"use strict";

const dateFormat = require('dateformat');

class BaseController {
	async before() {
		this.view = this.view || {};
		this.view.dateFormat = dateFormat;
		this.view.currController = this.ctx.controller;
		this.view.session = this.ctx.session;

		//no cache
		this.ctx.response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")

		this.ctx.session.set('keep-alive', new Date().getTime());
	}

	async render(file) {
		return await this.ctx.render(file, this.view);
	}
}

exports.BaseController = BaseController;
