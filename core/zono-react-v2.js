

/**
 * @description 转换为虚拟DOM
 * */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

/**
 * @description 转换文字dom
 * */
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * @description 出现修改时第一个调用的函数，对比workloop，workloop是一直再循环
 * */
function render(el, container) {
  nextUnitOfWork = {
    dom: container, //已经有DOM
    props: {
      children: [el],
    },
  }; //最顶部节点
}

let nextUnitOfWork = null; //下一个任务
function workLoop(deadline) {
  let shouldYield = false; //是否停止
  while (nextUnitOfWork && !shouldYield) {
    // 执行完下一个任务后会找下下个任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

//寻找下一个执行单元
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    // 1.创建DOM
    const dom = (fiber.dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type));
    fiber.parent.dom.append(dom); //添加到父级容器
    // 2.处理porps
    Object.keys(fiber.props).forEach((prop) => {
      if (prop !== "children") dom[prop] = fiber.props[prop];
    });
  }

  // 3.转换链表
  const children = fiber.props.children;

  let prevChild = null; //上一个孩子节点，用于绑定sibling
  //连接fiber间的关系
  children.forEach((child, index) => {
    // 为了避免修改虚拟DOM（虚拟DOM只能靠组件修改），使用fiber
    let newWork = {
      type: child.type,
      props: child.props,
      children: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) fiber.children = newWork; //  第一个节点
    else prevChild.sibling = newWork; //连接兄弟
    prevChild = newWork; //记录上一个孩子
  });

  // 4.返回下一个执行单元
  // 真实DOM的渲染路径
  
  if (fiber.children) return fiber.children; // 孩子（前）
  if (fiber.sibling) return fiber.sibling; // 兄弟（后）
  return fiber.parent?.sibling; // 叔叔（中的后）
}

export { createElement, render };
const ZonoReact = {
  createElement,
  render,
};
export default ZonoReact;
