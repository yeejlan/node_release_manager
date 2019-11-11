"use strict";

const md5 = require('md5');
const {UserDao} = require('../dao/UserDao');
const {LogModel} = require('./LogModel');
const {Utils} = require('../lib/Utils');
let userDao = new UserDao();
let logModel = new LogModel();
let sitePhrase = app.getConfig["site.phrase"];

class UserModel {
	currentUserId(ctx) {
		let userid = parseInt(ctx.session.get('uid')) || 0;
		return userid;
	}

	currentRole(ctx) {
		let role = ctx.session.get(role) || '';
		return role;
	}

	async currentUserInfo(ctx) {
		let userid = this.currentUserId(ctx);
		return await this.getUserById(userid);
	}

	hasLoggedin(ctx, loginPageRedirect) {
		if(this.currentUserId(ctx) > 0) {
			return true;
		}
		if(loginPageRedirect) {
			ctx.redirect('/login');
			ctx.exit();
		}
		return false;
	}

	isAdmin(pageRedirect) {
		if(this.currentRole() == "admin") {
			return true;
		}
		if(pageRedirect) {
			ctx.redirect('/');
			ctx.exit;
		}
		return false;
	}

	async getUserById(userid) {
		return await userDao.getUserById(userid);
	}

	/*user login*/
	async login(ctx, username, password) {
		if(!username || !password) {
			return false;
		}
		let user = await userDao.getUserByName(username);
		if(!user) {
			return false;
		}
		let passwordMd5 = this.getPasswordMd5(password);
		if(user.password == passwordMd5) { //login success
			let session = ctx.session;
			session.set('uid', user.id);
			session.set('username', user.username);
			session.set('role', user.role);
			await logModel.add(user.id, user.username, "login", "Success", Utils.getClientIp(ctx));
			return true;
		}
		await logModel.add(-1, user.username, "login", "Failed", Utils.getClientIp(ctx));
		return false;
	}

	async verifyPassword(username, password) {
		if(!username || !password) {
			return false;
		}
		let user = await userDao.getUserByName(username);
		if(!user) {
			return false;
		}
		let passwordMd5 = this.getPasswordMd5(password);
		if(user.password == passwordMd5) {
			return true;
		}
		return false;
	}

	async changePassword(userid, password) {
		if(userid < 1 || !password) {
			return false;
		}
		let passwordMd5 = this.getPasswordMd5(password);
		return await userDao.updatePassword(userid, passwordMd5);
	}

	getPasswordMd5(password) {
		return md5(password + sitePhrase);
	}
}

exports.UserModel = UserModel;