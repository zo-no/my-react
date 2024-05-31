/*
@Date		:2023/12/05 16:53:59
@Author		:zono
@Description: 这里先写一次不用react的插槽处理
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoOne from '@/views/DemoOne';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <DemoOne title="REACT好好玩哦" x={10}>
            <span slot="footer">我是页脚</span>
            <span>哈哈哈哈</span>
            <span slot="header">我是页眉</span>
        </DemoOne>

         <DemoOne title="哇卡卡卡">
            <span>嘿嘿嘿</span>
        </DemoOne>

        <DemoOne title="哈哈哈哈哈" />
    </>
);