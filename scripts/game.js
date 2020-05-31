class Game {
    constructor() {
        this.size = 4;
        this.controls = new Controls();
        this.field = new Field(this.size);
        this.html = new HTML();

        this.init();

        this.controls.on("move", this.move.bind(this));
        this.controls.on("restart", this.restart.bind(this));
    }

    init() {
        this.score = 0;
        this.gameOver = false;

        this.newSquare();
        this.newSquare();
        this.draw();
    }

    draw() {
        this.html.draw(
            this.field.grid,
            {
                gameOver: this.gameOver,
                score: this.score,
            }
        );
    }

    newSquare() {
        let emptyCells = this.field.emptyCells();
        let random = Math.floor(Math.random() * emptyCells.length);
        let value = Math.random() > 0.1 ? 2 : 4;
        this.field.add(new Square(emptyCells[random], value));
    }

    moveSquare(square, cell) {
        this.field.remove(square);
        square.move(cell);
        this.field.add(square);
    }

    move(direction) {
        // 0: up, 1: right, 2: down, 3: left
        var self = this;

        if (this.gameOver) { return }

        var map = {
            0: { x: 0, y: -1 }, // Up
            1: { x: 1, y: 0 },  // Right
            2: { x: 0, y: 1 },  // Down
            3: { x: -1, y: 0 }   // Left
        };

        let square;
        var vector = map[direction];
        // Создаем порядок изменения клеток поля обратный вектору движения
        var traversals = this.buildTraversals(vector);
        var moved = false;

        traversals.y.forEach(function (y) {
            traversals.x.forEach(function (x) {
                let cell = { x, y };
                square = self.field.cell(cell);

                if (square) {
                    square.mergedFrom = null;
                    // Находим дальнюю пустую клету и клетку за ней
                    var destination = self.findDestination(square, vector);
                    var next = self.field.cell(destination.next);

                    // Если в след. клетке есть квадрат того же номинала, что и передвигаемый квадрат
                    // Квадрат не был объединен в этот ход
                    if (next && next.value === square.value && !next.mergedFrom) {
                        var merged = new Square(destination.next, square.value * 2);

                        this.score += square.value * 2;

                        // Меняем координаты квадрата для проверки isSamePosition и для анимации движения в .mergedFrom
                        square.move(destination.next);

                        // Записываем оба "родителя" нового квадрата для отрисовки движения
                        merged.mergedFrom = [square, next];

                        self.field.add(merged);
                        // убираем square с поля
                        self.field.remove(cell);
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
            this.newSquare();
            this.gameOver = this.isGameOver(this.field);
            this.draw();
        }
    };

    buildTraversals(vector) {
        var traversals = { x: [], y: [] };

        for (var pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        // Если вектор направлен вниз или вправо, то начинаем с противоволожного края, 
        // чтобы сначало сдвинуть квадраты, которые ближе к краю
        // при значении -1 подходит прямой порядок массива, при значении 0 порядок массива не важен
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

        // Шагаем от выбранного квадрата в сторону вектора, пока не находим другой квадрат, либо выходим за край
        do {
            previous = cell;
            cell = { x: previous.x + vector.x, y: previous.y + vector.y };
        } while (this.field.isOnField(cell) &&
            !this.field.cell(cell));

        // Берем место назначение и следующую клетку
        return {
            pos: previous,
            next: cell
        };
    }

    isGameOver(field) {
        let vectors = [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ];
        // Сравниаем значение каждого квадрата на поле со значением соседних квадратов по вертикали и горизонтали
        // если квадрат пустой, либо рядом есть квадрат того же ранга игра еще не закончена
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let cell = { x, y };
                let square = field.cell(cell);
                if (!square) {
                    return false;
                } else {
                    for (let i = 0; i < vectors.length; i++) {
                        let target = field.cell({ x: cell.x + vectors[i].x, y: cell.y + vectors[i].y });
                        if (target && target.value === square.value) {
                            return false;
                        }
                    }
                }
            }
        }
        console.log('GAME OVER!');
        return true;
    }

    restart() {
        this.field.init();
        this.html.clearMessage();
        this.init();
    }
}