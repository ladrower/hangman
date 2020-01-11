import { HttpService } from '@/infrastructure/http/HttpClient'

export const auth = (userName: string) => (http: HttpService) =>
  http.post<{token: string}>(`/checkin`, { userName })
