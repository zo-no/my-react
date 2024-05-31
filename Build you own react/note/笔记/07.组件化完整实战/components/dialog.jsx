/*
@Date		:2023/12/06 14:40:06
@Author		:zono
@Description:简单写个组件
*/
import PropTypes from 'prop-types';
import React from 'react';

/* 
 render函数在渲染的时候，如果type是：
    + 字符串：创建一个标签
    + 普通函数：把函数执行，并且把props传递给函数
    + 构造函数：把构造函数基于new执行「也就是创建类的一个实例」，也会把解析出来的props传递过去
      + 每调用一次类组件都会创建一个单独的实例
      + 把在类组件中编写的render函数执行，把返回的jsx「virtualDOM」当做组件视图进行渲染！！
      例如：
      new Vote({
        title:'React其实还是很好学的!'
      })
 */

const Dialog = function Dialog(props) {
    // 获取传递的属性和插槽信息
    let { title, content, children } = props;
    children = React.Children.toArray(children);// 将插槽转换为数组
    
    return <div className="dialog-box" style={{ width: 300 }}>
        <div className="header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <h2 className="title">{title}</h2>
            <span>X</span>
        </div>
        <div className="main">
            {content}
        </div>
        {children.length > 0 ?
            // 有插槽才渲染
            <div className="footer">
                {children}
            </div> :
            null
        }
    </div>;
};

/* 属性规则校验 */
Dialog.defaultProps = {
    title: '温馨提示'
};// 设置默认属性
Dialog.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string.isRequired
};// 设置属性规则校验

export default Dialog;