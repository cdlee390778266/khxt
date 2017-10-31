function ajaxJson(url, param, callback, err_callback)
{
	var timestamp = (new Date()).valueOf();
	url = url + "?ajax=1&t=" + timestamp;
	$.ajax({
			async : true,
			data : param,
			type : "post",
			dataType : 'json',
			url : url,
			cache : false,
			success : function(data)
			{
				if (data.result == "error") {
					if (typeof(err_callback) == "undefined") {
						msgShow("操作失败：" + data.message);
					} else {
						err_callback(data.message);
					}
				} else {
					if (typeof(callback) == "undefined") {
						msgShow("操作成功");
					} else {
						if(typeof(data.data) != "undefined")
							callback(data.data);
						else 
							callback(data);
					}
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown)
			{
				var text = XMLHttpRequest.responseText;
				if(text=="session"){
					confirmDialog("会话失效，确认要重新登陆 吗",function(){
						top.location.href = "../../login/init.do";
					});
				}else if (!isEmpty(text)){
					msgShow(text);
				}else{
					//alert("系统调用出现错误，请联系系统管理员进行处理，谢谢");
				}
			}
		});
}

//前置分页采用
function renderPageInfo(page,pageNum,dataList){
	//计算总页数
	var count = dataList.length;
	renderPageHTML(page,pageNum,count);
	//取得分页数据
	var start = (page - 1) * pageNum;
	var end = page * pageNum;
	return dataList.slice(start,end);
}
//后台分页采用
function renderPageHTML(page,pageNum,count){
	//计算总页数
	var totalPage = 0;
	if(count%pageNum==0){
		totalPage = Math.floor(count/pageNum);
	} else {
		totalPage = Math.floor(count/pageNum) + 1;
	}
	var pageInfo='';
	var prev = '';
	var next = '';
	if(page==1){
		pageInfo += '<li class="disabled"><a class="button_page_disabled first"><span>首页</span></a></li>';
		prev = '<li class="disabled"><a class="button_page_disabled"><span>«</span></a></li>';
	}else{
		var prePage = page - 1;
		if(prePage<=0)
			prePage = 1;
		pageInfo += '<li><a href="javascript:renderPage(1)" class="button_page first">首页</a></li>';
		prev = '<li><a href="javascript:renderPage('+ prePage +')" class="button_page">«</a></a>';
	}
	var center = 5;
	var pageStart = 1;
	if (page > center) {
		if (totalPage - page < center) {
			pageStart = totalPage - 2 * center + 1;
			if (pageStart < 1) {
				pageStart = 1;
			}
		} else {
			pageStart = page - center;
		}
	} else {
		pageStart = 1;
	}
	// 分页终点
	var pageEnd = pageStart + 2 * center - 1;
	if (pageEnd > totalPage) {
		pageEnd = totalPage;
	}
	// 分页数
	pageInfo += prev;
	for (var i = pageStart; i <= pageEnd; i++) {
		if(i == page){
			pageInfo += '<li class="active"><a href="javascript:renderPage('+i+')"' + 'class="button_page_click"><span>'+i+'</span></a></li>';
		} else {
			pageInfo += '<li><a href="javascript:renderPage('+i+')"' + 'class="button_page">'+i+'</a></li>';
		}
	}
	
	if(page==totalPage || totalPage ==0){
		pageInfo += '<li class="disabled"><a class="button_page_disabled"><span>»</span></a></li>';
		pageInfo += '<li class="disabled"><a class="button_page_disabled last"><span>尾页</span></a></li>';
	}else{
		var nextPage = page + 1;
		if(nextPage>totalPage)
			nextPage = totalPage;
		pageInfo += '<li><a href="javascript:renderPage('+nextPage+')" class="button_page">»</a></li>';
		pageInfo += '<li><a href="javascript:renderPage('+totalPage+')" class="button_page last">尾页</a></li>';
	}
	//pageInfo = '<div class="button_count">共计'+count+'条</div>' + pageInfo;
	$("#pager").html(pageInfo);
}
