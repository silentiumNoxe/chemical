window.addEventListener("DOMContentLoaded", () => {
    let canvasElement = document.querySelector("canvas");
    canvasElement.onmousemove = canvasMoveListener;
    canvasElement.onmousedown = canvasClickDownListener;
    canvasElement.onmouseup = canvasClickUpListener;
    canvasElement.camera = new Camera();

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

function canvasMoveListener(event) {
    if(!this.clickStarted){
        return;
    }

    let rect = this.getBoundingClientRect();

    let mouse = {x: (event.clientX - rect.left).toFixed(0), y: (event.clientY - rect.top).toFixed(0)};
    this.mouseEnd = {x: mouse.x - this.mouseStart.x, y: mouse.y - this.mouseStart.y};
    this.camera.x = this.mouseEnd.x;
    this.camera.y = this.mouseEnd.y;

    document.querySelector("#mouse #asdf").innerHTML = "move.mouse "+JSON.stringify(mouse);
    document.querySelector("#mouse #final").innerHTML = "move.result "+JSON.stringify(this.camera);
}

function canvasClickDownListener(event) {
    let rect = this.getBoundingClientRect();
    let click = {
        x: (event.clientX - rect.left).toFixed(0),
        y: (event.clientY - rect.top).toFixed(0)
    };
    this.mouseStart = {
        x: ((event.clientX - rect.left).toFixed(0)) - this.camera.x,
        y: ((event.clientY - rect.top).toFixed(0)) - this.camera.y
    };

    document.querySelector("#mouse #click").innerHTML = "click "+JSON.stringify(click);
    document.querySelector("#mouse #camera").innerHTML = "click.camera "+JSON.stringify(this.camera);
    document.querySelector("#mouse #result").innerHTML = "click.resultStart"+JSON.stringify(this.mouseStart);
    this.clickStarted = true;
}

function canvasClickUpListener() {
    this.clickStarted = false;
}

