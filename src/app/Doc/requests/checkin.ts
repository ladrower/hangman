import { HttpService } from '@/infrastructure/http/HttpClient'

export type CheckinResponse = {
  token: string
}

export const checkin = (userName: string) => (http: HttpService) =>
  http.post<CheckinResponse>(`/checkin`, { userName })
