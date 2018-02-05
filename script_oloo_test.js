










// const Shape = Object.create($('<div></div>')[0]);

// const Shape = $('<div></div>')[0];

// $.extend(Shape, {

// const Shape = $.extend({}, $('<div></div>')[0], {

const Shape = Object.create(document.createElement('div'));

Object.assign(Shape, {
  init(type, startX, startY, endX, endY) {
    $(this)
      .addClass(type)
      .data({
        startX,
        startY,
        endX,
        endY,
      }).reset();
  },
  reset(startX, startY) {
    let $shape = $(this);
    $shape.css({
      left: startX || $shape.data('startX'),
      top:  startY || $shape.data('startY'),
    });
  },
  move(endX, endY) {
    let $shape = $(this);
    $shape.animate({
      left: endX || $shape.data('endX'),
      top:  endY || $shape.data('endY'),
    });
  },
});



$(function () {
  const $canvas = $('.canvas');

  $('form').submit(function(e) {
    e.preventDefault();
    let type = $(':checked').val();
    let [startX, startY, endX, endY] = $('.coords input').map((_, input) => ~~$(input).val());
    let s = Object.create(Shape).init(type, startX, startY, endX, endY);
    // .appendTo($canvas);

    // $(`<div></div>`)
    //   .addClass(type)
    //   .css({
    //     left: startX,
    //     top:  startY,
    //   }).data({
    //     startX,
    //     startY,
    //     endX,
    //     endY,
    //   }).appendTo($canvas);
  });

  $('a').click(function (e) {
    e.preventDefault();
    let $control = $(this);
    let $shapes  = $canvas.children().stop();

    if ($control.is('.start')) {
      $shapes.each(function () {
        let $shape = $(this);
        $(this).reset().move()
      });
    } else if ($control.is('.stop')) {
      $shapes.stop();
    } else {
      $shapes.remove();
    }
  });
});
