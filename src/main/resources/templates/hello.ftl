<table class="easyui-datagrid" 
					style="width:100%;height:100%"
				    id="futaskList" 
				    data-options="
				    toolbar:'#kt-nav',
				    url:'${domain!}api/user/getall',
				    method:'get',
				    fitColumns: true,
				    
				    "
			>
				<thead >
		            <tr>
		            	<th data-options="field:'userid',hidden:true">用户id</th>
		                <th data-options="field:'username',width:80",halign:'center'>用户名称</th>
		            </tr>
		        </thead>
	        </table>
		
