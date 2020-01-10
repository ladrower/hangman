import { action, observable } from 'mobx'
import { store } from '@/infrastructure/store/store'
import { checkin, CheckinResponse } from '@/app/Doc/requests/checkin'
import { HttpReader, IResource } from '@/infrastructure/resource'
import { GameData } from '@/mock/game/GameServiceInterface'
import { getGame } from '@/app/Doc/requests/getGame'
import { postGame } from '@/app/Doc/requests/postGame'
import { guess } from '@/app/Doc/requests/guess'

@store
export class DocStore {
  constructor(
    private httpReader: HttpReader,
  ) {}

  @observable checkin: {
    resource: IResource<CheckinResponse>,
    token: string | null
  } = {
    resource: {},
    get token() {
      const { resource: { data } } = this
      return data ? data.token : null
    }
  }
  @observable createGameResource: IResource<GameData> = {}
  @observable getGameResource: IResource<GameData> = {}
  @observable guessCharResource: IResource<GameData> = {}

  @action doCheckin = (userName: string) => this.checkin.resource = this.httpReader.read(checkin(userName))
  @action createGame = (token: string) => this.createGameResource = this.httpReader.read(postGame(token))
  @action getGame = (token: string) => this.getGameResource = this.httpReader.read(getGame(token))
  @action makeGuess = (character: string, token: string) => this.guessCharResource = this.httpReader.read(guess(character, token))
}
