/*
@Date		:2023/12/06 14:43:34
@Author		:zono
@Description:尝试一次组件
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import Dialog from './components/dialog';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Dialog title="友情提示" content="大家出门做好个人防护！" />

        <Dialog content="我们一定要好好学React！">
            <button>确定</button>
            <button>很确定</button>
        </Dialog>
    </>
);