/**
 * @param x {number}
 * @param y {number}
 * */
function Position(x, y) {
    this.x = x;
    this.y = y;
}

/** @param target {Position | {x: number, y: number}}*/
Position.prototype.distanceTo = function (target) {
    let a = this.x - target.x;
    let b = this.y - target.y;
    return Math.sqrt(a*a+b*b);
};