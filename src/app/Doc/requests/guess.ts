import { HttpService } from '@/infrastructure/http/HttpClient'
import { GameData } from '@/mock/game/GameServiceInterface'

export const guess = (character: string, token: string) => (http: HttpService) =>
  http.post<GameData>(`/guess`, { character },{ headers: { Authorization: `Bearer ${token}` } })
