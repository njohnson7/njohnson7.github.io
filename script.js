$(function () {
  const $document = $(document);
  const $body     = $(document.body);
  const $apples   = $('.apples');
  const $word     = $('.word');
  const $guesses  = $('.guesses');
  const $gameOver = $('.game-over');
  const $newGame = $('a');

  const randomWord = (function () {
    const getRandomSetOfWords = _ => ([
      ['ivy', 'espionage', 'kayak', 'dwarves', 'bagpipes'],
      ['blizzard', 'witchcraft', 'banjo', 'icebox', 'cycle'],
    ][(~~(Math.random() * 2))]);

    let words = getRandomSetOfWords();
    return _ => words.splice(~~(Math.random() * words.length), 1)[0];
  }());

  const Game = {
    MAX_WRONG_COUNT: 6,
    init() {
      this.reset();
      this.word = randomWord();
      if (!this.word) {
        this.outOfWords();
        return;
      }

      this.guessedLetters = [];
      this.wrongCount     = 0;
      this.addLettersToPage();
      return this;
    },
    reset() {
      $gameOver.hide();
      $body.removeClass();
      $('.letter').remove();
      $apples.show().css('backgroundPositionY', 0);
    },
    outOfWords() {
      alert('all out of words!');
      $body.hide(500);
      $document.off();
    },
    createLetter(letter) {
      return $('<div>', {
        class: 'letter',
        html:  `<span>${letter}</span>`,
      });
    },
    addLettersToPage() {
      [...this.word].forEach(letter => this.createLetter(letter).appendTo($word));
    },
    skipGuess(letter) {
      return !/^[a-z]$/.test(letter)
        || this.guessedLetters.includes(letter)
        || $gameOver.is(':visible');
    },
    addGuessedLetter(letter) {
      this.guessedLetters.push(letter);
      this.createLetter(letter).appendTo($guesses);
    },
    showGameOver(msg) {
      $gameOver.show().find('p').text(msg);
    },
    win() {
      this.showGameOver('You win!');
      $body.addClass('win');
      $newGame.trigger('focus');
    },
    lose() {
      this.showGameOver("Sorry, you're out of guesses!");
      $word.find('span:hidden').addClass('lose').show(600);
      $body.addClass('lose');
      $newGame.trigger('focus');
      $apples.hide();
    },
    removeApple() {
      $apples.css('backgroundPositionY', `${this.wrongCount * 20}%`);
    },
    isCorrectLetter(letter) {
      return this.word.includes(letter);
    },
    isAllCorrect() {
      return [...this.word].every(letter => this.guessedLetters.includes(letter));
    },
    showLetter(letter) {
      $word.find(`span:contains(${letter})`).show();
    },
    correct(letter) {
      this.showLetter(letter);
      if (this.isAllCorrect()) this.win();
    },
    incorrect() {
      this.wrongCount++;
      if (this.wrongCount == this.MAX_WRONG_COUNT) this.lose();
      else this.removeApple();
    },
    processGuess(letter) {
      if (this.skipGuess(letter)) return;
      this.addGuessedLetter(letter);
      if (this.isCorrectLetter(letter)) this.correct(letter);
      else this.incorrect(letter);
    },
  };

  let game;
  $newGame.click(function (e) {
    e.preventDefault();
    game = Object.create(Game).init();
  }).click();

  $document.keypress(function (e) {
    let letter = e.key.toLowerCase();
    game.processGuess(letter);
  });
});
