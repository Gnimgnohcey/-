class CM{
    constructor(targetObject){
       const {data,methods,beforeCreated,created,beforeMounted,mounted,updated,destroyed,watch}=targetObject
       this._$data=data
       this.$methods=methods
       this.$beforeCreated=beforeCreated
       this.$created=created
       this.$beforeMounted=beforeMounted
       this.$mounted=mounted
       this.$updated=updated
       this.$destroyed=destroyed
    //    this.$virNodeTree=[]
       this.$watch=watch
       this.$domMap=new Map()
    }
    initDom(domValue){
       this.$virNodeTree=this.createVNode(document.querySelector(domValue))
       this.$data=this.beforeCreated()
       this.created()
       this.beforeMounted()
       this.$data.b=1
    //    setInterval(()=>{
    //     this.$data.b++
    //     this.$data.a+=2
    //    },1000)
//         测试代码
       //created后才将data初始化
    }
    beforeCreated(){
        console.log('beforeCreated', this.$data)
        if(this.$beforeCreated!=undefined){
            this.$beforeCreated()
        }
        const _this=this
        //运行钩子函数
        return new Proxy(this._$data(),{
            get(target,key){
              return Reflect.get(target,key)
            },
            set(target,key,newValue){
              console.log('this', _this)
              let result
              if(_this.$domMap.get(`{{${key}}}`)){
                _this.$domMap.get(`{{${key}}}`).forEach(element=>{
                    result=Reflect.set(target,key,newValue)
                    _this.updataDom(element)
                })
              }
            //   dom变化即使更新
              return result
            }
        })
    }
    created(){
        if(this.$created!=undefined){
            this.$created()
        }
        console.log('created', this.$data)
    }
    beforeMounted(){
        this.patchValue(this.$virNodeTree)
    }
    createVNode(truthDom){
        const hierachyNode=[]
        Array.prototype.slice.call(truthDom.childNodes).forEach(element => {
            hierachyNode.push(this.setVNode(element))
        });
        return hierachyNode
        // js获取的子节点是一个伪数组，需要转换为数组才可以使用foreach
    }
    setVNode(selectDom){
        const nodeType=selectDom.nodeType
        const nodeName=selectDom.nodeName
        const nodeValue=selectDom.nodeValue
        let reBuildVir=new VNode(nodeName,Symbol(),nodeValue,selectDom)
        if(selectDom.childNodes.length){
           reBuildVir.pushChildren(this.createVNode(selectDom)) 
        }
        return reBuildVir
    }
    //创建虚拟dom
    patchValue(currentNode){
        currentNode.forEach(element=>{
           let handleValue=element.value
           let newValue=handleValue
           const regex=/\{\{([\w]*|[\w]*\(\))\}\}/g
           if(handleValue!=null&&handleValue.match(regex)){
             handleValue.match(regex).forEach(textValue=>{
                 try{
                    let childMap
                    if(this.$domMap.get(textValue)){
                        childMap=this.$domMap.get(textValue)
                    }else{
                        childMap=new Set()
                    }
                    childMap.add(element)
                    this.$domMap.set(textValue,childMap)
                    // 将文本中出现的{{}}与dom节点绑定存放在map中做一张记录表
                    newValue=this.complieValue(newValue,textValue)
                 }catch(e){
                     console.log('find a error',e)
                 }
              })
              element.el.textContent=newValue
            }
            // element.el.textContent=e         
           if(element.children.length!=0){
               this.patchValue(element.children)
           }
       })
       //要用递归,所以这里只能通过传参的方式,不能直接调用this.$nodeTreeList
    }
    updataDom(vnode){
        let handleValue=vnode.value
        let newValue=handleValue
        const regex=/\{\{([\w]*|[\w]*\(\))\}\}/g
        if(handleValue.match(regex)){
          handleValue.match(regex).forEach(textValue=>{
              try{
                 newValue=this.complieValue(newValue,textValue)
              }catch(e){
                  console.log('find a error',e)
              }
           })
           vnode.el.textContent=newValue
         }
    }
    //这个函数只做映射dom变化及时变化,只对单个vnode做处理
    complieValue(handleValue,regexResult){
        // const recoRegex=/[\w]{1,}\(\)|[\w]{1,}/g
        const recoRegex=/[\w]{1,}/g
        let currentKey=regexResult.match(recoRegex)
        if(this.$data[currentKey]!=undefined){
            return handleValue.replace(regexResult,this.$data[currentKey])
        }else if(this.$methods[currentKey]!=undefined){
            return handleValue.replace(regexResult,this.$methods[currentKey]())
        }else{
            return new Error("can not find key in Method or Data")
        }
    }
}
class VNode{
    constructor(tag,key,value,el){
        this.tag=tag
        this.key=key
        this.value=value
        this.el=el
        el.attributes==undefined?this.domAttributes=[]:this.domAttributes=el.attributes
        this.children=[]
    }
    pushChildren(virNodeArray){
        this.children=virNodeArray
        //因为外部直接传入整体，这边采用赋值的手段，不再用push
    }
}
function createCM(targetObject){
    return new CM(targetObject)
}
