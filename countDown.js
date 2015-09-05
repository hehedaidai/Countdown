/**
* @Name：  易维护、可扩展定制可复用的倒计时插件 countDown.js
* @Author：虾兵  @Blog：http://ddbing.com/
* @param   参数暂支持三个，cid,data,nowDate。
* @param   cid: 倒计时模块id,以区分多个倒计时模块的情况。
* @param   nowDate: 开始时间，不设置则默认为系统当前时间。
* @param   data: 初始化后台传过来的活动结束时间数据，JSON格式如：
	[
		{ "id":"1",time:"2015/09/05 10:27:30" },
		{ "id":"2",time:"2015/09/09 09:08:40" },
		{ "id":"3",time:"2015/06/03 12:30:10" }
	];
*/
;(function ($, window, document, undefined) {

	var countDown = function(cid,data,nowDate){
		this.cid = cid;
		this.data = data;
		this.nowDate = nowDate;
	};

	countDown.prototype = {
		constructor: countDown,
		main: function(){
			var that = this, data, newData = [];
			this.init();
			data = that.backData;
			that.initTemp(data);
			that._init ? that._init = false:'';
			$.each(data,function(i,val){
				if (val.ms) {
					newData.push({id:val.id,ms:val.ms});
				};
			});
			that.backData = newData;
			setTimeout(function(){
				that.handle();
			},1000);
		},
		
		//初始化处理
		init: function(){
			var that = this, data = that.data, backData=[], ms = 0, msEnd, msNow, _init = that._init = true;
			msNow = ( new Date(that.nowDate) ).getTime() || ( new Date() ).getTime();
			$.each(data,function(i,val){
				msEnd =( new Date(val.time) ).getTime();
				ms = msEnd - msNow;
				if ( ms < 1000 ) {
					that.msHandle(ms,val.id,'-1');
				}else{
					that.msHandle(ms,val.id);
				};
				
			});
		},

		//初始转化时间格式
		msHandle: function(ms,id,flag){
			var D, H, M, S, objTime = {}, backData = this.backData ||  [] ;
		   if (flag < 0) {
		   		objTime = {
				   id: id,
				   no: flag
				};
		   		backData.push(objTime);
		   }else{
				S = Math.floor( ms/1000 );
				M = Math.floor( S/60 );
				H = Math.floor( M/60 );
				D = Math.floor( H/24 );
				S = S % 60;
				M = M % 60;
				H = H % 24;
				objTime = {
					id:id,
					D:D,
					H:H,
					M:M,
					S:S,
					ms:ms
				};
				objTime = this.normTime(objTime);
				backData.push(objTime);
			};
			this.backData = backData;
			return this;
		},

		//倒计时定时器
		handle: function(){
			var that = this, timer, data = that.backData, cid = this.cid;
		    $.each(data,function(i,val){
				var ms = val.ms;
				if (ms < 1000) {
					$('#'+cid).find('#count'+val.id).html('<span class="title">距离活动结束还剩：</span><span class="end">活动已结束</span>');
				}else{
					ms -= 1000;
					that.msChange(ms, val.id);
					data[i].ms = ms;
				};
			});
			!!timer && clearTimeout(timer);
			timer = setTimeout(function(){
				that.handle();
			},1000);
		},

		//ms处理
		msChange: function(ms,id){
			var D, H, M, S, objTime = {},cid = this.cid, data = this.backData;
			S = Math.floor( ms/1000 );
			M = Math.floor( S/60 );
			H = Math.floor( M/60 );
			D = Math.floor( H/24 );
			S = S % 60;
			M = M % 60;
			H = H % 24;
			objTime = {
				id:id,
				D:D,
				H:H,
				M:M,
				S:S
			};
			objTime = this.normTime(objTime);
			$('#'+cid).find('#count'+id).children('.d').children('i').text( objTime.D );
			$('#'+cid).find('#count'+id).children('.h').children('i').text( objTime.H );
			$('#'+cid).find('#count'+id).children('.m').children('i').text( objTime.M );
			$('#'+cid).find('#count'+id).children('.s').children('i').text( objTime.S );
		},

		//统一处理时刻格式
		normTime: function(objTime){
			for (var i in objTime) {
				if (objTime.hasOwnProperty(i) && i != 'id') {
					objTime[i] = objTime[i] < 10  ? '0' + objTime[i] : objTime[i];
				};
			};
			return objTime;
		},

		//初始化模板
		initTemp: function(data){
			var temp = '<ul>';
			$.each(data,function(i,val){
				if (val.no < 0) {
					temp +='<li id="count'+ val.id +'"><span class="title">距离活动结束还剩：</span><span class="end">活动已结束</span></li>';
				}else{
					temp +='<li id="count'+ val.id +'"><span class="title">距离活动结束还剩：</span><span class="d"><i>'+ val.D +'</i><em>天</em></span>'
				           +'<span class="h"><i>'+ val.H +'</i><em>时</em></span><span class="m"><i>'+ val.M +'</i><em>分</em></span>'
				           +'<span class="s"><i>'+ val.S +'</i><em>秒</em></span>'
				       +'</li>';
				};
			});
			temp +='</ul>';
			$('#'+this.cid).append(temp);
		}
	};
	window.countDown = countDown;
}(jQuery, window, document));