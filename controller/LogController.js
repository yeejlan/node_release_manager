"use strict";

const {BaseController} = require('./BaseController');
const {UserModel} = require('../model/UserModel');
const {LogModel} = require('../model/LogModel');
const {Paging} = require('../lib/Paging');
const dateFormat = require('dateformat');

let userModel = new UserModel();
let logModel = new LogModel();

class LogController extends BaseController {
	async before() {
		await super.before();
		//userModel.hasLoggedin(this.ctx, true);
	}

	async indexAction() {
		let username = this.ctx.params.username || '';
		let date = this.ctx.params.date || '';
		let baseUrl = "/log/";

		this.view.username = username;
		if(date) {
			this.view.date = dateFormat(new Date(date), 'mm/dd/yyyy');
		}else{
			this.view.date = '';
		}
		if(!username || !date) {
			baseUrl = "/log/?username=" + username + "&date=" + date;
		}
		let page = parseInt(this.ctx.params.page) || 1;
		let pageSize = 10;
		let offset = (page -1) * pageSize;
		if(date) {
			date = dateFormat(new Date(date), 'yyyy-mm-dd');
		}
		let logs = await logModel.list(date, username, offset, pageSize);
		let logTotal = await logModel.getTotalCount(date, username);
		this.view.logList = logs;
		this.view.pageStr = Paging.page(this.ctx, logTotal, baseUrl, page, pageSize);

		return this.render("log/index");
	}
}

exports.LogController = LogController;