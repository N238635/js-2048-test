
$(document).ready(function () {
    var $playfield = $('#playfield');
    var mousedown = false;

    var $container = $('#squares-container');

    // Запускаем игру game.js
    new Game($container);

    $playfield.unbind('mousedown').mousedown(function () {
        mousedown = true;
    });
    $playfield.unbind('mouseup').mouseup(function () {
        mousedown = false;
    });
});