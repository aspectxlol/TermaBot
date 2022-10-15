import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import { hasGuildAdmin } from "../../tools/userPerms";

class kick extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('kick')
                .setDescription('kick a member')
                .addUserOption(op => op
                    .setName('member')
                    .setDescription('the member to be kicked')
                    .setRequired(true)
                )
                .addStringOption(op => op
                    .setName('reason')
                    .setDescription('the reason the member is to be kicked')
                    .setRequired(true)
                )
                .toJSON(),
            {}
        )
    }
    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot): Promise<any> {
        const member = await interaction.guild?.members.fetch(interaction.options.getUser('member')?.id!)
        const me = await interaction.guild?.members.fetch(interaction.user.id)
        if(!hasGuildAdmin(me!)) return interaction.reply({content: `Insufficient Permissions`, ephemeral: true})
        if(!member?.kickable) return interaction.reply({content: `Cannot Kick Member`, ephemeral: true})
        member.kick(interaction.options.getString('reason') || 'You Have been kicked').then((member) => {
            const embed = new EmbedBuilder()
                .setTitle(`Kicked ${member.user.tag}`)
                .setDescription(`${interaction.options.getString('reason') || 'Kicked'}`)
                .setColor('Blue')
            return interaction.reply({embeds: [embed]})
        })
    }
}

export default new kick()