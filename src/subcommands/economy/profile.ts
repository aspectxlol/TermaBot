import { CacheType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import { createProfile, getProfile } from "../../tools/database/economy";

export default class profile {
    interaction: ChatInputCommandInteraction<CacheType>
    client: Bot

    constructor(interaction: ChatInputCommandInteraction, client: Bot) {
        this.interaction = interaction
        this.client = client
    }

    public async execute() {
        const userArg = this.interaction.options.getUser('user')
            if(!userArg) {
                if(!(await getProfile(this.interaction.user.id))) await createProfile(this.interaction.user)
                const profile = await getProfile(this.interaction.user.id)
                const embed = new EmbedBuilder()
                    .setTitle(`[${profile?.rank}] ${this.interaction.user.username}'s profile`)
                    .setColor('Blue')
                    .addFields([
                        {name: `Balance`, value: `${profile?.balance}`}
                    ])

                return this.interaction.reply({embeds: [embed]})
            } else {
                if(!(await getProfile(userArg.id))) await createProfile(userArg)
                const profile = await getProfile(userArg.id)
                const embed = new EmbedBuilder()
                    .setTitle(`[${profile?.rank}] ${userArg.username}'s profile`)
                    .setColor('Blue')
                    .addFields([
                        {name: `Balance`, value: `${profile?.balance}`}
                    ])

                return this.interaction.reply({embeds: [embed]})
            }
    }
}