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
var express = require('express');
var router = express.Router();
var cors = require('cors');
var utils = require('../../framework/core/api_utils/utils.js')
var constants = require('../../framework/core/api_utils/constants.js');
var C = require('./api/composer.js');
var Composer = C.Composer;
var FileManager = C.FileManager;
var PackageManager = C.PackageManager;
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var storage = multer.diskStorage({
    // destination: 'upload/packages/',
    destination: function(req, file, cb) {
        var dir = constants.BASE_PACKAGE_UPLOAD_DESTINATION;
        if (req.query['package_id']) {
            dir += req.query['package_id'] + '/';
        }
        if (!fs.existsSync(dir)){
            mkdirp(dir, function(err) {
                if (err) {
                    console.log('Error creating folder for uploads. All systems FAIL!');
                    throw err;
                }
                cb(null, dir);
            });
        } else {
            cb(null, dir);
        }
    },
    filename: function (req, file, cb) {
        if (req.query['package_id']) {
            cb(null, file.originalname);
        } else  {
            cb(null, Date.now() + '_' + file.fieldname + '_' + file.originalname);
        }
    },
    // limits: {
    //     fieldNameSize: 100,
    //     fieldSize: 10000,
    //     fields: Infinity,
    //     fileSize: 10000,
    //     files: Infinity
    //     parts: Infinity
    //     headerPairs: 2000
    // }
});


var upload = multer({
    storage: storage
});


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
    Composer.updateSave(req).then(function(data) {
        res.send(data);
    }, function(error) {
        res.status(error.statusCode);
        res.send(error.errorMessage);
    });
});

router.post('/api/file-manager', cors(), upload.single('package'), function (req, res, next) {
    FileManager.addFile(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});

router.get('/api/file-manager', cors(), function(req, res) {
    FileManager.get(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
})
router.get('/api/file-manager/jobs/:id', cors(), function(req, res) {
    FileManager.job(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});
router.delete('/api/file-manager', cors(), function(req, res) {
    FileManager.get(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});

// Catalog operations via package manager

router.post('/upload', cors(), upload.single('package'), function (req, res, next) {
    PackageManager.upload(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});
router.use('/upload', cors(), express.static('upload/packages'));

router.post('/update', cors(), upload.single('package'), function (req, res, next) {
    PackageManager.update(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});
router.use('/update', cors(), express.static('upload/packages'));

router.post('/api/package-export', cors(), function (req, res, next) {
    PackageManager.export(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});
router.post('/api/package-copy', cors(), function (req, res, next) {
    PackageManager.copy(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});
router.get('/api/package-manager/jobs/:id', cors(), function (req, res, next) {
    PackageManager.getJobStatus(req).then(function(data) {
        utils.sendSuccessResponse(data, res);
    }, function(error) {
        utils.sendErrorResponse(error, res);
    });
});

module.exports = router;
