import {  GatewayIntentBits, Partials } from "discord.js";
import Bot from "./structures/Bot";
import { config } from 'dotenv'
import Ready from "./events/Ready";
import CommandInteraction from './events/CommandInteraction'
import AutocompleteInteractionEvent from "./events/AutocompleteInteraction";
config()

const client = new Bot({
    intents: [
        //DMS
        GatewayIntentBits.DirectMessages,

        //Guild
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        
        //MessageContent
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.GuildMember,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User
    ]
})

client.on('ready', () =>  { new Ready(client).execute() })
client.on('interactionCreate', (interaction) => { new CommandInteraction(client).execute(interaction)})
client.on('interactionCreate', (interaction) => { new AutocompleteInteractionEvent(client).execute(interaction)})

client.start(process.env.TOKEN!)