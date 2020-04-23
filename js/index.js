window.FBFMode = false;//frame-by-frame
window.border = {x: 10000, y: 5000};
window.entities = [];

window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    window.canvasContext = canvasElement.getContext("2d");

    window.camera = new Camera(canvasElement);
    window.camera.x = 0;
    window.camera.y = 0;

    window.requestAnimationFrame(loop);
});

function loop() {
    let startTime = window.performance.now();

    let canvasElement = document.querySelector("canvas");
    let canvas = window.canvasContext;

    //clear canvas
    canvas.clearRect(0,0, canvasElement.width, canvasElement.height);

    //scale index
    let scale = window.camera.scale / 10;

    canvas.font = 10*scale+"px Arial";
    canvas.textAlign = "center";

    let sumLife = 0;

    for(let i = 0; i < window.entityArray.length; i++){
        /** @type Entity*/let entity = window.entityArray[i];

        drawEntity(entity, canvas);

        if(entity.age === 0){
            entityArray.splice(i,  1);
        }else {
            entity.age--;
            sumLife += entity.age;
        }

        entity.updateState();
    }

    //debug information
    let fps = window.FBFMode ? "FBF" : (1000/(startTime-window.lastLoopTime)).toFixed(0);
    innerHTML("#time").set("loop "+String((window.performance.now() - startTime).toFixed(0)) + " ms FPS: "+fps);

    window.lastLoopTime = startTime;

    innerHTML("#camera").set(`camera x: ${camera.x} y: ${camera.y} scale: ${camera.scale}`);
    innerHTML("#entities").set("entities: "+window.entityArray.length);
    // console.dir(entityArray);
    innerHTML("#avrLife").set("average life: "+Math.floor(sumLife/entityArray.length));

    innerHTML("#en1").set(JSON.stringify(entityArray[0].position));
    // innerHTML("#en2").set(JSON.stringify(entityArray[1]));

    generateRandomEntities(document.querySelector("#quantityEntities").value);

    //next frame
    if(!window.FBFMode) {
        window.requestAnimationFrame(loop);
    }
}

/**
 * @param entity {Entity}
 * @param canvas {CanvasRenderingContext2D}
 * */
function drawEntity(entity, canvas) {
    let scale = window.camera.scale / 10;

    canvas.beginPath();

    entity.radius

    //draw circle
    canvas.arc((entity.position.x+window.camera.x) * scale, (entity.position.y+window.camera.y) * scale, entity.radius*scale, 0, 2 * Math.PI);
    if(entity.backgroundColor != null){
        canvas.fillStyle = canvas.strokeStyle = entity.backgroundColor;
        if(canvas.strokeStyle === "#fff" || canvas.strokeStyle === "#ffffff" || canvas.strokeStyle === "white")
            canvas.strokeStyle = "#000";
        canvas.fill();
    }

    //inner symbol
    if(entity.name != null && window.camera.scale > 7) {
        canvas.fillStyle = "#000";
        canvas.fillText(entity.name, (entity.position.x + window.camera.x) * scale, (entity.position.y + window.camera.y) * scale + 4 * (window.camera.scale / 10));
    }

    canvas.closePath();
    canvas.stroke();
}

function generateRandomEntities(max) {
    while (window.entities.length < max){
        let entity = new Entity();
        let x = Math.floor(Math.random() * window.border.x);
        let y = Math.floor(Math.random() * window.border.y);
        entity.pos = new Pos(x, y);
        entity.color = "white";
        entity.velocity = Math.floor(Math.random() * 20);
        entity.angle = Math.floor(Math.random() * 360);
        entity.radius = Math.floor(Math.random() * (100 - 20) + 20);
        window.entities.push(entity);
    }
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

function debug(mark, val) {
    let debug = document.querySelector("#debug");
    
}