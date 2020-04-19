function Camera(canvasElement){
    this.x = 0;
    this.y = 0;

    this.scale = 50;
    let scaleMax = 100;
    let scaleMin = 1;

    /** @type HTMLCanvasElement*/this.canvas = canvasElement;

    let canvas = this.canvas;
    this.canvas.onmousemove = function (event) {
        if(!canvas.clickStarted){
            return;
        }

        let rect = this.getBoundingClientRect();
        let mouse = {x: (event.clientX - rect.left).toFixed(0), y: (event.clientY - rect.top).toFixed(0)};
        canvas.mouseEnd = {x: mouse.x - canvas.mouseStart.x, y: mouse.y - canvas.mouseStart.y};
        canvas.camera.x = canvas.mouseEnd.x;
        canvas.camera.y = canvas.mouseEnd.y;
    };

    this.canvas.onmousedown = function (event) {
        let rect = this.getBoundingClientRect();
        canvas.mouseStart = {
            x: ((event.clientX - rect.left).toFixed(0)) - canvas.camera.x,
            y: ((event.clientY - rect.top).toFixed(0)) - canvas.camera.y
        };
        canvas.clickStarted = true;
    };

    this.canvas.onmouseup = this.canvas.onmouseleave = function () {
        canvas.clickStarted = false;
    };

    let camera = this;
    this.canvas.onwheel = function (event) {
        if(event.deltaY > 0){
            camera.scale++;
            if(camera.scale > scaleMax){
                camera.scale = scaleMax;
            }
        }else{
            camera.scale--;
            if(camera.scale < scaleMin){
                camera.scale = scaleMin;
            }
        }
    }
}