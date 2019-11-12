"use strict";

const {SiteConfigDao} = require('../dao/SiteConfigDao');
let siteConfigDao = new SiteConfigDao();

class SiteConfigModel {
	async new(siteconfig) {
		return siteConfigDao.new(siteconfig);
	}

	async list(offset, pageSize) {
		return siteConfigDao.list(offset, pageSize);
	}

	async getById(id) {
		return siteConfigDao.getById(id);
	}

	async update(siteconfig){
		return siteConfigDao.update(siteconfig);
	}

	async delete(id) {
		return siteConfigDao.delete(id);
	}
}

exports.SiteConfigModel = SiteConfigModel;