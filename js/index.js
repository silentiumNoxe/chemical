window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    let camera = new Camera(canvasElement);
    canvasElement.camera = camera;

    let canvas = canvasElement.getContext("2d");
    let timeElement = document.querySelector("#time");

    let entityArray = factoryEntities([
        {name: "H", x: 50, y: 50, radius: 10},
        {x: 80, y: 50}
    ]);

    setInterval(() => {
        let startTime = performance.now();
        canvas.clearRect(0,0, canvasElement.width, canvasElement.height); //clear canvas

        let scale = camera.scale / 10; //scale index

        canvas.font = 10*scale+"px Arial";
        canvas.textAlign = "center";

        entityArray.forEach(entity => {
            canvas.beginPath();
            canvas.arc((entity.x+camera.x) * scale, (entity.y+camera.y) * scale, entity.radius*scale, 0, 2 * Math.PI);
            if(camera.scale > 7) {
                canvas.fillText(entity.name, (entity.x + camera.x) * scale, (entity.y + camera.y) * scale + 4 * (camera.scale / 10));
            }
            canvas.closePath();
            canvas.stroke();
        });

        canvas.stroke();

        timeElement.innerHTML = String((performance.now() - startTime).toFixed(0)) + " ms";
        document.querySelector("#debug #camera").innerHTML =
            `x: ${camera.x} y: ${camera.y} scale: ${camera.scale}`;
    }, 10);
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

