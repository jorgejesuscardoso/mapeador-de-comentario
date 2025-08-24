/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase } from './Base.url'
import axios from 'axios'

const endPoint = UrlBase.prod


export const createHouse = async (data: any) => {
  try {
    const controller = new AbortController()

    const response = await axios.post(`${endPoint}/houses/`, data)

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}

export const getHouses = async () => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/houses/`)

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}

export const getHouseById = async (id: string) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/houses/${id}`)

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}

export const updateHouse = async (id: string, data: any) => {
  try {
    const controller = new AbortController()

    console.log(data)

    const response = await axios.put(`${endPoint}/houses/${id}`, data)

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}

export const deleteHouse = async (id: string) => {
  try {
    const controller = new AbortController()

    const response = await axios.delete(`${endPoint}/houses/${id}`)

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}


