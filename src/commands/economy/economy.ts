import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import { createProfile, getProfile } from "../../tools/database/economy";

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
                    )
                )
                .toJSON(),
                {}
        )
    }

    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot): Promise<any> {
        console.log(await getProfile(interaction.user.id))
        const subcommand = interaction.options.getSubcommand()
        if(subcommand === 'profile') {
            const userArg = interaction.options.getUser('user')
            if(!userArg) {
                if(!(await getProfile(interaction.user.id))) await createProfile(interaction.user)
                const profile = await getProfile(interaction.user.id)
                const embed = new EmbedBuilder()
                    .setTitle(`${interaction.user.username}\`s profile`)
                    .addFields([
                        {name: `Balance`, value: `${profile?.balance}`}
                    ])

                return interaction.reply({embeds: [embed]})
            }
        }
    }
}

export default new economy()