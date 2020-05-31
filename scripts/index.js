
$(document).ready(function () {
    var $playfield = $('#playfield');
    var mousedown = false;

    // Запускаем игру game.js
    new Game();

    $playfield.unbind('mousedown').mousedown(function () {
        mousedown = true;
    });
    $playfield.unbind('mouseup').mouseup(function () {
        mousedown = false;
    });
});