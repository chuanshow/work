<script type="text/javascript" src="/easyui/jquery.min.js"></script>  
<link  href="/css/bootstrap.min.css" rel="stylesheet" />
<script type="text/javascript" src="/js/bootstrap.min.js"></script> 
<script src="/toastr/toastr.js"></script>

<#include "head.ftl" >
<div class="tableDisplay" id="dataTable">
<table class="table table-bordered"  width="100%" style="margin-bottom:0px;" data-height="460" >
</table>
</div>

     <script type="text/javascript">
			$(document).ready(function() {
			$("#dataTable table").bootstrapTable({
			      search: false,
			      pagination: true,
			      pageSize: 15,
			      pageList: [5, 10, 15, 20],
			      showColumns: true,
			      showRefresh: false,
			      locale: "zh-CN",
			      striped: true,
			      toggle:true,
			      ajax:function(request) {
			        $.ajax({
			          url:"/api/user/getall",
			          type:"GET",
			          dataType:"json",
			          success:function(data){
			            $('#dataTable table').bootstrapTable('load', data);
			          },
			          error:function(error){
			            console.log(error);
			          }
			        })
			      },
			      columns:[{
			        field: "userid",
			        title:"用户id"
			      },{
			        field: "username",
			        title:"用户名"
			      }]
			    });
			  });
      </script>
