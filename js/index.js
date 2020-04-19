window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    let camera = new Camera(canvasElement);
    camera.scale = 10;

    canvasElement.camera = camera;

    let canvas = canvasElement.getContext("2d");

    let entityArray = factoryEntities([
        {name: "H", radius: 10},
    ]);

    let framesCounter = 0;

    function loop(){
        let startTime = performance.now();
        canvas.clearRect(0,0, canvasElement.width, canvasElement.height); //clear canvas

        let scale = camera.scale / 10; //scale index

        canvas.font = 10*scale+"px Arial";
        canvas.textAlign = "center";

        entityArray.forEach(entity => {
            entity.x = Math.random() * 1000;
            entity.y = Math.random() * 1000;

            canvas.beginPath();
            canvas.arc((entity.x+camera.x) * scale, (entity.y+camera.y) * scale, entity.radius*scale, 0, 2 * Math.PI);
            // if(camera.scale > 7) {
            //     canvas.fillText(entity.name, (entity.x + camera.x) * scale, (entity.y + camera.y) * scale + 4 * (camera.scale / 10));
            // }
            canvas.fill();
            canvas.closePath();
            canvas.stroke();
        });

        canvas.stroke();

        document.querySelector("#time").innerHTML =
            String((performance.now() - startTime).toFixed(0)) + " ms";
        document.querySelector("#debug #camera").innerHTML =
            `x: ${camera.x} y: ${camera.y} scale: ${camera.scale}`;
        document.querySelector("#debug #entities").innerHTML = "entities: "+entityArray.length;

        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
});

function factoryEntities(entities) {
    let array = [];
    let buf = {};
    for(let i = 0; i < entities.length; i++){
        let entity = new Entity();
        entity.name = buf.name = entities[i].name != null ? entities[i].name : buf.name;
        entity.x = buf.x = entities[i].x != null ? entities[i].x : buf.x;
        entity.y = buf.y = entities[i].y != null ? entities[i].y : buf.y;
        entity.radius = buf.radius = entities[i].radius != null ? entities[i].radius : buf.radius;
        array.push(entity);
    }
    return array;
}

