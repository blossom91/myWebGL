import {log} from '../src/utils';
import Vector from '../src/vector';
import Vertex from '../src/vertex';
import Matrix from '../src/matrix';
import MyMesh from '../src/myMesh';
import Color from '../src/color';

// 通过测试函数 主要测试了 Vertex Matrix 和 Mesh 类 等基础类
// 具体程序执行逻辑 canvas 文件内通过开发测试工具保证
// 为了保证程序便于测试 开发了 config.js 和 input 绑定的工具 可以动态控制所有输入参数  实时观看log效果 保证程序健壮性与正确性
export default class Test {
    test() {
        this.testCore();
        this.testMultiNum();
        this.testVextorSub();
        this.testVextorDot();
        this.testVextorCross();
        this.testFrom3DMesh();
        this.testVextorAdd();
        this.testMatrixLookAtLH();
        this.testMatrixRotation();
        this.testMatrixTransform();
    }

    ensure(condition, message) {
        // 如果 condition 为 false，输出 message
        if (condition) {
            log(message, 'success');
        } else {
            log(message, 'failed');
            throw `${message} failed`;
        }
    }

    equalArray(l1, l2) {
        // 判断简单数组是否相等
        return JSON.stringify(l1) === JSON.stringify(l2);
    }

    equalFloat(a, b) {
        // 判断浮点数是否相等
        return Math.abs(a - b) <= Number.EPSILON;
    }

    matrixEqual(m1, m2) {
        // 判断 2 个 Matrix 是否相等
        return m1.toString() === m2.toString();
    }

    colorEqual(c1, c2) {
        // 判断 2 个 Color 是否相等
        return c1.equal(c2);
    }

    vectorEqual(v1, v2) {
        // 判断 2 个 Vector 是否相等
        return v1.toString() === v2.toString();
    }

    myMeshEqual(mesh1, mesh2) {
        // 判断 2 个 mesh 的顶点数据和贴图数据 是否相等
        let indices1 = mesh1.indices;
        let indices2 = mesh2.indices;
        let indicesOk = this.equalArray(indices1, indices2);
        if (!indicesOk) {
            return false;
        }
        let vertices1 = mesh1.vertices;
        let vertices2 = mesh2.vertices;
        if (vertices1.length !== vertices2.length) {
            return false;
        }
        for (let i = 0; i < vertices1.length; i++) {
            const item = vertices1[i];
            let {position: p1, color: c1, u: u1, v: v1, w: w1, normal: n1} = item;
            let {position: p2, color: c2, u: u2, v: v2, w: w2, normal: n2} = vertices2[i];
            let pass =
                this.vectorEqual(p1, p2) &&
                this.colorEqual(c1, c2) &&
                this.vectorEqual(n1, n2) &&
                u1 === u2 &&
                v1 === v2 &&
                w1 === w2;
            if (!pass) {
                return false;
            }
        }

        return true;
    }

    testCore() {
        let a = new Vector(1, 1, 1);
        let b = new Vector(1, 1, 1);
        let c = new Vector(1, 1, 1);
        let expect = new Vector(1, 1, 1);
        let actual = Vector.core(a, b, c);
        this.ensure(this.vectorEqual(actual, expect), 'testCore');
    }

    testMultiNum() {
        let a = new Vector(1, 2, 3);
        let expect = new Vector(2, 4, 6);
        let actual = a.multiNum(2);
        this.ensure(this.vectorEqual(actual, expect), 'testMultiNum');
    }

    testVextorAdd() {
        let a = new Vector(1, 1, 1);
        let b = new Vector(1, 1, 1);
        let expect = Math.sqrt(12);
        let actual = a.add(b).length();
        this.ensure(this.equalFloat(actual, expect), 'testVextorAdd');
    }

    testVextorSub() {
        let a = new Vector(3, 2, 7);
        let b = new Vector(4, 4, 4);
        let expect = new Vector(1, 2, -3);
        let actual = b.sub(a);
        this.ensure(this.vectorEqual(actual, expect), 'testVextorSub');
    }

    testVextorDot() {
        let a = new Vector(7, 3, 1);
        let b = new Vector(1, 2, 1);
        let actual = a.dot(b);
        let expect = 14;
        this.ensure(this.vectorEqual(actual, expect), 'testVextorDot');
    }

    testVextorCross() {
        let a = new Vector(3, 2, 1);
        let b = new Vector(1, 2, 3);
        let actual = a.cross(b);
        let expect = new Vector(4, -8, 4);
        this.ensure(this.vectorEqual(actual, expect), 'testVextorCross');
    }

    testMatrixLookAtLH() {
        let cameraPosition = new Vector(0, 0, 10);
        let cameraTarget = new Vector(0, 0, 0);
        let cameraUp = new Vector(0, 1, 0);

        let matrix = Matrix.lookAtLH(cameraPosition, cameraTarget, cameraUp);

        let values = [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 10, 1];

        this.ensure(this.matrixEqual(matrix, new Matrix(values)), 'testMatrixLookAtLH');
    }

    testMatrixRotation() {
        let v = new Vector(10, 20, 30);
        let matrix = Matrix.rotation(v);
        let values = [
            0.554,
            0.829,
            0.079,
            0.0,
            0.327,
            -0.129,
            -0.936,
            0.0,
            -0.766,
            0.544,
            -0.342,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0
        ];
        this.ensure(this.matrixEqual(matrix, new Matrix(values)), 'testMatrixRotation');
    }

    testMatrixTransform() {
        let v = new Vector(0.5938, -0.1479, 0.1437);

        let values = [-1.774, 0.0, 0.01, 0.01, 0.0, 2.365, 0.0, 0.0, -0.018, 0.0, -1.01, -1.0, 0.0, 0.0, 10.091, 10.0];
        let vector = new Vector(-0.10706, -0.03547, 1.009077);

        this.ensure(this.vectorEqual(vector, new Matrix(values).transform(v)), 'testMatrixTransform');
    }

    // 只处理顶点数据与贴图数据比较 不判断坐标位置
    testFrom3DMesh() {
        let str3d = `vertices 3
triangles 1
1 0 1 -1 0 1 0.075 0.9783
1 1 1 -1 0 1 0.075 0.9783
0 0 1 -1 0 1 0.075 0.9783
0 1 2`;
        let mesh = MyMesh.from3DMesh(str3d);
        let ec = Color.red();

        let ev1 = new Vector(1, 0, 1);
        let nr1 = new Vector(-1, 0, 1);
        let v1 = new Vertex(ev1, ec, 0.075, 0.9783, 0, nr1);

        let ev2 = new Vector(1, 1, 1);
        let nr2 = new Vector(-1, 0, 1);
        let v2 = new Vertex(ev2, ec, 0.075, 0.9783, 0, nr2);

        let ev3 = new Vector(0, 0, 1);
        let nr3 = new Vector(-1, 0, 1);
        let v3 = new Vertex(ev3, ec, 0.075, 0.9783, 0, nr3);

        let vertices = [v1, v2, v3];

        let indices = [['0', '1', '2']];

        let expect = new MyMesh();
        expect.vertices = vertices;
        expect.indices = indices;

        this.ensure(this.myMeshEqual(mesh, expect), 'testFrom3DMesh');
    }
}
