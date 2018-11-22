function add_msg(json){
	var str = '';
	$.each(json.list,function(){
	
		str += msg_style(this);
		
	})
	
	var ul = $('#talk-pt-ul');
	ul.append(str);

	ul.parents('.ul-box').scrollTop(ul.height());
	
}
$(".talk-input").keydown(function(){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode==13){ 
		talkBtn();
	}     
});
function msg_style(msg){
	if(!msg) return false;
	var cls = msg.mfuserid == msg.mtouserid ? 'my-talk' : '';
	var name = msg.mfuserid == msg.mtouserid ? '我' : msg.funame;
	var time = msg.mtime;
	var str = '';
	str += '<li class="'+cls+'" style="overflow:hidden;margin-bottom:5px;">';
	
	str += '<div class="talk-user-img-box">';
	str += '<img src="'+ImgUrl+msg.fuheadportrait+'">';
	str += '</div>';
	
	str += '<div class="talk-user-info-box">';
	
	str += '<div class="talk-user-header">';
	str += '<span>'+name+'</span>';

	str += '</div>';
	
	str += '<div class="talk-user-text">';
	
	if( msg.mtype == 1 ){
		mcontent =eval('(' + msg.mcontent + ')'); 
		
		str += '<a onclick=shareCaseDetail("'+mcontent.url+'") class="ul-list-share-box">';
		str += '<p class="title">';
		str += mcontent.name+'病历的分享';
		str += '</p>';
		str += '<p class="content">'+mcontent.title+'</p>';
		str += '</a>';
	
	}else if( msg.mtype == 3 ){
		mcontent =eval('(' + msg.mcontent + ')'); 
		
		str += '<a onclick=shareTimeDetail("'+mcontent.url+'") class="ul-list-share-box">';
		str += '<p class="title">';
		str += mcontent.name;
		str += '</p>';
		str += '<p class="content">'+mcontent.title+'</p>';
		str += '</a>';
	
	}else{
		str += '<p>';
		str += msg.mcontent;
		str += '</p>';
	}
	
	str += '</div>';

	str += '<div class="talk-user-time">';
	str += '<i>'+time+'</i>';
	str += '</div>';
	
	str += '</div>';
	
	str += '</li>';
	
	return str;
	
}
function talk_ul_reload(){
	var ul = $('#talk-pt-ul');
	ul.html('');
	get_msg();
	ul.parents('.ul-box').scrollTop(ul.height());
	
}


$('.input-btn-box').on('click','.talk-share-btn',function(){
	$this= $(this);
	$list = $this.find('.talk-more-list');
	if($list.hasClass('hide')){
		$list.removeClass('hide');
	}else{
		$list.addClass('hide');
	}
})