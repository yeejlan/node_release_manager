"use strict";

let db = app.get('mysql.release_manager');

class SiteConfigDao {
	async new(siteconfig) {
		if(!siteconfig.sitename) {
			return false;
		}

		let p = siteconfig;

		let result = await db.insert("insert into siteconfig \
			(`sitename`,`base_dir`,`get_current_branch_command`,`update_command`,\
			generate_command,`test_release_command`,`release_command`,`cache_dir`,\
			`cache_exclude_dir`,`cache_urls`) values \
			(:sitename,:base_dir,:get_current_branch_command,:update_command,\
			:generate_command,:test_release_command,:release_command,:cache_dir,\
			:cache_exclude_dir,:cache_urls)", p);

		return result;
	}

	async list(offset, pageSize) {
		let p = {
			offset: offset,
			pageSize: pageSize
		}
		let result = await db.select("select * from siteconfig limit :offset , :pageSize", p);
		return result;
	}

	async getById(id) {
		if(id < 1) {
			return false;
		}
		let p = {
			id: id
		}
		let result = await db.selectOne("select * from siteconfig where id = :id", p);
		return result;
	}

	async update(siteconfig){
		if(siteconfig.id < 1) {
			return false;
		}
		let p = siteconfig;
		let result = await db.update("update siteconfig set \
			`sitename` = :sitename, \
			`base_dir` = :base_dir, \
			`get_current_branch_command` = :get_current_branch_command, \
			`update_command` = :update_command, \
			`generate_command` = :generate_command, \
			`test_release_command` = :test_release_command, \
			`release_command` = :release_command, \
			`cache_dir` = :cache_dir, \
			`cache_exclude_dir` = :cache_exclude_dir, \
			`cache_urls` = :cache_urls \
			 WHERE id = :id", p);
		return result;
	}

	async delete(id) {
		if(id < 1) {
			return false;
		}
		let p = {
			id: id
		}
		let result = await db.update("delete from siteconfig where id = :id", p);
		return result;
	}
}

exports.SiteConfigDao = SiteConfigDao;