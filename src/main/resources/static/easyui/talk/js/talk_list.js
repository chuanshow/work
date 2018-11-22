

var loginFlag = true; //重新登录 只登录，不进行其他操作
 

//sdk登录
function webimLogin() {
	$.messager.progress();
    webim.login(
            loginInfo, listeners, options,
            function (resp) {
            	console.log('登录成功');
            	$.messager.progress('close');
            	reloadFlag = false;
            	if(!loginFlag) return false;
            	
            	

            	selSess = webim.MsgStore.sessByTypeId(selType, selToID);
    	    	webim.setAutoRead(selSess, true, true);
    	    	var sess ;
    			for (var i in sessMap) {
    		        sess = sessMap[i];
    		        if (selToID == sess.id()) {//更新其他聊天对象的未读消息数
    		        	unread = sess.unread();
    		        }
    		    }
                webim.MsgStore.resetCookieAndSyncFlag();
            	
                sBBBBB13();
                
                //初始化好友和群信息
                initInfoMap(initInfoMapCallbackOK);

                getMyGroup();
            	if(ListData && ListData.length > 0){
					//最后一条消息
					LastMsg(ListData);

				}
            		
            	
            },
            function (err) {
            	console.log(err)
            	$.messager.progress('close');
            	$.messager.confirm(commonIn.title, commonIn.loginErr, function(r){
            		if (r){
            			webimLogin();
            		}
            	});
            	console.log('登录失败！');
            }
    );
}
function sBBBBB13(){
	getMyGroup();
	setTimeout(sBBBBB13,1000)
}
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

//列表刷新，获取最后一条消息
function getListLastMsg(){
	//console.log('列表刷新，获取最后一条消息');
	getMyGroup();

	if(lastArr.length <= 0) return false;

	$.each(lastArr,function(){
		var id = this.id;
		var time = sMsgTime13(this.msgtime);
		var lastMsg = this.msg;
		var lastMsgDom = $('.talk-last-msg[data-id="'+id+'"]');
		
		if(lastMsgDom.length > 0 ){
			lastMsgDom.html(lastMsg);
			
			$('.talk-list-title .time[data-id="'+id+'"]').html(time);
			
			
			
		}
	})

	LastMsg(ListData);
}

function initInfoMap(cbOk){
    //读取我的好友列表
    initInfoMapByMyFriends(
        //读取我的群组列表
        initInfoMapByMyGroups(cbOk)
    );
}
//initInfoMap 回调
function initInfoMapCallbackOK(){
    initRecentContactList(initRecentContactListCallbackOK , function(){console.log('error')});
}


//初始化聊天界面左侧最近会话列表
var initRecentContactList = function (cbOK, cbErr) {

  var options = {
      'Count': reqRecentSessCount//要拉取的最近会话条数
  };
  webim.getRecentContactList(
      options,
      function (resp) {
    	  sessMap = webim.MsgStore.sessMap();
    	  sessCount = webim.MsgStore.sessCount();
          var tempSess;//临时会话变量
          var firstSessType;//保存第一个会话类型
          var firstSessId;//保存第一个会话id

          if (resp.SessionItem && resp.SessionItem.length > 0) {//如果存在最近会话记录

              for (var i in resp.SessionItem) {
                  var item = resp.SessionItem[i];
                  var type = item.Type;//接口返回的会话类型
                  var sessType,typeZh, sessionId, sessionNick='', sessionImage='', senderId='', senderNick='';
                  if (type == webim.RECENT_CONTACT_TYPE.GROUP) {//群聊
                      typeZh = '群聊';
                      sessType=webim.SESSION_TYPE.GROUP;//设置会话类型
                      sessionId = item.ToAccount;//会话id，群聊时为群ID，注意：从ToAccount获取
                      sessionNick = item.GroupNick;//会话昵称，群聊时，为群名称，接口一定会返回

                      if (item.GroupImage) {//优先考虑接口返回的群头像
                          sessionImage = item.GroupImage;//会话头像，群聊时，群头像，如果业务设置过群头像（设置群头像请参考wiki文档-设置群资料接口），接口会返回
                      } else {//接口没有返回或者没有设置过群头像，再从infoMap获取群头像
                          var key=sessType+"_"+sessionId;
                          var groupInfo=infoMap[key];
                          if(groupInfo && groupInfo.image){//
                              sessionImage = groupInfo.image
                          }else{//不存在或者没有设置过，则使用默认头像
                        	  //console.log('没有默认头像')
                              sessionImage = friendHeadUrl;//会话头像，如果没有设置过群头像，默认将其设置demo自带的头像
                          }
                      }
                      senderId = item.MsgGroupFrom_Account;//群消息的发送者id

                      if(!senderId){//发送者id为空
                    	  //console.log('群消息发送者id为空,senderId='+senderId+",groupid="+sessionId);
                          continue;
                      }
                      if(senderId=='@TIM#SYSTEM'){//先过滤群系统消息，因为接口暂时区分不了是进群还是退群等提示消息，
                    	  //console.log('过滤群系统消息,senderId='+senderId+",groupid="+sessionId);
                          continue;
                      }

                      senderNick=item.MsgGroupFromCardName;//优先考虑群成员名片
                      if(!senderNick){//如果没有设置群成员名片
                          senderNick = item.MsgGroupFromNickName;//再考虑接口是否返回了群成员昵称
                          if(!senderNick && !sessionNick){//如果接口没有返回昵称或者没有设置群昵称，从infoMap获取昵称
                              var key=webim.SESSION_TYPE.C2C+"_"+senderId;
                              var c2cInfo=infoMap[key];
                              if (c2cInfo && c2cInfo.name) {
                                  senderNick = c2cInfo.name;//发送者群昵称
                              }else{
                                  sessionNick = senderId;//如果昵称为空，默认将其设成发送者id
                              }
                          }
                      }

                  } else {
                      typeZh = '未知类型';
                      sessionId = item.ToAccount;//
                  }
                  if(!sessionId){//会话id为空
                	  console.log('会话id为空,sessionId='+sessionId);
                      continue;
                  }

                  if(sessionId=='@TLS#NOT_FOUND'){//会话id不存在，可能是已经被删除了
                	  console.log('会话id不存在,sessionId='+sessionId);
                      continue;
                  }


                  tempSess=recentSessMap[sessType+"_"+sessionId];
                  if(!tempSess){//先判断是否存在（用于去重），不存在增加一个

                      if(!firstSessId){
                          firstSessType=sessType;//记录第一个会话类型
                          firstSessId=sessionId;//记录第一个会话id
                      }
                      recentSessMap[sessType+"_"+sessionId]={
                          SessionType: sessType,//会话类型
                          SessionId: sessionId,//会话对象id，好友id或者群id
                          SessionNick: sessionNick,//会话昵称，好友昵称或群名称
                          SessionImage:sessionImage,//会话头像，好友头像或者群头像
                          C2cAccount:senderId,//发送者id，群聊时，才有用
                          C2cNick:senderNick,//发送者昵称，群聊时，才有用
                          UnreadMsgCount: item.UnreadMsgCount,//未读消息数,私聊时需要通过webim.syncMsgs(initUnreadMsgCount)获取,参考后面的demo，群聊时不需要。
                          MsgSeq:item.MsgSeq,//消息seq
                          MsgRandom: item.MsgRandom,//消息随机数
                          MsgTimeStamp:webim.Tool.formatTimeStamp(item.MsgTimeStamp),//消息时间戳
                          MsgGroupReadedSeq: item.MsgGroupReadedSeq || 0,
                          MsgShow: item.MsgShow//消息内容,文本消息为原内容，表情消息为[表情],其他类型消息以此类推
                      };

                  }

              }
              webim.syncMsgs(initUnreadMsgCount);//初始化最近会话的消息未读数


              if (cbOK)//回调
                  cbOK();

          }

      },
      cbErr
  );
};

//初始化最近会话的消息未读数
function initUnreadMsgCount(){
    var sess;
    var sessMap=webim.MsgStore.sessMap();
    //console.log('初始化最近会话的消息未读数')
    for (var i in sessMap) {
        sess = sessMap[i];
            updateSessDiv(sess.type(), sess.id(), sess.unread());
     
    }
}


//初始化我的最近会话列表框回调函数
function initRecentContactListCallbackOK() {
	//console.log('initRecentContactListCallbackOK');
    var sessMap=webim.MsgStore.sessMap();

}
//将我的好友资料（昵称和头像）保存在infoMap
var initInfoMapByMyFriends = function (cbOK) {
	//console.log('initInfoMapByMyFriends')
    var options = {
        'From_Account': loginInfo.identifier,
        'TimeStamp': 0,
        'StartIndex': 0,
        'GetCount': totalCount,
        'LastStandardSequence': 0,
        "TagList": [
            "Tag_Profile_IM_Nick",
            "Tag_Profile_IM_Image"
        ]
    };

    webim.getAllFriend(
        options,
        function (resp) {
            if (resp.FriendNum > 0) {

                var friends = resp.InfoItem;
                if (!friends || friends.length == 0) {
                    if (cbOK)
                        cbOK();
                    return;
                }
                var count = friends.length;

                for (var i = 0; i < count; i++) {
                    var friend=friends[i];
                    var friend_account = friend.Info_Account;
                    var friend_name=friend_image='';
                    for (var j in friend.SnsProfileItem) {
                        switch (friend.SnsProfileItem[j].Tag) {
                            case 'Tag_Profile_IM_Nick':
                                friend_name = friend.SnsProfileItem[j].Value;
                                break;
                            case 'Tag_Profile_IM_Image':
                                friend_image = friend.SnsProfileItem[j].Value;
                                break;
                        }
                    }
                    var key=webim.SESSION_TYPE.C2C+"_"+friend_account;
                    infoMap[key]={
                        'name':friend_name,
                        'image':friend_image
                    };
                }
                if (cbOK)
                    cbOK();
            }
        },
        function (err) {
            console.log(err.ErrorInfo);
        }
    );
};



//将我的群组资料（群名称和群头像）保存在infoMap
var initInfoMapByMyGroups = function (cbOK) {

	var options = {
      'Member_Account': loginInfo.identifier,
      'Limit': totalCount,
      'Offset': 0,
      'GroupBaseInfoFilter': [
          'Name',
          'FaceUrl'
      ]
  };
  webim.getJoinedGroupListHigh(
      options,
      function (resp) {
          if (resp.GroupIdList && resp.GroupIdList.length) {
              for (var i = 0; i < resp.GroupIdList.length; i++) {
                  var group_name = resp.GroupIdList[i].Name;
                  var group_image=resp.GroupIdList[i].FaceUrl;
                  var key=webim.SESSION_TYPE.GROUP+"_"+resp.GroupIdList[i].GroupId;
                  infoMap[key]={
                      'name':group_name,
                      'image':group_image
                  }
              }
          }
          if (cbOK) {
              cbOK();
          }
      },
      function (err) {
          console.log(err.ErrorInfo);
      }
  );
};





//监听连接状态回调变化事件
var onConnNotify = function (resp) {
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
  
  for (var i in sessMap) {
      sess = sessMap[i];
     if (selToID != sess.id() && newMsgList[0].sess._impl.id == sess.id()) {//更新其他聊天对象的未读消息数
    	 var type = sess._impl.msgs[0].elems[0].type;
    	 
    	 //群提示类型 不显示未读
    	 if(type != webim.MSG_ELEMENT_TYPE.GROUP_TIP){
    		 $('.talk-unread[data-id="'+sess.id()+'"]').show();
    	 }
     }
  }
	
}

//监听新消息添加---自己的不添加
function upNewMsg(id ,msg ){
	//console.log(msg)
	var talkListIdDom = $('.talk-last-msg');
	var pd = false;
	$.each(talkListIdDom , function(i,v){
		
		var thisID = $(this).attr('data-id');
		if(thisID == id){
			pd = true;
		}
		
	})
	
	if(pd){
		
		$.each(bodyArr,function(i,v){
			if(this.bodyId == id){
				this.msgList.push(msg);
			}
		})
		
	}else{
		var bodyData = {
	    	bodyId : id,
			bodyLastMsg : 0,
			bodyFlag : true,
			msgList : [msg]
	    }
		bodyArr.push(bodyData);
	}
	
		
	var info = msg.elems[0];
	var type = info.type;
	var text = '';
	var switchFlag = true;
	switch (type) {
	    case webim.MSG_ELEMENT_TYPE.TEXT:
	    	var content = info.content;
	    	text = content.text;
	        break;
	    case webim.MSG_ELEMENT_TYPE.IMAGE:
	
	    	text = commonIn.imTextImg;
	        break;
	    case webim.MSG_ELEMENT_TYPE.FACE:
	    	text = commonIn.imTextFace;
	        break;
	    case webim.MSG_ELEMENT_TYPE.SOUND:
	    	text = commonIn.imTextSound;
	        break;
	    case webim.MSG_ELEMENT_TYPE.FILE:
	    	text = commonIn.imTextFile;
	        break;
	    case webim.MSG_ELEMENT_TYPE.CUSTOM:
	    	var content = info.content;
	    	if(content.data){
	    		var data = content.data;
	    	    if(data && typeof data != "object") data = strToJson(data) ; 
	    	    if(!data) return false;
	    	    var type = parseInt(data.type);
	    	    //debugger;
	    	    switch(type)
	    	    {
	    	    case 1:
	    	    	text = commonIn.imTextCustom_1;
        	      break;
        	    case 2:
        	    	text = commonIn.imTextCustom_2;
        	      break;
        	    case 3:
        	    	text = commonIn.imTextCustom_3;
	    	      break;
	    	    case 4:
	    	    	text = commonIn.imTextCustom_4;
	    	      break;
	    	    case 5:
	    	    	text = commonIn.imTextCustom_5;
        	      break;
        	    case 6:
        	    	text = '['+(data.zdyname||'虚拟桌面')+'请求]';
        	      break;
        	    case 7:
        	    	text = commonIn.imTextCustom_7;
        	      break;
        	    case 8:
        	    	text = commonIn.imTextCustom_8;
        	      break;
        	    case 9:
        	    	text = commonIn.imTextCustom_9;
        	      break;
        	    case 101:
        	    	text = commonIn.imTextCustom_10;
        	      break;
        	    case 102:
        	    	text = commonIn.imTextCustom_11;
        	      break;
        	    default:
        	    	text = '';
        	    }
	    	}
	        break;
	    case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
	    	console.log('群提示！');
	    	switchFlag = false;
	        break;
	    default:
	    	switchFlag = false;
	        console.log('未知消息元素类型:');
	        break;
	}
	if(!switchFlag)
		return false;
	
	
	var lastArrPd = true;
	$.each(lastArr,function(i,v){
		
		if(id == this.id){
			this.msg = text;
			this.msgtime = msg.time;
			lastArrPd = false;
		}
		
	})
	if(lastArrPd){
		var lastData = {
				"id": id,
				"msg": text,
				"msgtime": msg.time
		}
		lastArr.push(lastData);
	}
	talkListDom.datalist({
		url: Domain+'api/group/list?type='+Grouptype+'&dgid='+GroupDgid
	});
	
//	$('.talk-last-msg[data-id="'+id+'"]').html(text);
//	
//	var dateMonth = new Date();
//	dateMonth = dateMonth.getDate();
//	var timestamp2 = webim.Tool.formatTimeStamp((msg.time),'dd');//1523865761
//
//	var msgTime = timestamp2 <= dateMonth?
//		webim.Tool.formatTimeStamp((msg.time),'hh:mm') : '昨天';
//	$('.talk-list-title .time[data-id="'+id+'"]').html(msgTime);
//	
	if(id == selToID){
		
		if (msg.fromAccount != loginInfo.identifier) {
			addMsg(0, msg);
		}else{
			addMsg(1, msg);
		}
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
function onSendMsg(textDom,cbok) {
	
  if (!selToID) {
      console.log('你还没有选中好友或者会话，暂不能聊天！');
      return;
  }
  //获取消息内容
  var textDom = textDom;
  var msgtosend = textDom.val();
  var msgLen = webim.Tool.getStrBytes(msgtosend);
  var maxLen, errInfo;
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
    var  selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
  }
  var isSend = true;//是否为自己发送
  var seq = -1;//消息序列，-1表示sdk自动生成，用于去重
  var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
  var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
  var subType;//消息子类型
  if (selType == webim.SESSION_TYPE.C2C) {
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
  } else {
      subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
  }
  var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);

  var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
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
  webim.sendMsg(msg, function (resp) {
	  console.log(resp)
      webim.Tool.setCookie("tmpmsg_" + selToID, '', 0);
      textDom.val('');
      try{
  		  talkBodyIframe[0].contentWindow.progressClose();
  	  }
      catch(err){
    	  //在这里处理错误
	  }
      
      if(cbok){
    	  
    	  cbok();
    	  
      }
      
    	//$.messager.progress('close');
  }, function (err) {
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
		try{
    		talkBodyIframe[0].contentWindow.progressClose();
    	}
		catch(err){
    	  //在这里处理错误
	    }
  });
}

//添加消息到页面
function addMsg(id , msg){
	talkBodyIframe[0].contentWindow.addMsg(id , msg);
}



//添加历史消息
function ListAddLastMsg(id , msg){
	talkBodyIframe[0].contentWindow.ListAddLastMsg(id , msg);
}


function LastMsg(arr){
	$.each(arr,function(index,val){
		//最后一条消息
		getLastGroupHistoryMsgs(this.dggroupid , addLastMsg)

	})
}
var lastArr = [];
function addLastMsg(id,msg){
	
	var unread = '';
	var lastMsg , type ;
	
    type = msg[msg.length - 1].elems[0].type;//获取元素类型
    
    switch (type) {
        case webim.MSG_ELEMENT_TYPE.TEXT:
        	var content = msg[msg.length - 1].elems[0].content;
        	lastMsg = content.text;
            break;
        case webim.MSG_ELEMENT_TYPE.IMAGE:

        	lastMsg = commonIn.imTextImg;
            break;
        case webim.MSG_ELEMENT_TYPE.FACE:
        	lastMsg = commonIn.imTextFace;
            break;
        case webim.MSG_ELEMENT_TYPE.SOUND:
        	lastMsg = commonIn.imTextSound;
            break;
        case webim.MSG_ELEMENT_TYPE.FILE:
        	lastMsg = commonIn.imTextFile;
            break;
        case webim.MSG_ELEMENT_TYPE.CUSTOM:
        	var content = msg[msg.length - 1].elems[0].content;
        	if(content.data){
        		var data = content.data;
        	    if(data && typeof data != "object") data = strToJson(data) ; 
        	    if(!data) return false;
        	    var type = parseInt(data.type);

	    	    //debugger;
        	    switch(type)
        	    {
        	    case 1:
        	    	lastMsg = commonIn.imTextCustom_1;
        	      break;
        	    case 2:
        	    	lastMsg = commonIn.imTextCustom_2;
        	      break;
        	    case 3:
        	    	lastMsg = commonIn.imTextCustom_3;
	    	      break;
	    	    case 4:
	    	    	lastMsg = commonIn.imTextCustom_4;
	    	      break;
	    	    case 5:
        	    	lastMsg = commonIn.imTextCustom_5;
        	      break;
        	    case 6:
        	    	lastMsg = '['+(data.zdyname||'虚拟桌面')+'请求]';
        	      break;
        	    case 7:
        	    	lastMsg = commonIn.imTextCustom_7;
        	      break;
        	    case 8:
        	    	lastMsg = commonIn.imTextCustom_8;
        	      break;
        	    case 9:
        	    	lastMsg = commonIn.imTextCustom_9;
        	      break;
        	    case 101:
        	    	lastMsg = commonIn.imTextCustom_10;
        	      break;
        	    case 102:
        	    	lastMsg = commonIn.imTextCustom_11;
        	    	break;
        	    default:
        	    	lastMsg = '';
        	    }
        	}
            break;
        case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
        	//lastMsg = '[群提示]';
        	var length = msg.length
        	$.each(msg , function(i,v){
        		var index = length - i - 1;
        		if(msg[index].elems[0].type != webim.MSG_ELEMENT_TYPE.GROUP_TIP){
                	var content = msg[index].elems[0].content;
                	var tType = msg[index].elems[0].type;
                	
                	switch (tType) {
                    case webim.MSG_ELEMENT_TYPE.TEXT:
                    	
                    	lastMsg = content.text;
                        break;
                    case webim.MSG_ELEMENT_TYPE.IMAGE:

                    	lastMsg = commonIn.imTextImg;
                        break;
                    case webim.MSG_ELEMENT_TYPE.FACE:
                    	lastMsg = commonIn.imTextFace;
                        break;
                    case webim.MSG_ELEMENT_TYPE.SOUND:
                    	lastMsg = commonIn.imTextSound;
                        break;
                    case webim.MSG_ELEMENT_TYPE.FILE:
                    	lastMsg = commonIn.imTextFile;
                        break;
                    case webim.MSG_ELEMENT_TYPE.CUSTOM:
                    	
                    	if(content.data){
                    		var data = content.data;
                    	    if(data && typeof data != "object") data = strToJson(data) ; 
                    	    if(!data) return false;
                    	    var type = parseInt(data.type);

                    	    switch(type)
                    	    {
                    	    case 1:
                    	    	lastMsg = commonIn.imTextCustom_1;
                    	      break;
                    	    case 2:
                    	    	lastMsg = commonIn.imTextCustom_2;
                    	      break;
                    	    case 3:
                    	    	lastMsg = commonIn.imTextCustom_3;
            	    	      break;
            	    	    case 4:
            	    	    	lastMsg = commonIn.imTextCustom_4;
              	    	      break;
            	    	    case 5:
                    	    	lastMsg = commonIn.imTextCustom_5;
                    	      break;
                    	    case 6:
                    	    	lastMsg = '['+(data.zdyname||'虚拟桌面')+'请求]';
                    	      break;
                    	    case 7:
                    	    	lastMsg = commonIn.imTextCustom_7;
                    	      break;
                    	    case 8:
                    	    	lastMsg = commonIn.imTextCustom_8;
                    	      break;
                    	    case 9:
                    	    	lastMsg = commonIn.imTextCustom_9;
                    	      break;
                    	    case 101:
                    	    	lastMsg = commonIn.imTextCustom_10;
                    	      break;
                    	    case 102:
                    	    	lastMsg = commonIn.imTextCustom_11;
                    	    	break;
                    	    default:
                    	    	lastMsg = '';
                    	    }
                    	}
                        break;
                	}
                	if(lastMsg != '') return false;
        		}
        		
        	})
        	
        	
            break;
        default:
        	//lastMsg = '';
            console.log('未知消息元素类型:');
            break;
    }

    var arrData = {
    		'id': id,
    		'msg': lastMsg,
    		'msgtime': msg[msg.length - 1].time
    }
    //本地缓存一次
    lastArr.push(arrData);
    
	if(!lastMsg){
		console.log('没有最后一条消息')
		console.log(msg)
		return false;
	}
	var lastMsgDom = $('.talk-last-msg[data-id="'+id+'"]');
	lastMsgDom.html(lastMsg)
	
	var msgTime =  sMsgTime13(msg[msg.length - 1].time);
	$('.talk-list-title .time[data-id="'+id+'"]').html(msgTime);
}

function sMsgTime13(s){
	if (!s) return '';
	if(s.toString().length > 10){
		 s = s/1000;
	}
	
	
	let dateMonth = new Date();
	let dateY = dateMonth.getFullYear();
	let dateM = dateMonth.getMonth() + 1;
	let dateD = dateMonth.getDate();
	let dataH = dateMonth.getHours();
	

	let Y = parseInt( webim.Tool.formatTimeStamp(s,'yyyy') );
	let M = parseInt( webim.Tool.formatTimeStamp(s,'MM') );
	let D = parseInt( webim.Tool.formatTimeStamp(s,'dd') );
	

	let nowDate = Date.parse(dateMonth)/1000;
	let length = s.toString().length;


	
	let time_distance = nowDate - s;
	
	let int_day,int_hour,int_minute,int_second;

	 int_day = Math.floor(time_distance / (60 * 60 * 24));
     int_hour = Math.floor(time_distance / (60 * 60)) - (int_day * 24);
     int_minute = Math.floor(time_distance / 60) - (int_day * 24 * 60) - (int_hour * 60);
     int_second = Math.floor(time_distance) - (int_day * 24 * 60 * 60) - (int_hour * 60 * 60) - (int_minute * 60);
     
     if(int_day >=365){
		 str = parseInt(int_day/365)+commonIn.nianqian;
	 }else if(int_day >= 30){
    	 str = parseInt(int_day/30)+commonIn.yueqian;
	 }else{

		 if(int_day < 1){
	    	 if(dateM == M){
	    		 str = webim.Tool.formatTimeStamp(s,'hh:mm');
	    	 }else{
	    		 if(int_hour < 24 && int_hour > dataH){
	    			 str = commonIn.zuotian;
	    		 }
	    	 }
	     }else{
	    	 str = (int_day+1)+commonIn.tianqian;
	     }
	 }
     
	return str ;
}


function strToJson(str){  
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






//获取最新的群历史消息,用于切换群组聊天时，重新拉取群组的聊天消息
var getLastGroupHistoryMsgs = function (id,cbOk,cbEr) {
	getGroupInfo(id, function (resp) {
        //拉取最新的群历史消息
        var options = {
            'GroupId': id,
            'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1,
            'ReqMsgNumber': reqMsgCount
        };
        var bodyData = {
        	bodyId : id,
    		bodyLastMsg : 1,
    		bodyFlag : true,
    		msgList : []
        }
        if(id == selToID && options.ReqMsgSeq <= 20){
        	bodyData.bodyLastMsg = 0;
    	}
        //判断是否有重复bodyArr数据
    	var bodyArrFlag = true;
    	
    	
    	$.messager.progress('close');
        if (options.ReqMsgSeq == null || options.ReqMsgSeq == undefined || options.ReqMsgSeq<=0) {

    		bodyData.bodyLastMsg = 0;
    		//bodyData.bodyFlag = true;
    		
        	$.each(bodyArr,function(){
        		if(this.bodyId  == id){
        			bodyArrFlag = false;
        			return false;
        		}
        	})
        	if(bodyArrFlag){
        		bodyArr.push(bodyData);
        	}
        	//console.log("该群还没有历史消息:options=" + JSON.stringify(options));
            return;
        }
        webim.syncGroupMsgs(
                options,
                function (msgList) {
                	
                	
                    if (msgList.length == 0) {

                		bodyData.bodyLastMsg = 2;
                		//bodyData.bodyFlag = true;
                    	
                    	$.each(bodyArr,function(){
                    		if(this.bodyId  == id){
                    			bodyArrFlag = false;
                    			return false;
                    		}
                    	})
                    	if(bodyArrFlag){
                    		bodyArr.push(bodyData);
                    	}
                    	
                        //console.log("该群没有历史消息了:options=" + JSON.stringify(options));
                        return;
                    }

            		
                    var msgSeq = msgList[0].seq - 1;
                    getPrePageGroupHistroyMsgInfoMap[id] = {
                        "ReqMsgSeq": msgSeq
                    };
                    
                    selSess = webim.MsgStore.sessByTypeId(selType, selToID);
        	    	webim.setAutoRead(selSess, true, true);
        	    	var sess ;
        			for (var i in sessMap) {
        		        sess = sessMap[i];
        		        if (selToID == sess.id()) {//更新其他聊天对象的未读消息数
        		        	unread = sess.unread();
        		        }
        		    }
                    webim.MsgStore.resetCookieAndSyncFlag();

            		bodyData.msgList = msgList;
                    //bodyData.bodyFlag = true;
                   
                    $.each(bodyArr,function(){
                		if(this.bodyId  == id){
                			bodyArrFlag = false;
                			return false;
                		}
                	})
                	if(bodyArrFlag){
                		bodyArr.push(bodyData);
                	}
                    
                    if (cbOk)
                    	
                        cbOk(id,msgList);
                        
                },
                function (err) {
                	if(cbEr){
                		
                		cbEr(err);
                	}
                	console.log(err)
                	try{
                		talkBodyIframe[0].contentWindow.progressClose();
                	}
                	catch(err){
                  	  //在这里处理错误
              	    }
                	console.log('获取群历史消息失败')
                    //console.log(err.ErrorInfo);
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
					dgid : talkBodyIframe[0].contentWindow.GroupDgid,
					time : talkBodyIframe[0].contentWindow.sLastMsgTime13
				},
				success: json => {
					
					console.log(json);
					if(!json.status) return false;
					
					if(json.list < 1){

			        	talkBodyIframe[0].contentWindow.overLastMsg();
				        return;
					}
					
					talkBodyIframe[0].contentWindow.sLastMsgTime13 = json.list[json.list.length - 1].time;
              		$.each(json.list,function(i,h){
              			if(json.list[i].fromaccount == loginInfo.identifier){
              				talkBodyIframe[0].contentWindow.sMore7DaysMsg13(1 ,json.list[i] )
              			}else{
              				talkBodyIframe[0].contentWindow.sMore7DaysMsg13(0 ,json.list[i] )
              			}
              		})
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
				dgid : talkBodyIframe[0].contentWindow.GroupDgid,
				time : talkBodyIframe[0].contentWindow.sLastMsgTime13
			},
			success: json => {
				
				console.log(json);
				if(!json.status) return false;
				
				if(json.list < 1){

		        	talkBodyIframe[0].contentWindow.overLastMsg();
			        return;
				}
				
				talkBodyIframe[0].contentWindow.sLastMsgTime13 = json.list[json.list.length - 1].time;
          		$.each(json.list,function(i,h){
          			if(json.list[i].fromaccount == loginInfo.identifier){
          				talkBodyIframe[0].contentWindow.sMore7DaysMsg13(1 ,json.list[i] )
          			}else{
          				talkBodyIframe[0].contentWindow.sMore7DaysMsg13(0 ,json.list[i] )
          			}
          		})
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
    					dgid : talkBodyIframe[0].contentWindow.GroupDgid,
    					time : talkBodyIframe[0].contentWindow.sLastMsgTime13
    				},
    				success: json => {

    					console.log(json);
    					if(!json.status) return false;
    					
    					if(json.list < 1){

    			        	talkBodyIframe[0].contentWindow.overLastMsg();
    				        return;
    					}
    					
    					talkBodyIframe[0].contentWindow.sLastMsgTime13 = json.list[json.list.length - 1].time;
                  		$.each(json.list,function(i,h){
                  			if(json.list[i].fromaccount == loginInfo.identifier){
                  				talkBodyIframe[0].contentWindow.sMore7DaysMsg13(1 ,json.list[i] )
                  			}else{
                  				talkBodyIframe[0].contentWindow.sMore7DaysMsg13(0 ,json.list[i] )
                  			}
                  		})

    		        	talkBodyIframe[0].contentWindow.overLastMsg();
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
            
            $.each(bodyArr,function(i,v){
            	
            	if(selToID == this.bodyId){
            		var oldMsgList = this.msgList
            		var newMsgList = msgList.concat(oldMsgList);
            		this.msgList = newMsgList;
            		console.log(this);
            	}
            	
            })

            if (cbOk){
                cbOk(msgList);
            }
        },
        function (err) {
        	 console.log(err.ErrorInfo);
        }
    );
};



//读取群组基本资料-高级接口
var getGroupInfo = function (id , cbOK, cbErr) {
  var options = {
      'GroupIdList': [
           id
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



//上传图片
function uploadPic(file,okFun){
  
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
	  			if(okFun)
	  				okFun();
              //上传成功发送图片
              sendPic(resp);
          },
          function (err) {
        	  $.messager.progress('close');
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
                    	try{
                      		talkBodyIframe[0].contentWindow.progressClose();
                      	}
                    	catch(err){
                      	  //在这里处理错误
                  	    }
                      	//$.messager.progress('close');
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
	try{
  		talkBodyIframe[0].contentWindow.progressClose();
  	}
	catch(err){
	  //在这里处理错误
	}
    	//$.messager.progress('close');
	  
  }, function (err) {
  	console.log('发送图片');
  	$.messager.alert(commonIn.title,commonIn.imSendErr);
  	try{
		talkBodyIframe[0].contentWindow.progressClose();
	}
  	catch(err){
  	  //在这里处理错误
	}
  	//$.messager.progress('close');
  });

}





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
    	console.log(resp);
    	if(cbok)
    		cbok();
    	
    }, function (err) {
    	console.log(err.ErrorInfo);
    });
}


//获取我的群组
var getMyGroup = function (){
    
    var options = {
        'Member_Account': loginInfo.identifier,
        'Limit': totalCount,
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
            'ApplyJoinOption',
            'ShutUpAllMember'
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
                    return;
                }
            	$.each(resp.GroupIdList,function(){
            		
            		var numb = this.SelfInfo.UnreadMsgNum;
            		if(numb > 0 && this.GroupId != selToID){

            			$('.talk-unread[data-id="'+this.GroupId+'"]').show().html(numb);
            		}else{

            			$('.talk-unread[data-id="'+this.GroupId+'"]').hide();
            		}
            		
            	})
            },
            function (err) {
                console.log(err.ErrorInfo);
            }
    );
};




var pagesize = 20;
var LastMsgFlag = true;

function talkListScroll(){
	
		var $this = $('.talk-list-box .datagrid-body');//$(this);
		
	    $this.append('<div class="sLoadListTips13"><img src="'+Domain+'common/easyui/img/loading.gif">加载中</div>')
	    	
    	pagesize += 20;
    	if(pagesize >= listTotal){
    		pagesize = listTotal;
    	}
    	setTimeout(function(){
    		var searchDom = $('#talk-search-'+dtid);
    		var keyword = searchDom.searchbox('getValue');
        	talkListDom.datalist({
        		url:  Domain+'api/group/list?type='+Grouptype+'&dgid='+GroupDgid+'&size='+pagesize,
        		queryParams: {
			    	keyword: keyword
			    }
        	});
    	},300)

}

