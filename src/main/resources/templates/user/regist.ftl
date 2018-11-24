<#include "../head.ftl">
	
	<div id="body" style="left:500px;width:70%;top:400px">
			<form class="change-form" action="${domain!}regist" method="POST" style="width:100%;margin:0 auto;" id="usertable" >
				<div class="tg-row">
         			<div class="tg-col-12">

						<input class="easyui-textbox" id="name"
						  data-options="label:'用户名：',width:'90%'" name="uname"/>
					</div>
				</div>
				
				<div class="tg-row">
         			<div class="tg-col-12">
				
						<input class="easyui-textbox" id="password"
						data-options="label:'密码：',width:'90%'" 
							name="upassword" />
					</div>
				</div>
				<div class="tg-row">
	         		<div class="tg-col-12">	
						<div class="easyui-linkbutton" data-options="iconCls:'icon-search'" onclick="login()" style="width:20%"  AutoSize="true"></div>
					</div>
				</div>
		
			</form>
			</div>
				   <script language="JavaScript" type="text/javascript">
				   	function login(){
				   			var name=$("#name").val();
				   			var password=$("#password").val();
				   			if(name==''){
				   				$.messager.alert("提示消息","请输入用户名");
				   				return false;
				   			}
				   			if(password==''){
				   				$.messager.alert("提示消息","请输入密码");
				   				return false;
				   		}
				var form = document.getElementById('usertable');
				form.submit();				   		
				   	}
				   	<#if msg??>
				   	$.messager.show(${msg!});
				   	</#if>
				   </script>