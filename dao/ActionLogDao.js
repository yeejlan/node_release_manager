"use strict";

const {Utils} = require('../lib/Utils');
let db = app.get('mysql.release_manager');

class ActionLogDao {
	async add(userid, username, action_name, return_message, client_ip) {
		let p = {
			userid: userid,
			username: username,
			action_name: action_name,
			return_message: return_message,
			log_date: new Date().toISOString().replace(/T.+/, ''),
			log_ip: client_ip
		}

		return await db.insert("insert into action_log \
		(`userid`,`username`,`action_name`,`return_message`,`log_date`,`log_ip`) \
		values (:userid, :username, :action_name, :return_message, :log_date, :log_ip)", p, true);
	}

	async list(dateFilter, nameFilter, offset, pageSize) {
		let optionSQL = " where 1";
		if(dateFilter) {
			optionSQL += " and  log_date = :log_date ";
		}
		if(nameFilter) {
			optionSQL += " and  username = :username ";
		}
		let p = {
			offset: offset,
			pageSize: pageSize,
			log_date: dateFilter,
			username: nameFilter
		}
		let sql = `select * from action_log ${optionSQL} order by id desc limit :offset , :pageSize`;
		return await db.select(sql, p);
	}

	async getTotalCount(dateFilter, nameFilter) {
		let optionSQL = " where 1";
		if(dateFilter) {
			optionSQL += " and  log_date = :log_date ";
		}
		if(nameFilter) {
			optionSQL += " and  username like :username ";
		}
		let p = {
			log_date: Utils.date(dateFilter),
			username: nameFilter
		}

		let row = await db.selectOne(`select count(*) as cnt from action_log ${optionSQL}`, p);
		if(!row) {
			return 0;
		}
		return row['cnt'];
	}
}

exports.ActionLogDao = ActionLogDao;