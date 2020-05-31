class Controls {
    constructor() {
        this.events = {};
        this.listen();
        this.bindButton();
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    };

    emit(event, data) {
        var callbacks = this.events[event];
        if (callbacks) {
            callbacks.forEach(function (callback) {
                callback(data);
            });
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

        document.addEventListener("keydown", function (event) {
            var mapped = map[event.which];

            if (mapped !== undefined) {
                event.preventDefault();
                self.emit("move", mapped);
            }
        });
    }

    bindButton() {
        var button = document.querySelector("#reset");
        button.addEventListener("click", this.reset.bind(this));
        button.addEventListener("touchend", this.reset.bind(this));
    }

    reset(event) {
        event.preventDefault();
        this.emit("restart");
    }
}