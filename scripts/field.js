class Field {
    constructor(size) {
        this.size = size;
        this.grid = [];

        for (let x = 0; x < this.size; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.grid[x][y] = null;
            }
        }
    }

    cell(position) {
        if (this.isOnField(position)) {
            return this.grid[position.x][position.y];
        } else {
            return null;
        }
    }

    emptyCells() {
        let cells = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (!this.grid[x][y]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }

    add(square) {
        this.grid[square.x][square.y] = square;
    }

    remove(square) {
        this.grid[square.x][square.y] = null;
    }

    isOnField(position) {
        return (position.x >= 0 && position.x < this.size) &&
            (position.y >= 0 && position.y < this.size);
    };
}