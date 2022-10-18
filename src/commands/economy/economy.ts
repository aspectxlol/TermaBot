import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import pay from "../../subcommands/economy/pay";
import profile from "../../subcommands/economy/profile";

class economy extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('economy')
                .setDescription('economy commands')
                .addSubcommand(subcommand => subcommand
                    .setName('profile')
                    .setDescription('view someones profile')
                    .addUserOption(op => op
                        .setName('user')
                        .setDescription('the profile of a user')
                        .setRequired(false)
                    )
                )
                .addSubcommand(subcommand => subcommand
                    .setName('pay')
                    .setDescription('pay someone')
                    .addUserOption(op => op
                        .setName('user')
                        .setDescription('the profile of a user')
                        .setRequired(true)
                    )
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