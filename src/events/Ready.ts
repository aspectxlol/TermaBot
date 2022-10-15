import { Client, REST, Routes } from "discord.js";
import Bot from "../structures/Bot";
import BotCommands from "../structures/BotCommands";
import BotEvent from "../structures/BotEvents";
import { commandFiles } from "../utils/files";

export default class Ready extends BotEvent<'ready'> {
    commandArray: BotCommands[]
    constructor(client: Bot) {
        super(
            client,
            'ready',
            true
        )
        this.commandArray = []
    }

    public async execute(): Promise<void> {
        console.clear()
        

        let tasks: Promise<unknown>[] = [];
        commandFiles.forEach((command) => {
            const file = import(command)
            file.then((module) => {
                const command = module.default as BotCommands
                if(command === undefined) return console.error(`file path ${command} seems to be exporting incorrectly`)
                else this.commandArray.push(command)
            })
            tasks.push(file)
        })
        await Promise.all(tasks)
        
        this.commandArray.forEach((command) => {
            this.client.commands.set(command.data.name, command)
            console.log(`Registered command ${command.data.name}`)
        })  

        const payload = this.commandArray.map((cmd) => cmd.data)

        const rest = new REST({ version: "9" }).setToken(
            process.env.TOKEN || ""
        );

        await rest.put(Routes.applicationCommands(this.client.user?.id!), {
            body: payload,
        }).then(() => {
            console.log('Successfully registered all commands')
        });

        // const payload = this.commandArray.map((cmd) => cmd.data)
        // this.client.application?.commands.set(payload).then(() => {
        //     console.log(`Successfully registered all commands`)
        // })
    }
}