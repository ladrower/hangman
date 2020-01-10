import { HttpService } from '@/infrastructure/http/HttpClient'
import { GameData } from '@/mock/game/GameServiceInterface'

export const loadGame = (override: boolean) => (http: HttpService) =>
  override ?
    http.post<GameData>(`/game`) :
    http.get<GameData>(`/game`).catch(() => http.post<GameData>(`/game`))

