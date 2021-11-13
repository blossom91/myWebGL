import './static/index.css';
import {initSliders} from './config';
import {Canvas} from './canvas';
import MyMesh from './myMesh';
import ball100 from './static/ball100';
import ball10 from './static/ball10';
import {_e} from './utils';

const initMesh = function (canvas) {
    let mesh = MyMesh.from3DMesh(ball100);
    // let mesh = MyMesh.from3DMesh(ball10);
    canvas.drawMesh(mesh);
    canvas.drawLight();
    canvas.render();

    let run = () => {
        // 清理画布
        canvas.clear();
        // 绘制模型
        canvas.drawMesh(mesh);
        // 绘制光源模型
        canvas.drawLight();
        // 渲染
        canvas.render();
        requestAnimationFrame(() => {
            run();
        });
    };

    run();
};

// 程序执行入口
const main = () => {
    let canvas = new Canvas(_e('#canvas'));
    initSliders();
    initMesh(canvas);
};

main();

// 测试函数入口
// import Test from '../test';
// const __test = function() {
//     let tm = new Test();
//     tm.test();
// };
// __test();
