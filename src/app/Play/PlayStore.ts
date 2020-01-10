import { action, computed, observable, when } from 'mobx'
import { store } from '@/infrastructure/store/store'
import { HttpReader, IResource } from '@/infrastructure/resource'
import { GameData } from '@/mock/game/GameServiceInterface'
import { loadGame } from '@/app/Play/requests/loadGame'
import { guess } from '@/app/Play/requests/guess'
import { HttpService } from '@/infrastructure/http/HttpClient'
import { AxiosResponse } from 'axios'

@store
export class PlayStore {
  constructor(
    private httpReader: HttpReader,
  ) {}

  private disposeGameResource: () => void = () => null
  @observable private gameResource: IResource<GameData> = {}
  @observable game: GameData | null = null
  @observable error? = ''

  @computed get charsUsed() {
    const { game } = this
    return new Set(game ? game.charsUsed.split('') : null)
  }

  @computed get busy() {
    return this.gameResource.loading
  }

  @action makeGuess =(character: string) =>
    this.updateGameResource(guess(character))

  @action loadGame = (override = false) =>
    this.updateGameResource(loadGame(override))

  private updateGameResource(request: (http: HttpService) => Promise<AxiosResponse<GameData>>) {
    this.disposeGameResource()
    this.error = ''
    this.gameResource = this.httpReader.read(request)
    this.disposeGameResource = when(() => !this.gameResource.loading, () => {
      const { data, error } = this.gameResource
      if (data) {
        this.game = data
      } else if (error) {
        this.error = error.response.data
      }
    })
    return this.disposeGameResource
  }
}
