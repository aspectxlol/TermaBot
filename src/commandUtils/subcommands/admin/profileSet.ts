import { CacheType, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import Bot from "../../../structures/Bot";
import { configureProfile } from "../../../tools/database/economy";
import userOption from "../../options/userOption";

export default class profileSet {
    data: SlashCommandSubcommandBuilder

    constructor() {
        this.data = new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription('set a profile setting')
            .addUserOption(new userOption(true).data)
            .addStringOption(op => op
                .setName('setting')
                .setDescription('the setting')
                .addChoices({ name: `rank`, value: `rank` })
                .setRequired(true)
            )
            .addStringOption(op => op
                .setName('value')
                .setDescription('the value of the setting')
                .setRequired(true)
            )
    }

    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot) {
        const user = interaction.options.getUser('user')
        const setting = interaction.options.getString('setting')
        const value = interaction.options.getString('value')
        if(setting === 'rank') {
            configureProfile(`${user?.id}.rank`, value!).then(() => {
                return interaction.reply({content: `set ${value} rank to ${user?.username}`, ephemeral: true})
            })
        }
    }
}