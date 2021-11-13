/* eslint-disable no-bitwise */
import {random01} from './utils';

export default class Color {
    // 表示颜色的类
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static newHex(e) {
        e = e.replace('#', '');
        let r = (e >>> 24) & 255;
        let g = (e >>> 16) & 255;
        let b = (e >>> 8) & 255;
        let a = e & 255;

        return new Color(r, g, b, a);
    }

    interpolate(other, factor) {
        const c1 = this;
        const c2 = other;

        const r = c1.r + (c2.r - c1.r) * factor;
        const g = c1.g + (c2.g - c1.g) * factor;
        const b = c1.b + (c2.b - c1.b) * factor;
        const a = c1.a + (c2.a - c1.a) * factor;
        return new Color(r, g, b, a);
    }

    equal(c) {
        if (this.r === c.r && this.g === c.g && this.b === c.b && this.a === c.a) {
            return true;
        }
        return false;
    }

    // 随机颜色
    static randomColor() {
        return new Color(random01(), random01(), random01(), 255);
    }

    // 常见的几个颜色
    static black() {
        return new Color(0, 0, 0, 255);
    }

    static white() {
        return new Color(255, 255, 255, 255);
    }

    static transparent() {
        return new Color(0, 0, 0, 0);
    }

    static red() {
        return new Color(255, 0, 0, 255);
    }

    static green() {
        return new Color(0, 255, 0, 255);
    }

    static blue() {
        return new Color(0, 0, 255, 255);
    }

    static alpha(c, bg) {
        let alpha = c.a / 255.0;

        let r = (1 - alpha) * bg.r + alpha * c.r;
        let g = (1 - alpha) * bg.g + alpha * c.g;
        let b = (1 - alpha) * bg.b + alpha * c.b;

        return new Color(r, g, b, 255);
    }
}
