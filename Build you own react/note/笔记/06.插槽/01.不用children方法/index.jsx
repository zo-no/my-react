/*
@Date		:2023/12/05 16:58:44
@Author		:zono
@Description:这里还是直接覆盖src文件就行
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoOne from '@/views/DemoOne';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <DemoOne title="REACT好好玩哦" x={10}>
            <span>哈哈哈哈</span>
        </DemoOne>

         <DemoOne title="哇卡卡卡">
            <span>嘿嘿嘿</span>
        </DemoOne>

        <DemoOne title="哈哈哈哈哈" />
    </>
);