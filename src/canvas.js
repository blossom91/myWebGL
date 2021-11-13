import Vector from './vector';
import Vertex from './vertex';
import Matrix from './matrix';
import Color from './color';
import Mesh from './mesh';
import {config} from './config';

class Camera {
    constructor() {
        // 镜头在世界坐标系中的坐标
        this.position = new Vector(
            config.camera_position_x.value,
            config.camera_position_y.value,
            config.camera_position_z.value
        );

        // 镜头看的地方
        this.target = new Vector(
            config.camera_target_x.value,
            config.camera_target_y.value,
            config.camera_target_z.value
        );

        // 镜头向上的方向
        this.up = new Vector(config.camera_up_x.value, config.camera_up_y.value, config.camera_up_z.value);
    }
}

export class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.w = canvas.width;
        this.h = canvas.height;
        this.pixels = this.context.getImageData(0, 0, this.w, this.h);
        this.bytesPerPixel = 4;

        this.camera = new Camera();
        // 灯源模型
        this.light = Mesh.sphere();
        // 初始化色值深度检测
        this.initDepth();
    }

    initDepth() {
        this.depth = [];
        for (let i = 0; i <= this.w; i++) {
            this.depth[i] = [];
            for (let j = 0; j <= this.h; j++) {
                this.depth[i][j] = Number.MAX_VALUE;
            }
        }
    }

    render() {
        // 执行这个函数后, 才会实际地把图像画出来
        const {pixels, context} = this;
        context.putImageData(pixels, 0, 0);
    }

    clear(color = Color.black()) {
        // 用 color 填充整个 canvas
        // 遍历每个像素点, 设置像素点的颜色
        this.initDepth();
        let {w, h} = this;
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                this._setPixel(x, y, 0, color);
            }
        }
        this.render();
    }

    _getPixel(x, y) {
        let int = Math.round;
        x = int(x);
        y = int(y);
        // 用座标算像素下标
        let i = (y * this.w + x) * this.bytesPerPixel;
        // 设置像素
        let p = this.pixels.data;
        return new Color(p[i], p[i + 1], p[i + 2], p[i + 3]);
    }

    _setPixel(x, y, z, color, alpha = false) {
        // 浮点转 int
        let int = Math.round;
        x = int(x);
        y = int(y);
        // 这里是一个很大的坑,不需要处理z整形
        // z = int(z)
        let depth = this.depth[x][y];
        if (z < depth || alpha) {
            if (alpha) {
                let front = null;
                let back = null;
                if (z < depth) {
                    front = color;
                    back = this._getPixel(x, y);
                }
                else {
                    front = this._getPixel(x, y);
                    back = color;
                }
                color = Color.alpha(front, back);
            }
            this.depth[x][y] = z;
            // 用座标算像素下标
            let i = (y * this.w + x) * this.bytesPerPixel;
            // 设置像素
            let p = this.pixels.data;
            let {r, g, b, a} = color;
            // 一个像素 4 字节, 分别表示 r g b a
            p[i] = int(r);
            p[i + 1] = int(g);
            p[i + 2] = int(b);
            p[i + 3] = int(a);
        }
    }

    drawPoint(point, color = Color.black()) {
        let {w, h} = this;
        let p = point;
        if (p.x >= 0 && p.x <= w) {
            if (p.y >= 0 && p.y <= h) {
                // 做一个当前背景颜色与写入颜色的差值
                if (color.a === 255) {
                    this._setPixel(p.x, p.y, p.z, color);
                }
                else if (color.a === 0) {
                    // 完全透明不绘制
                }
                else {
                    // 半透明需要混色
                    this._setPixel(p.x, p.y, p.z, color, true);
                }
            }
        }
    }

    drawLine(p1, p2, color = Color.black()) {
        let [x1, y1, z1, x2, y2, z2] = [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z];
        let dx = x2 - x1;
        let dy = y2 - y1;
        let R = (dx ** 2 + dy ** 2) ** 0.5;
        let ratio = dx === 0 ? undefined : dy / dx;
        let angle = 0;
        if (ratio === undefined) {
            const p = Math.PI / 2;
            angle = dy >= 0 ? p : -p;
        }
        else {
            const t = Math.abs(dy / R);
            const sin = ratio >= 0 ? t : -t;
            const asin = Math.asin(sin);
            angle = dx > 0 ? asin : asin + Math.PI;
        }
        for (let r = 0; r <= R; r++) {
            const x = x1 + Math.cos(angle) * r;
            const y = y1 + Math.sin(angle) * r;
            let z = z1 + (z2 - z1) * (r / R) + 0.0000001;
            this.drawPoint(new Vector(x, y, z), color);
        }
    }

    colorFromUV(p, imageInfo) {
        let {w, h, colorList} = imageInfo;
        let {u, v} = p;
        u = Math.abs(u);
        u *= (1 / p.w);
        u = u > 1 ? 1 : u;
        v = Math.abs(v);
        v *= (1 / p.w);
        v = v > 1 ? 1 : v;
        u = Math.ceil(u * (w - 1));
        v = Math.ceil(v * (h - 1));
        let color = colorList[v][u];
        return color;
    }

    drawScanline(v1, v2, imageInfo, cosValue) {
        let [a, b] = [v1, v2].sort((va, vb) => va.position.x - vb.position.x);
        let x1 = a.position.x;
        let x2 = b.position.x;
        for (let x = x1; x <= x2; x++) {
            let factor = 0;
            if (x2 !== x1) {
                factor = (x - x1) / (x2 - x1);
            }
            let p = a.interpolate(b, factor);
            let color = a.color.interpolate(b.color, factor);

            if (imageInfo) {
                color = this.colorFromUV(p, imageInfo, cosValue);
            }
            if (cosValue !== undefined) {
                let {r, g, b, a} = color;
                r = Math.max(0, Math.round(r * cosValue));
                g = Math.max(0, Math.round(g * cosValue));
                b = Math.max(0, Math.round(b * cosValue));
                color = new Color(r, g, b, a);
            }

            this.drawPoint(p.position, color);
        }
    }

    drawTriangle(v1, v2, v3, imageInfo, cosValue) {
        let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y);
        let middleFactor = 0;
        if (c.position.y - a.position.y !== 0) {
            middleFactor = (b.position.y - a.position.y) / (c.position.y - a.position.y);
        }
        let middle = a.interpolate(c, middleFactor);
        let startY = a.position.y;
        let endY = b.position.y;
        for (let y = startY; y <= endY; y++) {
            let factor = 0;
            if (endY !== startY) {
                factor = (y - startY) / (endY - startY);
            }
            let va = a.interpolate(middle, factor);
            let vb = a.interpolate(b, factor);

            this.drawScanline(va, vb, imageInfo, cosValue);
        }
        startY = b.position.y;
        endY = c.position.y;
        for (let y = startY; y <= endY; y++) {
            let factor = 0;
            if (endY !== startY) {
                factor = (y - startY) / (endY - startY);
            }
            let va = middle.interpolate(c, factor);
            let vb = b.interpolate(c, factor);
            this.drawScanline(va, vb, imageInfo, cosValue);
        }
    }

    project(coordVector, transformMatrix) {
        let {w, h} = this;
        let [w2, h2] = [w / 2, h / 2];
        let point = transformMatrix.transformVertex(coordVector);
        let x = point.x * w2 + w2;
        let y = -point.y * h2 + h2;
        let z = -point.z * 1 + 1;
        let v = new Vector(x, y, z);
        return new Vertex(v, coordVector.color, point.u, point.v, point.w, coordVector.normal);
    }

    drawMesh(mesh) {
        let {w, h} = this;
        let {position, target, up} = this.cameraNow();
        const view = Matrix.lookAtLH(position, target, up);
        // field of view
        const projection = Matrix.perspectiveFovLH(0.8, w / h, 0.1, 1);

        // 得到 mesh 中点在世界中的坐标(模型自绘制逻辑)
        // const rotation = Matrix.rotation(mesh.rotation);
        // const scale = Matrix.scale(mesh.scale);
        // const translation = Matrix.translation(mesh.position);
        // const world = scale.multiply(rotation).multiply(translation);

        // 通过设置项取代mesh相关属性
        mesh.rotation = new Vector(config.rotation_x.value, config.rotation_y.value, config.rotation_z.value);
        mesh.position = new Vector(
            config.mesh_position_x.value,
            config.mesh_position_y.value,
            config.mesh_position_z.value
        );

        // const scale = new Vector(config.scale_x.value, config.scale_y.value, config.scale_z.value);
        // multiply scale position z 失效  原因未知
        const world = Canvas.worldMatrix(mesh.rotation, mesh.position);

        // 矩阵相乘可以叠加(线性代数知识)
        const transform = world.multiply(view).multiply(projection);

        // 获取光源点世界坐标
        let light = this.light;
        let lworld = Canvas.worldMatrix(light.rotation, light.position, light.scale);
        let lv = light.position;
        let lwp = lworld.transform(lv);

        for (let t of mesh.indices) {
            // 拿到三角形的三个顶点
            let [a, b, c] = t.map(i => mesh.vertices[i]);

            // 拿到三角形中心点(重心)
            let triangleCenter = Vector.core(a.position, b.position, c.position);
            // 三角形重心世界坐标转换
            triangleCenter = world.transform(triangleCenter);
            // 光线与三角形重心法向量
            let lightVector = lwp.sub(triangleCenter).normalize();

            // 三角形平面法向量
            let normalVector = Vector.core(a.normal, b.normal, c.normal);
            // 三角形平面法向量世界坐标转换 不需要postion变换
            normalVector = Canvas.worldMatrixNormal(mesh.rotation, mesh.scale)
                .transform(normalVector)
                .normalize();

            let cameraNormal = target.sub(position).normalize();
            let cameraCos = normalVector.dot(cameraNormal);
            // 大于0 即 -90 到 90 的夹角都是背面 不画
            if (cameraCos > 0) {
                continue;
            }
            // 三角形平面法向量 与 光线向量夹角 cos
            let cosValue = normalVector.dot(lightVector);

            // 拿到屏幕上的 3 个像素点
            let [v1, v2, v3] = [a, b, c].map(v => this.project(v, transform));
            // 把这个三角形画出来
            this.drawTriangle(v1, v2, v3, mesh.imageInfo, cosValue);
        }
    }

    static worldMatrix(rotation, position, scale) {
        // 如果有旋转, 通过 rotation 得到旋转变换
        const r = Matrix.rotation(rotation);
        // 这里的 position 其实是世界坐标, 其他以该点为参照的点需要通过 translation 得到位移变换
        const t = Matrix.translation(position);
        // 如果有缩放, 通过 scale 得到缩放变换
        let world;
        // 原因是 multiply scale postion z失效 暂时不知道原因  怀疑是光源scale问题
        if (scale !== undefined) {
            const s = Matrix.scale(scale);
            world = r.multiply(t).multiply(s);
        }
        else {
            world = r.multiply(t);
        }
        // 两次变换相乘, 得到一个世界变换
        // 世界变换的意思是说, 任何一个相对于 position 的点, 通过这个变换能得到世界坐标
        return world;
    }

    static worldMatrixNormal(rotation, scale) {
        const r = Matrix.rotation(rotation);
        const s = Matrix.scale(scale);
        const world = r
            .multiply(s)
            .inverse()
            .transpose();
        return world;
    }

    // 话光源 可以支持多模型绘制 需要维护一个meshs数组 draw的时候遍历处理 但就不做了 电脑扛不住...
    drawLight() {
        let {w, h} = this;
        let {position, target, up} = this.cameraNow();
        const view = Matrix.lookAtLH(position, target, up);
        const projection = Matrix.perspectiveFovLH(0.8, w / h, 0.1, 1);
        let mesh = this.light;
        this.light.position = new Vector(config.light_x.value, config.light_y.value, config.light_z.value);
        const world = Canvas.worldMatrix(mesh.rotation, mesh.position, mesh.scale);
        const transform = world.multiply(view).multiply(projection);
        // eslint-disable-next-line no-restricted-syntax
        for (let t of mesh.indices) {
            // 拿到三角形的三个顶点
            let [a, b, c] = t.map(i => mesh.vertices[i]);

            // 拿到屏幕上的 3 个像素点
            let [v1, v2, v3] = [a, b, c].map(v => this.project(v, transform));
            // 把这个三角形画出来

            this.drawTriangle(v1, v2, v3, mesh.imageInfo);
        }
    }

    cameraNow() {
        let position = new Vector(
            config.camera_position_x.value,
            config.camera_position_y.value,
            config.camera_position_z.value
        );
        let target = new Vector(
            config.camera_target_x.value,
            config.camera_target_y.value,
            config.camera_target_x.value
        );
        let up = new Vector(config.camera_up_x.value, config.camera_up_y.value, config.camera_up_z.value);
        return {position, target, up};
    }
}
