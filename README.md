# 文件CMing.js介绍
用于前端各种学习
这个文件是对JS库的jQuery的仿写，里面大致还原的jQuery的的封装过程
# jQuery的初步分析
.jQuery的使用方式主要是以$符起手的一个函数，而且这个函数的隐藏在局部之中，非全局暴露的一个字符，所以这个时候就需要用到js中的匿名函数将其隐藏起来
在通过window.的赋值方式将值传递到window之中，来达到实现的$()调用过程。其次$()选择器选中之后返回出来的是一个jQuery的对象，这个时候就可以利用new
来达到返回对象的目的，具体代码如下。
 

  (function(){
  
	var jQuery = window.jQuery = window.$ = function(selector) {
		
		return new jQuery.fn.init(selector);
	})();
  		
		
		/* 
          function New(f){
				return function(...arr){
				var obj={_proto_:f.prototype};
				f.apply(obj,arr);
				return obj;
						}
					}
					伪造new的内部实现
				*/
