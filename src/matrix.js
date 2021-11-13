import Vector from './vector';

// todo 将定长number数组更新为 ArrayBuffer 类型数组
export default class Matrix {
    constructor(matrixList) {
        if (matrixList) {
            this.m = matrixList;
        }
        else {
            this.m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    }

    toString() {
        let s = '';
        const m = this.m;
        for (let i = 0; i < m.length; i++) {
            s += m[i].toFixed(3);
        }
        return s;
    }

    multiply(other) {
        const m1 = this.m;
        const m2 = other.m;
        const m = [];
        for (let index = 0; index < 16; index++) {
            const i = Math.floor(index / 4);
            const j = index % 4;
            m[i * 4 + j]
                = m1[i * 4] * m2[j]
                + m1[i * 4 + 1] * m2[4 + j]
                + m1[i * 4 + 2] * m2[2 * 4 + j]
                + m1[i * 4 + 3] * m2[3 * 4 + j];
        }
        return new Matrix(m);
    }

    static zero() {
        return new Matrix();
    }

    static identity() {
        const m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        return new Matrix(m);
    }

    static lookAtLH(eye, target, up) {
        const zaxis = target.sub(eye).normalize();
        const xaxis = up.cross(zaxis).normalize();
        const yaxis = zaxis.cross(xaxis).normalize();

        const ex = -xaxis.dot(eye);
        const ey = -yaxis.dot(eye);
        const ez = -zaxis.dot(eye);

        const m = [
            xaxis.x,
            yaxis.x,
            zaxis.x,
            0,
            xaxis.y,
            yaxis.y,
            zaxis.y,
            0,
            xaxis.z,
            yaxis.z,
            zaxis.z,
            0,
            ex,
            ey,
            ez,
            1
        ];
        return new Matrix(m);
    }

    static perspectiveFovLH(fieldOfView, aspect, znear, zfar) {
        const h = 1 / Math.tan(fieldOfView / 2);
        const w = h / aspect;
        const m = [w, 0, 0, 0, 0, h, 0, 0, 0, 0, zfar / (zfar - znear), 1, 0, 0, (znear * zfar) / (znear - zfar), 0];
        return new Matrix(m);
    }

    static rotationX(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const m = [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
        return new Matrix(m);
    }

    static rotationY(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const m = [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
        return new Matrix(m);
    }

    static rotationZ(angle) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const m = [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        return new Matrix(m);
    }

    static rotation(angle) {
        const x = Matrix.rotationZ(angle.z);
        const y = Matrix.rotationX(angle.x);
        const z = Matrix.rotationY(angle.y);
        return x.multiply(y).multiply(z);
    }

    static translation(v) {
        const {x, y, z} = v;
        const m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
        return new Matrix(m);
    }

    static scale(v) {
        let {x, y, z} = v;
        let m = [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
        return new Matrix(m);
    }

    inverse() {
        let m = this.m;
        let b = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let t = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let temp = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                t[i * 4 + j] = m[i * 4 + j];
            }
        }
        let max = Number.MIN_VALUE;
        let k = 0;
        for (let i = 0; i < 4; i++) {
            max = t[i * 4 + i];
            k = i;
            for (let j = i + 1; j < 4; j++) {
                if (Math.abs(t[j * 4 + i]) > Math.abs(max)) {
                    max = t[j * 4 + i];
                    k = j;
                }
            }
            if (k !== i) {
                for (let j = 0; j < 4; j++) {
                    temp = t[i * 4 + j];
                    t[i * 4 + j] = t[k * 4 + j];
                    t[k * 4 + j] = temp;

                    temp = b[i * 4 + j];
                    b[i * 4 + j] = b[k * 4 + j];
                    b[k * 4 + j] = temp;
                }
            }
            if (t[i * 4 + i] === 0) {
                break;
            }
            temp = t[i * 4 + i];
            for (let j = 0; j < 4; j++) {
                t[i * 4 + j] = t[i * 4 + j] / temp;
                b[i * 4 + j] = b[i * 4 + j] / temp;
            }
            for (let j = 0; j < 4; j++) {
                if (j !== i) {
                    temp = t[j * 4 + i];
                    for (k = 0; k < 4; k++) {
                        t[j * 4 + k] = t[j * 4 + k] - temp * t[i * 4 + k];
                        b[j * 4 + k] = b[j * 4 + k] - temp * b[i * 4 + k];
                    }
                }
            }
        }
        return new Matrix(b);
    }

    transpose() {
        let m = this.m;
        let t = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                t[i * 4 + j] = m[i + j * 4];
            }
        }
        return new Matrix(t);
    }

    transform(v) {
        let m = this.m;
        let x = v.x * m[0] + v.y * m[1 * 4 + 0] + v.z * m[2 * 4 + 0] + m[3 * 4 + 0];
        let y = v.x * m[1] + v.y * m[1 * 4 + 1] + v.z * m[2 * 4 + 1] + m[3 * 4 + 1];
        let z = v.x * m[2] + v.y * m[1 * 4 + 2] + v.z * m[2 * 4 + 2] + m[3 * 4 + 2];
        let w = v.x * m[3] + v.y * m[1 * 4 + 3] + v.z * m[2 * 4 + 3] + m[3 * 4 + 3];

        return new Vector(x / w, y / w, z / w);
    }

    transformVertex(vertex) {
        let v = vertex.position;
        let m = this.m;
        let x = v.x * m[0] + v.y * m[1 * 4 + 0] + v.z * m[2 * 4 + 0] + m[3 * 4 + 0];
        let y = v.x * m[1] + v.y * m[1 * 4 + 1] + v.z * m[2 * 4 + 1] + m[3 * 4 + 1];
        let z = v.x * m[2] + v.y * m[1 * 4 + 2] + v.z * m[2 * 4 + 2] + m[3 * 4 + 2];
        let w = v.x * m[3] + v.y * m[1 * 4 + 3] + v.z * m[2 * 4 + 3] + m[3 * 4 + 3];

        let point = {
            x: x / w,
            y: y / w,
            z: z / w,
            w: 1 / w,
            u: vertex.u ? vertex.u / w : 0,
            v: vertex.v ? vertex.v / w : 0
        };

        return point;
    }
}
