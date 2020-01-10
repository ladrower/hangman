import { GameServiceInterface, response } from '@/mock/game/GameServiceInterface'
import { UnauthenticatedException, UnknownEntryException, UnknownWordException } from '@/mock/game/GameException'
import { GameModel } from '@/mock/game/GameModel'
import { HTTPCode } from '@/mock/HTTPCode'

export type Word = {id: number, word: string}

type GameEntry = {
  wordId: number;
  attemptsLeft: number;
  charsUsed: string;
}

type UserEntry = {
  score: number,
  game: null | GameEntry
}

export class GameService implements GameServiceInterface {
  private wordsMap: Map<number, string>
  constructor(
    private storage: Storage,
    private config: {
      words: Word[],
      maxAttempts: number,
      maxRoundScore: number
    }
  ) {
    this.wordsMap = new Map(
      config.words.map(({id, word}) => [id, word])
    )
  }
  /**
   * POST
   * @param userName
   */
  checkin(userName: string) {
    const hash = hashCode(userName).toString()
    const entry = this.storage.getItem(hash)
    if (entry === null) {
      this.storage.setItem(hash, JSON.stringify({
        score: 0,
        game: null
      } as UserEntry))
    }
    const token = uuidv4()
    this.storage.setItem(token, hash)

    return response(HTTPCode.OK, {token})
  }

  /**
   * GET
   * @param token
   */
  getGame(token: string) {
    try {
      const entry = this.getUserEntry(token)
      if (entry.game === null) {
        return response(HTTPCode.NotFound, 'No game has been started')
      }
      const { gameOver, attemptsLeft, puzzle } = this.createGameModel(entry.game).getState()
      const { charsUsed } = entry.game

      return response(HTTPCode.OK, {
        attemptsLeft,
        gameOver,
        puzzle,
        charsUsed,
        score: entry.score
      })
    } catch (e) {
      return GameService.errorResponse(e)
    }
  }

  /**
   * POST
   * @param token
   */
  postGame(token: string) {
    try {
      const entry = this.getUserEntry(token)
      const { words, maxAttempts } = this.config
      const { id } = words[Math.random() * words.length | 0]

      entry.game = {
        wordId: id,
        charsUsed: '',
        attemptsLeft: maxAttempts
      }

      const { gameOver, attemptsLeft, puzzle } = this.createGameModel(entry.game).getState()
      const { charsUsed } = entry.game

      this.setUserEntry(token, entry)

      return response(HTTPCode.OK, {
        attemptsLeft,
        gameOver,
        puzzle,
        charsUsed,
        score: entry.score
      })
    } catch (e) {
      return GameService.errorResponse(e)
    }
  }

  /**
   * POST
   * @param character
   * @param token
   */
  guess(character: string, token: string) {
    try {
      if (character.length !== 1) {
        return response(HTTPCode.Error, 'Only single character is accepted')
      }
      const entry = this.getUserEntry(token)
      if (entry.game === null) {
        return response(HTTPCode.Error, 'Game has not been started')
      }
      const game = this.createGameModel(entry.game)
      if (game.getState().gameOver) {
        return response(HTTPCode.Error, 'Game was over. Please start a new one')
      }

      game.guess(character)

      const { attemptsLeft, gameOver, puzzle } = game.getState()
      const charsUsed = entry.game.charsUsed.indexOf(character) === -1 ?
        entry.game.charsUsed + character :
        entry.game.charsUsed

      entry.game = {
        attemptsLeft,
        charsUsed,
        wordId: entry.game.wordId
      }
      if (gameOver === 'win') {
        entry.score += Math.round(this.config.maxRoundScore * attemptsLeft / this.config.maxAttempts)
      }

      this.setUserEntry(token, entry)

      return response(HTTPCode.OK, {
        attemptsLeft,
        gameOver,
        puzzle,
        charsUsed,
        score: entry.score
      })
    } catch (e) {
      return GameService.errorResponse(e)
    }
  }

  private getUserEntry(token: string) {
    const entry = this.storage.getItem(this.getIdentity(token))
    if (entry === null) {
      throw new UnknownEntryException(`Cannot find user entry. Please register`)
    }
    return JSON.parse(entry) as UserEntry
  }

  private setUserEntry(token: string, entry: UserEntry) {
    this.storage.setItem(this.getIdentity(token), JSON.stringify(entry))
  }

  private getIdentity(token: string) {
    const identity = this.storage.getItem(token)
    if (identity === null) {
      throw new UnauthenticatedException(`Not authenticated`)
    }
    return identity
  }

  private createGameModel(state: GameEntry): GameModel {
    const { attemptsLeft, charsUsed, wordId } = state
    const word = this.wordsMap.get(wordId)
    if (!word) {
      throw new UnknownWordException(`Cannot find word with id: ${wordId}`)
    }
    return new GameModel(word, attemptsLeft, charsUsed)
  }

  private static errorResponse(e: any) {
    if (e instanceof UnauthenticatedException) {
      return response(HTTPCode.Unauthorized, e.message)
    }
    if (e instanceof UnknownEntryException) {
      return response(HTTPCode.NotFound, e.message)
    }
    if (e instanceof UnknownWordException) {
      return response(HTTPCode.NotFound, e.message)
    }
    return response(HTTPCode.Error, 'Unknown error')
  }
}

function hashCode(s: string) {
  let hash = 0, i, chr;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
