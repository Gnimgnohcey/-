(function() {
	var _jQuery = window.jQuery;
	var _$ = window.$;
	var jQuery = window.jQuery = window.$ = function(selector) {
		return new jQuery.fn.init(selector);
		/*  返回一个jq对象,构造器
			function People(...arr){
						this.name=arr[0];
						this.age=arr[1];
					}
					function New(f){
						return function(...arr){
							var obj={_proto_:f.prototype};
							f.apply(obj,arr);
							return obj;
						}
					}
					伪造new	
				*/
	};
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
		},
		length: 0,
		//  伪数组写法
		jQuery: "1.0",
		//  版本声明
		size: function() {
			return this.length;
		},
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
		//  选择元素所构造的新对象
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
		},
		//      获取元素的属性和修改元素的属性

	}

	jQuery.fn.init.prototype = jQuery.fn;
	jQuery.fn.el_init.prototype = jQuery.fn;
	//  将init的原型指向jq.fn以达到读取jq.fn属性的方法
	jQuery.extend = jQuery.fn.extend = function(obj) {
		for(var o in obj) {
			this[o] = obj[o];
		}
	}
	// 拓展对象 属性
	// 静态方法的拓展
	jQuery.extend({
		tirm: function(text) {
			return(text || "").replace(/^\s+|\s+$/g, "")
		},
		noConflict: function() {
			window.jQuery = _jQuery;
			window.$ = _$;
			return jQuery;
		},
		isArray: function(array) {
			if(array) {
				return array.constructor == Array;
				// 通过对对象构造器的判断,判断其是否是数组
			}
		},
		isFunction: function(fn) {
			if(fn) {
				return(typeof fn) == 'function';
				// 判断类型,了解是否是函数
			}
		},
		Clone: function(Father, Child) {
			for(var val in Father) {
				if((typeof Father[val]).toLowerCase() == "object") {
					Father[val].constructor == Array ? Child[val] = [] : Child[val] = {};
					// 判断拷贝的对象是否是数组,如果是数组形式的就拷贝到数组中
					this.Clone(Father[val], Child[val])
					// 递归深拷贝
				} else {
					Child[val] = Father[val];
				}
			}
		},
		createElement: function(nature) {
			var targetPro = {
				/*					 label:"",
				 					   id:"",
				 					  className:""
				                                           初步决定传这三个属性,后续可以再添加*/
			};
			this.Clone(nature, targetPro);
			// console.log(portype)
			if(targetPro.label) {
				var label = document.createElement(targetPro.label);
				label.id = targetPro.id || "";
				label.className = targetPro.className || "";
				return label;
			} else {
				return new Error("target label can’t null");
			}
		},
//		 创建一个标签对象,传入id class label
		inherit: function(Person, Child) {
			function F() {};
			F.prototype = Person.prototype;
			Child.prototype = new F();
			Child.prototype.constructor = Child;
		},
		//         函数与函数之间的继承
		ObjCreat: function(p) {
			var ins;
			function F() {};
			F.prototype = p;
			ins = new F();
			return ins;
		},
		relativeObj: {},
		//        对象与函数之间的继承，p为一个对象
		relative(target, v_form, r_name) {
			/*
			 target:你需要关联的标签对象，可以是id选择也可以是class，但要确认选中一个对象；
			 v_form：你需要关联的表单元素，指定那个表单与那个标签相关联；
			 r_name:关联命名，用于后续清除
			 * */
			//				创建一个用于储存_other的对象
			Object.defineProperty($.relativeObj, r_name, {
				configurable: true,
				set(data) {
					$(target).el("0").html(data);
				},
				get() {},

			});
			var that = $(v_form);
			//			将$(v_form)的指向存贮住
			$(v_form).act("keyup", function() {
				$.relativeObj[r_name] = that.val();
			});
		},
		//		       html和表单的互相关联
		clearRelative: function(r_name) {
			delete($.relativeObj[r_name])
		}
		//				根据对应的传入的名字删除响应的关联
	})

	jQuery.fn.extend({
		html: function(content = false) {
			if(content) {
				this[0].innerHTML = content;
				return this;
			} else {
				return this[0].innerHTML;
			}
		},
		val: function(substance) {
			if(!substance) {
				return this[0].value;
			} else {
				this[0].value = substance;
			}
		},
		each: function(fn) {
			for(var i = 0; i < this.length; i++) {
				fn(i, this[i])
				// 内部回调传值,将对应的i与对应的对象传到函数之中
				// 遍历对象
			}
		},
		getClassName: function() {
			var classStr = "";
			if(this.length == 1) {
				return this[0].className;
				// 直接返回当前对象第一个对象的className 主要用于el选取的对象
			} else {
				for(var i = 0; i < this.length; i++) {
					classStr += this[i].className + ",";
				}
				return classStr;
				// 返回这个对象的所有className
			}
		},
		getId: function() {
			if(this[0].id) {
				return this[0].id;
			} else {
				return "id is undefined";
			}
		},
		//	获取对应的Id
		addClassName: function(targetName) {
			if(this.length == 1) {
				if(this[0].className) {
					this[0].className = this.getClassName() + " " + targetName;
				} else {
					this[0].className = targetName;
				}
				// 用字符串拼接的方法将className添加到目标对象中
				return this;
			} else {
				return new Error("addClass's length is must =1")
			}
		},
		//				为对象添加className
		addId: function(targetName) {
			if(this.length == 1) {
				if(this[0].id) {
					return new Error("obj's id only one");
					// 如果对象的id已经存在,则返回一个error
				} else {
					this[0].id = targetName;
				}
				// 用字符串拼接的方法将id添加到目标对象中
				return this;
			} else {
				return new Error("addClass's length is must =1");
				// 抛出异常,添加class的时候,所添加的目标对象必须只能为一个，建议用el选中
			}
		},
		//               为目标对象添加id
		getParent: function() {
			return new this.ParentNode(this[0].parentNode);
			// 将父节点作为参数传到ParentNode重新构建一个新对象,该对象存放着元素的父亲节点
		},
		//					获取父节点
		ParentNode: function(ele) {
			length = 0;
			this.size = function() {
				return this.length
			};
			Array.prototype.push.call(this, ele);
			// 添加数组形式的对象，将父节点传入
			return this;
		},
		//				构造父节点对象
		Silibing: function() {
			return new this.Brother(this[0], this[0].parentNode.children);
			// 将本身和同级别的所有元素传入
		},
		//				 获得同级元素
		Brother: function(self, other) {
			length = 0;
			for(var i = 0; i < other.length; i++) {
				if(other[i] != self) {
					// 如果两者不相等,则添加到新的对象之中
					Array.prototype.push.call(this, other[i]);
				}
			}
			return this;
		},
		//				 构造兄弟节点对象
		next:function(){
			return new this.Nexted(this[0], this[0].parentNode.children);
		},
		Nexted:function(self,other){
			length = 0;
			for(var i = 0; i < other.length; i++) {
				if(other[i] == self) {
					// 如果两者不相等,则添加到新的对象之中
					if(i==other.length-1){return new Error("目标对象没有下一个元素")};
					Array.prototype.push.call(this, other[i+1]);
				}
			}
			return this;
		},
		prep:function(){
			return new this.Preped(this[0], this[0].parentNode.children);
		},
		Preped:function(self,other){
			length = 0;
			for(var i = 0; i < other.length; i++) {
				if(other[i] == self) {
					// 如果两者不相等,则添加到新的对象之中
					 console.log(i)
					if(i==0){return new Error("目标对象没有上一个元素")};
					Array.prototype.push.call(this, other[i-1]);
				}
			}
			return this;
		},
		
		appendChild: function(obj) {
			this[0].appendChild(obj)
		},
		//				 添子节点
		act: function(action, fn) {
			/*传两个参数,click mouseover等等与函数
			        默认选取this对象第一个参数的click;*/
			this[0][`on${action}`] = fn;
			return this;
		}
		//添加动作事件

	})

	jQuery.fn.ParentNode.prototype = jQuery.fn;
	jQuery.fn.Brother.prototype = jQuery.fn;
	jQuery.fn.Nexted.prototype = jQuery.fn;
  jQuery.fn.Preped.prototype = jQuery.fn;
	//	  jQuery.ajax=function(json){
	//       var option={}

	//		Clone(json,option);
	//      // 将传进来的对象拷贝一次作为ajax使用的数据
	//		// option.data.account="1234123";
	//
	//.	  
	//	  
	// 		  var jsons={
	// 			  method:json.method,
	// 			  url:json.url,
	// 			  async:json.async,
	// 			  data:json.data||"",
	// 			  success:json.success||false,
	// 			  error:json.error||false,
	// 			  doajax:function(){
	// 				   var that=this;
	//     // 记录该对象的this到that中，这里的this指向的是jsons
	// 				   var sendData=(function(data){
	// 					       var oStr="";
	// 					   　　for(let val in data){
	// 						　　　　oStr +=val+"="+data[val]+"&";
	// 						　　};
	// 						　　return oStr;
	// 				    })(json.data);
	//    // 控制传入的值为json对象从json对象中拿到需要使用的值
	// 				   var xhr=new XMLHttpRequest;
	// 				   xhr.open(this.method, this.url,this.async);
	// 				   
	// 				   if(this.method.toLowerCase()=="post"){
	// 						xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
	// 					 }
	// 					 xhr.send(sendData);
	// 				   xhr.onreadystatechange=function(){
	//     // 此处的this指向xhr对象
	// 						  if(xhr.readyState==4){
	// 							  if(xhr.status>=200&&xhr.status<=300){
	// 								  if(that.success){that.success(xhr.responseText)}else{return true}
	// 							  }else{
	// 								  if(this.error){this.error()}else{return xhr.status};
	// 							  }
	// 						 }
	// 					  } 
	// 				  }
	// 			  }
	// 			  jsons.doajax();
	//		
	//	  }

})();