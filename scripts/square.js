class Square {
    constructor(position, value) {
        this.x = position.x;
        this.y = position.y;
        this.value = value;
        // Предыдущая позиция
        this.oldPosition = null;
        // Квадрат, который удалился в результате слияния
        this.mergedFrom = null;
    }

    move(position) {
        this.oldPosition = { x: this.x, y: this.y }
        this.x = position.x;
        this.y = position.y;
    }
}