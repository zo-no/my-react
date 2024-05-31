/*
@Date		:2023/12/04 15:56:37
@Author		:zono
@Description:一个简单的JSX处理器
*/

/*part1.createElement函数:用于构建虚拟DOM
----------------------------------------
1.参考react的createElement函数：
React.createElement(ele,props,...children)
- ele：元素标签名\组件名
- props：元素的属性集合(对象)（无属性，则此值为null）
- children：当前元素的子节点，第三个及以后的参数都是
- 返回虚拟DOM，可以看下文虚拟DOM结构
----------------------------------------
2. 参考react输出的虚拟DOM： 
virtualDOM = {
    $$typeof: Symbol(react.element), //react元素的标识
    ref: null,
    key: null,
    type: 标签名「或组件」, //h1、h2...
    // 存储了元素的相关属性 && 子节点信息
    props: {
        ..., // 元素的相关属性,如：className、style,
        children // 子节点信息（没有子节点则没有这个属性、属性值可能是一个值、也可能是一个数组）
    }//必定存在，至少是个空对象
  }
----------------------------------------
*/
export function createElement(ele, props, ...children) {
  let virtualDOM = {
    $$typeof: Symbol.for("react.element"),
    ref: null,
    key: null,
    type: null,
    props: {},
  };
  let len = children.length;

  // 1.处理type
  virtualDOM.type = ele;

  // 2.处理props
  if (props) {
    virtualDOM.props = {
      ...props,
      children,
    };
  }

  // 3.处理children
  if (len === 1) virtualDOM.props.children = children[0];
  else if (len > 1) virtualDOM.props.children = children;
  else virtualDOM.props.children = null;

  return virtualDOM;
}

/*part2.render函数：把虚拟DOM变为真实DOM（按v16），构建思路如下
----------------------------------------
1.首先根据ReactDOM.render方法构建大体结构
ReactDOM.render(virtualDOM, container)
----------------------------------------
2.由于函数涉及到递归对象取值，所以先定义一个对象迭代器,见下文
*/

/*定义一个对象迭代器:封装一个对象迭代的方法 
  - 基于传统的for/in循环，会存在一些弊端「性能较差(既可以迭代私有的，也可以迭代公有的)；只能迭代“可枚举、非Symbol类型的”属性...」
  + 解决思路：获取对象所有的私有属性「私有的、不论是否可枚举、不论类型」
    + Object.getOwnPropertyNames(arr) -> 获取对象非Symbol类型的私有属性「无关是否可枚举」
    + Object.getOwnPropertySymbols(arr) -> 获取Symbol类型的私有属性
    获取所有的私有属性：
      let keys = Object.getOwnPropertyNames(arr).concat(Object.getOwnPropertySymbols(arr));
    可以基于ES6中的Reflect.ownKeys代替上述操作「弊端：不兼容IE」
      let keys = Reflect.ownKeys(arr);
*/
const each = (obj, callback) => {
  // 1.参数校验,如果不是对象或者是null，直接抛出异常
  if (obj === null || typeof obj !== "object")
    throw new TypeError("obj is not a object");
  // 2.获取对象所有的私有属性「私有的、不论是否可枚举、不论类型」
  let keys = Reflect.ownKeys(obj);
  // 3.遍历所有的私有属性,每次迭代都执行回调函数
  keys.forEach((key) => callback(obj[key], key));
};

/*定义一个创建真实DOM的函数
这里先不对ref（获取真实DOM）和key（用于优化）进行处理

分析后函数任务就是：
先根据type创建一个标签，然后把props中的属性设置给标签，最后把标签插入到指定的容器中。

于是接下来按步骤处理：
- type：标签名
props中的属性进行处理（粗略）
- className
- style
- children
*/
export function render(virtualDOM, container) {
  //获取虚拟DOM的类型
  let { type, props } = virtualDOM;
  //1. type处理
  if (typeof type === "string") {
    let ele = document.createElement(type); //动态创建一个string标签
    // 2.props处理：构建回调函数为标签设置相关的属性 & 子节点，然后传入之前写好的对象迭代器
    each(props, (value, key) => {
      /*TODO为元素设置属性（自定义、内置）有两种方式（待回看）
      1. 元素.属性=属性值
      原理：内置属性是设置在元素标签上的（可以通过元素对象获取到），
        自定义属性是设置在元素对象上，在对象的堆内存空间中新增成员（不会设置到标签上）
      获取：元素.属性
      删除：delete 元素.属性

      2. 元素.setAttribute(属性名,属性值)
      原理：会直接写在元素的标签上
      获取：元素.getAttribute(属性名)
      删除：元素.removeAttribute(属性名)
      二者不能混淆（排除内置属性的特殊性）
      */

      // 2.1className的处理：value存储的是样式类名
      if (key === "className") {
        ele.className = value;
        return;
      }

      // 2.2.style的处理：value存储的是样式对象
      if (key === "style") {
        each(value, (val, attr) => {
          ele.style[attr] = val;
        });
        return;
      }
      // 2.3.子节点的处理：value存储的children属性值
      if (key === "children") {
        let children = value;
        if (!Array.isArray(children)) children = [children]; //如果不是数组，就包装成数组(对象方法少)
        children.forEach((child) => {
          // 子节点是文本节点：直接插入即可
          if (/^(string|number)$/.test(typeof child)) {
            //.test():用于检测字符串是否匹配某个正则表达式，返回true/false
            ele.appendChild(document.createTextNode(child)); //创建文本节点,并插入到标签中
            return;
          }
          // 子节点又是一个virtualDOM：递归处理
          render(child, ele);
        });
        return;
      }

      ele.setAttribute(key, value);
    });
    // 把新增的标签，增加到指定容器中
    container.appendChild(ele);
  }
}
