import { CacheType, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import Bot from "../../../structures/Bot";
import { setBalance } from "../../../tools/database/economy";
import userOption from "../../options/userOption";

export default class balanceSet {
    data: SlashCommandSubcommandBuilder

    constructor() {
        this.data = new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription('set balance')
            .addUserOption(new userOption(true).data)
            .addNumberOption(op => op
                .setName('amount')
                .setDescription('amount')
                .setMinValue(1)
                .setRequired(true)
            )
    }

    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot) {
        const amount = interaction.options.getNumber('amount', true)
        const user = interaction.options.getUser('user')
        setBalance(user?.id!, amount).then(() => {
            return interaction.reply({content: `set ${amount} TermaCoins to account ${user?.username}`, ephemeral: true})
        })
    }
}