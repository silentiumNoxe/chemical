/** @param position {Position}*/
function Vector(position) {
    this.direction = position;
}

Vector.fromAngleSpeed = function(angle, speed){
    let radians = this.angle * Math.PI / 180;
    let x = Math.floor(Math.cos(radians) * this.speed);
    let y = Math.floor(Math.sin(radians) * this.speed);

    return new Vector(new Position(x, y));
};