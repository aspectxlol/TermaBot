import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import fs from 'node:fs'
import os from 'os'
import { execSync } from 'child_process'
import { hasBotAdmin } from "../../tools/userPerms";

class stats extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
            .setName('stats')
            .setDescription('get pi stats')
            .toJSON(),
            {}
        )
    }
    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot): Promise<any> {
        if(!hasBotAdmin(interaction.user)) return interaction.reply({content: `insufficient permissions`, ephemeral: true})
        const temp = execSync('vcgencmd measure_temp', {encoding: 'utf-8'})
        const volts = execSync('vcgencmd measure_volts', {encoding: 'utf-8'})
        const uptime = execSync('uptime -p', {encoding: 'utf-8'})

        var totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
        var usedMemory = Number(((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2))
        var usedMemoryType = "GB"
        if (usedMemory < 1){usedMemory = usedMemory * 1024, usedMemoryType = "MB"}

        var freeMemory = Number((os.freemem() / 1024 / 1024 / 1024).toFixed(2))
        var freeMemoryType = "GB"
        if (freeMemory < 1){freeMemory = freeMemory * 1024, freeMemoryType =  "MB"}
        const embed = new EmbedBuilder()
            .setTitle('Pi Stats')
            .setColor('Blue')
            .addFields([
                {name: 'Pi Temperature', value: `${temp.slice(5, temp.length)}`, inline: true},
                {name: `pi Memory`, value: `Free: ${freeMemory}${freeMemoryType} / ${totalMemory}GB\nUsed: ${usedMemory}${usedMemoryType}/${totalMemory}GB`, inline: true},
                {name: `Voltages`, value: `${volts.slice(5, volts.length)}`, inline: true},
                {name: `pi Uptime`, value: `${uptime.slice(3, uptime.length)}`, inline: true}
            ])
        interaction.reply({embeds: [embed]})
    }
}

export default new stats()