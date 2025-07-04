/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase } from './Base.url'
import axios from 'axios'
import { mockUser } from '@/base/cards/mock'

const endPoint = UrlBase.render


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

export const getBooks = async (data: any) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/books/register`, {
      method: 'GET',
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
