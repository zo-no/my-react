/**
 * @Date        2024/03/23 18:42:27
 * @Author      zono
 * @Description
 * */

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
 * @description 虚拟dom转换为真实DOM
 * */
function render(el, container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  Object.keys(el.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = el.props[prop];
    }
  });

  el.props.children.forEach((child) => {
    render(child, dom);
  });

  container.append(dom);
}

export { createElement, render };
const ZonoReact = {
  createElement,
  render,
};
export default ZonoReact;
