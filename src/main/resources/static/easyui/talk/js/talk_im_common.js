//被踢下线
var onKickedEventCall = function(){
	console.log('被踢下线');
	loginFlag = false;
	$.messager.confirm(commonIn.title, commonIn.imExpel, function(r){
		if (r){
			webimLogin();
		}
	});
}
//获取用户聊天信息
var getGroupMsg = function() {

	getLastGroupHistoryMsgs(function(data) {
		
		$.each(data, function(i, h) {
			if (data[i].fromAccount == loginInfo.identifier) {
				addMsg(1, data[i])
			} else {
				addMsg(0, data[i])
			}
		})
		
		if(data.length < 20){
			$.ajax({
				type:'post',
				url: Domain+'api/group/record',
				data: {
					dgid : GroupDgid,
					time : sLastMsgTime13,
					size : 20 - data.length
				},
				success: json => {
					
					console.log(json);
					if(!json.status) return false;
					
					if(json.list < 1){
						$('#last-msg').html(commonIn.imOverMsgTips);
				    	setTimeout(function(){
				        	$('#last-msg').remove();
				    	},1000)
				        return;
					}
					
					sLastMsgTime13 = json.list[json.list.length - 1].time;
              		$.each(json.list,function(i,h){
              			if(json.list[i].fromaccount == loginInfo.identifier){
              				sMore7DaysMsg13(1 ,json.list[i] )
              			}else{
              				sMore7DaysMsg13(0 ,json.list[i] )
              			}
              		})
              		$('#last-msg').hide();
				},
				error : err => {
				
					console.log(err)
					
				}
				
			})
			
		}
		
	})

}


//监听连接状态回调变化事件
var onConnNotify = function(resp) {
	var info;
	switch (resp.ErrorCode) {
	case webim.CONNECTION_STATUS.ON:
		console.log('建立连接成功: ' + resp.ErrorInfo);

		break;
	case webim.CONNECTION_STATUS.OFF:
		info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
		console.log('连接已断开，无法收到新消息，请检查下你的网络是否正常！');
		console.log(info);
		break;
	case webim.CONNECTION_STATUS.RECONNECT:
		info = '连接状态恢复正常: ' + resp.ErrorInfo;
		console.log('连接状态恢复正常！');
		console.log(info);
		break;
	default:
		console.log('未知连接状态: =' + resp.ErrorInfo);
		break;
	}
};



//监听新消息事件
//newMsgList 为新消息数组，结构为[Msg]
var onMsgNotify = function (newMsgList){
	console.log('监听新消息');
  var sess, newMsg;
  //获取所有聊天会话
  var sessMap = webim.MsgStore.sessMap();
  for (var j in newMsgList) {//遍历新消息
      newMsg = newMsgList[j];
      upNewMsg(newMsg.getSession().id() , newMsg)
  }
  //消息已读上报，以及设置会话自动已读标记
  webim.setAutoRead(selSess, true, true);

}

//监听新消息添加---自己的不添加
function upNewMsg(id, data) {
	if(id != selToID) return false;
	var listDom = $('#talk-ul');
	if (data.fromAccount != loginInfo.identifier) {
		addMsg(0, data, listDom);
	}else{
		addMsg(1, data, listDom);
	}
	
}

//更新某一个好友或者群div-未读消息数
function updateSessDiv(sess_type, to_id ,unread_msg_count) {
	var badgeDiv = $('.pt-tab-user[data-id="'+to_id+'"]').get(0);
    if (badgeDiv && unread_msg_count > 0) {
        if (unread_msg_count >= 100) {
            unread_msg_count = '99';
        }
        $(badgeDiv).find('.msg-active').html(unread_msg_count);
        
    } else if (unread_msg_count <= 0) {//没有找到对应的聊天id
    	$(badgeDiv).find('.msg-active').html('');
    }
}



//发送消息(文本或者表情)
function onSendMsg(textDom , cbok) {
	if (!selToID) {
		console.log('你还没有选中好友或者会话，暂不能聊天！');
		return;
	}
	//获取消息内容
	var textDom = textDom;
	var msgtosend = textDom.val();
	var msgLen = webim.Tool.getStrBytes(msgtosend);
	var maxLen,
		errInfo;
	if (msgtosend.length < 1 || msgtosend == '') {
		console.log('发送的消息不能为空！');
		return;
	}
	if (selType == webim.SESSION_TYPE.C2C) {
		maxLen = webim.MSG_MAX_LENGTH.C2C;
		errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
	} else {
		maxLen = webim.MSG_MAX_LENGTH.GROUP;
		errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
	}
	if (msgLen > maxLen) {
		console.log(errInfo);
		$.messager.alert(commonIn.title,errInfo);
	  	$.messager.progress('close');
		return;
	}
	if (!selSess) {
		var selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
	}
	var isSend = true; //是否为自己发送
	var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
	var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
	var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
	var subType; //消息子类型
	if (selType == webim.SESSION_TYPE.C2C) {
		subType = webim.C2C_MSG_SUB_TYPE.COMMON;
	} else {
		subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
	}
	var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);

	var text_obj,
		face_obj,
		tmsg,
		emotionIndex,
		emotion,
		restMsgIndex;
	//解析文本和表情
	var expr = /\[[^[\]]{1,3}\]/mg;
	var emotions = msgtosend.match(expr);
	if (!emotions || emotions.length < 1) {
		text_obj = new webim.Msg.Elem.Text(msgtosend);
		msg.addText(text_obj);
	} else {

		for (var i = 0; i < emotions.length; i++) {
			tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
			if (tmsg) {
				text_obj = new webim.Msg.Elem.Text(tmsg);
				msg.addText(text_obj);
			}
			emotionIndex = webim.EmotionDataIndexs[emotions[i]];
			emotion = webim.Emotions[emotionIndex];

			if (emotion) {
				face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
				msg.addFace(face_obj);
			} else {
				text_obj = new webim.Msg.Elem.Text(emotions[i]);
				msg.addText(text_obj);
			}
			restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
			msgtosend = msgtosend.substring(restMsgIndex);
		}
		if (msgtosend) {
			text_obj = new webim.Msg.Elem.Text(msgtosend);
			msg.addText(text_obj);
		}
	}
	webim.sendMsg(msg, function(resp) {
		console.log(resp)
		webim.Tool.setCookie("tmpmsg_" + selToID, '', 0);
		textDom.val('');
		$.messager.progress('close');
		if(cbok){
	    	  
	    	cbok();
	    	  
	    }
		
	}, function(err) {
		var text = '';
		var code = err.ErrorCode;
		switch(code)
		{
		case 80001:
		  text = '原因：含有敏感词汇！';
		  break;
		}
		
		$.messager.alert(commonIn.title,commonIn.imSendErr + text);
		console.log('发送消息失败！');
		$.messager.progress('close');
	});
}


//添加消息到页面
function addMsg(id , msg){
	var img , userName;
	$.each(friendImg,function(index , val){
		if(friendImg[index].userid == msg.fromAccount){
			img = ImgUrl + friendImg[index].uheadportrait;
			var uname = friendImg[index].uname;
			var udremark = friendImg[index].udremark;
			userName = udremark  ? udremark : uname ;
			
			return false ;
		}
	})
    if(convertMsgtoHtml(msg) == 'false') return false;	
    var test = convertMsgtoHtml(msg);
	var cls = id == 1 ? 'my-talk' : '';
	img = img ? img : loginInfo.headurl;
	
	if(msg.elems[0].type == 'TIMGroupTipElem'){
		return false;
		userName = '提示' ;
		img = ImgUrl + '/common/img/ybhz.png';
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





//把消息转换成Html
function convertMsgtoHtml(msg) {
	var html = "",
		elems,
		elem,
		type,
		content;
	elems = msg.getElems(); //获取消息包含的元素数组
	for (var i in elems) {
		elem = elems[i];
		type = elem.getType(); //获取元素类型
		content = elem.getContent(); //获取元素对象
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
			console.log(html + '      未知消息元素类型: elemType=' + type);
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
	var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
	var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
	var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图
	if (!bigImage) {
		bigImage = smallImage;
	}
	if (!oriImage) {
		oriImage = smallImage;
	}
	return "<img src='" + oriImage.getUrl() + "' />";
}
//解析语音消息元素
function convertSoundMsgToHtml(content) {
	var second = content.getSecond(); //获取语音时长
	var downUrl = content.getDownUrl();
	//if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
		//return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl;
	//}
	return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
}
//解析文件消息元素
function convertFileMsgToHtml(content) {
	var fileSize = Math.round(content.getSize() / 1024);
	return '<a href="' + content.getDownUrl() + '" title="'+commonIn.imDownFile+'" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';
}
//解析表情消息元素
function convertFaceMsgToHtml(content) {
	var index = content.getIndex();
	var data = content.getData();
	var faceUrl = null;
	var emotion;
	if (index || index == 0) {
		emotion = webim.Emotions[index];
	} else {
		//惊讶 没有index  通过data 查找
		for (i in webim.Emotions) {
			var name = webim.Emotions[i][0];
			if (name == data) {
				emotion = webim.Emotions[i];
				break ;
			}
		}
	}
	if (emotion && emotion[1]) {
		faceUrl = emotion[1];
	}
	if (faceUrl) {
		return "<img src='" + faceUrl + "'/>";
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


function strToJson(str) {
	try 
	{ 
	//在此运行代码 
		var json = (new Function("return " + str))();
	} 
	catch(err) 
	{ 
	//在此处理错误 
		//在此处理错误 
		str = str.replace(/[\r\n]/g, ""); 
		var json = (new Function("return " + str ))();
	} 
	return json;
}
//解析群提示消息元素
function convertGroupTipMsgToHtml(content) {
	var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
	var text = "";
	var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
	var opType,
		opUserId,
		userIdList;
	var groupMemberNum;
	opType = content.getOpType(); //群提示消息类型（操作类型）
	opUserId = content.getOpUserId(); //操作人id
	switch (opType) {
	case webim.GROUP_TIP_TYPE.JOIN: //加入群
		userIdList = content.getUserIdList();
		for (var m in userIdList) {
			text += userIdList[m];
			if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
				text += "等" + userIdList.length + "人";
				break;
			}
		}
		var newUserId = content.userIdList[0];
		$.each(friendImg, function(index, val) {
			if (friendImg[index].userid == newUserId) {
				text = friendImg[index].uname;
			}
		})
		text = newUserId == text ? '新成员' : text;
		text += "加入该会话，当前会话成员数：" + content.getGroupMemberNum();
		break;
	case webim.GROUP_TIP_TYPE.QUIT: //退出群
		text += opUserId + "离开该会话，当前会话成员数：" + content.getGroupMemberNum();
		break;
	case webim.GROUP_TIP_TYPE.KICK: //踢出群
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
	case webim.GROUP_TIP_TYPE.SET_ADMIN: //设置管理员
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
	case webim.GROUP_TIP_TYPE.CANCEL_ADMIN: //取消管理员
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

	case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO: //群资料变更
		text += opUserId + "修改了会话资料：";
		var groupInfoList = content.getGroupInfoList();
		var type,
			value;
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

	case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO: //群成员资料变更(禁言时间)
		text += opUserId + "修改了会话成员资料:";
		var memberInfoList = content.getMemberInfoList();
		var userId,
			shutupTime;
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

//读取群组基本资料-高级接口
var getGroupInfo = function (cbOK, cbErr) {
    var options = {
        'GroupIdList': [
        	selToID
        ],
        'GroupBaseInfoFilter': [
            'Type',
            'Name',
            'Introduction',
            'Notification',
            'FaceUrl',
            'CreateTime',
            'Owner_Account',
            'LastInfoTime',
            'LastMsgTime',
            'NextMsgSeq',
            'MemberNum',
            'MaxMemberNum',
            'ApplyJoinOption'
        ],
        'MemberInfoFilter': [
            'Account',
            'Role',
            'JoinTime',
            'LastSendMsgTime',
            'ShutUpUntil'
        ]
    };
    webim.getGroupInfo(
            options,
            function (resp) {
                if (cbOK) {
                    cbOK(resp);
                }
            },
            function (err) {

                console.log('获取会话信息失败');
                console.log(err.ErrorInfo);
            }
    );
};



//获取最新的群历史消息,用于切换群组聊天时，重新拉取群组的聊天消息
var getLastGroupHistoryMsgs = function (cbOk, cbError) {
  if (selType == webim.SESSION_TYPE.C2C) {
      console.log('当前的聊天类型为好友聊天，不能进行拉取会话历史消息操作');
      return;
  }

	getGroupInfo(function (resp) {
      //拉取最新的群历史消息
      var options = {
          'GroupId': selToID,
          'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1,
          'ReqMsgNumber': reqMsgCount
      };
     
  	$.messager.progress('close');
      if (options.ReqMsgSeq == null || options.ReqMsgSeq == undefined || options.ReqMsgSeq<=0) {
          console.log("该会话还没有历史消息:options=" + JSON.stringify(options));
          //$('#last-msg').remove();
          $.ajax({
			type:'post',
			url: Domain+'api/group/record',
			data: {
				dgid : GroupDgid,
				time : sLastMsgTime13
			},
			success: json => {
				
				console.log(json);
				if(!json.status) return false;
				
				if(json.list < 1){
					$('#last-msg').html(commonIn.imOverMsgTips);
			    	setTimeout(function(){
			        	$('#last-msg').remove();
			    	},1000)
			        return;
				}
				
				sLastMsgTime13 = json.list[json.list.length - 1].time;
        		$.each(json.list,function(i,h){
        			if(json.list[i].fromaccount == loginInfo.identifier){
        				sMore7DaysMsg13(1 ,json.list[i] )
        			}else{
        				sMore7DaysMsg13(0 ,json.list[i] )
        			}
        		})
        		$('#last-msg').hide();
			},
			error : err => {
			
				console.log(err)
				
			}
			
		})
          return;
      }
      webim.syncGroupMsgs(
          options,
          function (msgList) {
              if (msgList.length == 0) {
              	console.log('该群没有历史消息了！');
              	//$('#last-msg').remove();
              	$.ajax({
    				type:'post',
    				url: Domain+'api/group/record',
    				data: {
    					dgid : GroupDgid,
    					time : sLastMsgTime13
    				},
    				success: json => {
    					
    					console.log(json);
    					if(!json.status) return false;
    					
    					if(json.list < 1){
    						$('#last-msg').html(commonIn.imOverMsgTips);
    				    	setTimeout(function(){
    				        	$('#last-msg').remove();
    				    	},1000)
    				        return;
    					}
    					
    					sLastMsgTime13 = json.list[json.list.length - 1].time;
                  		$.each(json.list,function(i,h){
                  			if(json.list[i].fromaccount == loginInfo.identifier){
                  				sMore7DaysMsg13(1 ,json.list[i] )
                  			}else{
                  				sMore7DaysMsg13(0 ,json.list[i] )
                  			}
                  		})
                  		$('#last-msg').hide();
    				},
    				error : err => {
    				
    					console.log(err)
    					
    				}
    				
    			})
              	
                  return;
              }

              var msgSeq = msgList[0].seq - 1;
              getPrePageGroupHistroyMsgInfoMap[selToID] = {
                  "ReqMsgSeq": msgSeq
              };

              sLastMsgTime13 = msgList[0].time;
              if (cbOk) cbOk(msgList);
              
              if(options.ReqMsgNumber < options.ReqMsgSeq){
  	        	$('#last-msg').show();
  	          }
              
          },
          function (err) {
          	console.log('获取会话历史消息失败！');
          }
      );
  });
};



//向上翻页，获取更早的群历史消息
var getPrePageGroupHistoryMsgs = function (cbOk) {

	if (selType == webim.SESSION_TYPE.C2C) {
	    console.log('当前的聊天类型为好友聊天，不能进行拉取群历史消息操作');
	    return;
	}
	var tempInfo = getPrePageGroupHistroyMsgInfoMap[selToID];//获取下一次拉取的群消息seq
	var reqMsgSeq;
	if (tempInfo) {
	    reqMsgSeq = tempInfo.ReqMsgSeq;
	    if (reqMsgSeq <= 0) {
	    	console.log('该群没有历史消息可拉取了');
	    	
	    	$.ajax({
				type:'post',
				url: Domain+'api/group/record',
				data: {
					dgid : GroupDgid,
					time : sLastMsgTime13
				},
				success: json => {
					
					console.log(json);
					if(!json.status) return false;
					
					if(json.list < 1){
						$('#last-msg').html(commonIn.imOverMsgTips);
				    	setTimeout(function(){
				        	$('#last-msg').remove();
				    	},1000)
				        return;
					}
					
					sLastMsgTime13 = json.list[json.list.length - 1].time;
              		$.each(json.list,function(i,h){
              			if(json.list[i].fromaccount == loginInfo.identifier){
              				sMore7DaysMsg13(1 ,json.list[i] )
              			}else{
              				sMore7DaysMsg13(0 ,json.list[i] )
              			}
              		})
              		$('#last-msg').hide();
				},
				error : err => {
				
					console.log(err)
					
				}
				
			})
	    	
			return false;
	    }
	    
	} else {
		console.log('获取下一次拉取的群消息seq为空');
		
		$.ajax({
			type:'post',
			url: Domain+'api/group/record',
			data: {
				dgid : GroupDgid,
				time : sLastMsgTime13
			},
			success: json => {
				
				console.log(json);
				if(!json.status) return false;
				
				if(json.list < 1){
					$('#last-msg').html(commonIn.imOverMsgTips);
			    	setTimeout(function(){
			        	$('#last-msg').remove();
			    	},1000)
			        return;
				}
				
				sLastMsgTime13 = json.list[json.list.length - 1].time;
          		$.each(json.list,function(i,h){
          			if(json.list[i].fromaccount == loginInfo.identifier){
          				sMore7DaysMsg13(1 ,json.list[i] )
          			}else{
          				sMore7DaysMsg13(0 ,json.list[i] )
          			}
          		})

          		$('#last-msg').hide();
			},
			error : err => {
			
				console.log(err)
				
			}
			
		})
		return false;
	}
	var options = {
	    'GroupId': selToID,
	    'ReqMsgSeq': reqMsgSeq,
	    'ReqMsgNumber': reqMsgCount
	};
	
	webim.syncGroupMsgs(
	    options,
	    function (msgList) {
	        if (msgList.length == 0) {
	        	console.log("该群没有历史消息了:options=" + JSON.stringify(options));
	        	
	        	$.ajax({
					type:'post',
					url: Domain+'api/group/record',
					data: {
						dgid : GroupDgid,
						time : sLastMsgTime13
					},
					success: json => {
						
						console.log(json);
						if(!json.status) return false;
						
						if(json.list < 1){
							$('#last-msg').html(commonIn.imOverMsgTips);
					    	setTimeout(function(){
					        	$('#last-msg').remove();
					    	},1000)
					        return;
						}
						
						sLastMsgTime13 = json.list[json.list.length - 1].time;
	              		$.each(json.list,function(i,h){
	              			if(json.list[i].fromaccount == loginInfo.identifier){
	              				sMore7DaysMsg13(1 ,json.list[i] )
	              			}else{
	              				sMore7DaysMsg13(0 ,json.list[i] )
	              			}
	              		})

	              		$('#last-msg').hide();
					},
					error : err => {
					
						console.log(err)
						
					}
					
				})
				return false;
	        }
	        var msgSeq = msgList[0].seq - 1;
	        getPrePageGroupHistroyMsgInfoMap[selToID] = {
	            "ReqMsgSeq": msgSeq
	        };
	        sLastMsgTime13 = msgList[0].time;
	        if (cbOk){
	            cbOk(msgList);
	        }
	    },
	    function (err) {
	  	  console.log(err.ErrorInfo);
	    }
	);
};

//上传文件
function uploadFile(file) {
    //var file = uploadFiles.files[0];
    //先检查图片类型和大小
	debugger;
    if (!checkFile(file)) {
        return;
    }
    var businessType;//业务类型，1-发群文件，2-向好友发文件
    if (selType == webim.SESSION_TYPE.C2C) {//向好友发文件
        businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG;
    } else if (selType == webim.SESSION_TYPE.GROUP) {//发群文件
        businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG;
    }

    //封装上传文件请求
    var opt = {
        'file': file, //文件对象
        'onProgressCallBack': onFileProgressCallBack, //上传文件进度条回调函数
        //'abortButton': document.getElementById('upd_abort'), //停止上传文件按钮
        'To_Account': selToID, //接收者
        'businessType': businessType,//业务类型
        'fileType': webim.UPLOAD_RES_TYPE.FILE//表示上传文件
    };
    //上传文件
    webim.uploadFile(opt,
        function (resp) {
    		debugger;
            //上传成功发送文件
            sendFile(resp,file.name);
            $.messager.progress('close');
    },
        function (err) {
            alert(err.ErrorInfo);
        }
    );
}
function sendFile(file,fileName) {
    if (!selToID) {
        alert("您还没有好友，暂不能聊天");
        return;
    }

    if (!selSess) {
        selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var msg = new webim.Msg(selSess, true, -1, -1, -1, loginInfo.identifier, 0, loginInfo.identifierNick);
    var uuid=file.File_UUID;//文件UUID
    var fileSize=file.File_Size;//文件大小
    var senderId=loginInfo.identifier;
    var downloadFlag=file.Download_Flag;
    if(!fileName){
        var random=Math.round(Math.random() * 4294967296);
        fileName=random.toString();
    }
    var fileObj=new webim.Msg.Elem.File(uuid,fileName, fileSize, senderId, selToID, downloadFlag, selType);
    msg.addFile(fileObj);
    //调用发送文件消息接口
    webim.sendMsg(msg, function (resp) {
        if (selType == webim.SESSION_TYPE.C2C) {//私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            addMsg(msg);
        }
    }, function (err) {
        alert(err.ErrorInfo);
    });
}
//检查文件类型和大小
function checkFile(file) {
   
    fileSize = Math.round(file.size / 1024 * 100) / 100; //单位为KB
    if (fileSize > 20 * 1024) {
    	$.messager.alert("您选择的文件大小超过限制(最大为20M)，请重新选择");
        return false;
    }
    return true;
}
//上传文件进度条回调函数
//loadedSize-已上传字节数
//totalSize-文件总字节数
function onFileProgressCallBack(loadedSize, totalSize) {
  //var progress = document.getElementById('upd_file_progress');//上传文件进度条
  //progress.value = (loadedSize / totalSize) * 100;
  console.log((loadedSize / totalSize) * 100)
}
//上传文件(通过base64编码)
function uploadFileByBase64() {
    var businessType;//业务类型，1-发群文件，2-向好友发文件
    if (selType == webim.SESSION_TYPE.C2C) {//向好友发文件
        businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG;
    } else if (selType == webim.SESSION_TYPE.GROUP) {//发群文件
        businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG;
    }
    //封装上传文件请求
    var opt = {
        'toAccount': selToID, //接收者
        'businessType': businessType,//文件的使用业务类型
        'fileType':webim.UPLOAD_RES_TYPE.FILE,//表示文件
        'fileMd5': '6f25dc54dc2cd47375e8b43045de642a', //文件md5
        'totalSize': 56805, //文件大小,Byte
        'base64Str': 'xxxxxxxxxxx' //文件base64编码

    };
    webim.uploadPicByBase64(opt,
        function (resp) {
            //alert('success');
            //发送文件
            sendFile(resp);
        },
        function (err) {
            alert(err.ErrorInfo);
        }
    );
}



//上传图片
function uploadPic(file ,cbok){

  var file = file;
  var businessType;//业务类型，1-发群图片，2-向好友发图片
  if (selType == webim.SESSION_TYPE.C2C) {//向好友发图片
      businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG;
  } else if (selType == webim.SESSION_TYPE.GROUP) {//发群图片
      businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG;
  }
  //封装上传图片请求
  var opt = {
      'file': file, //图片对象
      'onProgressCallBack': function(data){
      	}, //上传图片进度条回调函数
      'From_Account': loginInfo.identifier, //发送者帐号
      'To_Account': selToID, //接收者
      'businessType': businessType//业务类型
  };
  //上传图片
  webim.uploadPic(opt,
          function (resp) {
	  			if(cbok)
	  				cbok();
              //上传成功发送图片
              sendPic(resp );
          },
          function (err) {
              console.log(err.ErrorInfo);
          }
  );
}

//上传图片(用于低版本IE)
function uploadPicLowIE() {
  var businessType;//业务类型，1-发群图片，2-向好友发图片
  if (selType == webim.SESSION_TYPE.C2C) {//向好友发图片
      businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG;
  } else if (selType == webim.SESSION_TYPE.GROUP) {//发群图片
      businessType = webim.UPLOAD_PIC_BUSSINESS_TYPE.GROUP_MSG;
  }
  //封装上传图片请求
  var opt = {
      'formId': 'updli_form', //上传图片表单id
      'fileId': 'updli_file', //file控件id
      'To_Account': selToID, //接收者
      'businessType': businessType//图片的使用业务类型
  };
  webim.submitUploadFileForm(opt,
                      function (resp) {
                          //发送图片
                          sendPic(resp); 
                      },
                      function (err) {
                      	console.log('发送图片失败！');
                      }
  );
}

//发送图片
function sendPic(images) {
  if (!selToID) {
      console.log('您还没有好友，暂不能聊天！');
      return;
  }
  if (!selSess) {
      selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, 
      Math.round(new Date().getTime() / 1000));
  }
  var msg = new webim.Msg(selSess, true);
  var images_obj = new webim.Msg.Elem.Images(images.File_UUID);
  for (var i in images.URL_INFO) {
      var img = images.URL_INFO[i];
      var newImg;
      var type;
      switch (img.PIC_TYPE) {
          case 1://原图
              type = 1;//原图
              break;
          case 2://小图（缩略图）
              type = 3;//小图
              break;
          case 4://大图
              type = 2;//大图
              break;
      }
      newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, 
      img.PIC_Height, img.DownUrl);
      images_obj.addImage(newImg);
  }
  msg.addImage(images_obj);
  //调用发送图片接口
  webim.sendMsg(msg, function (resp) {

  	$.messager.progress('close');
  }, function (err) {
  	console.log('发送图片失败');
  	$.messager.alert(commonIn.title,commonIn.imSendErr);
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


//发送自定义消息
function sendCustomMsg(info , cbok) {
	  if (!selToID) {
	  	console.log("您还没有好友或会话，暂不能聊天");
	      return;
	  }
	  
	  //数据
	  var data = info;
	  //描述
	  var desc = "" ;
	  //扩展
	  var ext = "" ;
	  
	  var msgLen = webim.Tool.getStrBytes(data);
	
	  if (data.length < 1) {
	  	console.log("发送的消息不能为空!");
	      return;
	  }
	  var maxLen, errInfo;
	  if (selType == webim.SESSION_TYPE.C2C) {
	      maxLen = webim.MSG_MAX_LENGTH.C2C;
	      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
	  } else {
	      maxLen = webim.MSG_MAX_LENGTH.GROUP;
	      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
	  }
	  if (msgLen > maxLen) {
	  	console.log(errInfo);
	      return;
	  }
	
	  if (!selSess) {
	      selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
	  }
	  var msg = new webim.Msg(selSess, true,-1,-1,-1,loginInfo.identifier,0,loginInfo.identifierNick);
	  var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext);
	  msg.addCustom(custom_obj);
	  //调用发送消息接口
	  webim.sendMsg(msg, function (resp) {
		  if(cbok)
			  cbok();
	  }, function (err) {
	  	console.log(err.ErrorInfo);
	  });
}





//-----------------------------------------------------------------------


//获取我的群组
var getMyGroup = function () {
	
  var options = {
      'Member_Account': loginInfo.identifier,
      'Limit': 10,
      'Offset': 0,
      'GroupBaseInfoFilter': [
          'Type',
          'Name',
          'Introduction',
          'Notification',
          'FaceUrl',
          'CreateTime',
          'Owner_Account',
          'LastInfoTime',
          'LastMsgTime',
          'NextMsgSeq',
          'MemberNum',
          'MaxMemberNum',
          'ApplyJoinOption'
      ],
      'SelfInfoFilter': [
          'Role',
          'JoinTime',
          'MsgFlag',
          'UnreadMsgNum'
      ]
  };
  webim.getJoinedGroupListHigh(
          options,
          function (resp) {
              if (!resp.GroupIdList || resp.GroupIdList.length == 0) {
              	console.log('你目前还没有加入任何群组');
                  return;
              }
              var data = [];
              for (var i = 0; i < resp.GroupIdList.length; i++) {
                  var group_id = resp.GroupIdList[i].GroupId;
                  var name = webim.Tool.formatText2Html(resp.GroupIdList[i].Name);
                  var type_en = resp.GroupIdList[i].Type;
                  var type = webim.Tool.groupTypeEn2Ch(resp.GroupIdList[i].Type);
                  var role_en = resp.GroupIdList[i].SelfInfo.Role;
                  var role = webim.Tool.groupRoleEn2Ch(resp.GroupIdList[i].SelfInfo.Role);
                  var msg_flag = webim.Tool.groupMsgFlagEn2Ch(
                  resp.GroupIdList[i].SelfInfo.MsgFlag);
                  var msg_flag_en = resp.GroupIdList[i].SelfInfo.MsgFlag;
                  var join_time = webim.Tool.formatTimeStamp(
                  resp.GroupIdList[i].SelfInfo.JoinTime);
                  var member_num = resp.GroupIdList[i].MemberNum;
                  var notification = webim.Tool.formatText2Html(
                  resp.GroupIdList[i].Notification);
                  var introduction = webim.Tool.formatText2Html(
                  resp.GroupIdList[i].Introduction);
                  data.push({
                      'GroupId': group_id,
                      'Name': name,
                      'TypeEn': type_en,
                      'Type': type,
                      'RoleEn': role_en,
                      'Role': role,
                      'MsgFlagEn': msg_flag_en,
                      'MsgFlag': msg_flag,
                      'MemberNum': member_num,
                      'Notification': notification,
                      'Introduction': introduction,
                      'JoinTime': join_time
                  });
              }
              console.log(data)
              
          },
          function (err) {
          	console.log(err.ErrorInfo);
          }
  );
};


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




$(function(){
	var LastMsgFlag = true;
	$('.ul-box').on('scroll',function(){
		var $this = $(this);
		var scrollVal = $this.scrollTop();
		if(scrollVal <= 1){
			if($('#last-msg').length > 0 && LastMsgFlag){
				LastMsgFlag = false;
				$('#last-msg').show();
				setTimeout(function(){
					getPrePageGroupHistoryMsgs(function(msgList){
						msgList.reverse();
	              		$.each(msgList,function(i,h){
	              			if(msgList[i].fromAccount == loginInfo.identifier){
	              				ListAddLastMsg(1 ,msgList[i] )
	              			}else{
	              				ListAddLastMsg(0 ,msgList[i] )
	              			}
	              		})
	              		setTimeout(function(){
	              			LastMsgFlag = true;
	              		},1000)
	              		
	              		$('#last-msg').hide();
					})
				},1000)
				

			}
		}
	})

})









