$(function() {
    $.parser.onComplete = function() {
		/**
		 * 自定义查询框
		 */
		$.each($('.customsearch'), function(index, item) {
		    $(item).removeClass("customsearch");
		    var data = JSON.parse($(item).attr("data-options"));
		    // 初始化自定义控件逻辑
		    createSearchTextBox($(item).attr('id'), data);
		});
		
		$.each($('.customfilter'), function(index, item) {
		    $(item).removeClass("customfilter");
			 var data = JSON.parse($(item).attr("data-options"));
			    // 初始化自定义控件逻辑
			    createfilterTextBox($(item).attr('id'), data);
		});
    };
    $.parser.onComplete();
});

/**
 * 筛选框
 * 
 * @param createFilterTextBox
 * @param searchid
 * @param data
 * @returns
 */
function createfilterTextBox(searchid, data) {
    if (!data.datagrid && !data.loadFunction) {
	console.log('错误:没有datagrid');
	return;
    }
    if(!data.datagrid){
	eval(data.loadFunction);
	return ;
    }
    var tableid = data.datagrid;
    data.label= data.label?data.label:"状态:";
    data.value=data.selected;
    data.onSelect= data.onSelect? data.onSelect: function(record){
	    var queryParams = $("#" + tableid).datagrid('options').queryParams;
	    if (!queryParams)
		queryParams = {};
	    var statestr= data.pname?data.pname:'state';
	    try{
		eval('queryParams.'+statestr+'=record.value');
	    }catch (e){
		console.log(e);
	    }
	    $("#" + tableid).datagrid({
				url : $("#"+ tableid).datagrid('options').url,
				queryParams : queryParams
			    });
    };
	
    $("#" + searchid).combobox(data);
}

/**
 * 查询框
 * 
 * @param createSearchTextBox
 * @param searchid
 * @param data
 * @returns
 */
function createSearchTextBox(searchid, data) {
    $("body").append("<style>.icon-clear{visibility: hidden;}</style>");
    if (!data.datagrid && !data.loadFunction) {
	console.log('错误:没有datagrid');
	return;
    }
    var tableid = data.datagrid;
    confdatath = data.width ? parseFloat(data.width) : 300;
    data.hegiht = data.hegiht ? parseFloat(data.hegiht) : 30;
    data.prompt = data.title ? data.title : '请输入查询关键字';
    data.icons = [{
		    iconCls : 'icon-clear',
		    handler : function(e) {
			$(e.data.target).textbox('clear').textbox('textbox').focus();
			$(this).css('visibility', 'hidden');
			if (data.loadFunction) {
			    try {
				eval(data.loadFunction + "('"+ "')");
			    } catch (e) {
				console.log(e);
			    }
			} else {
			    var queryParams = $("#" + tableid).datagrid('options').queryParams;
			    if (!queryParams)
				queryParams = {};
			    queryParams.keyword = "";
			    $("#" + tableid).datagrid({
						url : $("#"+ tableid).datagrid('options').url,
						queryParams : queryParams
					    });
			}
		    }
		},
		{
		    iconCls : 'icon-search',
		    handler : function(e) {
			var key = $.trim($("#" + searchid).textbox("getValue"));
			if (data.loadFunction) {
			    try {
				eval(data.loadFunction + "('"+ key + "')");
			    } catch (e) {
				console.log(e);
			    }
			} else {
			    var queryParams = $("#" + tableid).datagrid('options').queryParams;
			    if (!queryParams)
				queryParams = {};
			    queryParams.keyword = key;
			    $("#" + tableid).datagrid({
						url : $("#"+ tableid).datagrid('options').url,
						queryParams : queryParams
					    });
			}
		    }
		} ];
    data.inputEvents = $.extend({},$.fn.textbox.defaults.inputEvents, {
		    keyup : function(e) {
			var t = $(this).val();
			var icon = $("#" + searchid).textbox(
				'getIcon', 0);
			if (t != null && t != "") {
			    icon.css('visibility', 'visible');
			} else {
			    icon.css('visibility', 'hidden');
			}
		    }
		});
    $("#" + searchid).textbox(data);
}