import { HttpService } from '@/infrastructure/http/HttpClient'

export const login = (userName: string) => (http: HttpService) =>
  http.post<{token: string}>(`/checkin`, { userName })
