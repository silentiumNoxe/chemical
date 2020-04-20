function Entity(name) {
    this.x = 0;
    this.y = 0;
    this.nextX = this.x;
    this.nextY = this.y;

    this.radius = 1;
    this.speed = 0;
    this.angle = 0;
    this.mass = 1;

    this.name = name;

    this.backgroundColor = null;

    this.age = 1000;
}

Entity.prototype.move = function () {
    let radians = this.angle * Math.PI / 180;
    this.velocityX = Math.cos(radians) * this.speed;
    this.velocityY = Math.sin(radians) * this.speed;

    collide(this);

    this.nextX = (this.x += this.velocityX);
    this.nextY = (this.y += this.velocityY);
};

Entity.prototype.collideWith = function (target) {
    let speed1 = Math.sqrt(Math.pow(this.velocityX, 2) + Math.pow(this.velocityY, 2));
    let speed2 = Math.sqrt(Math.pow(target.velocityX, 2) + Math.pow(target.velocityY, 2));

    let direction1 = Math.atan2(this.velocityX, this.velocityY);
    let direction2 = Math.atan2(target.velocityX, target.velocityY);
};

Entity.prototype.setX = function (val) {
    this.x = Number(val).toFixed(0);
};

Entity.prototype.setY = function (val) {
    this.y = Number(val).toFixed(0);
};

Entity.prototype.setNextX = function (val) {
    this.nextX = Number(val).toFixed(0);
};

Entity.prototype.setNextY = function (val) {
    this.nextY = Number(val).toFixed(0);
};

Entity.prototype.setAngle = function (val) {
    let max = 360;
    while (val > max) {
        val -= max;
    }

    while (val < 0){
        val += max;
    }

    this.angle = val;
};