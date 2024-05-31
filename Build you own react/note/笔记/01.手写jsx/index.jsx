/*
@Date		:2023/12/05 16:26:26
@Author		:zono
@Description:该文件用于测试自己写的jsx方法，直接复制到src之后覆盖index.jsx即可
*/

// import React from "react";
// import ReactDOM from "react-dom/client";
import "./index.less";
import { createElement, render } from "./myJSXhandle";
// import { createElement, render } from './jsxHandle';

// const root = ReactDOM.createRoot(document.getElementById("root"));

let styObj = {
  color: "red",
  fontSize: "16px",
};
let x = 10;
let y = 20;

//把react.createElement方法改成自己的方法
//把react.Fragment改为直接填写
//可以见到react已经没有被调用了
let jsxObj = createElement(
  //   React.Fragment,
  "div",
  null,
  createElement("h2", { className: "title", style: styObj }, "zono"),
  createElement(
    "div",
    { className: "box" },
    // "牛",
    createElement("span", null, x),
    createElement("span", null, y),
  ),
);

// console.log(jsxObj);

//有了render方法，就不需要ReactDOM.render了
// root.render(jsxObj);
render(jsxObj, document.getElementById("root"));
