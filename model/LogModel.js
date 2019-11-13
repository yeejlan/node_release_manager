"use strict";

const {ActionLogDao} = require('../dao/ActionLogDao');
let logDao = new ActionLogDao();

class LogModel {
	async add(userid, username, action_name, return_message, client_ip) {
		return logDao.add(userid, username, action_name, return_message, client_ip);
	}

	async list(dateFilter, nameFilter, offset, pageSize) {
		return logDao.list(dateFilter, nameFilter, offset, pageSize);
	}

	async getTotalCount(dateFilter, nameFilter) {
		return logDao.getTotalCount(dateFilter, nameFilter);
	}
}

exports.LogModel = LogModel;