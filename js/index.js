window.FBFMode = false;//frame-by-frame
window.border = {x: 5000, y: 5000};

window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    window.camera = new Camera(canvasElement);
    window.camera.x = 3000;
    window.camera.y = 2000;

    window.entityArray = [];
    // /** @type Entity[]*/window.entityArray = factoryEntities([
    //     {name: "H", radius: 100, x: 200, y: 200, backgroundColor: "white", speed: 1, angle: 60},
    //     {x: 450, angle: 90}
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

    let sumLife = 0;

    for(let i = 0; i < window.entityArray.length; i++){
        /** @type Entity*/let entity = window.entityArray[i];

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
            window.entityArray.splice(i, 1);
        }

        if(entity.x < 0 || entity.y < 0){
            window.entityArray.splice(i, 1);
        }

        // entity.setAngle(entity.angle+2);
        if(entity.age === 0){
            entityArray.splice(i,  1);
        }else {
            entity.age--;
            sumLife += entity.age;
        }

        // collide(entity);
    }

    //debug information
    let fps = window.FBFMode ? "FBF" : (1000/(startTime-window.lastLoopTime)).toFixed(0);
    innerHTML("#time").set("loop "+String((window.performance.now() - startTime).toFixed(0)) + " ms FPS: "+fps);

    window.lastLoopTime = startTime;

    innerHTML("#camera").set(`camera x: ${camera.x} y: ${camera.y} scale: ${camera.scale}`);
    innerHTML("#entities").set("entities: "+window.entityArray.length);
    // console.dir(entityArray);
    innerHTML("#avrLife").set("average life: "+Math.floor(sumLife/entityArray.length));

    // innerHTML("#en1").set(JSON.stringify(entityArray[0]));
    // innerHTML("#en2").set(JSON.stringify(entityArray[1]));

    generateRandomEntities(document.querySelector("#quantityEntities").value);

    //next frame
    if(!window.FBFMode) {
        window.requestAnimationFrame(loop);
    }
}

function generateRandomEntities(max) {
    while (window.entityArray.length < max){
        let entity = new Entity();
        entity.x = Math.floor(Math.random() * window.border.x);
        entity.y = Math.floor(Math.random() * window.border.y);
        entity.backgroundColor = "white";
        entity.speed = Math.floor(Math.random() * 10);
        entity.angle = Math.floor(Math.random() * 360);
        entity.radius = Math.floor(Math.random() * (100 - 20) + 20);
        window.entityArray.push(entity);
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