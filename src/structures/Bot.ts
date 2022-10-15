import { Client, ClientOptions, Collection } from 'discord.js'
// import { eventFiles } from '../utils/files'
import BotCommands from './BotCommands'
import BotEvent from './BotEvents'

export default class Bot extends Client {
    commands: Collection<string, BotCommands>
    constructor(options: ClientOptions) {
        super(options)
        this.commands = new Collection()
    }

    async start(token: string) {
        this.login(token)
        // await this.initModules()
    }

    // async initModules() {
    //     const tasks: Promise<unknown>[] = [];
    //     eventFiles.forEach((file: string) => {
    //         const task = import(file)
    //         task.then((module) => {
    //             const event = module.default as BotEvent<any>
    //             if(!event) return console.log(`File Path ${file} isnt exporting correctly`)
    //             if(event.once) this.once(event.eventName, event.execute.bind(null, this))
    //             else this.on(event.eventName, event.execute.bind(null, this))
    //             console.log(`|> registered event ${event.eventName}`)
    //         })
    //         tasks.push(task)
    //     })
    //     await Promise.all(tasks);
    //     console.log('Registered Events')
    // }
}