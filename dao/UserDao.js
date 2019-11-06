"use strict";

let db = app.get('mysql.release_manager');

class UserDao {
	async new(username, password, role) {
		role = role || 'user';
		if(!username || !password) {
			return false;
		}
		let p = {
			username: username,
			password: password,
			role: role
		};
		let sql = 'insert into users \
		(`username`,`password`,`role`) values (:username, :password, :role)';
		return await db.insert(sql, p, true);
	}

	async update(id, password, role) {
		role = role || 'user';
		if(id < 1) {
			return false;
		}
		let passwordSql = '';
		if(password) {
			passwordSql = "password = :password,"
		}
		let p = {
			id: id,
			password: password,
			role: role
		};
		return await db.update(`update users set ${passwordSql} role = :role where id = :id`, p);
	}

	async delete(id) {
		if(id < 1) {
			return false;
		}
		let p = {
			id: id,
		};
		return await db.update("delete from users where id = :id", p);
	}

	async list(offset, pageSize) {
		offset = offset || 0;
		pageSize = pageSize || 10;
		let p = {
			offset: offset,
			pageSize: pageSize
		}
		return await db.select("select * from users limit :offset, :pageSize", p);
	}

	async getUserByName(username) {
		if(!username) {
			return false;
		}
		let p = {
			username: username
		}
		return await db.selectOne("select * from users where username = :username", p);
	}

	async getUserById(userid) {
		if(userid < 1) {
			return false;
		}
		let p = {
			id: userid
		}
		return await db.selectOne("select * from users where id = :id", p);
	}

	async updatePassword(userid, password) {
		if(userid < 1 || !password) {
			return false;
		}
		let p = {
			password: password,
			id: userid
		}
		return await db.update("update users set password = :password where id = :id", p);
	}
}

exports.UserDao = UserDao;