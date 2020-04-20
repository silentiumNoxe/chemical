function Entity(name) {
    this.x = 0;
    this.y = 0;
    this.radius = 1;
    this.speed = 0;
    this.angle = 0;

    this.name = name;

    this.backgroundColor = null;
}

Entity.prototype.move = function () {
    let radians = this.angle * Math.PI / 180;
    let xunits = Math.cos(radians) * this.speed;
    let yunits = Math.sin(radians) * this.speed;

    this.x += xunits;
    this.y += yunits;
};