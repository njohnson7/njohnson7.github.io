



















$(function () {
  const $document = $(document);
  const $body     = $(document.body);
  const $tree     = $('.tree');
  const $apples   = $('.apples');
  const $word     = $('.word');
  const $guesses  = $('.guesses');
  const $gameOver = $('.game-over');

  const sample = arr => arr.splice(~~(Math.random() * arr.length), 1)[0];

  const createLetterDiv = letter => $('<div>', {
    class: 'letter',
    html: `<span>${letter}</span>`,
  });

  const reset = function () {
    $gameOver.hide().find('p').hide();
    $body.removeClass();
    $word.find('.letter').remove();
    $guesses.find('.letter').remove();
    $apples.show().css('backgroundPositionY', 0);
    guessedLetters = [];
    wrongCount = 0;
    if (words.length == 0) {
      alert('all out of words!');
      $body.hide(500);
      return;
    }
    currentWord = sample(words);
    [...currentWord].forEach(letter => createLetterDiv(letter).appendTo($word));
  };

  let words = ['consider', 'minute', 'accord', 'evident', 'practice', 'intend', 'cat'];
  let currentWord;
  let guessedLetters;
  let wrongCount;

  reset();

  $document.keypress(function (e) {
    let letter = e.key.toLowerCase();
    if (!/[a-z]/.test(letter) || guessedLetters.includes(letter) || $('.game-over:visible').length != 0) return;
    guessedLetters.push(letter);
    createLetterDiv(letter).appendTo($guesses).find('span').css('visibility', 'visible');

    if (currentWord.includes(letter)) {
      $word.find(`.letter span:contains(${letter})`).css('visibility', 'visible');
      if ([...currentWord].every(letter => guessedLetters.includes(letter))) {
        $gameOver.show().find('.win').show(400);
        $body.addClass('background-blue');
        $('a').trigger('focus');
      }
    } else {
      wrongCount++;
      if (wrongCount == 6) {
        $gameOver.show().find('.lose').show(400);
        $body.addClass('background-red');
        $('a').trigger('focus');
        $apples.hide();
      } else {
        $apples.css('backgroundPositionY', `${wrongCount * 20}%`);
        return;
      }
    }
  });

  $('a').click(function (e) {
    e.preventDefault();
    reset();
  });
});
