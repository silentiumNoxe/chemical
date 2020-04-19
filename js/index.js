window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.camera = new Camera(canvasElement);

    let canvas = canvasElement.getContext("2d");
    let timeElement = document.querySelector("#time");

    let entity1 = new Entity();
    entity1.x = 50;
    entity1.y = 50;
    entity1.radius = 20;

    let entity2 = new Entity();
    entity2.x = 50;
    entity2.y = 150;
    entity2.radius = 20;

    setInterval(() => {
        let startTime = performance.now();
        canvas.clearRect(0,0, canvasElement.width, canvasElement.height);

        let scale = canvasElement.camera.scale / 10;

        canvas.beginPath();
        canvas.arc((entity1.x+canvasElement.camera.x) * scale, (entity1.y+canvasElement.camera.y) * scale, entity1.radius*scale, 0, 6);
        canvas.fill();
        canvas.closePath();

        canvas.beginPath();
        canvas.arc((entity2.x+canvasElement.camera.x) * scale, (entity2.y+canvasElement.camera.y) * scale, entity2.radius*scale, 0, 6);
        canvas.fill();
        canvas.closePath();

        canvas.stroke();

        timeElement.innerHTML = String((performance.now() - startTime).toFixed(0)) + " ms";
    }, 10);
});

