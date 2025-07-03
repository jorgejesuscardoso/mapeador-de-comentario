/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase } from './Base.url'
import axios from 'axios'

const endPoint = UrlBase.dev

export const Login = async (user: string, password: string) => {
  try {
    const controller = new AbortController()
    const data = { user, password }

    const response = await axios(`${endPoint}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      signal: controller.signal,
    })

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado no login'
  }
}
