class Field {
    constructor(size) {
        this.size = size;
        this.grid = [];
        this.init();
    }

    init() {
        for (let y = 0; y < this.size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.size; x++) {
                this.grid[y][x] = null;
            }
        }
    }

    cell(position) {
        if (this.isOnField(position)) {
            return this.grid[position.y][position.x];
        } else {
            return null;
        }
    }

    emptyCells() {
        let cells = [];
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (!this.grid[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }

    add(square) {
        this.grid[square.y][square.x] = square;
    }

    remove(square) {
        this.grid[square.y][square.x] = null;
    }

    isOnField(position) {
        return (position.x >= 0 && position.x < this.size) &&
            (position.y >= 0 && position.y < this.size);
    };
}