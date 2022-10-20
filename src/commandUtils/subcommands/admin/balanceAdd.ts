import { CacheType, ChatInputCommandInteraction, Integration, SlashCommandSubcommandBuilder } from "discord.js";
import Bot from "../../../structures/Bot";
import { addBalance } from "../../../tools/database/economy";
import userOption from "../../options/userOption";

export default class balanceAdd {
    data: SlashCommandSubcommandBuilder

    constructor() {
        this.data = new SlashCommandSubcommandBuilder()
            .setName('add')
            .setDescription('add balance')
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
        addBalance(user?.id!, amount).then(() => {
            return interaction.reply({content: `added ${amount} TermaCoins to account ${user?.username}`, ephemeral: true})
        })
    }
}