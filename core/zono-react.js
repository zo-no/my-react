/**
 * @Date        2024/03/24 09:44:42
 * @Author      zono
 * @Description V2-加入事件循环机制
 * */
let nextWorkOFUnit = null;

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

function workLoop(deadline) {
  let shouldYield = false; //是否停止
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

//寻找下一个执行单元
function performWorkOFUnit(fiber) {
  // 1.创建DOM
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  // 2.处理porps
  Object.keys(el.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = el.props[prop];
    }
  });

  // 3.转换链表
  const children = work.props.children;
  children.forEach((child, index) => {
    // 为了避免修改虚拟DOM（虚拟DOM只能靠组件修改），使用fiber
    const newWork = {
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      //  第一个节点
      work.child = newWork;
    } else {
      prevChild.sibling = newWork;
    }
    prevChild = newWork;
  });

  // 4.返回下一个执行单元
  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  return work.parent?.sibling;
}
