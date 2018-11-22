var loginFlag = true; 

//sdk登录
function webimLogin() {
	$.messager.progress();
	webim.login(
		loginInfo, listeners, options,
		function(resp) {

        	console.log('登录成功');
        	$.messager.progress('close');

            if(!loginFlag) return false;
			
			//获取会话组聊天记录
			getGroupMsg();

			$.ajax({
				url : Domain + 'api/consultation/detail',
				type : 'post',
				data : {
					'access_token' : access_token,
					'ciid' : ciid
				},
				success : function(json) {
					var typeObj = json.permissions;
					getGroupTab(typeObj);
				},
				error : function(json) {

					console.log(json)
				}
			})

		},
		function(err) {
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

var getGroupTab = function(typeObj) {
	$.ajax({
		url : Domain + 'api/group',
		type : 'post',
		data : {
			'dgid' : GroupDgid
		},
		success : function(data) {
			
			if (data.status) {
				$.each(data.users, function(index, val) {
					friendImg.push(data.users[index]);
				})
			}

			if (data.mrecord) {
				//申请病历
				mrecodeinfor(typeObj.mrcode, data)

			}

			if (data.consultationinfor) {
				//申请报告
				ciid = data.consultationinfor.ciid;
				cimrid = data.consultationinfor.cimrid;
			}
			if(data.permissions.apply){
				if (data.permissions.apply == 1||data.permissions.apply == 3){
					//会诊申请
					consultationinfor(1, data)
				}else if (data.permissions.apply == 2){
						consultationinfor(2, data)
				}
			}
			if(data.permissions.report){
				if (data.permissions.report == 1||data.permissions.report == 3){
					reportinfor(1, data);
				}else if (data.permissions.report == 2){
					//会诊报告编写
					reportinfor(2, data);
				}
			}
			if(data.permissions.opinion){
				if (data.permissions.opinion == 2) {
					//会诊意见编写
					opinioninfor(2, data);
				}else if (data.permissions.opinion == 1) {
					//会诊意见只读
					opinioninfor(1, data);
				}
			}

			tabDom.tabs('select', commonIn.tabsTalkName);
		},
		error : function(data) {

			console.log(data)
		}
	})

}







