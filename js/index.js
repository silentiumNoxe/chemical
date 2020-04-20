window.FBFMode = false;//frame-by-frame
window.border = {x: 2000, y: 2000};

window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    window.camera = new Camera(canvasElement);
    window.camera.scale = 10;

    window.entityArray = [];
    // /** @type Entity[]*/window.entityArray = factoryEntities([
    //     {name: "H", radius: 20, x: 200, y: 200, backgroundColor: "white", speed: 2, angle: 60},
    //     {x: 250, angle: 90}
    // ]);

    window.requestAnimationFrame(loop);
});

function loop() {
    let startTime = window.performance.now();

    let canvasElement = document.querySelector("canvas");
    let canvas = canvasElement.getContext("2d");

    //clear canvas
    canvas.clearRect(0,0, canvasElement.width, canvasElement.height);

    //scale index
    let scale = camera.scale / 10;

    canvas.font = 10*scale+"px Arial";
    canvas.textAlign = "center";

    for(let i = 0; i < window.entityArray.length; i++){
        /** @type Entity*/let entity = window.entityArray[i];
        // let previousEntity = i-1 < 0 ? entityArray[entityArray.length - 1] : entityArray[i-1];

        canvas.beginPath();

        //draw circle
        canvas.arc((entity.x+window.camera.x) * scale, (entity.y+window.camera.y) * scale, entity.radius*scale, 0, 2 * Math.PI);
        if(entity.backgroundColor != null){
            canvas.fillStyle = canvas.strokeStyle = entity.backgroundColor;
            if(canvas.strokeStyle === "#fff" || canvas.strokeStyle === "#ffffff" || canvas.strokeStyle === "white")
                canvas.strokeStyle = "#000";
            canvas.fill();
        }

        //inner symbol
        if(entity.name != null && window.camera.scale > 7) {
            canvas.fillStyle = "#000";
            canvas.fillText(entity.name, (entity.x + window.camera.x) * scale, (entity.y + window.camera.y) * scale + 4 * (window.camera.scale / 10));
        }

        canvas.closePath();
        canvas.stroke();

        entity.move();

        if(entity.x > window.border.x || entity.y > window.border.y){
            entityArray.splice(i, 1);
        }

        entity.setAngle(entity.angle+2);
    }

    collide();

    //debug information
    let fps = window.FBFMode ? "FBF" : (1000/(startTime-window.lastLoopTime)).toFixed(0);
    innerHTML("#time").set("loop "+String((window.performance.now() - startTime).toFixed(0)) + " ms FPS: "+fps);

    window.lastLoopTime = startTime;

    innerHTML("#camera").set(`camera x: ${camera.x} y: ${camera.y} scale: ${camera.scale}`);
    innerHTML("#entities").set("entities: "+window.entityArray.length);

    // innerHTML("#en1").set(JSON.stringify(entityArray[0]));
    // innerHTML("#en2").set(JSON.stringify(entityArray[1]));

    generateRandomEntities(500);

    //next frame
    if(!window.FBFMode) {
        window.requestAnimationFrame(loop);
    }
}

function generateRandomEntities(max) {
    while (window.entityArray.length < max){
        let entity = new Entity();
        entity.x = (Math.random() * window.border.x);
        entity.y = (Math.random() * window.border.y);
        entity.backgroundColor = "white";
        entity.speed = Math.random() * 10;
        entity.angle = Math.random() * 360;
        entity.radius = Math.random() * 30;
        window.entityArray.push(entity);
    }
}

/**
 * @param en1 {Entity}
 * @param en2 {Entity}
 * */
function hitTestEntity(en1, en2) {
    let dx = en1.nextX - en2.nextX;
    let dy = en1.nextY - en2.nextY;
    let distance = (dx*dx + dy*dy);

    let res = distance <= Math.pow(en1.radius + en2.radius, 2);
    // console.log(res, distance, Math.pow(en1.radius + en2.radius, 2));
    // innerHTML("#collision").set("dis: "+distance+" a: "+Math.pow(en1.radius + en2.radius, 2)+" res: "+res);
    return res;
}

function collide() {
    for(let i = 0; i < entityArray.length; i++){
        let entity = entityArray[i];
        for(let k = 0; k < entityArray.length; k++){
            let testEntity = entityArray[k];
            if(hitTestEntity(entity, testEntity)){
                collideEntities(entity, testEntity);
            }
        }
    }
}

function collideEntities(en1, en2) {
    let dx = en1.nextX - en2.nextX;
    let dy = en1.nextY - en2.nextY;

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

function factoryEntities(entities) {
    let array = [];
    let buf = {};
    for(let i = 0; i < entities.length; i++){
        buf = Object.assign(buf, entities[i]);
        array.push(Object.assign(new Entity(), buf));
    }
    return array;
}

function nextFrame() {
    loop();
}

function switchFBF(button) {
    if(window.FBFMode == null){
        window.FBFMode = false;
    }
    window.FBFMode = !window.FBFMode;

    if(window.FBFMode){//switch on
        button.style.backgroundColor = "green";
        document.querySelector("#nextFrame").hidden = false;
    }else{//switch off
        button.style.backgroundColor = "red";
        document.querySelector("#nextFrame").hidden = true;
        document.querySelector("canvas").focus();
        requestAnimationFrame(loop);
    }
}

function innerHTML(selector) {
    return {
        append(html){
            document.querySelector(selector).innerHTML += html;
        },
        set(html){
            document.querySelector(selector).innerHTML = html;
        }
    }
}
