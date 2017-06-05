var request = require('request');
var Promise = require('bluebird');
var rp = require('request-promise');
var utils = require('../../../framework/core/api_utils/utils.js');
var constants = require('../../../framework/core/api_utils/constants.js');
var fs = require('fs');
var _ = require('lodash');

PackageFileHandler = {};

function deleteFile(filename) {
	setTimeout(function() {
		fs.unlinkSync(constants.BASE_PACKAGE_UPLOAD_DESTINATION + filename);
	}, constants.PACKAGE_FILE_DELETE_DELAY_MILLISECONDS);
};

function checkStatus(req, transactionId, isUpdate) {
	var upload_server = req.query['upload_server'];
	var headers = _.extend({},
        {
            'Authorization': req.get('Authorization')
        }
    );
    var type = isUpdate ? 'update' : 'upload';
	request({
		url: upload_server + ':' + constants.PACKAGE_MANAGER_SERVER_PORT + '/api/' + type + '/' + transactionId + '/state',
		type: 'GET',
		headers: headers,
		forever: constants.FOREVER_ON,
       	rejectUnauthorized: false
	}, function(error, response, body) {
		if (error) {
			console.log('Error checking status for transaction', transactionId, '. Will delete file', req.file.filename, ' in ', constants.PACKAGE_FILE_DELETE_DELAY_MILLISECONDS ,' milliseconds');
			deleteFile(req.file.filename);
		} else {
			var jsonStatus = null;
			if (typeof body == 'string' || body instanceof String) {
				jsonStatus = JSON.parse(body);
			} else {
				jsonStatus = body;
			}

			if (jsonStatus.status && (jsonStatus.status == 'success' || jsonStatus.status == 'failure')) {
				console.log('Transaction ', transactionId, ' completed with status ', jsonStatus.status ,'. Will delete file', req.file.filename, ' in ', constants.PACKAGE_FILE_DELETE_DELAY_MILLISECONDS ,' milliseconds');
				deleteFile(req.file.filename);
			} else {
				setTimeout(function() {
					checkStatus(req, transactionId, isUpdate);
				}, constants.PACKAGE_FILE_ONBOARD_TRANSACTION_STATUS_CHECK_DELAY_MILLISECONDS);
			}
		}
	});
};

PackageFileHandler.checkCreatePackageStatusAndHandleFile = function(req, transactionId, isUpdate) {
	checkStatus(req, transactionId, isUpdate);
};


module.exports = PackageFileHandler;
