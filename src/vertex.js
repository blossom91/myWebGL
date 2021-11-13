import {interpolate} from './utils';

export default class Vertex {
    // 表示顶点的类
    // 表示了一个坐标和一个颜色
    constructor(position, color, u, v, w, normal) {
        this.position = position;
        this.color = color;
        this.u = u;
        this.v = v;
        this.w = w;
        this.normal = normal;
    }

    interpolate(other, factor) {
        let a = this;
        let b = other;
        let p = a.position.interpolate(b.position, factor);
        let c = a.color.interpolate(b.color, factor);
        let w = interpolate(a.w, b.w, factor);
        let u = interpolate(a.u, b.u, factor);
        let v = interpolate(a.v, b.v, factor);

        return new Vertex(p, c, u, v, w);
    }
}
