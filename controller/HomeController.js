"use strict";

const {BaseController} = require('./BaseController');
const {UserModel} = require('../model/UserModel');
const {SiteConfigModel} = require('../model/SiteConfigModel');
const {ReleaseService} = require('../service/ReleaseService');

let userModel = new UserModel();
let siteConfigModel = new SiteConfigModel();

class HomeController extends BaseController {

	async before() {
		await super.before();
		userModel.hasLoggedin(this.ctx, true);

		this.siteId = parseInt(this.ctx.params.siteId);
		this.view.siteInfo = null;
		this.view.siteId = this.siteId;
		this.siteInfo = null;
		if(this.siteId > 0) {
			this.siteInfo = await siteConfigModel.getById(this.siteId);
			this.view.siteInfo = this.siteInfo;
		}		
	}

	async indexAction() {
		let task = this.ctx.params.task || '';
		let releaseType = this.ctx.params.releaseType || '';
		let filterKeywords = this.ctx.params.keyWords;

		let frameLink = `src="/home/runCommand?siteId=${this.siteId}&task=${task}&releaseType=${releaseType}" `;
		this.view.frameLink = frameLink;
		this.view.releaseType = releaseType;
		this.view.keyWords = filterKeywords;

		let sites = await siteConfigModel.list(0, 1000);
		this.view.sites = sites;

		return this.render("home/index");
	}

	async runCommandAction() {
		let command = this.ctx.params.task;
		let siteId = parseInt(this.ctx.params.siteId);

		let releasService = new ReleaseService();
		return releasService.runCommand(this.ctx, siteId, command);
	}

	async helloAction() {
		return 'hello '+ this.ctx.params.username;
	}

}

exports.HomeController = HomeController;
