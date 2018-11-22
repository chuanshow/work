$(function(){
	$('a,img').attr('ondragstart','return false');
})
//发送消息
function talkBtn(){
	var input = $('#talk-input');
	var val = input.val();
	if (!val || val == '') {
		input.focus();
		return false;
	}
	var cbok = '';

	try{
		if(pushWXType){
			cbok = pushWX('msg',1);
		}
	}catch(e){
		//console.log(e);
	}
	onSendMsg( input,cbok);
	$.messager.progress({});
}
var inputFB = false;


$(document).on('keydown','.talk-input',function(){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode==13){ 
		talkBtn();
	}     
});

$(document).on('click','.pop-close-btn',function(){
	
	$(this).parents('.con-talk-type-box').remove();
	
})


//申请病历
function mrecodeinfor(type,data){
	if(type == 1){
		
		//只读
		var mrid = data.mrecord.mrid;
		var url = Domain+'dr2/case/detail?mrid='+mrid+'&&dtid='+dtid;
		
		var obj = {
			name : commonIn.tabsCaseName,
			url : url
		}
		
		talkAddTabs(obj);
		
	}else if(type == 2){
		
		//读写
		var mrid = data.mrecord.mrid;
		var url = Domain+'dr2/case/change?mrid='+mrid+'&&dtid='+dtid;
		
		var obj = {
			name : commonIn.tabsCaseName,
			url : url
		}
		
		talkAddTabs(obj);
		
	}
	
}


//会诊报告
function reportinfor(type,data){
	if(type == 1){
		
		//只读
		var ciid = data.consultationinfor.ciid;
		var cimrid = data.consultationinfor.cimrid;
		var url = Domain+'dr2/consultation/reportdetail?dtid='+dtid+'&&ciid=' + ciid + '&&cimrid=' + cimrid;
		
		var obj = {
			name : commonIn.tabsConsultationReportName,
			url : url
		}
		
		talkAddTabs(obj);
		
	}else if(type == 2){
		
		//读写
		var ciid = data.consultationinfor.ciid;
		var cimrid = data.consultationinfor.cimrid;
		var url = Domain+'dr2/consultation/reportedit?dtid='+dtid+'&&ciid=' + ciid + '&&cimrid=' + cimrid+'&reload=re'+dtid+'();';
		
		var obj = {
			name : commonIn.tabsConsultationReportName,
			url : url,
		}
		
		talkAddTabs(obj);
		
	}
	
}

//会诊意见书
function opinioninfor(type,data){
	if(type == 1){
		
		//只读
		var ciid = data.consultationinfor.ciid;
		var cimrid = data.consultationinfor.cimrid;
		var url = Domain+'dr2/consultation/opiniondetail?dtid='+dtid+'&&ciid=' + ciid + '&&cimrid=' + cimrid;
		var obj = {
			name : commonIn.tabsConsultationOpinionName,
			url : url
		}
		
		talkAddTabs(obj);
		
	}else if(type == 2){
		
		//读写
		var ciid = data.consultationinfor.ciid;
		var cimrid = data.consultationinfor.cimrid;
		var url = Domain+'dr2/consultation/opinionedit?dtid='+dtid+'&&ciid=' + ciid + '&&cimrid=' + cimrid+'&reload=re'+dtid+'();';
		
		var obj = {
			name : commonIn.tabsConsultationOpinionName,
			url : url
		}
		
		talkAddTabs(obj);
		
	}
	
}

//申请报告
function consultationinfor(type,data){
	if(type == 1){
		
		//只读
		var ciid = data.consultationinfor.ciid;

		var cimrid = data.consultationinfor.cimrid;
		
		var url = Domain+'dr2/consultation/applydetail?dtid='+dtid+'&&ciid='+ciid+'&&cimrid='+cimrid;
		var obj = {
			name : commonIn.tabsConsultationApplyName,
			url : url
		}
		
		talkAddTabs(obj);
		
	}else if(type == 2){
		
		//读写
		var ciid = data.consultationinfor.ciid;

		var cimrid = data.consultationinfor.cimrid;
		
		var url = Domain+'dr2/consultation/applyedit?dtid='+dtid+'&&ciid='+ciid+'&&cimrid='+cimrid+'&reload=re'+dtid+'();';
		var obj = {
			name : commonIn.tabsConsultationApplyName,
			url : url
		}

		talkAddTabs(obj);
		
	}
	
}

function talkAddTabs(obj){
	if(typeof obj != 'object'){
		console.log('talkAddTabs传入值不是JSON');
		return false;
	}
	
	tabDom.tabs('add',{
	    title : obj.name,
	    href : obj.url,
	    id : obj.id
	});
	
}

//打开表情
$(document).on('click','.talk-icon-btn',function(event){
	var _this = $(this);
	var faceDom = _this.siblings('.wl_faces_box');
	showEmotionDialog(faceDom);
});

//发送图片
$(document).on('change','.talk-img-btn',function(){
	var _this = $(this);
    var file = _this.get(0).files[0]; 
    if(!/image\/\w+/.test(file.type)){
    	$.messager.alert(commonIn.title,commonIn.imSendImgErr);
        return false;  
    }
    $.messager.progress();
    if(_this.hasClass('pt'))
    	uploadPic(file,pushWX('msg',2));
    else
    	uploadPic(file);
	
})

//发送文件
$(document).on('change','.talk-file-btn',function(){
	
	var _this = $(this);
    var file = _this.get(0).files[0]; 
    $.messager.progress();
    uploadFile(file);
})
//放大图片talk -img 
$(document).on('click','.talk-user-text p img',function(){
	
	var $this = $(this);
	var url = $this.attr('src');
	
	
	var str = '';
	
	str += '<div class="talk-pop-box">';
	
	str += '<img class="remove-talk-pop-btn" src="'+Domain+'common/easyui/img/delet_btn.png">';
	
	str += '<div class="talk-pop-img-box">';
	str += '<img src="'+url+'">';
	str += '</div>';
	
	
	str += '<div class="talk-pop-box-btn">';
	
	str += '<img onclick="enlarge(this)" src="'+Domain+'common/easyui/img/fangda.png" title="'+commonIn.imgHandleTips_a+'">';
	
	str += '<img onclick="narrow(this)" src="'+Domain+'common/easyui/img/suoxiao.png" title="'+commonIn.imgHandleTips_b+'">';

	str += '<img onclick="rotate_left(this)" src="'+Domain+'common/easyui/img/youxuan.png" title="'+commonIn.imgHandleTips_c+'">';

	str += '<img onclick="rotate_right(this)" src="'+Domain+'common/easyui/img/zuoxuan.png" title="'+commonIn.imgHandleTips_d+'">';
	
	str += '</div>'
		
		
	str += '</div>';
	
	$('body').append(str);

	var oBox = $('.talk-pop-img-box img')[0];
	var oBar = $('.talk-pop-img-box img')[0];
	startDrag(oBar, oBox);

	oBox.onmousewheel=scrollFunc;//IE/Opera/Chrome 

	
})

var scrollFunc=function(e){ 
    e=e || window.event; 
   
    if(e.wheelDelta){//IE/Opera/Chrome 
        //console.log(e.wheelDelta); 
    	if(e.wheelDelta > 0){
    		enlarge();
    	}else{
    		narrow();
    	}
        
    }else if(e.detail){//Firefox 
    	//console.log(e.detail); 
    	if(e.detail > 0){
    		narrow();
    	}else{
    		enlarge();
    	}
        
    } 
} 
/*注册事件*/ 
if(document.addEventListener){ 
    document.addEventListener('DOMMouseScroll',scrollFunc,false); 
}//W3C 
	

function enlarge(t){
	if(t){
		
	var listDom = $(t).parent('.talk-pop-box-btn');
	var img = listDom.siblings('.talk-pop-img-box').find('img');

	}else{
		var img = $('.talk-pop-img-box img');
	}
	
	var oWidth=img.width(); //取得图片的实际宽度
	img.css({
		'maxWidth': 'none'
	})
	img.width(oWidth + 50);
	
	
}

function narrow(t){
	
	if(t){
		
	var listDom = $(t).parent('.talk-pop-box-btn');
	var img = listDom.siblings('.talk-pop-img-box').find('img');

	}else{
		var img = $('.talk-pop-img-box img');
	}
	var oWidth=img.width(); //取得图片的实际宽度
	img.css({
		'maxWidth': 'none'
	})
	img.width(oWidth - 50);
	

}

function rotate_left(t){
	var listDom = $(t).parent('.talk-pop-box-btn');
	var img = listDom.siblings('.talk-pop-img-box').find('img');
	var size = img.attr('data-size') || 0 ;
	size = parseInt(size) + 15;
	img.css({
		'transform':'rotate('+size+'deg)',
		'-ms-transform':'rotate('+size+'deg)', 	/* IE 9 */
		'-moz-transform':'rotate('+size+'deg)', 	/* Firefox */
		'-webkit-transform':'rotate('+size+'deg)', /* Safari 和 Chrome */
		'-o-transform':'rotate('+size+'deg)' 	/* Opera */
		
	})
	img.attr('data-size',size); 
}

function rotate_right(t){
	var listDom = $(t).parent('.talk-pop-box-btn');
	var img = listDom.siblings('.talk-pop-img-box').find('img');
	var size = img.attr('data-size') || 0 ;
	size = parseInt(size) - 15;
	img.css({
		'transform':'rotate('+size+'deg)',
		'-ms-transform':'rotate('+size+'deg)', 	/* IE 9 */
		'-moz-transform':'rotate('+size+'deg)', 	/* Firefox */
		'-webkit-transform':'rotate('+size+'deg)', /* Safari 和 Chrome */
		'-o-transform':'rotate('+size+'deg)' 	/* Opera */
		
	})
	img.attr('data-size',size); 
}




//关闭 图片弹窗
$(document).on('click','.remove-talk-pop-btn',function(){
	
	var $this = $(this);
	var Dom = $this.parents('.talk-pop-box');
	Dom.remove();
	document.onmousewheel=function(){};
})





var params = {
	left: 0,
	top: 0,
	currentX: 0,
	currentY: 0,
	flag: false
};
//获取相关CSS属性
var getCss = function(o,key){
	return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 	
};

//拖拽的实现
var startDrag = function(bar, target, callback){
	if(getCss(target, "left") !== "auto"){
		params.left = getCss(target, "left");
	}
	if(getCss(target, "top") !== "auto"){
		params.top = getCss(target, "top");
	}
	//o是移动对象
	bar.onmousedown = function(event){
		params.flag = true;
		if(!event){
			event = window.event;
			//防止IE文字选中
			bar.onselectstart = function(){
				return false;
			}  
		}
		var e = event;
		params.currentX = e.clientX;
		params.currentY = e.clientY;
	};
	document.onmouseup = function(){
		params.flag = false;	
		if(getCss(target, "left") !== "auto"){
			params.left = getCss(target, "left");
		}
		if(getCss(target, "top") !== "auto"){
			params.top = getCss(target, "top");
		}
	};
	document.onmousemove = function(event){
		var e = event ? event: window.event;
		if(params.flag){
			var nowX = e.clientX, nowY = e.clientY;
			var disX = nowX - params.currentX, disY = nowY - params.currentY;
			target.style.left = parseInt(params.left) + disX + "px";
			target.style.top = parseInt(params.top) + disY + "px";
			if (event.preventDefault) {
				event.preventDefault();
			}
			return false;
		}
		
		if (typeof callback == "function") {
			callback(parseInt(params.left) + disX, parseInt(params.top) + disY);
		}
	}	
};



