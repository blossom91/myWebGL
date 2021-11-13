export default class Vector {
    // 表示三维向量的类
    constructor(x, y, z = 0) {
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
    }

    interpolate(other, factor) {
        const p1 = this;
        const p2 = other;
        const x = p1.x + (p2.x - p1.x) * factor;
        const y = p1.y + (p2.y - p1.y) * factor;
        const z = p1.z + (p2.z - p1.z) * factor;
        return new Vector(x, y, z);
    }

    add(other) {
        let v1 = this;
        let v2 = other;
        let x = v1.x + v2.x;
        let y = v1.y + v2.y;
        let z = v1.z + v2.z;
        return new Vector(x, y, z);
    }

    static core(v1, v2, v3) {
        let x = (v1.x + v2.x + v3.x) / 3;
        let y = (v1.y + v2.y + v3.y) / 3;
        let z = (v1.z + v2.z + v3.z) / 3;
        return new Vector(x, y, z);
    }

    toString() {
        let s = '';
        s += this.x.toFixed(3);
        s += this.y.toFixed(3);
        s += this.z.toFixed(3);
        return s;
    }

    multiNum(n) {
        return new Vector(this.x * n, this.y * n, this.z * n);
    }

    sub(v) {
        const x = this.x - v.x;
        const y = this.y - v.y;
        const z = this.z - v.z;
        return new Vector(x, y, z);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const l = this.length();
        if (l === 0) {
            return this;
        }
        const factor = 1 / l;

        return this.multiNum(factor);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        const x = this.y * v.z - this.z * v.y;
        const y = this.z * v.x - this.x * v.z;
        const z = this.x * v.y - this.y * v.x;
        return new Vector(x, y, z);
    }
}
