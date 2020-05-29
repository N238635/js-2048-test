class Square {
    constructor(position, value) {
        this.x = position.x;
        this.y = position.y;
        this.value = value;
        this.oldPosition = null;
    }

    move(position) {
        this.oldPosition = { x: this.x, y: this.y }
        this.x = position.x;
        this.y = position.y;
    }
}