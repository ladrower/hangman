import { HTTPCode } from '@/mock/HTTPCode'

type ServiceResponse<TData> = {
  code: number,
  data: TData
}

export type GameData = {
  score: number;
  attemptsLeft: number;
  puzzle: Array<string | null>;
  charsUsed: string;
  gameOver?: 'win' | 'loss';
}

export interface GameServiceInterface {
  // register and get a token
  checkin(userName: string): ServiceResponse<{token: string}>

  // restore the latest game
  getGame(token: string): ServiceResponse<GameData | string>

  // start a new one
  postGame(token: string): ServiceResponse<GameData | string>

  // guess a char
  guess(character: string, token: string): ServiceResponse<GameData | string>

  // logout
  checkout(token: string): ServiceResponse<null>
}

export const response = <T>(code: HTTPCode, data: T): ServiceResponse<T> => ({code, data})
