import { HttpService } from '@/infrastructure/http/HttpClient'

export const logout = () => (http: HttpService) =>
    http.post(`/checkout`)
