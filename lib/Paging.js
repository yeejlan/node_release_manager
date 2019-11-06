"use strict";

class Paging {
	static page(ctx, total, baseUrlStr, currentPage, pageSize) {
		let pages = Math.ceil(total / pageSize);
		let currPage = currentPage;
		let prev = 1;
		let next = pages;
		let last = pages;
		let baseUrl = baseUrlStr;
		if(pages < 2) {
			return '';
		}

		if(currPage > pages) {
			currPage = pages;
		}
		if(currPage < 1) {
			currPage = 1;
		}
		if(currPage > 1) { //page prev
			prev = currPage -1;
		}

		if(currPage < pages) { //page next
			next = currPage + 1;
		}

		baseUrl = baseUrl.replace(/\\?page=([0-9]+)&/, "?");
		baseUrl = baseUrl.replace(/\\?page=([0-9]+)/, "");
		baseUrl = baseUrl.replace(/&page=([0-9]+)&/, "");

		let pageParam = "page=";
		let params = ctx.params;
		let paramTotal = Object.keys(params).length;
		if(baseUrl.endsWith('/') || (params.page && paramTotal == 1)) {
			pageParam = "?" + pageParam;
		}else {
			if(!baseUrl.endsWith('&')) {
				pageParam = "&" + pageParam;
			}
		}

		// first page & page previous
		let str = "";
		if(currPage == 1) {
			str += '<li><a href="#" title="first">&lt;&lt;</a></li>';
			str += '<li><a href="#" title="previous">&lt;</a></li>';
		}else {
			str += "<li><a href=\"" + baseUrl + pageParam + '1"  title="first">&lt;&lt;</a></li>';
			str += "<li><a href=\"" + baseUrl + pageParam + prev + ' " title="previous">&lt;</a></li>';
		}

		let start_pos = 0;
		if(currPage > 5) {
			start_pos = currPage -5;
		}
		let end_pos = pages;
		if(currPage < pages -5) {
			end_pos = currPage + 5;
		}

		for(let c=start_pos; c<end_pos; c++) {
			let pageNumber = c + 1;
			if(currPage == pageNumber) {
				str += '<li class="active"><a href="#">' + pageNumber + "</a></li>";
			}else {
				str += "<li><a href=\"" + baseUrl + pageParam + pageNumber + "\">" + pageNumber + "</a></li>";
			}
		}

		// last page
		if(currPage == last) {
			str += '<li><a href="#" title="next">&gt;</a></li>';
			str += '<li><a href="#"  title="last">&gt;&gt;</a></li>';
		}else {
			str += "<li><a href=\"" + baseUrl + pageParam + next + ' " title="next">&gt;</a></li>';
			str += "<li><a href=\"" + baseUrl + pageParam + last + ' " title="last">&gt;&gt;</a></li>';
		}

		return str;
	}
}

exports.Paging = Paging;