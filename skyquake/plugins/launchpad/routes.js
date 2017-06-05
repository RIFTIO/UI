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

var app = require('express').Router();
var cors = require('cors');
var utils = require('../../framework/core/api_utils/utils.js');
var launchpadAPI = require('./api/launchpad.js');

app.get('/api/nsr', cors(), function(req, res) {
        launchpadAPI['nsr'].get(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.get('/api/nsr/:id', cors(), function(req, res) {
        launchpadAPI['nsr'].get(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.delete('/api/nsr/:id', cors(), function(req, res) {
        launchpadAPI['nsr'].delete(req).then(function(response) {
            utils.sendSuccessResponse(response, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.post('/api/nsr', cors(), function(req, res) {
        launchpadAPI['nsr'].create(req).then(function(data) {
            res.send(data);
        }, function(error) {
            console.log(error)
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.get('/api/nsr/:nsr_id/vnfr', cors(), function(req, res) {
        launchpadAPI['vnfr'].get(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        }).catch(function(error) {
            console.log(error)
        });
    });
    app.get('/api/nsr/:nsr_id/vld', cors(), function(req, res) {
        launchpadAPI['nsr'].nsd.vld.get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/api/nsr/:nsr_id/vld/:vld_id', cors(), function(req, res) {
        launchpadAPI['nsr'].nsd.vld.get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.delete('/api/nsr/:nsr_id/vld/:vld_id', function(req, res) {
        launchpadAPI['nsr'].nsd.vld.delete(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.post('/api/nsr/:nsr_id/vld', cors(), function(req, res) {
        launchpadAPI['nsr'].nsd.vld.create(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.put('/api/nsr/:nsr_id/vld/:vld_id', cors(), function(req, res) {
        launchpadAPI['nsr'].nsd.vld.update(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/api/vlr', cors(), function(req, res) {
        launchpadAPI['vlr'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/api/vlr/:id', cors(), function(req, res) {
        launchpadAPI['vlr'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });

    app.put('/api/nsr/:id/admin-status', cors(), function(req, res) {
        launchpadAPI['nsr'].setStatus(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.post('/api/nsr/:id/:scaling_group_id/instance', cors(), function(req, res) {
        launchpadAPI['nsr'].createScalingGroupInstance(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            console.log(error)
            utils.sendErrorResponse(error, res);
        });
    });
    app.delete('/api/nsr/:id/:scaling_group_id/instance/:scaling_instance_id', cors(), function(req, res) {
        launchpadAPI['nsr'].deleteScalingGroupInstance(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            console.log(error)
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/api/vnfr', cors(), function(req, res) {
        launchpadAPI['vnfr'].get(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.get('/api/vnfr/:id', cors(), function(req, res) {
        launchpadAPI['vnfr'].get(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.get('/api/vnfr/:vnfr_id/:vdur_id', cors(), function(req, res) {
        launchpadAPI['vdur'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        })
    });
    app.get('/api/vnfr/:vnfr_id/vdur/:vdur_id/console-url', function(req, res) {
        launchpadAPI['vdur']['consoleUrl'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    })
    app.get('/api/catalog', cors(), function(req, res) {
        launchpadAPI['catalog'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            if(!error || !error.statusCode) {
                error = {
                    statusCode: 500,
                    message: 'unknown error with Catalog.get'
                }
            }
            utils.sendErrorResponse(error, res);
        });
    });
    //TODO refactor this query
    app.get('/api/decorated-catalog', cors(), function(req, res) {
        launchpadAPI['catalog'].get(req).then(function(data) {
            var returnData = launchpadAPI['catalog'].decorateNsdCatalogWithPlacementGroups(data)
            utils.sendSuccessResponse(returnData, res);
        }, function(error) {
            if(!error || !error.statusCode) {
                error = {
                    statusCode: 500,
                    message: 'unknown error with Catalog.get'
                }
            }
            utils.sendErrorResponse(error, res);
        });
    });

    //TODO refactor this query
    app.post('/api/vnfd', cors(), function(req, res) {
        launchpadAPI['catalog'].getVNFD(req).then(function(data) {
            res.send(data);
        }).catch(function(error) {
            console.log(error)
        });
    });
    app.get('/api/nsd/:nsd_id/input-param', cors(), function(req, res) {
        launchpadAPI['nsd'].getInputParams(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.post('/api/exec-ns-service-primitive', cors(), function(req, res) {
        launchpadAPI['rpc'].executeNSServicePrimitive(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/api/get-ns-service-primitives', cors(), function(req, res) {
        launchpadAPI['rpc'].getNSServicePrimitiveValues(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.delete('/api/catalog/:catalogType/:id', cors(), function(req, res) {
        launchpadAPI['catalog'].delete(req).then(function(response) {
            res.status(response.statusCode);
            res.send({});
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.post('/api/catalog/:catalogType', cors(), function(req, res) {
        launchpadAPI['catalog'].create(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.put('/api/catalog/:catalogType/:id', cors(), function(req, res) {
        launchpadAPI['catalog'].update(req).then(function(data) {
            res.send(data);
        }, function(error) {
            res.status(error.statusCode);
            res.send(error.errorMessage);
        });
    });
    app.get('/api/nsr/:id/compute-topology', cors(), function(req, res) {
        launchpadAPI['computeTopology'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        })
    });
    app.get('/api/network-topology', cors(), function(req, res) {
        launchpadAPI['networkTopology'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        })
    });
    app.get('/api/cloud-account', cors(), function(req, res) {
        launchpadAPI['cloud_account'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        })
    });
    app.get('/api/config', cors(), function(req, res) {
        launchpadAPI['config'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        })
    });
    app.get('/api/config-agent-account', cors(), function(req, res) {
        launchpadAPI['config-agent-account'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.get('/api/config-agent-account/:id', cors(), function(req, res) {
        launchpadAPI['config-agent-account'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.post('/api/config-agent-account', cors(), function(req, res) {
        launchpadAPI['config-agent-account'].create(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.put('/api/config-agent-account/:id', cors(), function(req, res) {
        launchpadAPI['config-agent-account'].update(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.delete('/api/config-agent-account/:id', cors(), function(req, res) {
        launchpadAPI['config-agent-account'].delete(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    //DataCenters
    app.get('/api/data-centers', cors(), function(req, res) {
        launchpadAPI['data_centers'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });//DataCenters
    app.get('/api/ssh-key', cors(), function(req, res) {
        launchpadAPI['SSHkey'].get(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.put('/api/ssh-key', cors(), function(req, res) {
        launchpadAPI['SSHkey'].put(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.post('/api/ssh-key', cors(), function(req, res) {
        launchpadAPI['SSHkey'].post(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });
    app.delete('/api/ssh-key/:name', cors(), function(req, res) {
        launchpadAPI['SSHkey'].delete(req).then(function(data) {
            utils.sendSuccessResponse(data, res);
        }, function(error) {
            utils.sendErrorResponse(error, res);
        });
    });

    utils.passThroughConstructor(app);

module.exports = app;
