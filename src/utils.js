const log = console.log.bind(console);

const _e = sel => document.querySelector(sel);

const _es = sel => document.querySelectorAll(sel);

const int = Math.floor;

const interpolate = (a, b, factor) => a + (b - a) * factor;

const random01 = (a = 0, b = 255) => Math.round(Math.random() * (b - a)) + a;

export {
    //
    log,
    _e,
    _es,
    interpolate,
    int,
    random01
};
