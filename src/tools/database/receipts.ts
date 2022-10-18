import { QuickDB } from "quick.db"; 

const receiptsDB = new QuickDB({ filePath: `src/database/receipts.sqlite` })

export interface receipt {
    sender: string
    receiver: string
    amount: number
    id: string
}

export const addReceipts = async (sender: string, receiver: string, amount: number, id: string) => {
    return await receiptsDB.set(`${id}`, {
        sender,
        receiver,
        amount
    }) as receipt
}

export const getReceipt = async (id: string) => {
    return await receiptsDB.get(`${id}`) as receipt
}

export const removeReceipt = async (id: string) => {
    return await receiptsDB.delete(`${id}`)
}