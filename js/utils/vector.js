/** @param position {Position}*/
function Vector(position) {
    this.direction = position;
}

Vector.prototype.offsetX = function(x){
    let val = this.direction.x + x;
    return new Vector(new Position(val, this.direction.y));
};

Vector.prototype.offsetY = function(y){
    let val = this.direction.y + y;
    return new Vector(new Position(this.direction.x, val));
};

/** @param pos {Position}*/
Vector.prototype.offsetToPosition = function(pos){
    let x = this.direction.x+pos.x;
    let y = this.direction.y+pos.y;
    return new Vector(new Position(x, y));
};

/**
 * @param angle {number}
 * @param speed {number}
 * */
Vector.fromAngleSpeed = function(angle, speed){
    let radians = angle * Math.PI / 180;
    let x = Math.floor(Math.cos(radians) * speed);
    let y = Math.floor(Math.sin(radians) * speed);

    return new Vector(new Position(x, y));
};