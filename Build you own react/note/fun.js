function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  // 区分 函数式组件
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function updateFunctionComponent(fiber) {
  // 执行函数式组件获取到 children
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }


  let domParentFiber = fiber.parent;
  // 递归找到 含有 dom 节点的 元素
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;


  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  }
  // ignore
  else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  // ignore
}


function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    // 删除节点，直到有 dom 节点的元素为止
    commitDeletion(fiber.child, domParent);
  }
}
