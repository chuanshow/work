<script type="text/javascript" src="/easyui/jquery.min.js"></script>   
<link  href="/css/bootstrap.min.css" rel="stylesheet" />
<link href="/toastr/toastr.scss" rel="stylesheet" />
<script src="/toastr/toastr.js"></script>

<nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
    <div class="navbar-header">
        <a class="navbar-brand" href="#">系统首页</a>
    </div>
    <div>
        <ul class="nav navbar-nav">
            <li class="active"><a href="#">iOS</a></li>
            <li><a href="#">SVN</a></li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    Java
                    <b class="caret"></b>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="#">jmeter</a></li>
                    <li><a href="#">EJB</a></li>
                    <li><a href="#">Jasper Report</a></li>
                    <li class="divider"></li>
                    <li><a href="#">分离的链接</a></li>
                    <li class="divider"></li>
                    <li><a href="#">另一个分离的链接</a></li>
                </ul>
            </li>
            <li class="dropdown" >
            	<a href="" onClick="quit()">退出</a>
              </li>
        </ul>
    </div>
    </div>
     <script type="text/javascript">
      toastr.options.positionClass = 'toast-bottom-right';
	      function quit(){
	      	var url ="/api/user/exist"
	      	$.post(url, {
			},function(data){
				  toastr.success('${msg!}');
			})
      </script>
</nav>