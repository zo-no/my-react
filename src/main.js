// v1
/**
 * @description 原生DOM
 * */
// const dom = document.createElement("div");
// dom.id = "app";
// document.querySelector("#root").append(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = "app";
// dom.append(textNode);

// v2
/**
 * @description 虚拟DOM
 * */
import ReactDOM from "../core/zono-react-dom.js";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(App);
