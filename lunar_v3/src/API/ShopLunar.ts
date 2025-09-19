/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase } from './Base.url'
import axios from 'axios'
import { mockUser } from '@/base/cards/mock'

const endPoint = UrlBase.prod


export const ShopRequest = async (data: any) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/shop/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      signal: controller.signal,
    })

    return response
  } catch (err: any) {
   throw new Error(
      err.response?.data?.error || err.response?.data?.message || 'Erro inesperado no registro'
    )
  }
}

