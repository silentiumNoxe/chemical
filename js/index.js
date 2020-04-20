window.FBFMode = false;//frame-by-frame

window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    window.camera = new Camera(canvasElement);
    window.camera.scale = 10;

    window.entityArray = factoryEntities([
        {name: "H", radius: 10, x: 100, y: 100, backgroundColor: "#bb0300"},
        {x: 150}
    ]);

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

    window.entityArray.forEach(entity => {
        // entity.x = Math.random() * 1000;
        // entity.y = Math.random() * 1000;

        canvas.beginPath();

        //draw circle
        canvas.arc((entity.x+window.camera.x) * scale, (entity.y+window.camera.y) * scale, entity.radius*scale, 0, 2 * Math.PI);
        if(entity.backgroundColor != null){
            canvas.fillStyle = canvas.strokeStyle = entity.backgroundColor;
            canvas.fill();
        }

        //inner symbol
        if(entity.name != null && window.camera.scale > 7) {
            canvas.fillStyle = "#000";
            canvas.fillText(entity.name, (entity.x + window.camera.x) * scale, (entity.y + window.camera.y) * scale + 4 * (window.camera.scale / 10));
        }

        canvas.closePath();
        canvas.stroke();
    });

    //debug information
    let fps = window.FBFMode ? "FBF" : (1000/(startTime-window.lastLoopTime)).toFixed(0);
    innerHTML("#time").set("loop "+String((window.performance.now() - startTime).toFixed(0)) + " ms FPS: "+fps);

    window.lastLoopTime = startTime;

    innerHTML("#camera").set(`camera x: ${camera.x} y: ${camera.y} scale: ${camera.scale}`);
    innerHTML("#entities").set("entities: "+window.entityArray.length);

    //next frame
    if(!window.FBFMode) {
        window.requestAnimationFrame(loop);
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
