<script type="text/javascript" src="${domain!}easyui/jquery.min.js"></script>   
<link  href="${domain!}css/bootstrap.min.css" rel="stylesheet"></script>
<script type="text/javascript" src="${domain!}jquery.js"></script>
<div class="col-md-8">
<div class="panel panel-default">  
  <div class="panel-body"> 
 <form role="form" id="user_info">
  <div class="form-group">
    <label for="name">用户名</label>
    <input type="text" class="form-control" id="uname" placeholder="请输入用户名">
  </div>
  <div class="form-group">
    <label for="name">密码</label>
    <input type="password" class="form-control" id="upassword" placeholder="请输入密码">
  </div>
  <button type="submit" onclick="btn_from()" class="btn btn-default">提交</button>
</form>  

  </div>  
</div>  
</div>  
<div class="col-md-4">
 
  </div>  
  <script type="text/javascript">
  	function btn_from(){
  	var data=$('#user_info').serialize();
  	var submitData=decodeURIComponent(data,true);
  		$.ajax({
	    url:'${domain!}user/login',
	    data:submitData,
	    cache:false,//false是不缓存，true为缓存
	    async:true,//true为异步，false为同步
	    success:function(result){
    	}
	})
  	}
  
  
  </script>
</div>  
</div>  