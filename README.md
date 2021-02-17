# 文件CMing.js介绍
用于前端各种学习
这个文件是对JS库的jQuery的仿写，里面主要模拟了jQuery的的封装过程
# jQuery的初步分析
.jQuery的使用方式主要是以$符起手的一个函数，而且这个函数的隐藏在局部之中，非全局暴露的一个字符，所以这个时候就需要用到js中的匿名函数将其隐藏起来
在通过window.的赋值方式将值传递到window之中，来达到实现的$()调用过程。其次$()选择器选中之后返回出来的是一个jQuery的对象，这个时候就可以利用new
来达到返回对象的目的，具体代码如下。
  (function(){
  
	var jQuery = window.jQuery = window.$ = function(selector) {
             将匿名函数内部定义的$赋值window.$
		return new jQuery.fn.init(selector);
	      利用new来构造一个对象
	})();
  		
		
	/* function New(f){
	               var obj={_proto_:f.prototype};
		       利用闭包将obj对象存储起来
			return function(...arr){
			f.apply(obj,arr);
		       修改函数内部指向
			return obj;
		         }
		   }
	   伪造new的内部实现
		*/
# jQuery添加实例方法
 jQuery.fn = jQuery.prototype = {}利用定义的fn与jQuery的原型联系起来，在jQuery.fn中添加方法的时候jQuery中也就得到了这个方法。
	  
	  jQuery.fn = jQuery.prototype = {
		init: function(selector) {
			var first_selector = selector.split("")[0];
			switch(first_selector) {
				case '#':
					var selector = selector.replace("#", "");
					//  简单处理#
					var ele = document.getElementById(selector);
					Array.prototype.push.call(this, document.getElementById(selector));
					//  性能最好的添加数组形式对象Array.prototype.push.apply(target_obj,array)
					break;
				case '.':
					var selector = selector.replace(".", "");
					//  将传进来的.class处理
					var ele = document.getElementsByClassName(selector);
					Array.prototype.push.apply(this, ele);
					break;
				default:
					Array.prototype.push.apply(this, document.getElementsByTagName(selector));
					break;
			}
			return this;
			//  将自己返回出去
		}，
			css: function(attr, target = false) {
			if(this.length == 1 && !target) {
				return this[0].currentStyle ? obj.currentStyle[attr] : getComputedStyle(this[0])[attr];
				/* 如果前面使用的对象的length只有一个
				      传进来的参数只有一个属性
				      那么默认返回对象第一个参数的对应的属性的值*/
			} else {
				for(let i = 0; i < this.length; i++) {
					this[i].style[attr] = target;
				}
				/*      改变对应对象对应属性的css属性,且不返回任何参数,链式截断
				          return this;*/
			}
		}
	  }
这里就是在实例方法中添加了init 方法，而init作为选择器的入口，将面$()传入的对象return new jQuery.fn.init(selector);的方式重新构建出一个新的类似数组的一个对象，达到生成jquery单独对象的目的，但这个生成对象init{}本身内部是只有选择器选中的html对象，没有实例方法的（例如fn中的css方法），所以想要继续调用jQuery.fn中的其他实例方法的时候就需要用到原生js的原型链这个概念，将

          jQuery.fn.init.prototype = jQuery.fn;
将init 的原型指向jQuery.fn这样本身没有方法就可以向他的父级寻找，这样就大概模拟出来jQuery的实现环境，同是在fn中添加你所需要的实例方法便可以实现调用的目的，在init函数中还需要return this，这个就是jQuery中的链式调用的核心实现 $("div").eq(0).css()......这个的实现就是基于return this，函数使用完之后将自身返回出去来达到继续调用的目的。
# 构建类似数组对象的方法
数组么，有的属性无非就是length啊，通过下表拿数据之类的，想要构建出一个类似数组的对象，第一种方法就是给对象手动添加length属性
	
	var obj={
		length：0，
		}
这样就达到了obj.length获得长度，其次就是obj[下标]的方式

		 for(var i=0;i<arr.length;i++){
		    obj[i]=arr[i]
		 };
		 obj.length=arr.length
这种就是简单的模拟了一个生成类似数组的对象，jquery中用的方法的话是另一种
       
       Array.prototype.push.apply(this,ele);
这种插入方法有点类似于继承的实现，而且性能是最好的一种方法

# 选中某个对象eq的实现
我没有用eq来表达，而是用的el（个人原因），这个的实现也是个人想法，可能jQuery不是这种方法。
	
	el: function(num) {
			//          alert(this[num])
			//          拿到对应的jq对象传进去重新构造一个新的对象,对象的第一个参数为对应选中的
			return new jQuery.fn.el_init(this[num]);
		},
		el_init: function(obj) {
			this.size = function() {
				return this.length
			};
			Array.prototype.push.call(this, obj);
			return this;
		},
和上面新建init有点类似，就是在init函数构建完之后，选中对象的具体哪个值然后传入新的构造函数之中，重新构造出一个新的对象 Array.prototype.push.apply(this,选中的对象);构建出的el_init对象存储的值就是选中的对象


# 文件CMINVue.js介绍

实现了对vue框架模拟的数据双向绑定的功能,仅供学习使用
