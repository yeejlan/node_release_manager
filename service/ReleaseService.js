"use strict";

const {SiteConfigModel} = require('../model/SiteConfigModel');
const {LogModel} = require('../model/LogModel');
const {Utils} = require('../lib/Utils');

let spawn = require('child_process').spawn;

let commandMapping = {
	"getCurrentBranch": "get_current_branch_command",
	"update": "update_command",
	"generate": "generate_command",
	"testRelease": "test_release_command",
	"release": "release_command"
};
let COMMAND_COLOR = "#3A87AD";
let SUCCESS_COLOR = "#468847";
let FAILURE_COLOR = "#894A48";

let siteConfigModel = new SiteConfigModel();
let logModel = new LogModel();

class ReleaseService {
	constructor() {
		this.runResult = '';
		this.ctx = null;
	}

	async runCommand(ctx, siteId, command) {
		this.ctx = ctx;
		if(command == "") {
			return
		}
		if(siteId < 1) {
			return this.print("invalid siteId");
		}
		if(!commandMapping[command]) {
			return this.print("invalid command");
		}
		let siteInfo = await siteConfigModel.getById(siteId);
		if(!siteInfo) {
			return this.print("Site not found, siteId = " + siteId);
		}

		let docBegin = '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>file content</title></head><body>';
		let scrollBegin = '<script>var scroll_to_bottom = function() { var height = document.body.scrollHeight; window.scrollTo(0, height) }, timer = setInterval(scroll_to_bottom, 100);</script>';
		await this.write(docBegin);
		await this.write(scrollBegin);

		let cmdKey = commandMapping[command];
		let cmdStr = siteInfo[cmdKey];
		let baseDir = siteInfo["base_dir"];
		cmdStr = cmdStr.replace("\r\n", "\n");
		cmdStr = cmdStr.replace("\r", "\n");
		let commands = cmdStr.split('\n');
		for(let oneCmd of commands) {
			if(!oneCmd) {
				continue;
			}
			this.print('<br /><strong>Command Executed:</strong><br /> \
				<span style="color:' + COMMAND_COLOR + "\">" + oneCmd +
				"</span><br /><br /><strong>Execution Result:</strong><br /><br />");
			await this.runCmd(oneCmd, baseDir);
		}
		
		let scrollEnd = "<script>clearInterval(timer); setTimeout(scroll_to_bottom, 500);</script>";
		let docEnd = "</body></html>";
		await this.write(scrollEnd);
		await this.write(docEnd);
		
		//log
		let session = this.ctx.session;
		let uid = parseInt(session.get('uid')) || 0;
		let username = session.get('username') || '';
		let ip = Utils.getClientIp(this.ctx);
		logModel.add(
			uid, 
			username,
			command,
			this.runResult.toString(),
			ip
		)
	}

	async runCmd(cmdStr, baseDir) {
		let cmdArr = cmdStr.split(' ');
		let cmd = cmdArr[0];
		cmdArr.shift();
		let args = cmdArr;
		let proc = spawn(cmd, args, {cwd: baseDir});
		proc.stdout.on('data', (data) => {
			this.print("<span style=\"color:" + SUCCESS_COLOR + ";\">" + data + '</span>');
		});

		proc.stderr.on('data', (data) => {
			this.print("<span style=\"color:" + FAILURE_COLOR + ";\">" + data + '</span>');
		});

		return new Promise((resolve, reject) => {
			proc.on('close', (code) => {
				this.print('<br />');
				resolve(code);
			});
			proc.on('error', (code) => {
				this.print('<br />');
				resolve(false);
			});
		});
	}

	async print(message) {
		let msg = message.replace("\r\n", "\n");
		msg = msg.replace("\r", "\n");
		msg = msg.replace("\n", "<br />\n");
		this.runResult += msg;
		return new Promise((resolve, reject) => {
			this.ctx.response.write(message, 'utf-8', () => {
				resolve(null);
			})
		});
	}

	async write(message) {
		return new Promise((resolve, reject) => {
			this.ctx.response.write(message, 'utf-8', () => {
				resolve(null);
			})
		});		
	}
}

exports.ReleaseService = ReleaseService;