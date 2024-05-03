/**
 * @Date        2024/04/05 22:07:53
 * @Author      zono
 * @Description 实现React细粒度更新
 * 思路：
 * - 建立state和effect的订阅发布关系
 * - 具体就是再callback中使用set函数时，检查当前effect环境，并把环境进行订阅
 * */
// useState-p20
// function useState(value) {
//   const getter = () => value;
//   const setter = (newValue) => (value = newValue);
//   return [getter, setter];
// }

// effect调用栈
const effectStack = [];

/**
 * @description 建立发布订阅关系
 * */
function subscribe(effect, subs) {
  // 订阅关系建立
  subs.add(effect);
  // 依赖关系建立
  effect.deps.add(subs);
}

function cleanup(effect) {
  //从该effect订阅的所有state对应的subs中移除该effect
  for (const subs of effect.deps) {
    subs.delete(effect);
  }
  //将该effect依赖的所有state对应subs移除
  effect.deps.clear();
}

// useState-p24
function useState(value) {
  // 保存 订阅 该state变化的effect
  const subs = new Set();

  const setter = (nextValue) => {
    value = nextValue;
    // 遍历subs，通知所有订阅该state变化的effect执行
    for (const effect of [...subs]) {
      effect.execute(); //执行effct
    }
  };

  const getter = () => {
    // 获取当前上下文的effect
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
      // 建立发布订阅关系
      subscribe(effect, subs);
    }
    return value;
  };

  return [getter, setter];
}

// useEffect使用发布订阅实现
function useEffect(callback) {
  const execute = () => {
    // 重置依赖
    cleanup(effect); //清除当前依赖
    // 加入栈顶
    effectStack.push(effect);

    try {
      // 执行回调，这里面就可能有useState里的set函数，于是就可以建立发布订阅关系
      callback();
    } finally {
      // effect出栈
      effectStack.pop();
    }
  };

  const effect = {
    // 用于执行usEffect回调函数
    execute, //具体函数
    // 保存该useEffect依赖的state对应的subs的集合
    deps: new Set(), //依赖关系
  };

  //创建后就执行一次
  execute;
}

function useMemo(callback) {
  const [s, set] = useState();
  // 每次执行callback，建立回调中state的订阅发布关系
  useEffect(() => set(callback()));
  return s;
}
