import { HttpService } from '@/infrastructure/http/HttpClient'
import { GameData } from '@/mock/game/GameServiceInterface'

export const postGame = (token: string) => (http: HttpService) =>
  http.post<GameData>(`/game`, undefined,{ headers: { Authorization: `Bearer ${token}` } })
