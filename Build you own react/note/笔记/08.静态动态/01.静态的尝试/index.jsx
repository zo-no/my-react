/*
@Date		:2023/12/06 14:43:34
@Author		:zono
@Description:尝试一次组件
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import Vote from './component/Vote';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Vote title="React其实还是很好学的!" />
    </>
);

setTimeout(() => {
    root.render(
        <>
            <Vote title="我是五秒后传递的标题" />
        </>
    );
}, 5000); 
