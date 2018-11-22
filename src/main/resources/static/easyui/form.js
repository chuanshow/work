
$(function(){
	//表单添加onSubmit事件
	$(document).on('submit','form',function(){
		formInputCheck();
	})
	
})
function formCheck(input){
	//表单input集
	console.log(input);
	var str = true ;
	$.each(input , function(){
		var $this = $(this);
		if($this.hasClass('textbox-f')){
			var checkPd = $this.attr('data-check');
			if(checkPd){
				var arr = checkPd.split(';');
				if($this.textbox){
					//input值
					var inputValue = $this.textbox('getValue');
					
					$.each(arr, function(index, key){
						//判断是否有字符长度限制 [8 : 最大8个字符] [3-8 : 最小3个字符，最大8个字符]
						var re = /^((?!-).)*$/;
						if (!re.test(key) || parseInt(key)){
							
							//console.log("含有-！") ;
							
							//校验结果
							var checkValue = checkInit('MAX' , inputValue , key);
							
							if(checkValue != true){
								
								//input名称
								var name = $this.siblings('label').html();
								str =  name + checkValue;
								$this.siblings('span').find('input').focus();
								return str;
							}
							
						}else{

							//校验结果
							var checkValue = checkInit(key , inputValue);
							
							if(checkValue != true){

								//input名称
								var name = $this.siblings('label').html();
								str =  name + checkValue;
								$this.siblings('span').find('input').focus();
								return str;
							}
							
						}
						
					})

				}
				
			}
			
		}
		
	})
	return str;
}
function formInputCheck(input){
	//表单input集
	console.log(input);
	var str = true ;
	$.each(input , function(){
		var $this = $(this);
			var checkPd = $this.attr('data-check');
			if(checkPd){
				var arr = checkPd.split(';');

				//input值
				var inputValue = $this.val();
				
				$.each(arr, function(index, key){

					//判断是否有字符长度限制 [8 : 最大8个字符] [3-8 : 最小3个字符，最大8个字符]
					var re = /^((?!-).)*$/;
					if (!re.test(key) || parseInt(key)){
						
						//console.log("含有-！") ;
						//校验结果
						var checkValue = checkInit('MAX' , inputValue , key);
						
						if(checkValue != true){

							str = checkValue;
							$this.focus();
							return str;
						}
						
					}else{

						//校验结果
						var checkValue = checkInit(key , inputValue);
						
						if(checkValue != true){
							
							str =  checkValue;
							$this.focus();
							return str;
						}
						
					}
					
				})
			}
			
		
	})
	return str;
}
function checkInit(check , val , length){
	
	var str ; 
	switch(check)
	{
	case 'S': //字符串
		str = checkFn.S(val)
	  break;
	case 'L': //布尔型
		str = checkFn.L(val)
	  break;
	case 'N': //数值型
		str = checkFn.N(val)
	  break;
	case 'D': //日期型  YYYY-MM-DD YYYY/MM/DD
		str = checkFn.D(val)
	  break;
	case 'DT': //日期时间型 YYYY-MM-DD hh:mm:ss
		str = checkFn.DT(val)
	  break;
	case 'T': //时间型 hh:mm:ss
		str = checkFn.T(val)
	  break;
	case 'BY': //二进制
		str = checkFn.BY(val)
	  break;
	case 'A': //字母字符
		str = checkFn.A(val)
	  break;
	case 'AN': //字母或（和）数字字符
		str =  checkFn.AN(val)
	  break;
	case 'D8': //日期型  YYYY-MM-DD YYYY/MM/DD
		str = checkFn.D8(val)
	  break;
	case 'T6': //时间型 hh:mm:ss
		str = checkFn.T6(val)
	  break;
	case 'DT15': //日期时间型 YYYY-MM-DD hh:mm:ss
		str = checkFn.DT15(val)
	  break;
	case 'MAX': //值 最大最小值  [8 : 最大8个字符] [3-8 : 最小3个字符，最大8个字符]
		str = checkFn.MAX(val , length)
	  break;
	default:
		str = true;
	}
	return str;
}

var checkFn = {
	
	S : function(val){
		//console.log(val)
		var str ;
		//if(!val){
		//	str = '必填项 请输入';
		//}
		str = true;
		return str;
	}
	,L : function(val){
		var str ;
		//console.log(val)
		if( val == '0' || val == '1' || val == 'true' || val == 'false'){
			str = true;
		}else{
			str = '不是布尔型，值只能为 0、1、true、false';
		}
		return str;
	}
	,N : function(val){
		//console.log(val)
		var str ;
		if(parseInt(val)){
			str = true;
		}else{
			str = '只能包含数字';
		}
	}
	,D : function(val){

		//console.log(val)
		//| 日期有效性验证 
		//| 格式为：YYYY-MM-DD或YYYY/MM/DD  
		var DateStr = val;
		var str ;
		var sDate=DateStr.replace(/(^\s+|\s+$)/g,'');//去两边空格; 
		  
		//如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为'' 
		//数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式 
		var s = sDate.replace(/[\d]{ 4,4 }[\-/]{1}[\d]{1,2}[\-/]{1}[\d]{1,2}/g,''); 
		if( s == '' ){//说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D 
			var t=new Date(sDate.replace(/\-/g,'/')); 
		    var ar=sDate.split(/[-/:]/); 
		    if( ar[0]!=t.getYear() || ar[1]!=t.getMonth()+1 || ar[2]!=t.getDate()){
		    	//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。'); 
		    	str = '错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD'; 
		    }else{
		    	str = true;
		    }
		}else{//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。'); 
			str =  '错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD'; 
		} 

		return str;
		
	}
	,DT : function(val){
		
		var str ;
		//console.log(val)
		var reg=/^(\d+)-(\d{ 1,2})-(\d{ 1,2})(\d{ 1,2}):(\d{1,2}):(\d{1,2})$/; 
		  var r=val.match(reg); 
		  if(r==null) return false; 
		  r[2]=r[2]-1; 
		  var d= new Date(r[1],r[2],r[3],r[4],r[5],r[6]);
		  str = true; 
		  if(d.getFullYear()!=r[1]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getMonth()!=r[2]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getDate()!=r[3]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getHours()!=r[4]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getMinutes()!=r[5]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getSeconds()!=r[6]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  
		  return str;
		
		
	}
	,T : function(val){
		//console.log(val)
		var str ;
		str = true;
		var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
		if (a == null) {
			str =  '错误的日期格式！格式为：hh:mm:ss'; 
		}
		if (a[1]>24 || a[3]>60 || a[4]>60)
		{
			str =  '错误的日期格式！格式为：hh:mm:ss'; 
		}
		
		return str;
		
		
	}
	,BY : function(val){
		//console.log(val)
		//二进制
		var str ;
		//javascript中正则表达式以斜杠“/” 开头和结尾
		var re = /^1[10]*$/;
		var objExp = new RegExp(re);
		   
		if (objExp.test(val)) {
			str = true;
		}else{
			str = "非二进制类型";
		}
		return str;
		
	}
	,A : function(val){
		
		//console.log(val)
		var str;
		var re = /^[A-Za-z]*$/;
		if (re.test(val))
		{
			str = true;
		}else{
			str = "只能包含英文字母" ;
		}
		return str;
	}
	,N : function(val){
		
		//console.log(val)
		var str ;
		var re = /^[0-9]*$/;
		if (re.test(val))
		{
			str = true;
		}else{
			str = "只能包含数字" ;
		}
		return str;
	}
	,AN : function(val){
		//console.log(val)
		var str;
		var re=/^[A-Za-z0-9]+$/;
        if(re.test(val)){
        	str = true;
		}else{
			str = "只能包含字母和数字" ;
		}
        

    	return str;
	}
	,D8 : function(val){
		//console.log(val)
		//| 日期有效性验证 
		//| 格式为：YYYY-MM-DD或YYYY/MM/DD  
		var DateStr = val;
		var str ;
		var sDate=DateStr.replace(/(^\s+|\s+$)/g,'');//去两边空格; 
		  
		//如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为'' 
		//数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式 
		var s = sDate.replace(/[\d]{ 4,4 }[\-/]{1}[\d]{1,2}[\-/]{1}[\d]{1,2}/g,''); 
		if( s == '' ){//说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D 
			var t=new Date(sDate.replace(/\-/g,'/')); 
		    var ar=sDate.split(/[-/:]/); 
		    if( ar[0]!=t.getYear() || ar[1]!=t.getMonth()+1 || ar[2]!=t.getDate()){
		    	//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。'); 
		    	str = '错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD'; 
		    }else{
		    	str = true;
		    }
		}else{//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。'); 
			str =  '错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD'; 
		} 

		return str;
	}
	,T6 : function(val){
		//console.log(val)
		var str ;
		var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
		if (a == null) {
			str =  '错误的日期格式！格式为：hh:mm:ss'; 
		}
		if (a[1]>24 || a[3]>60 || a[4]>60)
		{
			str =  '错误的日期格式！格式为：hh:mm:ss'; 
		}else{
			str = true;
		}
		return str;
	}
	,DT15 : function(val){
		
		var str ;
		//console.log(val)
		var reg=/^(\d+)-(\d{ 1,2})-(\d{ 1,2})(\d{ 1,2}):(\d{1,2}):(\d{1,2})$/; 
		  var r=val.match(reg); 
		  if(r==null) return false; 
		  r[2]=r[2]-1; 
		  var d= new Date(r[1],r[2],r[3],r[4],r[5],r[6]); 
		  if(d.getFullYear()!=r[1]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getMonth()!=r[2]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getDate()!=r[3]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getHours()!=r[4]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getMinutes()!=r[5]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  if(d.getSeconds()!=r[6]) str = '错误的日期格式！格式为：YYYY-MM-DD hh:mm:ss'; 
		  str = true; 
		  
		  return str;
		
	}
	,MAX : function(val , length){
		//console.log(val);
		var arr = length.split('-');
		var str;
		
		if(arr[1]){
			if ( val.length <  arr[1] && val.length > arr[0] )
			str = true ;
			else 
			str = '请输入'+ arr[0] + '到'+ arr[1] +'个字符';
		}else{
			if ( val.length <  arr[0] )
			str = true ;
			else 
			str = '最多输入'+ arr[0] + '个字符';
		}

		return str;
	}
}

