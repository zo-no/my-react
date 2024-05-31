function commitRoot() {
  // 移除 刚才收集的 旧节点
  deletions.forEach(commitWork);
  // commit 当前 wipRoot 的 child 元素
  commitWork(wipRoot.child);
  // 改变当前 root 指向
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 更新 dom 的 属性(新增新属性和移除旧属性) 及 事件的添加和移除处理
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
