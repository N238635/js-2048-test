class Controls {
    constructor() {
        this.events = {};
        this.$playfield = $('#playfield');
        this.mouseCoords = null;
        this.enableInput = true;

        this.listen();
        this.bindButton(".reset", this.reset);
        this.bindButton(".restart", this.reset);
    }

    // Записываем действия для конкретного евента
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    };

    // Выполняем действия евента
    emit(event, data) {
        var callbacks = this.events[event];
        if (callbacks && this.enableInput) {
            this.enableInput = false;
            callbacks.forEach(function (callback) {
                callback(data);
            });

            // Блокируем ввод до выполнения всех анимаций
            setTimeout(() => {
                this.enableInput = true;
            }, 200);
        }
    };

    listen() {
        var self = this;

        var map = {
            38: 0, // Up
            39: 1, // Right
            40: 2, // Down
            37: 3, // Left
            75: 0, // Vim up
            76: 1, // Vim right
            74: 2, // Vim down
            72: 3, // Vim left
            87: 0, // W
            68: 1, // D
            83: 2, // S
            65: 3  // A
        };

        // Управление с клавиатуры взято из оригинальной версии
        document.addEventListener("keydown", function (event) {
            var mapped = map[event.which];

            if (mapped !== undefined) {
                event.preventDefault();
                self.emit("move", mapped);
            }
        });

        // Нажатия мыши фиксируются только внутри поля
        this.$playfield.unbind('mousedown').mousedown((event) => {
            self.mouseCoords = { x: event.pageX, y: event.pageY }
        });

        // Отжатие мыши фиксируется за пределами поля для удобства
        document.addEventListener("mouseup", (event) => {
            if (this.mouseCoords) {
                let x = event.pageX - self.mouseCoords.x;
                let y = event.pageY - self.mouseCoords.y;
                let mapped = self.mapMouseDirection(x, y);
                // Защита от случайных кликов
                if (mapped !== null) {
                    self.emit("move", mapped);
                }
                self.mouseCoords = null;
            }
        });
    }

    bindButton(selector, funct) {
        var button = document.querySelector(selector);
        button.addEventListener("click", funct.bind(this));
    }

    reset(event) {
        event.preventDefault();
        this.emit("restart");
    }

    mapMouseDirection(x, y) {
        let absX = Math.abs(x);
        let absY = Math.abs(y);
        if (Math.abs(absX - absY) < 10) {
            // Близко к диагонали не считать
            return null;
        } else if (absX > absY) {
            // Если движение меньше 10 пикселей не считать
            return (absX < 10) ? null : ((x > 0) ? 1 : 3);
        } else {
            return (absY < 10) ? null : ((y > 0) ? 2 : 0);
        }
    }
}