/**
* @description 转化为真实dom
* @param {type} element——更新的内容
* @param {*} container -- 原始内容  
* @returns   
* @see document.createTextNode(""):https://www.bookstack.cn/read/javascript-tutorial/docs-dom-document.md#67afmd
* */
function render(element, container) {
  //若为文本类型就创建文本，不然就创建DOM元素
  const dom = element.type == "TEXT_ELEMENT" ?
    document.createTextNode("") : document.createElement(element.type)
  // 排除 特殊属性 "children",若为children就false
  const isProperty = key => key !== "children"

  // 将元素属性 一一 写入 dom 节点上
  Object.keys(element.props)
    .filter(isProperty)//若为children就跳过
    .forEach(name => {
      dom[name] = element.props[name]
    })

  // 遍历递归 将 子元素 一个一个 都 附到 真实的 dom 节点上
  element.props.children.forEach(child =>
    render(child, dom)
  )

  // 最后挂载到 指定的 dom 节点容器上
  container.appendChild(dom)
}

