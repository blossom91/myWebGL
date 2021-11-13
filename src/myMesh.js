import {config} from './config';
import Color from './color';
import Vector from './vector';
import Vertex from './vertex';

export default class MyMesh {
    constructor() {
        // 坐标位置
        this.position = new Vector(
            config.mesh_position_x.value,
            config.mesh_position_y.value,
            config.mesh_position_z.value
        );
        // 旋转角度
        this.rotation = new Vector(config.rotation_x.value, config.rotation_y.value, config.rotation_z.value);

        // 缩放
        this.scale = new Vector(config.scale_x.value, config.scale_y.value, config.scale_z.value);

        // 三角形数组
        this.imageInfo = null;
        this.vertices = null;
        this.indices = null;
    }

    static fromImageMesh(data) {
        data = data.split('\n');
        let w = Number(data.shift());
        let h = Number(data.shift());
        let list = new Array(h);
        for (let i = 0; i < h; i++) {
            list[i] = data.shift().split(' ');
            for (let j = 0; j < list[i].length; j++) {
                let e = list[i][j];
                list[i][j] = Color.newHex(e);
            }
        }
        return {
            w,
            h,
            colorList: list
        };
    }

    static from3DMesh(data, imageString) {
        data = data.split('\n');
        let verticesTotal = data.shift().split(' ')[1];
        verticesTotal = Number(verticesTotal);
        let trianglesTotal = data.shift().split(' ')[1];
        trianglesTotal = Number(trianglesTotal);
        let vertices = [];
        for (let i = 0; i < verticesTotal; i++) {
            const e = data.shift().split(' ');
            let [x, y, z, nx, ny, nz, u, v] = e;
            let color = Color.red();
            let position = new Vector(Number(x), Number(y), Number(z));
            let normal = new Vector(Number(nx), Number(ny), Number(nz));
            vertices.push(new Vertex(position, color, Number(u), Number(v), 0, normal));
        }
        let indices = [];
        for (let i = 0; i < trianglesTotal; i++) {
            const e = data.shift().split(' ');
            indices.push(e);
        }
        let m = new MyMesh();
        m.vertices = vertices;
        m.indices = indices;
        if (imageString) {
            m.imageInfo = this.fromImageMesh(imageString);
        }
        return m;
    }
}
