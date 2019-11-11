"use strict";

const {BaseController} = require('./BaseController');
const {UserModel} = require('../model/UserModel');

let userModel = new UserModel();

class LoginController extends BaseController {
	async before() {
		await super.before();
		this.view.errStr = "";
	}

	async indexAction() {
		let err = parseInt(this.ctx.params.err);
		if(err == 1) {
			this.view.errStr = "Invalid username or password, Please try again!";
		}
		if(err == 2) {
			this.view.errStr = "Internal error, Please try again later!";
		}
		return this.render("login/index");
	}

	async postAction() {
		let username = this.ctx.params.username;
		let password = this.ctx.params.password;
		let isLogin = await userModel.login(this.ctx, username, password);
		if(isLogin) {
			this.ctx.redirect('/');
			return;
		}
		this.ctx.redirect('/login?err=1');
		return;
	}

	async exitAction() {
		await this.ctx.session.destroy();
		this.ctx.redirect("/login")
		return;
	}

	async changepasswordAction() {
		let oldPassword = this.ctx.params.oldpassword;
		let newPassword  = this.ctx.params.newpassword;
		let confirmPassword = this.ctx.params.confirmpassword;

		this.view.msg = '';
		this.view.oldPassword = oldPassword;
		this.view.newPassword = newPassword;
		this.view.confirmPassword = confirmPassword;
		if(this.ctx.request.method == 'POST') {
			let msg = "";
			let username = this.ctx.session.get('username');
			let result = await userModel.verifyPassword(username, oldPassword);
			if(!result) {
				msg = "Old Password is wrong!";
			}
			if(msg == "" && (newPassword == "" || confirmPassword == "")){
				msg = "New Password or Comfirm New Passsword cannot be empty!";
			}
			if(msg == "" && (newPassword != confirmPassword)){
				msg = "Confirm New Password do NOT match New Password!";
			}
			if(msg == "") {
				let userid = parseInt(this.ctx.session.get('uid'));
				let updateResult = userModel.changePassword(userid, newPassword);
				if(!updateResult) {
					msg = "Internal error on changePassword";
				}else{
					msg = "Your password updated successfully!";
				}
			}
			this.view.msg = msg;
		}
		return this.render("login/changepassword");
	}
}

exports.LoginController = LoginController;