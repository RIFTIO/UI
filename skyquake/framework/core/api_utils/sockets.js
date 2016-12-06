/*
 * 
 *   Copyright 2016 RIFT.IO Inc
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
//SOCKET MANAGER
// test
//Supports localhost node polling subscriptions and pass through subscriptions to other websockets
//
//TODO REFACTOR: this needs to happen. there's too much boilerplate code in here.
//TODO Document after refactoring
//TODO Improved logging for debugging
//TODO List of URLS

var WebSocket = require('ws');
var Request = require('request');
var _ = require('lodash');
var constants = require('./constants.js');
var Promise = require('promise');
var url = require('url');
var sockjs = require('sockjs');
var websocket_multiplex = require('websocket-multiplex');


function getPortForProtocol (protocol) {
  switch (protocol) {
    case 'http':
      return 8000;
    case 'https':
      return 8443;
  }
}

var Subscriptions = function() {
  this.ID = 0;
  this.socketServers = {};
};

Subscriptions.prototype.configure = function(config) {
  this.config = config;
  this.ready = true;
  // 1. Setup SockJS server
  var sockjs_opts = {};
  this.service = sockjs.createServer(sockjs_opts);
  // 2. Setup multiplexing
  this.multiplexer = new websocket_multiplex.MultiplexServer(this.service);

  this.service.installHandlers(this.config.httpServer, {prefix:'/multiplex'});
}

/**
 * [subscribe description]
 * @param  {Object}   req
 * @param  {String}   req.body.url May be http, https, or ws
 * @param  {Function} req.body.transform A function that will transform
 *                                      the data before sending it out
 *                                      through the socket. Receives one
 *                                      argument, which is the data
 *                                      returned from the subscription.
 * @param  {Function} callback Function that will receive the SubscriptionData reference object
 * @return {Object}   SubscriptionReference  An object containing the subscription information.
 * @return {Number} SubscriptionReference.id The subscription ID
 */
Subscriptions.prototype.subscribe = function(req, callback) {
  var self = this;
  var URL = req.body.url;
  var SubscriptionReference;
  var sessionId = req.session.id;
  var protocolTest = /^(.{2,5}):\/\//;
  var protocol = URL.match(protocolTest);

  if (!protocol) {
    var origin = '';
    if (req.query['api_server']) {
      var api_server_protocol = req.query['api_server'].match(protocolTest)[1];
      var api_server_origin = req.query['api_server'] + ':' + getPortForProtocol(api_server_protocol);
      origin = api_server_origin;
      protocol = api_server_protocol;
    } else {
      // TODO: NEED A WAY (URL PARAM) TO TRIGGER THIS PART OF THE CODE
      // WHICH IS NECESSARY FOR DEVELOPMENT ON MAC
      // No protocol was passed with the url in the body. Assume req.protocol is protocol and construct URL
      protocol = req.protocol || 'https';
      // Converting relative URL to full path.
      origin = protocol + '://' + req.headers.host
    }
    var a = url.resolve(origin, req.baseUrl);
    var b = url.resolve(a, URL);
    URL = b;
    console.log('DEBUG URL IS', URL);
  } else {
    protocol = protocol[1]
  }

  return new Promise(function(resolve, reject) {

    if (!self.ready) {
      return reject({
        statusCode: 500,
        errorMessage: 'SocketManager not configured yet. Cannot proceed'
      })
    }

    self.createWebSocketServer().then(function(successData) {

        self.socketServers[sessionId + successData.id] = successData;
        self.setUpSocketInstance(protocol, URL, req, self.socketServers[sessionId + successData.id].wss, successData.id);
        return resolve({
          statusCode: 200,
          data: {
            id: self.socketServers[sessionId + successData.id].id
          }
        });
      },
      function(errorData) {
        return reject({
          statusCode: 503,
          errorMessage: errorData.error
        });
      });
  });
};

Subscriptions.prototype.setUpSocketInstance = function(protocol, URL, req, wss, channelId) {
  var self = this;
  //Need to refactor this to make it more scalable/dynamic
  switch (protocol) {
    case 'http':
      self.socketInstance(URL, req, wss, PollingSocket, channelId);
      break;
    case 'https':
      self.socketInstance(URL, req, wss, PollingSocket, channelId);
      break;
    case 'ws':
      self.socketInstance(URL, req, wss, WebSocket, channelId);
      break;
    case 'wss':
      self.socketInstance(URL, req, wss, WebSocket, channelId);
      break;
  }
}

Subscriptions.prototype.createWebSocketServer = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    var wss = null;

    self.ID++;

    wss = self.multiplexer.registerChannel(self.ID);

    return resolve({
      id: self.ID,
      wss: wss
    });
  });
};

Subscriptions.prototype.socketInstance = function(url, req, wss, Type, channelId) {
  console.log('Creating a new socketInstance for:', url, 'sessionId:', req.session.id);
  var self = this;
  var Socket = null;
  var Connections = [];
  var Index = 0;
  var sessionId = req.session.id;
  var wssRef = wss;
  var channelIdRef = channelId;
  wss.on('connection', function(conn) {
    console.log('New connection to multiplex-server for channelId', channelIdRef);

    conn.on('data', function(msg) {
      console.log('Test purposes only. Received message from client:', msg);
      conn.write('Test purposes only. Echo: ' + msg);
    });

    if (!Socket) {
      if (Type == PollingSocket) {
        Socket = new Type(url, req, 1000, req.body);
      } else {
        Socket = new Type(url);
      }
      console.log('Socket assigned for url', url);
    }
    conn.index = Index++;
    // Add this client-connection into list of connections for this channelId/wss
    Connections.push(conn);

    conn.on('close', function() {
      // Remove the browser connection from list of Connections for this channelId/wss
      Connections.splice(conn.index, 1);
      console.log('splicing conn.index', conn.index,' for channel', channelIdRef);

      // Check if no other connections exist
      if (Connections.length == 0) {
        console.log('No more connections for', channelId, '. Will close socket server and downstream socket/poller.');
        try {
          // Close downstream socket/poller
          Socket.close();

          // Close socket server
          conn.end();

          // Remove from list of socketServers
          delete self.socketServers[sessionId + wss.id];

          // There is no unregisterChannel. Assuming
          // sockjs/websocket-multiplex do the right
          // things and cleanup after themselves.
        } catch (e) {
          console.log('Error closing socket server: ', e);
        }
        Index = 0;
        delete Socket;
      }
    });

    Socket.onopen = function() {
      console.log('Opened a websocket to southbound server');
    };

    Socket.onerror = function(error) {
      console.log('Error on southbound connection. Error:', error);
    }

    Socket.onmessage = function(data) {
      var i;
      var self = this;
      if (req.body.transform && req.body.transform.constructor.name == "String") {
        //someTransformObject[req.body.transform](data, send)
        //req.body.transform(data, send);
      } else {
        if (Type == PollingSocket) {
          send(data);
        } else {
          send(data.data);
        }
      }

      function send(payload) {
        var is401 = false;
        try {
          if (typeof payload == 'string') {
            var jsonPayload = JSON.parse(payload);
            is401 = jsonPayload.statusCode == 401;
          }
          else {
            is401 = payload.statusCode == 401;
          }
        } catch(e) {
          payload = {}
        }

        for (i = Connections.length - 1; i >= 0; i -= 1) {
          // console.log('Sending payload to channelId:', channelId, ' on connection', i);
          Connections[i].write(payload);
        };
        if (is401) {
          try {
            Socket.close();
          } catch (e) {
            console.log('Error closing Socket')
          }
        }
      }

    };
  });
};

function PollingSocket(url, req, interval, config) {
  console.log('Creating a new PollingSocket for url', url, 'sessionId:', req.session.id);
  var self = this;
  self.isClosed = false;
  var requestHeaders = {};
  _.extend(requestHeaders, {
    'Authorization': req.get('Authorization')
  });

  var pollServer = function() {
    Request({
      url: url,
      method: config.method || 'GET',
      headers: requestHeaders,
      json: config.payload,
      rejectUnauthorized: false,
      forever: constants.FOREVER_ON
    }, function(error, response, body) {
      if (error) {
        console.log('Error polling: ' + url);
      } else {
        if (!self.isClosed) {
          self.poll = setTimeout(pollServer, 1000 || interval);
          var data = response.body;
          if (self.onmessage) {
            self.onmessage(data);
          }
        }
      }
    });
  };
  pollServer();
};

PollingSocket.prototype.close = function() {
  console.log('Closing PollingSocket');
  var self = this;
  this.isClosed = true;
  clearTimeout(self.poll);
};


module.exports = Subscriptions;
