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

    let mouseDiv = document.querySelector("#mouse #move");
    let rect = this.getBoundingClientRect();

    let mouse = {x: (event.clientX - rect.left).toFixed(0), y: (event.clientY - rect.top).toFixed(0)};
    this.mouseEnd = {x: mouse.x - this.mouseStart.x, y: mouse.y - this.mouseStart.y};
    this.camera.x = this.mouseEnd.x;
    this.camera.y = this.mouseEnd.y;

    // mouseDiv.innerHTML =
    //     `
    //         <p>MOUSE X: ${this.mouseEnd.x}</p>
    //         <p>MOUSE Y: ${this.mouseEnd.y}</p>
    //         <p>CAMERA X: ${this.camera.x}</p>
    //         <p>CAMERA Y: ${this.camera.y}</p>
    //     `;
}

function canvasClickDownListener(event) {
    // let mouseDiv = document.querySelector("#mouse #clickStart");
    let rect = this.getBoundingClientRect();
    let click = {
        x: (event.clientX - rect.left).toFixed(0),
        y: (event.clientY - rect.top).toFixed(0)
    };
    this.mouseStart = {
        x: ((event.clientX - rect.left).toFixed(0)) - this.camera.x,
        y: ((event.clientY - rect.top).toFixed(0)) - this.camera.y
    };
    // this.mouseStart = {x: this.camera.x, y: this.camera.y};
    //

    document.querySelector("#mouse #click").innerHTML = JSON.stringify(click);
    document.querySelector("#mouse #camera").innerHTML = JSON.stringify(this.camera);
    document.querySelector("#mouse #result").innerHTML = JSON.stringify(this.mouseStart);
    this.clickStarted = true;
}

function canvasClickUpListener(event) {
    let mouseDiv = document.querySelector("#mouse #clickEnd");
    let rect = this.getBoundingClientRect();
    let mouse = {x: (event.clientX - rect.left).toFixed(0), y: (event.clientY - rect.top).toFixed(0)};
    this.mouseEnd = {x: mouse.x - this.mouseStart.x, y: mouse.y - this.mouseStart.y};

    this.clickStarted = false;
}

