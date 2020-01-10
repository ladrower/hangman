import { HttpService } from '@/infrastructure/http/HttpClient'
import { GameData } from '@/mock/game/GameServiceInterface'

export const getGame = (token: string) => (http: HttpService) =>
  http.get<GameData>(`/game`, { headers: { Authorization: `Bearer ${token}` } })
