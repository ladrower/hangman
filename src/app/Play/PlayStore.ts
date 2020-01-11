import { action, computed, observable } from 'mobx'
import { store } from '@/infrastructure/store/store'
import { HttpReader, IResource } from '@/infrastructure/resource'
import { GameData } from '@/mock/game/GameServiceInterface'
import { loadGame } from '@/app/Play/requests/loadGame'
import { guess } from '@/app/Play/requests/guess'

@store
export class PlayStore {
  constructor(
    private httpReader: HttpReader,
  ) {}

  private gameData: GameData | null = null

  @observable private gameResource: IResource<GameData> = {}

  @computed get game(): GameData |null {
    const { data } = this.gameResource
    if (data) {
      this.gameData = data
    }
    return this.gameData
  }

  @computed get error(): string {
    const { error } = this.gameResource
    return error && error.response.data
  }

  @computed get charsUsed() {
    const { game } = this
    return new Set(game ? game.charsUsed.split('') : null)
  }

  @computed get busy() {
    return this.gameResource.loading
  }

  @action makeGuess (character: string) {
    this.gameResource = this.httpReader.read(guess(character))
  }

  @action loadGame (override = false) {
    this.gameResource = this.httpReader.read(loadGame(override))
  }
}
