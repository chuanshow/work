<script type="text/javascript" src="/easyui/jquery.min.js"></script>   
<link  href="/css/bootstrap.min.css" rel="stylesheet">
<link href="/toastr/toastr.scss" rel="stylesheet" />
<script src="/toastr/toastr.js"></script>
<style>
	.col-md-8{
		background:url(/login.jpg);
		position: absolute;
		width:100%;
		height:100%;
		overflow-x: hidde;
		overflow-y: hidde;
	}
	.panel-default{
		position: absolute;
	    top: 25%;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    margin:0 auto;
	    text-align:center;
	    width:50%;
	    height:50%;
	}
</style>
<div class="col-md-8">
<div class="panel panel-default" >  
  <div class="panel-body"> 
 <form role="form" action="/user/login" method="post" id="user_info">
  <div class="form-group">
    <label for="name">用户名</label>
    <input type="text" class="form-control" name="uname" placeholder="请输入用户名">
  </div>
  <div class="form-group">
    <label for="name">密码</label>
    <input type="password" class="form-control" name="upassword" placeholder="请输入密码">
  </div>
  <button type="submit"  class="btn btn-default">登录</button>
</form>  
  </div>  
</div>  
</div>  
<div class="col-md-4">
  </div> 
  <script type="text/javascript">
     toastr.options.positionClass = 'toast-bottom-right';
  		$(function(){
  			console.log('${msg!}');
  			console.log('${domain!}');
  		})
  	if('${msg!}'){
  	  toastr.error('${msg!}');
  	}
  	function btn_from(){
  	var data=$('#user_info').serialize();
  	}
  </script>
</div>  
</div>  