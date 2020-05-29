class HTML {
    constructor() {
        this.$container = $('#squares-container');
    }

    draw(field) {
        let self = this;

        window.requestAnimationFrame(() => {
            self.clearContainer(self.playfield);

            field.grid.forEach((row) => {
                row.forEach((cell) => {
                    if (cell) {
                        self.drawSquare(cell);
                    }
                });
            });
        });
    }

    drawSquare(square) {
        let element = document.createElement("div");
        var className = "thing t" + square.value;
        element.setAttribute("class", className);

        var position = "left: " + (square.x * 100) + "px; top: " + (square.y * 100) + "px;";
        element.setAttribute("style", position);
        this.playfield.append(element);
    }

    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    };
}