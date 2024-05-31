/*
@Date		:2023/12/05 16:53:59
@Author		:zono
@Description: 这里先写一次不用react的插槽处理
*/

import PropTypes from "prop-types";
const DemoOne = function DemoOne(props) {
  let { title, x, children } = props; //取出属性
  //检测children是否存在，若不存在则赋值为空数组，若存在则检测是否为数组，若不是则转换为数组
  // 要对children的类型做处理
  // 可以基于 React.Children 对象中提供的方法，对props.children做处理：count\forEach\map\toArray...
  // 好处：在这些方法的内部，已经对children的各种形式做了处理
  return (
    <div className="demo-box">
      {children[0]}
      <br />

      <h2 className="title">{title}</h2>
      <span>{x}</span>

      <br />
      {children[1]}
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
