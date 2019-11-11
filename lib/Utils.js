"use strict";

class Utils {
	static getClientIp(ctx) {
		let req = ctx.request;
		let ipstr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		let ipArr = ipstr.split(',');
		return ipArr[0];
	}

	static time() {
		return Math.round(new Date() / 1000);
	}

	static date(dateString) {
		let d = new Date();
		if(dateString) {
			d = new Date(dateString);
		}
		return d.toISOString().replace(/T.+/, '')
	}
}

exports.Utils = Utils;