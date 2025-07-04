/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase } from './Base.url'
import axios from 'axios'

const endPoint = UrlBase.prod


export const RegisterBook = async (data: any) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/books/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      signal: controller.signal,
    })

    return response.data
  } catch (err: any) {
   throw new Error(
      err.response?.data?.error || err.response?.data?.message || 'Erro inesperado no registro'
    )
  }
}
