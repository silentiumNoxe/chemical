class Pos{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    /** @param pos {Pos | {x: number, y: number}}*/
    distance(pos){
        let deltaX = this.x - pos.x;
        let deltaY = this.y - pos.y;
        return Math.sqrt(deltaX*deltaX+deltaY*deltaY);
    }
}