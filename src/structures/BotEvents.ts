import { ClientEvents } from 'discord.js'
import Bot from './Bot'

export type EventName = keyof ClientEvents
export default abstract class BotEvent<T extends EventName> {
    eventName: string
    once: boolean
    client: Bot

    constructor(client: Bot, eventName: string, once: boolean) {
        this.client = client
        this.eventName = eventName
        this.once = once
    }

    public abstract execute(
        ...args: ClientEvents[T]
    ): Promise<void>
}