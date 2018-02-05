



















$(function () {
  const SHAPE_TYPES = ['shape', 'circle', 'star'];
  const SHAPE_SIZE  = 30;
  const MOVE_SPEED  = 800;
  const $canvas     = $('.canvas');

  const createShape = (type, { startX, startY, endX, endY }) => (
    $('<div></div>')
      .addClass(`shape ${type}`)
      .css({
        left: startX,
        top:  startY,
      }).data({
        startX,
        startY,
        endX,
        endY,
      })
  );

  HTMLDivElement.prototype.move = function (speed = MOVE_SPEED) {
    let $shape = $(this);
    if (!$shape.hasClass('shape')) return;

    $shape.css({
      left: $shape.data('startX'),
      top:  $shape.data('startY'),
    }).animate({
      left: $shape.data('endX'),
      top:  $shape.data('endY'),
    }, speed);
  };

  const randomCoord  = max => ~~(Math.random() * max + 1);
  const isValidCoord = (coord, max) => coord && coord >= 0 && coord <= max;
  const clampCoord   = (coord, max) => isValidCoord(coord, max) ? +coord : randomCoord(max);

  const getCoords = _ => {
    let [startX, startY, endX, endY] = $('.coords input').map((_, coord) => $(coord).val() || NaN);
    [startX, endX] = [startX, endX].map(coord => clampCoord(coord, $canvas.width()  - SHAPE_SIZE));
    [startY, endY] = [startY, endY].map(coord => clampCoord(coord, $canvas.height() - SHAPE_SIZE));
    return { startX, startY, endX, endY };
  };

  const randomType = _ => SHAPE_TYPES[~~(Math.random() * SHAPE_TYPES.length)];
  const getType    = _ => $(':checked').val() || randomType();

  $canvas.addShape = function () {
    let type   = getType();
    let coords = getCoords();
    createShape(type, coords).appendTo(this).hide().show('fast');
  };



  $('form').submit(function (e) {
    e.preventDefault();
    $canvas.addShape();
    $(this).trigger('reset');
  });

  $('a').click(function (e) {
    e.preventDefault();
    let $control = $(this);
    let $shapes  = $canvas.children().stop();


    console.log(42);


    if      ($control.is('.start')) $shapes.each((_, shape) => shape.move());
    else if ($control.is('.clear')) $shapes.remove();
  });
});
