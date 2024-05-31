import PropTypes from "prop-types";
import React from "react";

const DemoOne = function DemoOne(props) {
  let { title, x, children } = props;
  children = React.Children.toArray(children);
  let headerSlot = [],
    footerSlot = [],
    defaultSlot = [];
  children.forEach((child) => {
    // 传递进来的插槽信息，都是编译为virtualDOM后传递进来的「而不是传递的标签」
    let { slot } = child.props; //获取插槽的名称
    //根据插槽的名称，把当前的插槽信息存放到对应的数组中
    if (slot === "header") {
      headerSlot.push(child);
    } else if (slot === "footer") {
      footerSlot.push(child);
    } else {
      defaultSlot.push(child);
    }
  });

  return (
    // 通过数组的形式，把插槽信息渲染到页面中
    <div className="demo-box">
      {headerSlot}
      <br />

      <h2 className="title">{title}</h2>
      <span>{x}</span>

      <br />
      {footerSlot}
    </div>
  );
};
/* 设置属性的校验规则 */
DemoOne.defaultProps = {
  x: 0,
};
DemoOne.propTypes = {
  title: PropTypes.string.isRequired,
  x: PropTypes.number,
};

export default DemoOne;
