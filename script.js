$(function () {
  const $canvas      = $('.canvas');
  const $form        = $('form');
  const $inputCoords = $('.coords input');
  const SHAPE_TYPES  = ['shape', 'circle', 'star'];
  const SHAPE_SIZE   = 30;
  const MAX_WIDTH    = $canvas.width()  - SHAPE_SIZE;
  const MAX_HEIGHT   = $canvas.height() - SHAPE_SIZE;
  const MIN_SPEED    = 100;
  const MAX_SPEED    = 3000;

  const randomType = _ => SHAPE_TYPES[~~(Math.random() * SHAPE_TYPES.length)];
  const getType    = _ => $(':checked').val() || randomType();

  const randomCoord  = max           => ~~(Math.random() * max + 1);
  const isValidCoord = (coord, max)  => coord && coord >= 0 && coord <= max;
  const clampCoord   = (coord, max)  => isValidCoord(coord, max) ? +coord : randomCoord(max);
  const clampCoords  = (coords, max) => coords.map(coord => clampCoord(coord, max));
  const getCoords    = function () {
    let [startX, startY, endX, endY] = $inputCoords.map((_, coord) => $(coord).val() || NaN);
    [startX, endX] = clampCoords([startX, endX], MAX_WIDTH);
    [startY, endY] = clampCoords([startY, endY], MAX_HEIGHT);
    return { startX, startY, endX, endY };
  };

  const randomSpeed = _ => ~~(Math.random() * MAX_SPEED - MIN_SPEED + 1) + MIN_SPEED;
  const getSpeed    = _ => +$('.speed input').val().trim() || randomSpeed();

  const createShape = (type, { startX, startY, endX, endY }, speed) => ($('<div>', {
    class: `shape ${type}`,
    data:  { startX, startY, endX, endY, speed },
    on:    {
      reset() {
        $(this).css({ left: startX, top: startY });
      },
      move() {
        $(this).trigger('reset').animate({ left: endX, top: endY }, speed);
      },
    },
  }).trigger('reset'));

  $canvas.addShape = function () {
    createShape(getType(), getCoords(), getSpeed()).appendTo(this).hide().show('fast');
  };

  const move  = (_, shape) => $(shape).trigger('move');
  const reset = (_, shape) => $(shape).trigger('reset');

  $form.submit(function (e) {
    e.preventDefault();
    $canvas.addShape();
    this.reset();
  });

  $('a').click(function (e) {
    e.preventDefault();
    let $control = $(this);
    let $shapes  = $canvas.children().stop();
    $form.trigger('reset');

    if      ($control.is('.start')) $shapes.each(move);
    else if ($control.is('.reset')) $shapes.each(reset);
    else if ($control.is('.clear')) $shapes.remove();
  });
});
