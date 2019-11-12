"use strict";

const {UserDao} = require('../dao/UserDao');
const {UserModel} = require('./UserModel');

let userDao = new UserDao();
let sitePhrase = app.getConfig["site.phrase"];
let userModel = new UserModel();

class AdminModel {
	async newUser(username, password, role) {
		let passwordMd5 = userModel.getPasswordMd5(password);
		return userDao.new(username, passwordMd5, role);
	}

	async updateUser(id, password, role) {
		let passwordMd5 = '';
		if(password) {
			passwordMd5 = userModel.getPasswordMd5(password);
		}
		return userDao.update(id, passwordMd5, role);
	}

	async listUser(offset, pageSize) {
		return userDao.list(offset, pageSize);
	}

	async isUserNameFree(username) {
		let user = await userDao.getUserByName(username);
		if(!user) {
			return true;
		}
		return false;
	}

	async deleteUser(id) {
		return userDao.delete(id);
	}
}

exports.AdminModel = AdminModel;