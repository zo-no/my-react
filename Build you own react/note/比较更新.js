
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
​
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)
​
  // ignore
}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type
    // 类型相同，更新 属性 
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    // 类型不同，但是 新 fiber 元素存在，则进行 新增(新增新的 fiber)
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    // 类型不同，但是 旧 fiber 树存在，则进行 移除 (先收集起来，在 commit 阶段一并移除)
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }
    // 下个循环 对 兄弟 fiber 进行比较 (和 下面的  i++ 一个道理)
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    // 如果是 第一个 子元素，则把 新的 fiber 挂到 wipFiber 的  child 属性上
    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      // 其他的 子元素 ，挂到 上一个子元素的 sibling 属性上
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}


