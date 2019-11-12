"use strict";

const {BaseController} = require('./BaseController');
const {UserModel} = require('../model/UserModel');
const {SiteConfigModel} = require('../model/SiteConfigModel');

let userModel = new UserModel();
let siteConfigModel = new SiteConfigModel();

class SiteconfigController extends BaseController {
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
		let sites = await siteConfigModel.list(offset, numPerPage);
		this.view.sites = sites;
		return this.render("siteconfig/list");
	}

	async addAction() {
		let siteconfig = {
			"id": 0,
			"sitename": "",
			"base_dir": "",
			"get_current_branch_command": "",
			"update_command": "",
			"generate_command": "",
			"test_release_command": "",
			"release_command": "",
			"cache_dir": "",
			"cache_exclude_dir": "",
			"cache_urls": ""
		}
		this.view.errStr = '';
		this.view.siteconfig = siteconfig;
		return this.render("siteconfig/add");
	}

	async doaddAction() {
		let siteconfig = {
			"id": 0,
			"sitename": this.ctx.params.sitename,
			"base_dir": this.ctx.params["base_dir"],
			"get_current_branch_command": this.ctx.params["get_current_branch_command"],
			"update_command": this.ctx.params["update_command"],
			"generate_command": this.ctx.params["generate_command"],
			"test_release_command": this.ctx.params["test_release_command"],
			"release_command": this.ctx.params["release_command"],
			"cache_dir": this.ctx.params["cache_dir"],
			"cache_exclude_dir": this.ctx.params["cache_exclude_dir"],
			"cache_urls": this.ctx.params["cache_urls"]
		};
		let err = "";
		if(!siteconfig.sitename) {
			err = "Invalid sitename";
		}
		if(err == ""){
			let isSuccess = await siteConfigModel.new(siteconfig);
			if(!isSuccess) {
				err = "new siteconfig failed";
			}else{
				this.ctx.redirect("/siteconfig");
				this.ctx.exit();
			}
		}
		this.view.siteconfig = siteconfig;
		this.view.errStr = err;
		return this.render("siteconfig/add");
	}

	async editAction() {
		let id = parseInt(this.ctx.params.id);
		let siteconfig = await siteConfigModel.getById(id);
		this.view.siteconfig = siteconfig;
		this.view.errStr = '';
		return this.render("siteconfig/edit");
	}

	async doeditAction() {
		let siteconfig = {
			"id": parseInt(this.ctx.params.id),
			"sitename": this.ctx.params.sitename,
			"base_dir": this.ctx.params["base_dir"],
			"get_current_branch_command": this.ctx.params["get_current_branch_command"],
			"update_command": this.ctx.params["update_command"],
			"generate_command": this.ctx.params["generate_command"],
			"test_release_command": this.ctx.params["test_release_command"],
			"release_command": this.ctx.params["release_command"],
			"cache_dir": this.ctx.params["cache_dir"],
			"cache_exclude_dir": this.ctx.params["cache_exclude_dir"],
			"cache_urls": this.ctx.params["cache_urls"]
		};
		let err = "";
		if(siteconfig.id < 1){
			err = "Invalid id";
		}
		if(siteconfig.sitename == ""){
			err = "Please fill out the Site Name!";
		}
		if(err == ""){
			let isSuccess = await siteConfigModel.update(siteconfig)
			if(!isSuccess) {
				err = "update siteconfig failed";
			}else{
				this.ctx.redirect("/siteconfig")
				this.ctx.exit();
			}
		}

		this.view.siteconfig = siteconfig;
		this.view.errStr = err;
		return render("siteconfig/edit");
	}

	async deleteAction() {
		let id = parseInt(this.ctx.params.id);
		let isSuccess = await siteConfigModel.delete(id);
		if(!isSuccess) {
			throw new Error("delete failed");
		}
		this.ctx.redirect("/siteconfig");
	}
}

exports.SiteconfigController = SiteconfigController;