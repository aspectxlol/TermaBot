import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import { hasGuildAdmin } from "../../tools/userPerms";

class ban extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('ban')
                .setDescription('ban a user')
                .addUserOption(op => op
                    .setName('member')
                    .setDescription('the member being banned')
                    .setRequired(true)
                )
                .addStringOption(op => op
                    .setName('reason')    
                    .setDescription('the reason the member is being banned')
                )
                .toJSON(),
                {}
        )
    }

    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot): Promise<any> {
        const member = await interaction.guild?.members.fetch(interaction.options.getUser('member')?.id!)
        const me = await interaction.guild?.members.fetch(interaction.user.id)
        if(!hasGuildAdmin(me!)) return interaction.reply({content: `Insufficient Permissions`, ephemeral: true})
        if(!member?.bannable) return interaction.reply({content: `Cannot Ban This user`, ephemeral: true})
        member?.ban({reason: interaction.options.getString('reason') || 'You have been banned'}).then((member) => {
            const embed = new EmbedBuilder()
                .setTitle(`Banned ${member.user.tag}`)
                .setDescription(`${interaction.options.getString('reason') || 'You Have been Banned'}`)
                .setAuthor({
                    name: client.user?.username!,
                    iconURL: client.user?.displayAvatarURL()
                })
            interaction.reply({embeds: [embed]})
        })
    }
}

export default new ban()