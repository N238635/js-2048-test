class Game {
    constructor() {
        this.size = 4;
        this.controls = new Controls();
        this.field = new Field(this.size);
        this.html = new HTML();
        this.newSquare();
        this.newSquare();
        this.draw();

        this.controls.on("move", this.move.bind(this));
    }

    draw() {
        this.html.draw(this.field);
    }

    newSquare() {
        let emptyCells = this.field.emptyCells();
        let random = Math.floor(Math.random() * emptyCells.length);
        let value = Math.random() > 0.1 ? 2 : 4;
        this.field.add(new Square(emptyCells[random], value));
    }

    moveSquare(square, cell) {
        this.field.remove(square);
        this.field.add(square);
        square.move(cell);
    }

    move(direction) {
        // 0: up, 1: right, 2: down, 3: left
        var self = this;

        var map = {
            0: { x: 0, y: -1 }, // Up
            1: { x: 1, y: 0 },  // Right
            2: { x: 0, y: 1 },  // Down
            3: { x: -1, y: 0 }   // Left
        };

        var square;
        var vector = map[direction];
        var traversals = this.buildTraversals(vector);
        var moved = false;

        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach(function (x) {
            traversals.y.forEach(function (y) {
                let cell = { x, y };
                square = self.field.cell(cell);

                if (square) {
                    var destination = self.findDestination(square, vector);
                    console.log(square, destination);
                    var next = self.field.cell(destination.next);

                    if (next && next.value === square.value) {
                        var merged = new Square(destination.next, square.value * 2);

                        self.field.add(merged);
                        self.field.remove(square);

                        square.move(destination.next);
                    } else {
                        self.moveSquare(square, destination.pos);
                    }

                    if (!self.isSamePostition(cell, square)) {
                        moved = true;
                    }
                }
            });
        });

        if (moved) {
            //this.newSquare();

            this.draw();
        }
    };

    buildTraversals(vector) {
        var traversals = { x: [], y: [] };

        for (var pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();

        return traversals;
    }

    isSamePostition(a, b) {
        return (a.x === b.x && a.y === b.y);
    }

    findDestination(square, vector) {
        var previous;
        var cell = { x: square.x, y: square.y };

        do {
            previous = cell;
            cell = { x: previous.x + vector.x, y: previous.y + vector.y };
        } while (this.field.isOnField(cell) &&
            !this.field.cell(cell));

        return {
            pos: previous,
            next: cell // Used to check if a merge is required
        };
    }
}