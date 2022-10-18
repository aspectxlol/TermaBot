import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import userOption from "../../commandUtils/options/userOption";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import pay from "../../commandUtils/subcommands/economy/pay";
import profile from "../../commandUtils/subcommands/economy/profile";

class economy extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('economy')
                .setDescription('economy commands')
                .addSubcommand(subcommand => subcommand
                    .setName('profile')
                    .setDescription('view someones profile')
                    .addUserOption(new userOption(false).data)
                )
                .addSubcommand(subcommand => subcommand
                    .setName('pay')
                    .setDescription('pay someone')
                    .addUserOption(new userOption(true).data)
                    .addNumberOption(op => op
                        .setName('amount')
                        .setDescription('the payment amount')
                        .setMinValue(1)
                        .setRequired(true)
                    )
                )
                .toJSON(),
                {}
        )
    }

    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot): Promise<any> {
        const subcommand = interaction.options.getSubcommand()
        if(subcommand == 'profile') { return new profile(interaction, client).execute() }
        else if(subcommand === 'pay') { return new pay(interaction, client).execute() }
    }
}

export default new economy()