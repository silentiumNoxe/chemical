function Camera(canvasElement){
    this.x = 0;
    this.y = 0;

    this.scale = 50;

    let scaleMax = 100;
    let scaleMin = 1;

    /** @type HTMLCanvasElement*/this.canvas = canvasElement;

    let camera = this;
    let mouseStart = {};
    let clickStarted = false;
    this.canvas.onmousemove = function (event) {
        if(!clickStarted){
            return;
        }

        let rect = this.getBoundingClientRect();
        let mouse = {x: (event.clientX - rect.left).toFixed(0), y: (event.clientY - rect.top).toFixed(0)};
        let mouseEnd = {x: mouse.x - mouseStart.x, y: mouse.y - mouseStart.y};
        camera.x = mouseEnd.x;
        camera.y = mouseEnd.y;
    };

    this.canvas.onmousedown = function (event) {
        let rect = this.getBoundingClientRect();
        mouseStart = {
            x: ((event.clientX - rect.left).toFixed(0)) - camera.x,
            y: ((event.clientY - rect.top).toFixed(0)) - camera.y
        };
        clickStarted = true;
    };

    this.canvas.onmouseup = this.canvas.onmouseleave = function () {
        clickStarted = false;
    };

    
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