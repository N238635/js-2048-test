class HTML {
    constructor($container) {
        this.$playfield = $('#playfield');
        this.$container = $('#squares-container');
        this.$message = $('#end-screen');
        this.$score = $('.score');
    }

    draw(grid, data) {
        let self = this;

        // Удаляем все элементы из контейнера
        self.$container.empty();

        // Обновляем отоброжение
        window.requestAnimationFrame(() => {
            // Рисуем новые
            grid.forEach((row) => {
                row.forEach((square) => {
                    if (square) {
                        self.drawSquare(square);
                    }
                });
            });
        });

        this.updateScore(data.score);

        if (data.gameOver) {
            this.gameOver(data.score);
        }
    }

    drawSquare(square) {
        let self = this;
        let wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");

        let element = document.createElement("div");
        let classes = "thing t" + square.value;
        element.setAttribute("class", classes);

        // Записываем номинал квадрата, потому что прописывать их в классе плохо масштабируется
        element.textContent = square.value;

        // Если квадрат был сдвинут рисуем сначало в предыдущей позиции для анимации transition
        let position = square.oldPosition || square;
        let positionStyle = "left: " + (position.x * 100) + "px; top: " + (position.y * 100) + "px;";
        wrapper.setAttribute("style", positionStyle);

        // Двигаем квадрат в текущую позицию
        if (square.oldPosition) {
            // Обновляем отоброжение, чтобы не ломались анимации
            setTimeout(() => {
                positionStyle = "left: " + (square.x * 100) + "px; top: " + (square.y * 100) + "px;";
                wrapper.setAttribute("style", positionStyle);
            }, 0);
        } else if (square.mergedFrom) {
            classes += " merged";
            element.setAttribute("class", classes);

            // Отрисовываем квадраты, которые были поглащены объединением.
            square.mergedFrom.forEach((parentSquare) => {
                self.drawSquare(parentSquare);
            });
        } else {
            classes += " new";
            element.setAttribute("class", classes);
        }

        wrapper.appendChild(element);
        this.$container.append(wrapper);
    }

    gameOver(score) {
        let message = "Your score: " + score;
        this.$message.find("p")[0].textContent = message;
        this.$message.addClass("gameover");
    }

    clearMessage() {
        this.$message.removeClass("gameover");
    }

    updateScore(score) {
        let text = "Score: " + score;
        this.$score.text(text);
    }
}