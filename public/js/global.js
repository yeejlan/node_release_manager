/**
 * JavaScript global
 */

jQuery(function(){
	$('#myModal').modal({
		show: false
	});	
	
	var jQ_result = $('#js_result'),
		jQ_keyWords = $('#keyWords'),
		jQ_form = $('#js_releaseForm'),
		jQ_hiddenTask = jQ_form.find('input[name=task]'),
		jQ_hiddenReleaseType = jQ_form.find('input[name=releaseType]');
		jQ_hiddenKeyWords = jQ_form.find('input[name=keyWords]');
				
	function confirmDialog(callback){
		var jQ_myModal = $('#myModal');
		jQ_myModal.modal('show');
		jQ_myModal.find('.btn-danger')
			.unbind('click')
			.bind('click', function() {
				callback();
				jQ_myModal.modal('hide');
			});
	}

	$('#selectedSite').change(function() {
		var selectedSite = $(this).val();
		if(selectedSite != ''){
			location.href = "home?siteId=" + selectedSite;
		}
	});

	$('#selectReleaseType').change(function() {
		var selectReleaseType = $(this).val();

		if(selectReleaseType == 'exclude'){
			$('.keywords_div label').html('Filter Key words:');
		} else {
			$('.keywords_div label').html('Include Key words:');
		}
	});
	
	$('.btnTask').click(function() { 
		var task = $(this).attr('data-task');
		var rollbackNumber = $.trim($('#rollBackNum').val());
		var siteId = $('#selectedSite').val();
		var url = '/home/runCommand?siteId='+ siteId +'&task=' + task;
		
		switch(task) {
			case 'rollback':
				url += '&rollbackNumber=' + rollbackNumber;
			case 'update':
			case 'generate':
				confirmDialog(function() {
					jQ_result.attr('src', url);	
				});
			
				break;
			default:
				jQ_result.attr('src', url);	
				
				break;
		}
	});
	
	$('#js_testRelease').click(function(){
		jQ_hiddenTask.val('testRelease');
		jQ_hiddenReleaseType.val($('#selectReleaseType').val());
		jQ_hiddenKeyWords.val(jQ_keyWords.val());
		jQ_form.submit();
	});
	$('#js_release').click(function(){
		confirmDialog(function() {
			jQ_hiddenTask.val('release');
			jQ_hiddenReleaseType.val($('#selectReleaseType').val());
			jQ_hiddenKeyWords.val(jQ_keyWords.val());
			jQ_form.submit();
		});
	});
	
	$('.siteFormBtn').click(function(){
		$('.formSet').submit();
	});
	
	$('#js_clearCache').click(function(){
		$('#js_formClearCache').submit();
	});
	
	$("#datepicker" ).datepicker();
	
	$('.pagination').find('li').click(function(){
		var self = $(this);
		self.addClass('active').sublings().removeClas('active');
		
	});
	
	$('.btn_del').click(function(){
		var self = $(this),
			siteId = self.siblings('input');
		confirmDialog(function() {
			location.href = "/siteconfig/delete/?id=" + siteId.val();
		});
	});
	
	$('.returnMessage').click(function(){
		var self = $(this),
		js_myModal = $('#myModal'),
		message = self.siblings('.hidMessage').html();
		js_myModal.find('p').html(message);
		js_myModal.modal('show');
	});
	
	$('.btn_user').click(function(){
		$(this).closest('form').submit();
	});
	
	$('#log_search').click(function(){
		$(this).closest('form').submit();
	});
	
	$('.btn_delUser').click(function(){
		var self = $(this),
			siteId = self.siblings('input');
		confirmDialog(function() {
			location.href = "/admin/delete/?id=" + siteId.val();
		});
	});
	
	var fixHelper = function(e, ui) {
		ui.children().each(function() {
			$(this).width($(this).width());
		});
		return ui;
	};

	var jQ_save = $('#js_save'),
		jQ_order = $('#js_order'),
		jQ_sortable = $('#sortable'),
		jQ_sortableBody = jQ_sortable.find('tbody');
	jQ_order.click(function(){
		jQ_sortableBody.sortable({
			helper: fixHelper,
			cancel: ""
		});
		jQ_sortable.removeClass('table-striped');
		jQ_sortableBody.addClass('alert-info');
		jQ_order.hide();
		jQ_save.show();
		
	});
	$('#js_orderOpt').delegate('#js_save', 'click', function(){
		var ids = [];
		$('#sortable tbody tr').each(function() {
			var id = $(this).find("td:first").text();
			ids.push(id);
		});
		var oData = {ids: ids.toString()};
		var url = '/siteconfig/updateorderlist';
		$.post(url, oData, function(json){
			if(json.state == 'success'){
				jQ_order.show();
				jQ_save.hide();
				jQ_sortable.addClass('table-striped');
				jQ_sortableBody.removeClass('alert-info');
				jQ_sortableBody.sortable({
					cancel: '#sortable tbody'
				});
			}
		});
	});

	
});
