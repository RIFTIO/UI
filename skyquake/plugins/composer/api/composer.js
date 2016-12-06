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

var request = require('request');
var Promise = require('bluebird');
var rp = require('request-promise');
var utils = require('../../../framework/core/api_utils/utils.js');
var constants = require('../../../framework/core/api_utils/constants.js');
var _ = require('underscore');
var APIVersion = '/v1';
var Composer = {};

var DataCenters = {};
// Catalog module methods
Composer.get = function(req) {
    var api_server = req.query['api_server'];
    var results = {}
    return new Promise(function(resolve, reject) {
        Promise.all([
            rp({
                uri: utils.confdPort(api_server) + APIVersion + '/api/config/nsd-catalog/nsd?deep',
                method: 'GET',
                headers: _.extend({}, constants.HTTP_HEADERS.accept.collection, {
                    'Authorization': req.get('Authorization')
                }),
                forever: constants.FOREVER_ON,
                rejectUnauthorized: false,
                resolveWithFullResponse: true
            }),
            rp({
                uri: utils.confdPort(api_server) + APIVersion + '/api/config/vnfd-catalog/vnfd?deep',
                method: 'GET',
                headers: _.extend({}, constants.HTTP_HEADERS.accept.collection, {
                    'Authorization': req.get('Authorization')
                }),
                forever: constants.FOREVER_ON,
                rejectUnauthorized: false,
                resolveWithFullResponse: true
            }),
            rp({
                uri: utils.confdPort(api_server) + APIVersion + '/api/operational/ns-instance-opdata?deep',
                method: 'GET',
                headers: _.extend({}, constants.HTTP_HEADERS.accept.data, {
                    'Authorization': req.get('Authorization')
                }),
                forever: constants.FOREVER_ON,
                rejectUnauthorized: false,
                resolveWithFullResponse: true
            })
            // Not enabled for now
            // rp({
            //   uri: utils.confdPort(api_server) + '/api/config/pnfd-catalog/pnfd?deep',
            //   method: 'GET',
            //   headers: _.extend({},
            //     constants.HTTP_HEADERS.accept.collection,
            //     {
            //       'Authorization': req.get('Authorization')
            //     }),
            //   forever: constants.FOREVER_ON,
            // rejectUnauthorized: false,
            //   resolveWithFullResponse: true
            // })
        ]).then(function(result) {
            var response = [{
                "id": "GUID-1",
                "name": "RIFT.ware™ NS Descriptors Catalog",
                "short-name": "rift.ware-nsd-cat",
                "description": "RIFT.ware™, an open source NFV development and deployment software platform that makes it simple to create, deploy and manage hyper-scale Virtual network functions and applications.",
                "vendor": "RIFT.io",
                "version": "",
                "created-on": "",
                "type": "nsd",
                "meta": {
                    "icon-svg": "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%0A%3C!--%20Generator%3A%20Adobe%20Illustrator%2018.0.0%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200)%20%20--%3E%0A%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22connection-icon-1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20viewBox%3D%220%200%2050%2050%22%20style%3D%22enable-background%3Anew%200%200%2050%2050%3B%22%20xml%3Aspace%3D%22preserve%22%3E%0A%09%3Cpath%20d%3D%22M15%2030c-2.8%200-5-2.2-5-5s2.2-5%205-5%205%202.2%205%205-2.2%205-5%205zm0-8c-1.7%200-3%201.3-3%203s1.3%203%203%203%203-1.3%203-3-1.3-3-3-3z%22%2F%3E%3Cpath%20d%3D%22M35%2020c-2.8%200-5-2.2-5-5s2.2-5%205-5%205%202.2%205%205-2.2%205-5%205zm0-8c-1.7%200-3%201.3-3%203s1.3%203%203%203%203-1.3%203-3-1.3-3-3-3z%22%2F%3E%3Cpath%20d%3D%22M35%2040c-2.8%200-5-2.2-5-5s2.2-5%205-5%205%202.2%205%205-2.2%205-5%205zm0-8c-1.7%200-3%201.3-3%203s1.3%203%203%203%203-1.3%203-3-1.3-3-3-3z%22%2F%3E%3Cpath%20d%3D%22M19.007%2025.885l12.88%206.44-.895%201.788-12.88-6.44z%22%2F%3E%3Cpath%20d%3D%22M30.993%2015.885l.894%201.79-12.88%206.438-.894-1.79z%22%2F%3E%3C%2Fsvg%3E"
                },
                "descriptors": []
            }, {
                "id": "GUID-2",
                "name": "RIFT.ware™ VNF Descriptors Catalog",
                "short-name": "rift.ware-vnfd-cat",
                "description": "RIFT.ware™, an open source NFV development and deployment software platform that makes it simple to create, deploy and manage hyper-scale Virtual network functions and applications.",
                "vendor": "RIFT.io",
                "version": "",
                "created-on": "",
                "type": "vnfd",
                "meta": {
                    "icon-svg": "data:image/svg+xml,<?xml version=\"1.0\" encoding=\"utf-8\"?> <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"> <svg version=\"1.1\" id=\"Layer_3\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100px\" height=\"100px\" viewBox=\"0 0 100 100\" enable-background=\"new 0 0 100 100\" xml:space=\"preserve\"> <g> <path d=\"M58.852,62.447l-4.662-1.033c-0.047-3.138-0.719-6.168-1.996-9.007l3.606-2.92c0.858-0.695,0.99-1.954,0.296-2.813 l-4.521-5.584c-0.334-0.413-0.818-0.675-1.346-0.731c-0.525-0.057-1.056,0.102-1.468,0.435L45.25,43.64v0 c-2.486-1.907-5.277-3.259-8.297-4.019v-4.458c0-1.104-0.896-2-2-2H27.77c-1.104,0-2,0.896-2,2v4.461 c-3.08,0.777-5.922,2.171-8.447,4.144l-3.545-2.82c-0.415-0.33-0.94-0.479-1.472-0.422c-0.527,0.06-1.009,0.327-1.339,0.743 l-4.472,5.623c-0.688,0.864-0.544,2.123,0.32,2.81l3.642,2.896v0c-1.25,2.848-1.895,5.88-1.916,9.011l-4.666,1.078 c-1.076,0.249-1.747,1.322-1.499,2.398l1.616,7.001c0.249,1.077,1.325,1.747,2.399,1.499l4.813-1.111v0 c1.429,2.681,3.344,5.017,5.691,6.943l-2.17,4.55c-0.476,0.997-0.054,2.19,0.943,2.666l6.484,3.094 c0.271,0.129,0.566,0.195,0.861,0.195c0.226,0,0.451-0.038,0.668-0.115c0.5-0.177,0.909-0.545,1.138-1.024l2.198-4.611 c2.923,0.563,5.966,0.554,8.879-0.033l2.236,4.585c0.484,0.994,1.685,1.403,2.675,0.921l6.456-3.148 c0.992-0.484,1.405-1.682,0.921-2.674l-2.206-4.524c2.335-1.946,4.231-4.301,5.639-6.999l4.812,1.067 c1.076,0.237,2.146-0.441,2.385-1.52l1.556-7.014c0.115-0.518,0.02-1.06-0.266-1.508C59.82,62.878,59.369,62.562,58.852,62.447z M40.18,61.761c0,4.859-3.953,8.812-8.813,8.812c-4.858,0-8.811-3.953-8.811-8.812s3.952-8.812,8.811-8.812 C36.227,52.949,40.18,56.902,40.18,61.761z\"/> <path d=\"M64.268,45.324c0.746,0,1.463-0.42,1.806-1.139l1.054-2.208c1.826,0.353,3.736,0.345,5.551-0.021l1.07,2.195 c0.484,0.992,1.682,1.405,2.675,0.921l2.691-1.313c0.477-0.233,0.842-0.646,1.015-1.147c0.172-0.501,0.139-1.051-0.095-1.528 l-1.052-2.155c1.458-1.214,2.645-2.686,3.527-4.377l2.278,0.504c1.075,0.238,2.146-0.442,2.386-1.52l0.647-2.923 c0.238-1.078-0.442-2.146-1.521-2.385l-2.184-0.484c-0.028-1.962-0.449-3.857-1.248-5.632l1.673-1.355 c0.412-0.334,0.675-0.818,0.73-1.345s-0.102-1.056-0.436-1.468l-1.884-2.327c-0.697-0.859-1.957-0.99-2.813-0.295l-1.614,1.307 c-1.554-1.193-3.299-2.038-5.188-2.513v-2.039c0-1.104-0.896-2-2-2h-2.994c-1.104,0-2,0.896-2,2v2.04 c-1.927,0.486-3.703,1.358-5.28,2.592l-1.634-1.298c-0.862-0.687-2.12-0.543-2.81,0.32l-1.864,2.344 c-0.33,0.416-0.481,0.945-0.422,1.472c0.061,0.527,0.327,1.009,0.743,1.339l1.69,1.345c-0.78,1.779-1.184,3.676-1.197,5.636 l-2.189,0.505c-0.517,0.119-0.965,0.439-1.246,0.889c-0.281,0.45-0.372,0.993-0.252,1.51l0.675,2.918 c0.249,1.076,1.323,1.747,2.398,1.498l2.28-0.527c0.892,1.676,2.089,3.137,3.559,4.343l-1.035,2.17 c-0.228,0.479-0.257,1.028-0.08,1.528c0.178,0.5,0.546,0.91,1.024,1.138l2.703,1.289C63.686,45.261,63.979,45.324,64.268,45.324z M64.334,27.961c0-3.039,2.473-5.51,5.512-5.51c3.038,0,5.51,2.472,5.51,5.51c0,3.039-2.472,5.511-5.51,5.511 C66.807,33.472,64.334,31,64.334,27.961z\"/> <path d=\"M96.107,66.441l-2.182-0.484c-0.028-1.961-0.449-3.856-1.25-5.632l1.675-1.355c0.412-0.334,0.675-0.818,0.73-1.346 c0.056-0.527-0.102-1.056-0.436-1.468l-1.885-2.327c-0.695-0.859-1.956-0.99-2.813-0.295l-1.614,1.307 c-1.555-1.193-3.3-2.038-5.188-2.513v-2.039c0-1.104-0.896-2-2-2h-2.994c-1.104,0-2,0.896-2,2v2.041 c-1.929,0.486-3.706,1.358-5.282,2.592l-0.001,0l-1.631-1.298c-0.415-0.331-0.938-0.482-1.472-0.422 c-0.527,0.06-1.009,0.327-1.339,0.742l-1.863,2.343c-0.688,0.865-0.544,2.123,0.32,2.811l1.691,1.345 c-0.782,1.784-1.186,3.68-1.199,5.636l-2.188,0.505c-0.517,0.12-0.965,0.439-1.246,0.889c-0.281,0.45-0.372,0.993-0.252,1.51 l0.675,2.918c0.249,1.076,1.327,1.744,2.397,1.498l2.281-0.526c0.893,1.677,2.09,3.138,3.558,4.343h0.001l-1.035,2.168 c-0.229,0.479-0.258,1.029-0.081,1.529c0.178,0.5,0.546,0.909,1.024,1.138l2.702,1.289c0.278,0.132,0.571,0.195,0.86,0.195 c0.746,0,1.463-0.42,1.806-1.139l1.054-2.208c1.828,0.353,3.739,0.347,5.552-0.021l1.071,2.194 c0.484,0.992,1.682,1.405,2.675,0.921l2.69-1.312c0.477-0.233,0.842-0.645,1.014-1.147c0.173-0.501,0.14-1.051-0.093-1.528 l-1.052-2.155c1.459-1.215,2.645-2.688,3.525-4.377l2.278,0.505c0.52,0.116,1.061,0.02,1.508-0.266 c0.447-0.285,0.763-0.736,0.878-1.254l0.647-2.923C97.866,67.748,97.186,66.681,96.107,66.441z M85.162,66.174 c0,3.039-2.471,5.511-5.508,5.511c-3.039,0-5.512-2.472-5.512-5.511c0-3.039,2.473-5.511,5.512-5.511 C82.691,60.664,85.162,63.136,85.162,66.174z\"/> </g> </svg> "
                },
                "descriptors": []
            }, {
                "id": "GUID-3",
                "name": "RIFT.ware™ PNF Descriptors Catalog",
                "short-name": "rift.ware-pnfd-cat",
                "description": "RIFT.ware™, an open source NFV development and deployment software platform that makes it simple to create, deploy and manage hyper-scale Virtual network functions and applications.",
                "vendor": "RIFT.io",
                "version": "",
                "created-on": "",
                "type": "pnfd",
                "meta": {
                    "icon-svg": "data:image/svg+xml,<?xml version=\"1.0\" encoding=\"utf-8\"?> <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"> <svg version=\"1.1\" id=\"Layer_4\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100px\" height=\"100px\" viewBox=\"0 0 100 100\" enable-background=\"new 0 0 100 100\" xml:space=\"preserve\"> <path d=\"M86.334,47.444V35.759H13.666v11.686h3.561v5.111h-3.561v11.686h72.668V52.556h-4.108v-5.111H86.334z M26.628,59.454h-5.051 v-4.941h5.051V59.454z M26.628,52.404h-5.051v-4.941h5.051V52.404z M26.628,45.486h-5.051v-4.941h5.051V45.486z M34.094,59.454 h-5.051v-4.941h5.051V59.454z M34.094,52.404h-5.051v-4.941h5.051V52.404z M34.094,45.486h-5.051v-4.941h5.051V45.486z M41.452,59.454h-5.051v-4.941h5.051V59.454z M41.452,52.404h-5.051v-4.941h5.051V52.404z M41.452,45.486h-5.051v-4.941h5.051 V45.486z M48.733,59.454h-5.051v-4.941h5.051V59.454z M48.733,52.404h-5.051v-4.941h5.051V52.404z M48.733,45.486h-5.051v-4.941 h5.051V45.486z M56.2,59.454h-5.051v-4.941H56.2V59.454z M56.2,52.404h-5.051v-4.941H56.2V52.404z M56.2,45.486h-5.051v-4.941H56.2 V45.486z M63.558,59.454h-5.05v-4.941h5.05V59.454z M63.558,52.404h-5.05v-4.941h5.05V52.404z M63.558,45.486h-5.05v-4.941h5.05 V45.486z M74.858,59.312h-6.521v-3.013h6.521V59.312z M71.572,50.854c-2.875,0-5.204-2.33-5.204-5.203s2.329-5.203,5.204-5.203 s5.204,2.33,5.204,5.203S74.446,50.854,71.572,50.854z M74.858,45.618c0,1.801-1.46,3.261-3.261,3.261 c-1.8,0-3.261-1.46-3.261-3.261s1.46-3.26,3.261-3.26C73.398,42.358,74.858,43.817,74.858,45.618z\"/> </svg>"
                },
                "descriptors": []
            }];
            if (result[0].body) {
                response[0].descriptors = JSON.parse(result[0].body).collection['nsd:nsd'];
                if (result[2].body) {
                    var data = JSON.parse(result[2].body);
                    if (data && data["nsr:ns-instance-opdata"] && data["nsr:ns-instance-opdata"]["rw-nsr:nsd-ref-count"]) {
                        var nsdRefCountCollection = data["nsr:ns-instance-opdata"]["rw-nsr:nsd-ref-count"];
                        response[0].descriptors.map(function(nsd) {
                            if (!nsd["meta"]) {
                                nsd["meta"] = {};
                            }
                            if (typeof nsd['meta'] == 'string') {
                                nsd['meta'] = JSON.parse(nsd['meta']);
                            }
                            nsd["meta"]["instance-ref-count"] = _.findWhere(nsdRefCountCollection, {
                                "nsd-id-ref": nsd.id
                            })["instance-ref-count"];
                        });
                    }
                }
            };
            if (result[1].body) {
                response[1].descriptors = JSON.parse(result[1].body).collection['vnfd:vnfd'];
            };
            // if (result[2].body) {
            //   response[2].descriptors = JSON.parse(result[2].body).collection['pnfd:pnfd'];
            // };
            resolve({
                statusCode: response.statusCode || 200,
                data: JSON.stringify(response)
            });
        }).catch(function(error) {
            // Todo: Need better logic than all or nothing.
            // Right now even if one of the southbound APIs fails - all fail
            var res = {};
            console.log('Problem with Composer.get', error);
            res.statusCode = error.statusCode || 500;
            res.errorMessage = {
                error: 'Failed to get catalogs' + error
            };
            reject(res);
        });
    });
};
Composer.delete = function(req) {
    var api_server = req.query['api_server'];
    var catalogType = req.params.catalogType;
    var id = req.params.id;
    console.log('Deleting', catalogType, id, 'from', api_server);
    return new Promise(function(resolve, reject) {
        request({
            uri: utils.confdPort(api_server) + APIVersion + '/api/config/' + catalogType + '-catalog/' + catalogType + '/' + id,
            method: 'DELETE',
            headers: _.extend({}, constants.HTTP_HEADERS.accept.data, {
                'Authorization': req.get('Authorization')
            }),
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
        }, function(error, response, body) {
            if (utils.validateResponse('Composer.delete', error, response, body, resolve, reject)) {
                resolve({
                    statusCode: response.statusCode
                });
            }
        });
    });
};
Composer.getVNFD = function(req) {
    var api_server = req.query['api_server'];
    var vnfdID = req.body.data;
    var authorization = req.get('Authorization');
    var VNFDs = [];
    if (typeof(vnfdID) == "object" && vnfdID.constructor.name == "Array") {
        vnfdID.map(function(id) {
            VNFDs.push(requestVNFD(id));
        });
    } else {
        VNFDs.push(requestVNFD(vnfdID));
    }
    return new Promise(function(resolve, reject) {
        Promise.all(VNFDs).then(function(data) {
            resolve(data)
        }).catch(function(error) {
            // Todo: Need better logic than all or nothing.
            // Right now even if one of the southbound APIs fails - all fail
            var res = {};
            console.log('Problem with Composer.getVNFD', error);
            res.statusCode = 404;
            res.errorMessage = {
                error: 'Failed to get VNFDs' + error
            };
            reject(res);
        });
    });

    function requestVNFD(id) {
        return new Promise(function(resolve, reject) {
            var url = utils.confdPort(api_server) + APIVersion + '/api/config/vnfd-catalog/vnfd' + (id ? '/' + id : '') + '?deep';
            request({
                uri: url,
                method: 'GET',
                headers: _.extend({}, constants.HTTP_HEADERS.accept.data, {
                    'Authorization': authorization
                }),
                forever: constants.FOREVER_ON,
                rejectUnauthorized: false,
            }, function(error, response, body) {
                if (utils.validateResponse('Composer.create', error, response, body, resolve, reject)) {
                    var data;
                    //Is this still needed?
                    try {
                        data = JSON.parse(response.body)
                    } catch (e) {
                        reject({
                            statusCode: response ? response.statusCode : 400,
                            errorMessage: 'Issue parsing VNFD ' + id + 'from ' + utils.confdPort(api_server) + '/api/config/vnfd-catalog/vnfd/' + id + '?deep'
                        });
                    }
                    resolve(data);
                }
            });
        });
    }
};
Composer.create = function(req) {
    var api_server = req.query['api_server'];
    var catalogType = req.params.catalogType;
    var data = req.body;
    console.log('Creating', catalogType, 'on', api_server);
    var jsonData = {};
    jsonData[catalogType] = [];
    jsonData[catalogType].push(data);
    return new Promise(function(resolve, reject) {
        var requestHeaders = {};
        _.extend(requestHeaders, constants.HTTP_HEADERS.accept.data, constants.HTTP_HEADERS.content_type.data, {
            'Authorization': req.get('Authorization')
        });
        request({
            uri: utils.confdPort(api_server) + '/api/config/' + catalogType + '-catalog',
            method: 'POST',
            headers: requestHeaders,
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
            json: jsonData
        }, function(error, response, body) {
            if (utils.validateResponse('Composer.create', error, response, body, resolve, reject)) {
                resolve({
                    statusCode: response.statusCode
                });
            }
        });
    });
};
Composer.update = function(req) {
    var api_server = req.query['api_server'];
    var catalogType = req.params.catalogType;
    var id = req.params.id;
    var data = req.body;
    console.log('Updating', catalogType, 'id', id, 'on', api_server);
    var jsonData = {};
    jsonData[catalogType] = {};
    jsonData[catalogType] = data;
    return new Promise(function(resolve, reject) {
        var requestHeaders = {};
        _.extend(requestHeaders, constants.HTTP_HEADERS.accept.data, constants.HTTP_HEADERS.content_type.data, {
            'Authorization': req.get('Authorization')
        });
        request({
            uri: utils.confdPort(api_server) + APIVersion + '/api/config/' + catalogType + '-catalog' + '/' + catalogType + '/' + id,
            method: 'PUT',
            headers: requestHeaders,
            forever: constants.FOREVER_ON,
            rejectUnauthorized: false,
            json: jsonData
        }, function(error, response, body) {
            if (utils.validateResponse('Composer.update', error, response, body, resolve, reject)) {
                resolve({
                    statusCode: response.statusCode
                });
            }
        });
    });
};
module.exports = Composer;
