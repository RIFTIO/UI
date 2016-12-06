
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

/**
 * inactivity routes module. Provides a RESTful API for this
 * skyquake instance's inactivity state.
 * @module framework/core/modules/routes/inactivity
 * @author Laurence Maultsby <laurence.maultsby@riftio.com>
 */

var cors = require('cors');
var bodyParser = require('body-parser');
var Router = require('express').Router();
var utils = require('../../api_utils/utils');
var descriptorModelMetaAPI = require('../api/descriptorModelMetaAPI.js');

Router.use(bodyParser.json());
Router.use(cors());
Router.use(bodyParser.urlencoded({
    extended: true
}));

Router.get('/descriptor-model-meta', cors(), function(req, res) {
    descriptorModelMetaAPI.get(req).then(function(response) {
        utils.sendSuccessResponse(response, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});

module.exports = Router;



