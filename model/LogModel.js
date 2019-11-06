"use strict";

const {ActionLogDao} = require('../dao/ActionLogDao');
let logDao = new ActionLogDao();

class LogModel {
	async add(userid, username, action_name, return_message, client_ip) {
		return await logDao.add(userid, username, action_name, return_message, client_ip);
	}

	async list(dateFilter, nameFilter, offset, pageSize) {
		return await logDao.list(dateFilter, nameFilter, offset, pageSize);
	}

	async getTotalCount(dateFilter, nameFilter) {
		return await logDao.getTotalCount(dateFilter, nameFilter);
	}
}

exports.LogModel = LogModel;