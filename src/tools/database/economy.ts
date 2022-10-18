import { User } from 'discord.js'
import { QuickDB } from 'quick.db'

const ecoDB = new QuickDB({filePath: `src/database/economy.sqlite`})

export interface profile {
    name: string
    rank: string
    balance: number
    inventory: string[]
}

export const createProfile = async (user: User) => {
    return await ecoDB.set(`${user.id}`, {
        name: `${user.tag}`,
        rank: ``,
        balance: 0,
        inventory: []
    }) as profile
}

export const getProfile = async (userId: string) => {
    if(!(await ecoDB.get(`${userId}.name`))) return null
    return await ecoDB.get(`${userId}`) as profile
}

export const setBalance = async (userId: string, balance: number) => {
    return await ecoDB.set(`${userId}.balance`, balance) as number
}

export const addBalance = async (userId: string, amount: number) => {
    return await ecoDB.add(`${userId}.balance`, amount) as number
}

export const getBalance = async (userId: string) => {
    return await ecoDB.get(`${userId}.balance`) as number
}

export const removeBalance = async (userId: string, amount: number) => {
    return ecoDB.add(`${userId}.balance`, -amount)
}