function Camera(canvasElement){
    this.x = 0;
    this.y = 0;
    /** @type HTMLCanvasElement*/this.canvas = canvasElement;

    this.canvas.onmousemove = function (event) {
        if(!this.clickStarted){
            return;
        }

        let rect = this.getBoundingClientRect();
        let mouse = {x: (event.clientX - rect.left).toFixed(0), y: (event.clientY - rect.top).toFixed(0)};
        this.mouseEnd = {x: mouse.x - this.mouseStart.x, y: mouse.y - this.mouseStart.y};
        this.camera.x = this.mouseEnd.x;
        this.camera.y = this.mouseEnd.y;
    };

    this.canvas.onmousedown = function (event) {
        let rect = this.getBoundingClientRect();
        this.mouseStart = {
            x: ((event.clientX - rect.left).toFixed(0)) - this.camera.x,
            y: ((event.clientY - rect.top).toFixed(0)) - this.camera.y
        };
        this.clickStarted = true;
    };

    this.canvas.onmouseup = this.canvas.onmouseleave = function () {
        this.clickStarted = false;
    };
}