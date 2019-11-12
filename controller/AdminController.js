"use strict";

const {BaseController} = require('./BaseController');
const {UserModel} = require('../model/UserModel');
const {AdminModel} = require('../model/AdminModel');

let userModel = new UserModel();
let adminModel = new AdminModel();

class AdminController extends BaseController {
	async before() {
		await super.before();
		userModel.hasLoggedin(this.ctx, true);
		userModel.isAdmin(this.ctx, true);
	}

	async indexAction() {
		let page = 1;
		//list in single page
		let numPerPage= 1000;
		let offset = (page - 1) * numPerPage;
		let userList = await adminModel.listUser(offset, numPerPage);

		this.view.userlist = userList;
		return this.render("admin/list");
	}

	async addAction() {
		let user = {
			username: '',
			password: '',
			confirmpassword: '',
			role: ''
		}

		this.view.post = user;
		this.view.errStr = '';
		return this.render("admin/add");
	}

	async doaddAction() {
		let username = this.ctx.params.username;
		let password = this.ctx.params.password;
		let confirmpassword = this.ctx.params.confirmpassword;
		let role = this.ctx.params.role;

		let err = "";

		if(username == "" || password == "" || confirmpassword == ""){
			err = "Please fill out Username/Password/Confirm Password!";
		}
		if(password != confirmpassword){
			err = "Confirm Password does NOT match Password!";
		}

		if(err == ""){
			let isSuccess = await adminModel.newUser(username, password, role);
			if(!isSuccess){
				err = "new user failed";
			}else{
				this.ctx.redirect("/admin");
				this.ctx.exit();
			}
		}

		let user = {
			username: username,
			password: password,
			confirmpassword: confirmpassword,
			role: role
		}
		this.view.post = user;
		this.view.errStr = err;
		return this.render("admin/add");
	}

	async editAction() {
		let id = parseInt(this.ctx.params.id);

		let user = await userModel.getUserById(id);

		this.view.user = user;
		this.view.errStr = "";
		
		return this.render("admin/edit");
	}

	async doeditAction() {
		let id = parseInt(this.ctx.params.id);
		let username = this.ctx.params.username;
		let password = this.ctx.params.password;
		let confirmpassword = this.ctx.params.confirmpassword;
		let role = this.ctx.params.role;

		let err = "";

		if(password == "" || confirmpassword == ""){
			err = "Please fill out Password/Confirm Password!";
		}
		if(password != confirmpassword){
			err = "Confirm Password does NOT match Password!";
		}
		if(err == ""){
			let isSuccess = await adminModel.updateUser(id, password, role);
			if(!isSuccess) {
				err = "update user failed";
			}else{
				this.ctx.redirect("/admin");
				this.ctx.exit();
			}
		}

		this.view.user = {
			"id": id,
			"password": "",
			"username": username,
			"role": role
		};
		this.view.errStr = err;
		return this.render("admin/edit");
	}

	async deleteAction() {
		let id = parseInt(this.ctx.params.id);
		let isSuccess = await adminModel.deleteUser(id);
		if(!isSuccess) {
			throw new Error('delete failed');
		}
		this.ctx.redirect("/admin");
	}
}

exports.AdminController = AdminController;

