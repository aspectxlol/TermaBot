import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import { hasGuildAdmin } from "../../tools/userPerms";

class unban extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('unban')
                .setDescription('unban a member banned from this server')
                .addStringOption(op => op
                    .setName('user')    
                    .setDescription('the user being unbanned')
                    .setAutocomplete(true)
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
        const user = await client.users.fetch(interaction.options.getString('user')!);
        interaction.guild?.members.unban(user).then((user) => {
            const embed = new EmbedBuilder()
                .setTitle(`Unbanned ${user?.tag}`)
                .setColor('Blue')
                .setDescription('unbanned a user')
            return interaction.reply({embeds: [embed]})
        })
    }

    public async autocomplete(interaction: AutocompleteInteraction<CacheType>): Promise<void> {
        const focusedOption = interaction.options.getFocused(true)
        let choices: {name: string, value: string}[] = [];
        if(focusedOption.name === 'user') {
            (await interaction.guild?.bans.fetch())?.forEach((ban) => {
                choices.push({name: `${ban.user.tag}`, value: `${ban.user.id}`})
            })
        }
        const filtered = choices.filter(choice => choice.name.startsWith(focusedOption.value));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        );
    }
}

export default new unban()