
//添加消息到页面
function addMsg(id , msg){
	//console.log(msg)
	if(msg.elems[0].type == 'TIMGroupTipElem'){
		return false;
		userName = '提示' ;
		img = ImgUrl + '/common/img/ybhz.png';
	}
	var img , userName;
	if(friendImg && friendImg.length > 0){
			
		$.each(friendImg,function(index , val){
			if(friendImg[index].userid == msg.fromAccount){
				img = ImgUrl + friendImg[index].uheadportrait;
				var uname = friendImg[index].uname;
				var udremark = friendImg[index].udremark;
				userName = udremark  ? udremark : uname ;
				
				return false ;
			}
		})

	}
	if(convertMsgtoHtml(msg) == 'false') return false;
    var test = convertMsgtoHtml(msg);
	var cls = id == 1 ? 'my-talk' : '';
	img = img ? img : loginInfo.headurl;
	

	if(!userName && id == 1)
		userName = loginInfo.identifierNick;

	if(!userName) 
		userName = msg.fromAccountNick;
	
	
	var time = webim.Tool.formatTimeStamp(msg.time,'dd/MM/yyyy hh:mm:ss') ;
	var str = '';

	str += '<li class="'+cls+'">';
	str += '<div class="talk-user-img-box">';
	str += '<img src="'+img+'">';
	str += '</div>';
	str += '<div class="talk-user-info-box">';
	str += '<div class="talk-user-header">';
	str += '<span>'+userName+'</span>';
	str += '</div>';
	str += '<div class="talk-user-text">';
	
	if(msg.elems[0].type == "TIMCustomElem"){
		//自定义消息
		str += test;
	}else{
		//文本 图片
		str += '<p>';
		str += test;
		str += '</p>';
	}
	
	str += '</div>';

	str += '<div class="talk-user-time">';
	str += '<i>'+time+'</i>';
	str += '</div>';
	
	str += '</div>';
	str += '</li>';
	
	
	msgBox.append(str);
	
	if(msg.elems[0].type == "TIMImageElem"){
		
		setTimeout(function(){
			msgBox.parents('.ul-box').scrollTop(msgBox.height());
		},500)
		
	}else{
		
		msgBox.parents('.ul-box').scrollTop(msgBox.height());
		
	}
	
	$('img').on('error',function(){
	    $(this).attr('src', ImgUrl + '/common/img/error-img.png');
	});
    $.messager.progress('close');
}

//添加历史消息
function ListAddLastMsg(id , msg){
	
	var img , userName;
	$.each(friendImg,function(index , val){
		if(friendImg[index].userid == msg.fromAccount){
			img = ImgUrl + friendImg[index].uheadportrait;
			userName = friendImg[index].udremark ;
			return false ;
		}
	})
	if(convertMsgtoHtml(msg) == 'false') return false;
    var test = convertMsgtoHtml(msg);
	var cls = id == 1 ? 'my-talk' : '';
	img = img ? img : loginInfo.headurl;
	
	if(msg.elems[0].type == 'TIMGroupTipElem'){
		return false;
	}

	if(!userName && id == 1)
		userName = loginInfo.identifierNick;

	if(!userName) 
		userName = msg.fromAccountNick;
	
	
	var time = webim.Tool.formatTimeStamp(msg.time,'dd/MM/yyyy hh:mm:ss') ;
	var str = '';

	str += '<li class="'+cls+'">';
	str += '<div class="talk-user-img-box">';
	str += '<img src="'+img+'">';
	str += '</div>';
	str += '<div class="talk-user-info-box">';
	str += '<div class="talk-user-header">';
	str += '<span>'+userName+'</span>';
	str += '</div>';
	str += '<div class="talk-user-text">';
	
	if(msg.elems[0].type == "TIMCustomElem"){
		//自定义消息
		str += test;
	}else{
		//文本 图片
		str += '<p>';
		str += test;
		str += '</p>';
	}
	
	str += '</div>';

	str += '<div class="talk-user-time">';
	str += '<i>'+time+'</i>';
	str += '</div>';
	
	str += '</div>';
	str += '</li>';
	
	msgBox.prepend(str);
	
	$('img').on('error',function(){
	    $(this).attr('src', ImgUrl + '/common/img/error-img.png');
	});
    $.messager.progress('close');
}



function sMore7DaysMsg13(id , msg){
	
	var img , userName;
	$.each(friendImg,function(index , val){
		if(friendImg[index].userid == msg.fromaccount){
			img = ImgUrl + friendImg[index].uheadportrait;
			userName = friendImg[index].udremark ;
			return false ;
		}
	})
	if(sMore7DaysMsgConvert13(msg.mmsgcontent) == 'false') return false;
    var test = sMore7DaysMsgConvert13(msg.mmsgcontent);
	var cls = id == 1 ? 'my-talk' : '';
	img = img ? img : loginInfo.headurl;
	
	if(msg.mmsgcontent[0].type == 'TIMGroupTipElem'){
		return false;
	}

	if(!userName && id == 1)
		userName = loginInfo.identifierNick;

	if(!userName) 
		userName = msg.fromaccountnick;
	
	
	var time = webim.Tool.formatTimeStamp(msg.time,'dd/MM/yyyy hh:mm:ss') ;
	var str = '';

	str += '<li class="'+cls+'">';
	str += '<div class="talk-user-img-box">';
	str += '<img src="'+img+'">';
	str += '</div>';
	str += '<div class="talk-user-info-box">';
	str += '<div class="talk-user-header">';
	str += '<span>'+userName+'</span>';
	str += '</div>';
	str += '<div class="talk-user-text">';
	
	if(msg.mmsgcontent[0].type == "TIMCustomElem"){
		//自定义消息
		str += test;
	}else{
		//文本 图片
		str += '<p>';
		str += test;
		str += '</p>';
	}
	
	str += '</div>';

	str += '<div class="talk-user-time">';
	str += '<i>'+time+'</i>';
	str += '</div>';
	
	str += '</div>';
	str += '</li>';
	
	msgBox.prepend(str);
	
	$('img').on('error',function(){
	    $(this).attr('src', ImgUrl + '/common/img/error-img.png');
	});
    $.messager.progress('close');
	
}

function sMore7DaysMsgConvert13(msg){
	var type = msg[0].type;
	var content = msg[0].content;
	var html = "";

	switch (type) {
	    case webim.MSG_ELEMENT_TYPE.TEXT:
	        html += content.text;
	        break;
	    case webim.MSG_ELEMENT_TYPE.IMAGE:
	    	var smallImage = content.imageinfoarray[1].url;//小图
		    var bigImage = content.imageinfoarray[0].url;//大图
		    var oriImage = content.imageinfoarray[2].url;//原图
		    if (!bigImage) {
		      bigImage = smallImage;
		    }
		    if (!oriImage) {
		        oriImage = smallImage;
		    }
	
	        html += "<img src='" + oriImage +"' />";
	        break;
	    case webim.MSG_ELEMENT_TYPE.SOUND:
	    	html += "语音已过期";
	    	break;
	    case webim.MSG_ELEMENT_TYPE.CUSTOM:
	        html += sCustomMsg13(content);
	        break;
	    default:
	  	  console.log( html + '      未知消息元素类型: elemType=' + type);
	    break;
	}
	return html;
}

function sCustomMsg13(content){
	var data = content.data;//自定义数据
	if(data && typeof data != "object") data = strToJson(data) ; 
	if(!data) return false;
	var type = parseInt(data.type);
	switch(type)
	{
	case 1:
		var url = data.url;
		var str = '';
		str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_ychz.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_1+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_1+'</div>'
			
			str += '</div>';
		
	  break;
	case 2:
		var url = data.url;
		var str = '';
		str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/phone@2x.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_2+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_2+'</div>'
			
			str += '</div>';
		
	  break;
	case 3:
		  	var url = data.url;
		  	
				if(data.uid == loginInfo.identifier){
					var nowData = new Date().getTime();

					var now = Date.parse(new Date(nowData));
					now = now / 1000 ;
					var set =  Date.parse(new Date(data.overtime));
					set = set / 1000 ;
	
					if(now < set){
						
						var desktopStr = '<div class="desktop-tips-box">';
						desktopStr += '<a href="'+data.url+'" target="_blank">【'+data.yqName+'】' + commonIn.imCustomMsgTitle_3_tips + data.overtime;
						desktopStr += '</a>';
						desktopStr += '</div>';
						
						$('.ul-box').append(desktopStr);	
					}
				}
					
				var str = '';
				str += '<div class="talk-diy-box">';
				
				str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
				
				str += '<img src="' + Domain + 'common/easyui/img/talk_tb.png">'
				
				str += '<span class="content">'+commonIn.imCustomMsg_invite+'【 '+data.name+' 】'+commonIn.imCustomMsg_3+'【'+data.ckName+'】</span>';
				
				str += '</a>';
				
				str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_3+'<span>'+commonIn.imCustomMsg_overtime + data.overtime+'</span></div>'
				
				str += '</div>';
	
				break;
	case 4:
		  	var url = data.url;
				if(data.uid == loginInfo.identifier){
					var nowData = new Date().getTime();

					var now = Date.parse(new Date(nowData));
					now = now / 1000 ;
					var set =  Date.parse(new Date(data.overtime));
					set = set / 1000 ;
	
					if(now < set){
						
						var desktopStr = '<div class="desktop-tips-box">';
						desktopStr += '<a href="'+data.url+'" target="_blank">【'+data.yqName+'】'+ commonIn.imCustomMsgTitle_4_tips + data.overtime;
						desktopStr += '</a>';
						desktopStr += '</div>';
						
						$('.ul-box').append(desktopStr);	
					}
				}
					
				var str = '';
				str += '<div class="talk-diy-box">';
				
				str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
				
				str += '<img src="' + Domain + 'common/easyui/img/talk_bq.png">'
				
				str += '<span class="content">'+commonIn.imCustomMsg_invite+'【 '+data.name+' 】'+commonIn.imCustomMsg_4+'</span>';
				
				str += '</a>';
				
				str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_4+'<span>'+commonIn.imCustomMsg_overtime +data.overtime+'</span></div>'
				
				str += '</div>';
	
				break;
	case 5:
		  	var url = data.url;
		  	var str = '';
		  	str += '<div class="talk-diy-box">';
				
				str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
				
				str += '<img src="' + Domain + 'common/easyui/img/tk_icon_ycyx.png">'
				
				str += '<span class="content">'+commonIn.imCustomMsg_5+'</span>';
				
				str += '</a>';
				
				str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_5+'</div>'
				
				str += '</div>';
		  	
		    break;
	case 6:
		var url = data.url;

		data.sName = data.sName ? data.sName : data.sname;
		data.yqName = data.yqName ? data.yqName : data.yqname;
		var zdyname = data.zdyname || '虚拟桌面';
		
			if(data.uid == loginInfo.identifier){
				var nowData = new Date().getTime();

				var now = Date.parse(new Date(nowData));
				now = now / 1000 ;
				var set =  Date.parse(new Date(data.overtime));
				set = set / 1000 ;
				if(now < set){

					var desktopStr = '<div class="desktop-tips-box">';
					desktopStr += '<a href="'+data.url+'" target="_blank">【'+data.yqName+'】邀请你进行'+zdyname+'，点击进入操作！过期时间：' + data.overtime;
					desktopStr += '</a>';
					desktopStr += '</div>';
					
					$('.ul-box').append(desktopStr);	
				}
			}
			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_yccz.png">'
			
			str += '<span class="content">邀请【 '+data.name+' 】进行【'+data.sName+'】'+zdyname+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+zdyname+'<span>'+ commonIn.imCustomMsg_overtime +data.overtime+'</span></div>'
			
			str += '</div>';
	
			break;
	case 7:
			var url = data.url;
			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_hdzb.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_7+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_7+'</div>'
			
			str += '</div>';
	
			break;
	case 8:
			var url = data.url;
			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_zb.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_8+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_8+'</div>'
			
			str += '</div>';
	
			break;
	case 9:
		  	var url = data.url;
				
			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/talk_ck.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_invite+'【 '+data.name+' 】'+commonIn.imCustomMsg_9+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_9+'</div>'
			
			str += '</div>';
	
			break;
			
	case 101:
	  	var url = data.url;
			
		var str = '';
		str += '<div class="talk-diy-box">';
		
		str += '<a href="javascript:void(0)" class="talk-diy-body">';
		
		str += '<img src="' + Domain + 'common/easyui/img/talk_ck.png">'
		
		str += '<span class="content">'+commonIn.imYhTips_1+'</span>';
		
		str += '</a>';
		
		str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_2+'</div>'
		
		str += '</div>';

		break;
		
	case 102:
		var url = data.url;
		var str = '';
		str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_ychz.png">'
			
			str += '<span class="content">'+commonIn.imYhTips_2+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.videoconsul+'</div>'
			
			str += '</div>';
		
	  break;
	default:
		var str = '';
		console.log('自定义消息未定义！！！！！！！！！！！！');
		console.log(data);
		console.log('自定义消息未定义！！！！！！！！！！！！');
		
		
	}
	
	
	return str;
}

//把消息转换成Html
function convertMsgtoHtml(msg) {
  var html = "", elems, elem, type, content;
  elems = msg.getElems();//获取消息包含的元素数组
  for (var i in elems) {
      elem = elems[i];
      type = elem.getType();//获取元素类型
      content = elem.getContent();//获取元素对象
      switch (type) {
          case webim.MSG_ELEMENT_TYPE.TEXT:
              html += convertTextMsgToHtml(content);
              break;
          case webim.MSG_ELEMENT_TYPE.IMAGE:
              html += convertImageMsgToHtml(content);
              break;
          case webim.MSG_ELEMENT_TYPE.FACE:
              html += convertFaceMsgToHtml(content);
              break;
          case webim.MSG_ELEMENT_TYPE.SOUND:
              html += convertSoundMsgToHtml(content);
              break;
          case webim.MSG_ELEMENT_TYPE.FILE:
              html += convertFileMsgToHtml(content);
              break;
          case webim.MSG_ELEMENT_TYPE.CUSTOM:
              html += convertCustomMsgToHtml(content);
              break;
          case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
              html += convertGroupTipMsgToHtml(content);
              break;
          default:
        	  console.log( html + '      未知消息元素类型: elemType=' + type);
              break;
      }
  }
  return html;
}
//解析文本消息元素
function convertTextMsgToHtml(content) {
  return content.getText();
}
//解析图片消息元素
function convertImageMsgToHtml(content) {
  var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL);//小图
  var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE);//大图
  var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN);//原图
  if (!bigImage) {
      bigImage = smallImage;
  }
  if (!oriImage) {
      oriImage = smallImage;
  }
  return	"<img src='" + oriImage.getUrl() +"' />";
}
//解析语音消息元素
function convertSoundMsgToHtml(content) {
	console.log(content)
  var second = content.getSecond();//获取语音时长
  var downUrl = content.getDownUrl();
  //if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
  //    return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl;
  //}
  return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
}
//解析文件消息元素
function convertFileMsgToHtml(content) {
	console.log(content)
  var fileSize = Math.round(content.getSize() / 1024);
	  //var downUrl = content.getDownUrl();
	  //return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
  return '<a href="' + content.getDownUrl() + '" title="'+commonIn.imDownFile+'" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';
}
//解析表情消息元素
function convertFaceMsgToHtml(content) {
  var index = content.getIndex();
  var data = content.getData();
  var faceUrl = null;
  var emotion ;
  if(index || index == 0 ) {
  	emotion = webim.Emotions[index];
  }else{
  	//惊讶 没有index  通过data 查找
  	for(i in webim.Emotions){
  		var name = webim.Emotions[i][0];
  		if(name == data){
  	    	emotion = webim.Emotions[i];
  	    	break ;
  		}
  	}
  }
  if (emotion && emotion[1]) {
      faceUrl = emotion[1];
  }
  if (faceUrl) {
      return	"<img src='" + faceUrl + "'/>";
  } else {
      return data;
  }
}


//解析自定义消息元素
function convertCustomMsgToHtml(content) {
	var data = content.getData();//自定义数据
	if(data && typeof data != "object") data = strToJson(data) ; 
	if(!data) return false;
	var type = parseInt(data.type);
	switch(type)
	{
	case 1:
		var url = data.url;
		var str = '';
		str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_ychz.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_1+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_1+'</div>'
			
			str += '</div>';
		
	  break;
	case 2:
		var url = data.url;
		var str = '';
		str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/phone@2x.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_2+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_2+'</div>'
			
			str += '</div>';
		
	  break;
	case 3:
		  	var url = data.url;
				if(data.uid == loginInfo.identifier){
					var nowData = new Date().getTime();

					var now = Date.parse(new Date(nowData));
					now = now / 1000 ;
					var set =  Date.parse(new Date(data.overtime));
					set = set / 1000 ;
	
					if(now < set){
						
						var desktopStr = '<div class="desktop-tips-box">';
						desktopStr += '<a href="'+data.url+'" target="_blank">【'+data.yqName+'】' + commonIn.imCustomMsgTitle_3_tips + data.overtime;
						desktopStr += '</a>';
						desktopStr += '</div>';
						
						$('.ul-box').append(desktopStr);	
					}
				}
					
				var str = '';
				str += '<div class="talk-diy-box">';
				
				str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
				
				str += '<img src="' + Domain + 'common/easyui/img/talk_tb.png">'
				
				str += '<span class="content">'+commonIn.imCustomMsg_invite+'【 '+data.name+' 】'+commonIn.imCustomMsg_3+'【'+data.ckName+'】</span>';
				
				str += '</a>';
				
				str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_3+'<span>'+commonIn.imCustomMsg_overtime + data.overtime+'</span></div>'
				
				str += '</div>';
	
				break;
	case 4:
		  	var url = data.url;
				if(data.uid == loginInfo.identifier){
					var nowData = new Date().getTime();

					var now = Date.parse(new Date(nowData));
					now = now / 1000 ;
					var set =  Date.parse(new Date(data.overtime));
					set = set / 1000 ;
	
					if(now < set){
						
						var desktopStr = '<div class="desktop-tips-box">';
						desktopStr += '<a href="'+data.url+'" target="_blank">【'+data.yqName+'】'+ commonIn.imCustomMsgTitle_4_tips + data.overtime;
						desktopStr += '</a>';
						desktopStr += '</div>';
						
						$('.ul-box').append(desktopStr);	
					}
				}
					
				var str = '';
				str += '<div class="talk-diy-box">';
				
				str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
				
				str += '<img src="' + Domain + 'common/easyui/img/talk_bq.png">'
				
				str += '<span class="content">'+commonIn.imCustomMsg_invite+'【 '+data.name+' 】'+commonIn.imCustomMsg_4+'</span>';
				
				str += '</a>';
				
				str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_4+'<span>'+commonIn.imCustomMsg_overtime +data.overtime+'</span></div>'
				
				str += '</div>';
	
				break;
	case 5:
		  	var url = data.url;
		  	var str = '';
		  	str += '<div class="talk-diy-box">';
				
				str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
				
				str += '<img src="' + Domain + 'common/easyui/img/tk_icon_ycyx.png">'
				
				str += '<span class="content">'+commonIn.imCustomMsg_5+'</span>';
				
				str += '</a>';
				
				str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_5+'</div>'
				
				str += '</div>';
		  	
		    break;
	case 6:
		var url = data.url;

		data.sName = data.sName ? data.sName : data.sname;
		data.yqName = data.yqName ? data.yqName : data.yqname;
		var zdyname = data.zdyname || '虚拟桌面';
			if(data.uid == loginInfo.identifier){
				var nowData = new Date().getTime();

				var now = Date.parse(new Date(nowData));
				now = now / 1000 ;
				var set =  Date.parse(new Date(data.overtime));
				set = set / 1000 ;
	
				if(now < set){
					
					var desktopStr = '<div class="desktop-tips-box">';
					desktopStr += '<a href="'+data.url+'" target="_blank">【'+data.yqName+'】邀请你进行'+zdyname+'，点击进入操作！过期时间：' + data.overtime;
					desktopStr += '</a>';
					desktopStr += '</div>';
					
					$('.ul-box').append(desktopStr);	
				}
			}

			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_yccz.png">'
			
			str += '<span class="content">邀请【 '+data.name+' 】进行【'+data.sName+'】'+zdyname+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+zdyname+'<span>'+ commonIn.imCustomMsg_overtime +data.overtime+'</span></div>'
			
			str += '</div>';
	
			break;
	case 7:
			var url = data.url;
			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_hdzb.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_7+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_7+'</div>'
			
			str += '</div>';
	
			break;
	case 8:
			var url = data.url;
			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_zb.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_8+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_8+'</div>'
			
			str += '</div>';
	
			break;
	case 9:
		  	var url = data.url;
				
			var str = '';
			str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/talk_ck.png">'
			
			str += '<span class="content">'+commonIn.imCustomMsg_invite+'【 '+data.name+' 】'+commonIn.imCustomMsg_9+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_9+'</div>'
			
			str += '</div>';
	
			break;
			
	case 101:
	  	var url = data.url;
			
		var str = '';
		str += '<div class="talk-diy-box">';
		
		str += '<a href="javascript:void(0)" class="talk-diy-body">';
		
		str += '<img src="' + Domain + 'common/easyui/img/talk_ck.png">'
		
		str += '<span class="content">'+commonIn.imYhTips_1+'</span>';
		
		str += '</a>';
		
		str += '<div class="talk-diy-footer">'+commonIn.imCustomMsgTitle_2+'</div>'
		
		str += '</div>';

		break;
		
	case 102:
		var url = data.url;
		var str = '';
		str += '<div class="talk-diy-box">';
			
			str += '<a href="' + url + '" target="_blank"  class="talk-diy-body">';
			
			str += '<img src="' + Domain + 'common/easyui/img/tk_icon_ychz.png">'
			
			str += '<span class="content">'+commonIn.imYhTips_2+'</span>';
			
			str += '</a>';
			
			str += '<div class="talk-diy-footer">'+commonIn.videoconsul+'</div>'
			
			str += '</div>';
		
	  break;
	default:
		var str = '';
		console.log('自定义消息未定义！！！！！！！！！！！！');
		console.log(data);
		console.log('自定义消息未定义！！！！！！！！！！！！');
		
		
	}
	
	
	return str;
}



//解析群提示消息元素
function convertGroupTipMsgToHtml(content) {
    var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
    var text = "";
    var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
    var opType, opUserId, userIdList;
    var groupMemberNum;
    opType = content.getOpType();//群提示消息类型（操作类型）
    opUserId = content.getOpUserId();//操作人id
    switch (opType) {
        case webim.GROUP_TIP_TYPE.JOIN://加入群
            userIdList = content.getUserIdList();
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            var newUserId = content.userIdList[0];
            
            $.each(friendImg,function(index , val){
        		if(friendImg[index].userid == newUserId){
        			text = friendImg[index].uname;
        		}
        	})
        	
            text += " 加入该会话，当前会话成员数："+content.getGroupMemberNum();
            break;
        case webim.GROUP_TIP_TYPE.QUIT://退出群
            text += opUserId + "离开该会话，当前会话成员数："+content.getGroupMemberNum();
            break;
        case webim.GROUP_TIP_TYPE.KICK://踢出群
            text += opUserId + "将";
            userIdList = content.getUserIdList();
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "踢出该会话";
            break;
        case webim.GROUP_TIP_TYPE.SET_ADMIN://设置管理员
            text += opUserId + "将";
            userIdList = content.getUserIdList();
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "设为管理员";
            break;
        case webim.GROUP_TIP_TYPE.CANCEL_ADMIN://取消管理员
            text += opUserId + "取消";
            userIdList = content.getUserIdList();
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "的管理员资格";
            break;

        case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO://群资料变更
            text += opUserId + "修改了会话资料：";
            var groupInfoList = content.getGroupInfoList();
            var type, value;
            for (var m in groupInfoList) {
                type = groupInfoList[m].getType();
                value = groupInfoList[m].getValue();
                switch (type) {
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
                        text += "会话头像为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
                        text += "会话名称为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
                        text += "会话创建人为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
                        text += "会话公告为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
                        text += "会话简介为" + value + "; ";
                        break;
                    default:
                        text += "未知信息为:type=" + type + ",value=" + value + "; ";
                        break;
                }
            }
            break;

        case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO://群成员资料变更(禁言时间)
            text += opUserId + "修改了会话成员资料:";
            var memberInfoList = content.getMemberInfoList();
            var userId, shutupTime;
            for (var m in memberInfoList) {
                userId = memberInfoList[m].getUserId();
                shutupTime = memberInfoList[m].getShutupTime();
                text += userId + ": ";
                if (shutupTime != null && shutupTime !== undefined) {
                    if (shutupTime == 0) {
                        text += "取消禁言; ";
                    } else {
                        text += "禁言" + shutupTime + "秒; ";
                    }
                } else {
                    text += " shutupTime为空";
                }
                if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + memberInfoList.length + "人";
                    break;
                }
            }
            break;
        default:
            text += "未知会话提示消息类型：type=" + opType;
            break;
    }
    return text;
}

function strToJson(str){  
	try 
	{ 
	//在此运行代码 
		var json = (new Function("return " + str.replace(/\n/g,'')))();
	} 
	catch(err) 
	{ 
		//在此处理错误 
		str = str.replace(/[\r\n]/g, ""); 
		var json = (new Function("return " + str ))();
	} 

	
    return json;  
}


//发送消息(文本或者表情)
function onSendMsg(textDom,cbok) {
	
  if (!selToID) {
      console.log('你还没有选中好友或者会话，暂不能聊天！');
      return;
  }
  //获取消息内容
  window.parent.onSendMsg(textDom,cbok);
}


//发送自定义消息
function sendCustomMsg(info , cbok) {
    if (!selToID) {
    	console.log("您还没有好友或会话，暂不能聊天");
        return;
    }
    window.parent.sendCustomMsg(info , cbok);
}

//上传图片
function uploadPic(file,cbok){
	if (!selToID) {
    	console.log("您还没有好友或会话，暂不能聊天");
        return;
    }
    window.parent.uploadPic(file,function(){
    	if(cbok)
    		cbok();
        $.messager.progress('close');
    });
}


//上传图片
function uploadFile(file,cbok){
	if (!selToID) {
    	console.log("您还没有好友或会话，暂不能聊天");
        return;
    }
    window.parent.uploadFile(file,function(){
    	if(cbok)
    		cbok();
        $.messager.progress('close');
    });
}


//切换播放audio对象
function onChangePlayAudio(playAudio) {
  if(curPlayAudio){
      if(curPlayAudio!=playAudio){
          curPlayAudio.currentTime=0;
          curPlayAudio.pause();
          curPlayAudio=playAudio;
      }
  }else{
      curPlayAudio=playAudio;
  }
}

//打开表情窗体
var showEmotionDialog = function (dom) {

  var domUL = dom.find('.emotionUL');
  if(domUL.find('li').length > 1){
  	dom.show();
  	return false;
  }

  for (var index in webim.Emotions) {
      var emotions = $('<img>').attr({
          "id": webim.Emotions[index][0],
          "src": webim.Emotions[index][1],
          "style": "cursor:pointer;"
      }).click(function () {
          selectEmotionImg(this);
      });
      $('<li>').append(emotions).appendTo(domUL);
  }
  dom.show();
  $('body').bind({
		click : function() {
			$('.wl_faces_box').hide();
		}
	});
}

//表情选择div的关闭方法
var turnoffFaces_box = function (t) {
	var _this = $(t);
	_this.parents('.wl_faces_box').fadeOut("slow");
};
//选中表情
var selectEmotionImg = function (t) {
	var _this = $(t);
  var txtDom = $('#talk-input');
  txtDom.val(txtDom.val() + t.id)
  txtDom.focus();
  //talkBtn();
};

var getCookie = function(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}




$(function(){
	var LastMsgDom = $("#last-msg");
	$('.ul-box').on('scroll',function(){
		var $this = $(this);
		var scrollVal = $this.scrollTop();
		if(scrollVal <= 1){
			if(LastMsgDom.length > 0){
				LastMsgDom.show();
				setTimeout(function(){
					window.parent.getPrePageGroupHistoryMsgs(function(msgList){
						msgList.reverse();
                		$.each(msgList,function(i,h){
                			if(msgList[i].fromAccount == loginInfo.identifier){
                				ListAddLastMsg(1 ,msgList[i] )
                			}else{
                				ListAddLastMsg(0 ,msgList[i] )
                			}
                		})
                		LastMsgDom.hide();
					})
				},1000)
				

			}
		}
	})

})











