import Vector from './vector';
import Vertex from './vertex';
import Color from './color';

// 为便于测试 内置了一些简单的模型顶点坐标集合 实际业务中,应每个模型类专门处理文件 方便组合封装和 shader 功能扩展
export default class Mesh {
    // 表示顶点的类
    // 表示了一个坐标和一个颜色
    constructor() {
        // 世界基点坐标
        this.position = new Vector(0, 0, 0);
        // 旋转角度
        this.rotation = new Vector(0, 0, 0);
        // 模型缩放比例
        this.scale = new Vector(1, 1, 1);

        // 三角形顶点数组
        this.vertices = [];
        // 三角形下标数组
        this.indices = [];
    }

    static cube2() {
        let points = [
            -1,
            1,
            0,
            255,
            0,
            0,
            255,
            1,
            1,
            0,
            0,
            255,
            0,
            255,
            -1,
            -1,
            0,
            0,
            0,
            255,
            255,
            1,
            -1,
            0,
            255,
            255,
            255,
            255,
            -1,
            1,
            2,
            255,
            0,
            0,
            255,
            1,
            1,
            2,
            0,
            255,
            0,
            255,
            -1,
            -1,
            2,
            0,
            0,
            255,
            255,
            1,
            -1,
            2,
            255,
            255,
            255,
            255
        ];
        let vertices = [];
        for (let i = 0; i < points.length; i += 7) {
            let v = new Vector(points[i], points[i + 1], points[i + 2]);
            let c = new Color(points[i + 3], points[i + 4], points[i + 5], points[i + 6]);
            // let c = Color.white()
            vertices.push(new Vertex(v, c));
        }
        let indices = [
            // 12
            [0, 1, 2],
            [1, 3, 2],
            [1, 7, 3],
            [1, 5, 7],
            [5, 6, 7],
            [5, 4, 6],
            [4, 0, 6],
            [0, 2, 6],
            [0, 4, 5],
            [5, 1, 0],
            [2, 3, 7],
            [2, 7, 6]
        ];
        let m = new Mesh();
        m.vertices = vertices;
        m.indices = indices;
        return m;
    }

    // 返回一个正方体
    static cube() {
        // 8 points
        let points = [
            -0.05,
            0.05,
            -0.05, // 0
            0.05,
            0.05,
            -0.05, // 1
            -0.05,
            -0.05,
            -0.05, // 2
            0.05,
            -0.05,
            -0.05, // 3
            -0.05,
            0.05,
            0.05, // 4
            0.05,
            0.05,
            0.05, // 5
            -0.05,
            -0.05,
            0.05, // 6
            0.05,
            -0.05,
            0.05 // 7
        ];

        let vertices = [];
        for (let i = 0; i < points.length; i += 3) {
            let v = new Vector(points[i], points[i + 1], points[i + 2]);
            // let c = Color.randomColor()
            let c = Color.white();
            vertices.push(new Vertex(v, c));
        }

        // 12 triangles * 3 vertices each = 36 vertex indices
        let indices = [
            // 12
            [0, 1, 2],
            [1, 3, 2],
            [1, 7, 3],
            [1, 5, 7],
            [5, 6, 7],
            [5, 4, 6],
            [4, 0, 6],
            [0, 2, 6],
            [0, 4, 5],
            [5, 1, 0],
            [2, 3, 7],
            [2, 7, 6]
        ];
        let m = new Mesh();
        m.vertices = vertices;
        m.indices = indices;
        return m;
    }

    static plane() {
        let points = [
            -1,
            0,
            1,
            255,
            0,
            0,
            255,
            3,
            0,
            0,
            0,
            255,
            0,
            255,
            -1,
            0,
            -1,
            0,
            0,
            255,
            255,
            -1,
            1,
            0,
            255,
            255,
            255,
            255,
            3,
            0,
            0,
            0,
            255,
            0,
            255,
            -1,
            -1,
            0,
            255,
            215,
            0,
            255
        ];
        let vertices = [];

        for (let i = 0; i < points.length; i += 7) {
            let v = new Vector(points[i], points[i + 1], points[i + 2]);
            let c = new Color(points[i + 3], points[i + 4], points[i + 5], points[i + 6]);
            vertices.push(new Vertex(v, c));
        }

        let indices = [
            [0, 1, 2],
            [3, 4, 5]
        ];
        let m = new Mesh();
        m.vertices = vertices;
        m.indices = indices;
        return m;
    }

    // 球 动态计算球顶点坐标生成球模型
    static sphere(h = 32) {
        let m = new Mesh();
        let vertices = [];
        let indices = [];
        let w = 2 * h;
        let r = 1;
        let color = Color.white();
        let index = 0;
        let grid = [];
        let pi = Math.PI;
        for (let iy = 0; iy <= h; iy++) {
            let v = iy / h;
            let row = [];
            for (let ix = 0; ix <= w; ix++) {
                let u = ix / w;
                let x = -r * Math.cos(u * 2 * pi) * Math.sin(v * pi);
                let y = r * Math.cos(v * pi);
                let z = r * Math.sin(u * 2 * pi) * Math.sin(v * pi);
                let scale = 0.03;
                let p = new Vector(x * scale, y * scale, z * scale);
                let n = p.normalize();
                let vertex = new Vertex(p, color, u, v, 0, n);
                vertices.push(vertex);
                row.push(index);
                index++;
            }
            grid.push(row);
        }
        for (let iy = 0; iy < h; iy++) {
            for (let ix = 0; ix < w; ix++) {
                let a = grid[iy][ix + 1];
                let b = grid[iy][ix];
                let c = grid[iy + 1][ix];
                let d = grid[iy + 1][ix + 1];

                if (iy !== 0) {
                    indices.push([a, b, d]);
                }

                if (iy !== h - 1) {
                    indices.push([b, c, d]);
                }
            }
        }
        m.vertices = vertices;
        m.indices = indices;
        return m;
    }
}
