function performUnitOfWork(fiber) {
  // 创建一个 dom 元素，挂载到 fiber 的 dom 属性
  if (!fiber.dom) fiber.dom = createDom(fiber);
  // 添加 dom 到 父元素上
  if (fiber.parent) fiber.parent.dom.appendChild(fiber.dom);

  const elements = fiber.props.children;
  let index = 0;
  // 保存 上一个 sibling fiber 结构
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

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
  // step1 如果 有 child fiber ，则返回 child
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;

  while (nextFiber) {
    // step2 如果 有 sibling fiber ，则返回 sibling
    if (nextFiber.sibling) return nextFiber.sibling;

    // step3 ，否则 返回 他的 parent fiber
    nextFiber = nextFiber.parent;
  }
}
