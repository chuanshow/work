var loginFlag = true; 
//sdk登录
function webimLogin() {
	$.messager.progress();
    webim.login(
            loginInfo, listeners, options,
            function (resp) {

            	console.log('登录成功');
            	$.messager.progress('close');
            	
            	if(!loginFlag) return false;


    			//获取会话组聊天记录
    			getGroupMsg();
            	
            	$.ajax({
        	        url: Domain + 'api/group',  
        	        type: 'post',  
        	        data:{'dgid':GroupDgid},  
        	        success: function (data) {
        	        	if(data.status){
			            	$.each(data.users,function(index,val){
				        		friendImg.push(data.users[index]);
				        	})
        	        	}


        				tabDom.tabs('select', commonIn.tabsTalkName);
        	        },
        	        error : function(data){
        	        	
        	        	console.log(data)
        	        }
            	})
            	
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



