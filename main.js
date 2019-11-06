"use strict";

const log = require('pino')()
global.log = log;
const pine = require('./pine');

let app = new pine.App();
global.app = app;
let router = new pine.Router(app);
let server = new pine.Server(router);

async function main(){

	let env = process.env.NODE_ENV || "production"
	await app.init(env, "release_manager");

	router.addRoute('/hello/(.*)', 'home/hello', {1: 'username'});

	let controller = require('./controller');
	router.setController(controller);

	server.serve()
}

main();