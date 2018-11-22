
$(function(){
	$('a,img').attr('ondragstart','return false');
})
function ckbtn(value, row, index){
	var str = '<i class="ck-icon icon-u-ck"></i>';
	
	return str;
	
}
function fupp_aaa(value,row,index){
	if(!value || value == "") return '';
	var str = '<div class="aaa-tips-btn">';
	var arr = value.split(",");
	$.each(arr,function(){
		str +='<span class="tips-btn case-add-tips-btn">'
		str +=this;
		str +='</span>';
	})
	str += '</div>';
	
	return str;
}
function IsDate(mystring) {
	var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
	var str = mystring;
	var arr = reg.exec(str);
	if(!arr || arr == '' || arr.length < 1){
		return false;
	}
	if (!reg.test(str)&&RegExp.$2<=12&&RegExp.$3<=31 || str==""){
		return false;
	}
	return true;
}

// 获取URL中参数
function GetQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

function followdate(format) {
	if (format != undefined) {
	    var date = new Date(format);
	    var y = date.getFullYear();
	    var m = date.getMonth() + 1;
	    m = m < 10 ? '0' + m : m;
	    var d = date.getDate();
	    d = d < 10 ? ("0" + d) : d;
	    var str = y + "-" + m + "-" + d
	    return str;
	} else {
	    return "-";

	}
}
function followState(value, row, index) {
	if (value == null)
	    value = 0;
	if (value == 0) {
	    return '<p>未开始随访</p>';
	}
	if (value == 1) {
	    return '<p >随访中</p>';
	}
	if (value == 2) {
	    return '<p >随访暂停</p>';
	}
	if (value == 3) {
	    return '<p >随访结束</p>';
	}
	return '-';
}

//性别
function Sex(value, row, index) {
	if(!value) return;
	if(value == '1') {
		var str = '<span class="text-apply-ing">男</span>';
		// return "男";
	} else if(value == '2') {
		var str = '<span class="text-over">女</span>';
		// return "女";
	} else{
		var str = '<span class="text-over-ing">未知</span>';
		// return "未知"
	}
	return str;

}

function formatpttype(value, row, index){
	if(value=='1'){
		var str = '<span class="text-apply-ing">门诊</span>';
		// return '门诊';
	}else if(value=="2"){
		var str = '<span class="text-apply-stop">急诊</span>';
		// return '急诊';
	}else if(value=="3"){
		var str = '<span class="text-over">住院</span>';
		// return '住院';
	}else{
		var str = '<span class="text-over-ing">其他</span>';
		// return '其它';
	}
	return str;
}



function followType(value, row, index) {
	if (value == 0) {
	    return '<p>长期随访课题</p>';
	}
	if (value == 1) {
	    return '<p>短期随访课题</p>';
	}
}
function funtype_formatter(value, row, index) {
	if (value === '0')
	    return "量表问卷";
	if (value === '1')
	    return "患教知识";
	if (value === '2')
	    return "复查提醒";
	return "-";
}
function f_fugtype(value,row,index){
    if(value==='0') return '网络随访';
    if(value==='1') return '人工随访';
    return '-';
}

function f_fugstate(value,row,index){
    if(value==='0') return '在访';
    if(value==='1') return '失访';
    if(value==='2') return '死亡';
    if(value==='3') return '中止';
    if(value==='4') return '结束';
    return '-';
}
function fuppublic_formatter(value, row, index) {
	switch (value) {
	case '0':
	    return '公有';
	case '1':
	    return '医院';
	case '2':
	    return '科室';
	case '3':
	    return '医生组';
	case '4':
	    return '个人';
	}
	return '-';
}

function f_fuestate(value, row, index) {
    if(value)
	switch (value) {
	case "0":
	    return '待执行';
	case "1":
	    return '推送失败'+(row && row.fuepushmsg ?'('+row.fuepushmsg+')':'' );
	case "2":
	    return '待反馈';
	case "3":
	    return '已反馈';
	case "4":
	    return '已取消';
	}
    return  "未执行";
}

function formatDate(value, row, index) {
	var unixTimestamp = new Date(value);
	var s = unixTimestamp.toLocaleString().replace(/\//g, "-");
	return s.substring(0, 9);
	}

function add0(m){return m<10?'0'+m:m }
function formatYMDHMS(shijianchuo)
{
var time = new Date(shijianchuo);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function followPlan(value, row, index) {
	if (value != null)
	    return '<a style="color:blue" onClick="planinfo(' + row.futfupid
		    + '\,\'' + row.fupname + '\')" >' + row.fupname + '</a>';
}





function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1000);
	var cval=getCookie(name);
	if(cval!=null)
	document.cookie= name + "="+cval+";expires="+exp.toGMTString()+"; path=/";
}
function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}
//setCookie("name","hayden","s20");
function setCookie(name,value,time)
{
	var time = time || 'd365';
	var strsec = getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec*1);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getsec(str)
{
	var str1=str.substring(1,str.length)*1;
	var str2=str.substring(0,1);
	if (str2=="s")
	{
		return str1*1000;
	}
	else if (str2=="h")
	{
		return str1*60*60*1000;
	}
	else if (str2=="d")
	{
		return str1*24*60*60*1000;
	}
}


