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
var router = require('express').Router();
var cors = require('cors');
var utils = require('../../framework/core/api_utils/utils.js')
var Composer = require('./api/composer.js');
router.get('/api/catalog', cors(), function(req, res) {
    Composer.get(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});
router.delete('/api/catalog/:catalogType/:id', cors(), function(req, res) {
    Composer.delete(req).then(function(response) {
        res.status(response.statusCode);
        res.send({});
    }, function(error) {
        res.status(error.statusCode);
        res.send(error.errorMessage);
    });
});
router.post('/api/catalog/:catalogType', cors(), function(req, res) {
    Composer.create(req).then(function(data) {
        res.send(data);
    }, function(error) {
        res.status(error.statusCode);
        res.send(error.errorMessage);
    });
});
router.put('/api/catalog/:catalogType/:id', cors(), function(req, res) {
    Composer.update(req).then(function(data) {
        res.send(data);
    }, function(error) {
        res.status(error.statusCode);
        res.send(error.errorMessage);
    });
});

module.exports = router;
