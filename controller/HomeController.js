"use strict";

let {BaseController} = require('./BaseController')
let {UserDao} = require('../dao/UserDao')

let db = app.get('mysql.release_manager');

class HomeController extends BaseController {

    async before1() {
        await super.before()
        console.log("this is home.before() running")
    }

    async indexAction() {
        return this.ctx.params
        //return 'this is home/index page ' + this.ctx.params['a']
    }

    async helloAction() {
        return this.ctx.params
    }    

    async sessLoadAction() {
    	return this.ctx.session.getStorage();
    }

    async sessionSaveAction() {
        let time = Math.round(new Date().getTime()/1000)
    	this.ctx.session.set('time', time);
        return time;
    }

    async logAction() {
    	return await db.select("select * from action_log where 1 limit 3");
    }

    async tplAction() {
        this.ctx.exit();
        return await this.ctx.render('/aaa')
    }

    async errorAction() {
        throw new Error("a test error")
    }
}

exports.HomeController = HomeController;
