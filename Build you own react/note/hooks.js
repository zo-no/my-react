// 保存当前的 fiber
let wipFiber = null
// 保存当前执行 hook 的索引，区分每次执行是哪个 hook 
let hookIndex = null


function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}


function useState(initial) {
  //维护一个状态
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    // 存在旧值，则直接取，否则取传入的初始值（所以除了第一次外都是旧值）
    state: oldHook ? oldHook.state : initial,
    // 存放 每次更新 状态的队列
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  //将所有值加入进行不可变更新
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    // 设置为下一个 工作单元，这样就可以开启一个新的 渲染
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

