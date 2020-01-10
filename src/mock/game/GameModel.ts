
type GameState = {
  attemptsLeft: number;
  puzzle: Array<string | null>;
  gameOver?: 'win' | 'loss';
}

export class GameModel {
  private readonly puzzle: Array<string | null>
  constructor(
    private word: string,
    private attemptsLeft: number,
    charsUsed: string,
  ) {
    this.puzzle = word.split('').map(char =>
      charsUsed.indexOf(char) !== -1 ? char : null
    )
  }

  getState() {
    const { attemptsLeft, puzzle, word } = this
    const state: GameState = { attemptsLeft, puzzle }
    if (attemptsLeft === 0) {
      state.gameOver = 'loss'
    } else if (word === puzzle.join('')) {
      state.gameOver = 'win'
    }
    return state
  }

  guess(character: string) {
    if (!this.attemptsLeft) {
      return false
    }
    let guessed = false
    this.word.split('').forEach((char, i) => {
      if (character === char) {
        this.puzzle[i] = char
        guessed = true
      }
    })
    if (!guessed) {
      this.attemptsLeft--
    }
    return guessed
  }
}
