class Camera {

    static SCALE_MAX = 100;
    static SCALE_MIN = 1;

    constructor(){
        this.pos = new Pos(0, 0);

        this.scale = 1;
    }

    /** @param context {HTMLCanvasElement}*/
    configureCanvas(context){
        const cameraContext = this;
        const mouse = {
            movePos: null,
            clickDown: null,
            clickUp: null,
            clicked: false
        };

        context.onmousemove = function (event) {
            if(mouse.clicked){
                cameraContext.pos = mouse.movePos;
            }

            mouse.movePos = new Pos(event.pageX, event.pageY);
        };

        context.onmousedown = function (event) {
            mouse.clicked = true;
            mouse.clickDown = new Pos(event.pageX, event.pageY);
        };

        context.onmouseup = context.onmouseleave = function (event) {
            mouse.clicked = false;
            mouse.clickUp = new Pos(event.pageX, event.pageY);
        }
    }
}

function CameraA(canvasElement){
    this.x = 0;
    this.y = 0;

    this.scale = 1;

    let scaleMax = 100;
    let scaleMin = 1;

    /** @type HTMLCanvasElement*/this.canvas = canvasElement;

    let camera = this;
    let mouseStart = {};
    let clickStarted = false;
    let mouse = {};
    let mouseMoveEvent = {};
    this.canvas.onmousemove = function (event) {
        let rect = this.getBoundingClientRect();
        mouse = {x: (event.clientX - rect.left).toFixed(0), y: (event.clientY - rect.top).toFixed(0)};
        mouseMoveEvent = {clientX: event.clientX, clientY: event.clientY};

        if(clickStarted){
            camera.x = mouse.x - mouseStart.x;
            camera.y = mouse.y - mouseStart.y;
        }
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

        clickStarted = true;
        camera.canvas.onmousedown(mouseMoveEvent);
        camera.canvas.onmousemove(mouseMoveEvent);
        clickStarted = false;
    }
}