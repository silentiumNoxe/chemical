function Entity(name) {
    this.position = null;

    this.nextX = this.x;
    this.nextY = this.y;

    this.radius = 1;
    this.speed = 0;
    this.angle = 0;
    this.mass = 1;

    this.name = name;

    this.backgroundColor = null;

    this.age = 2000;
}

Entity.prototype.move = function (vector) {
    // collision(this);

    this.position =
        new Position(this.position.x+vector.direction.x, this.position.y+vector.direction.y);
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

Entity.prototype.checkCollisionWith = function (target) {
    let distance = this.position.distanceTo(target.position);

    innerHTML("#en1").set(this.angle +" "+distance);
    let a = (this.radius + target.radius) * (this.radius + target.radius);

    return distance <= a;
};

Entity.prototype.doCollision = function (target) {
    let distance = this.position.distanceTo(target.position);
    innerHTML("#en1").append(" "+ distance);

    this.angle = Math.floor(this.angle / distance);

    this.cols++;

    if(!this.cols){
        this.backgroundColor = "white";
        this.cols = 0;
    }else if(this.cols > 1 && this.cols < 5){
        this.backgroundColor = "red";
    }else if(this.cols > 5 && this.cols < 10){
        this.backgroundColor = "blue";
    }else if(this.cols > 100){
        this.backgroundColor = "black";
    }
};

function collision(entity) {
    for(let k = 0; k < entityArray.length; k++){
        let testEntity = entityArray[k];
        if(testEntity === entity) continue;
        if(entity.checkCollisionWith(testEntity)){
            entity.doCollision(testEntity);
        }
    }
}

function collideEntities(en1, en2) {
    let dx = Math.floor(en1.nextX - en2.nextX);
    let dy = Math.floor(en1.nextY - en2.nextY);

    let collisionAngle = Math.atan2(dy, dx);

    let speed1 = Math.sqrt(en1.velocityX * en1.velocityX +
        en1.velocityY * en1.velocityY);
    let speed2 = Math.sqrt(en2.velocityX * en2.velocityX +
        en2.velocityY * en2.velocityY);

    let direction1 = Math.atan2(en1.velocityY, en1.velocityX);
    let direction2 = Math.atan2(en2.velocityY, en2.velocityX);

    let velocityx_1 = speed1 * Math.cos(direction1 - collisionAngle);
    let velocityy_1 = speed1 * Math.sin(direction1 - collisionAngle);
    let velocityx_2 = speed2 * Math.cos(direction2 - collisionAngle);
    let velocityy_2 = speed2 * Math.sin(direction2 - collisionAngle);

    let final_velocityx_1 = ((en1.mass - en2.mass) * velocityx_1 +
        (en2.mass + en2.mass) * velocityx_2)/(en1.mass + en2.mass);
    let final_velocityx_2 = ((en1.mass + en1.mass) * velocityx_1 +
        (en2.mass - en1.mass) * velocityx_2)/(en1.mass + en2.mass);

    let final_velocityy_1 = velocityy_1;
    let final_velocityy_2 = velocityy_2;

    en1.velocityX = Math.cos(collisionAngle) * final_velocityx_1 +
        Math.cos(collisionAngle + Math.PI/2) * final_velocityy_1;
    en1.velocityY = Math.sin(collisionAngle) * final_velocityx_1 +
        Math.sin(collisionAngle + Math.PI/2) * final_velocityy_1;
    en2.velocityX = Math.cos(collisionAngle) * final_velocityx_2 +
        Math.cos(collisionAngle + Math.PI/2) * final_velocityy_2;
    en2.velocityY = Math.sin(collisionAngle) * final_velocityx_2 +
        Math.sin(collisionAngle + Math.PI/2) * final_velocityy_2;

    en1.setNextX(en1.nextX += en1.velocityX);
    en1.setNextY(en1.nextY += en1.velocityY);
    en2.setNextX(en2.nextX += en2.velocityX);
    en2.setNextY(en2.nextY += en2.velocityY);
}