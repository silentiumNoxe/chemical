window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.camera = new Camera(canvasElement);

    let canvas = canvasElement.getContext("2d");
    let timeElement = document.querySelector("#time");

    setInterval(() => {
        let startTime = performance.now();
        canvas.clearRect(0,0, canvasElement.width, canvasElement.height);

        canvas.beginPath();
        canvas.fillRect(50+canvasElement.camera.x, 50+canvasElement.camera.y,10, 10);
        canvas.closePath();
        canvas.stroke();

        timeElement.innerHTML = String((performance.now() - startTime).toFixed(0)) + " ms";
    }, 10);
});

