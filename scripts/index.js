/**
 * index.js
 * - All our useful JS goes here, awesome!
 */

$(document).ready(function () {
    var $playfield = $('#playfield');
    var mousedown = false;

    new Game();

    $playfield.unbind('mousedown').mousedown(function () {
        mousedown = true;
    });
    $playfield.unbind('mouseup').mouseup(function () {
        mousedown = false;
    });
});