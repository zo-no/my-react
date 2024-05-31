/**
 * @Date        2024/03/13 19:30:51
 * @Author      zono
 * @Description 
 * */
//临时
let deletions;//需要删除的DOM
function createDom(){}




let nextUnitOfWork = null; //记录下一个执行单元
let wipRoot; //维护一个标识是否加载到差不多的tag
let currentRoot = null; //保存当前的fiber用于下一次调用workLoop更新或删除

/**
 * @description 提交代码到正式渲染
 * @param {type}
 * @returns
 * */
function commitRoot() {
  // 移除 刚才收集的 旧节点
  deletions.forEach(commitWork);
  // commit 当前 wipRoot 的 child 元素
  commitWork(wipRoot.child); //提交代码
  // commit 阶段完成后，保存当前 fiber 树
  currentRoot = wipRoot; // 改变当前 root 指向
  wipRoot = null;
}

/**
 * @description 上传操作
 * */
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  //新增
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
    //更新
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 更新 dom 的 属性(新增新属性和移除旧属性) 及 事件的添加和移除处理
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    //删除
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }

  // 递归上传
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

/**
 * @description 修改代码后执行render函数
 * render函数只执行wipRoot的初始化，相当于render的是虚拟dom
 * */
function render(element, container) {
  //设置下一个要执行的单元
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // 和上一次的 commit 阶段的 旧 fiber 树建立连接
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
}

function workLoop(deadline) {
  let shouldYield = false; // 是否要暂停
  //有下一个任务，且不暂停
  while (nextUnitOfWork && !shouldYield) {
    // 执行 一个工作单元 并返回 下一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 判断空闲时间是否足够
    shouldYield = deadline.timeRemaining() < 1;
  }

  //加入提交逻辑
  // 所有工作单元都执行完后，我们一并 进行 提交 操作，commitRoot 里进行所有元素 往 dom 树 上添加的动作
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
  //又开始等待被调用
  requestIdleCallback(workLoop);//浏览器空闲时调用
}

// 等待被调用
requestIdleCallback(workLoop);

//使用fiber来处理下一个单元
/**
 * @description 为节点设置关系，并返回下一个单元
 * 同时维持两个树，一个dom树，一个fiber树
 * @param {type}
 * @returns
 * */
function performUnitOfWork(fiber) {
  // -----------------------------------------------------------------------
  // 创建dom的过程，每次只渲染一个fiber
  // 创建一个 dom 元素，挂载到 fiber 的 dom 属性
  if (!fiber.dom) fiber.dom = createDom(fiber); //MY：可能是render
  // 添加 dom 到 父元素上
  if (fiber.parent) fiber.parent.dom.appendChild(fiber.dom);

  // -----------------------------------------------------------------------
  // 为元素的子元素（不管孙子）都创建一个 fiber 结构
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements); //进行调和

  let index = 0;
  // 保存 上一个 sibling fiber 结构
  let prevSibling = null;

  //建立fiber关系，为每个节点都设置上对应的关系
  while (index < elements.length) {
    //取出每一个孩子
    const element = elements[index];
    //放入准备放入下一个单元
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    // 第一个子元素 作为 child，其余的 子元素 作为 sibling
    if (index === 0) fiber.child = newFiber;
    else prevSibling.sibling = newFiber;

    prevSibling = newFiber;
    index++;
  }

  // -----------------------------------------------------------------------
  //返回下一个单元逻辑，先找孩子后找兄弟，和我们编写html的思路一样。
  // step1 如果 有 child fiber ，则返回 child
  if (fiber.child) return fiber.child; //先找孩子

  let nextFiber = fiber;
  //后找兄弟
  while (nextFiber) {
    // step2 如果 有 sibling fiber ，则返回 sibling
    if (nextFiber.sibling) return nextFiber.sibling;

    // step3 ，否则 返回 他的 parent fiber
    nextFiber = nextFiber.parent;
  }
}

/**
 * @description 调和函数
 * @param {type}
 * @returns
 * */
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  //若有新元素未被加入，或旧元素未被比较
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]; //获取当前元素
    let newFiber = null;

    //判断是否相同，从而决定是否更新
    const sameType = oldFiber && element && element.type === oldFiber.type;
    // 类型相同，更新 fiber 属性
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    // 类型不同，但是 新 fiber 元素存在，则进行 新增(新增新的 fiber)
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null, //新元素说明还没有dom
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    // 类型不同，但是 旧 fiber 树存在，则进行 移除 (先收集起来，在 commit 阶段一并移除)
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    // -----------------------------------------------------------------------
    // 为下一个循环做准备
    // 下个循环 对 兄弟 fiber 进行比较 (和 下面的  i++ 一个道理)
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    // 如果是 第一个 子元素，则把 新的 fiber 挂到 wipFiber 的  child 属性上
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      // 余下的 子元素 ，挂到 上一个子元素的 sibling 属性上
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}



// 事件属性
const isEvent = (key) => key.startsWith("on");
// 除 事件属性 和 特殊属性 children 外的属性
const isProperty = (key) => key !== "children" && !isEvent(key);
// 是否为新增属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// 是否要移除属性
const isGone = (prev, next) => (key) => !(key in next);

function updateDom(dom, prevProps, nextProps) {
  // 移除旧事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 添加或更新新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 添加监听事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
