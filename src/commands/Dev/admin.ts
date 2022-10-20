import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import balanceAdd from "../../commandUtils/subcommands/admin/balanceAdd";
import balanceSet from "../../commandUtils/subcommands/admin/balanceSet";
import profileSet from "../../commandUtils/subcommands/admin/profileSet";
import Bot from "../../structures/Bot";
import BotCommands from "../../structures/BotCommands";
import { hasBotAdmin } from "../../tools/userPerms";

class admin extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('admin')
                .setDescription('Bot Admins only commands')
                .addSubcommandGroup(subcommandGroup => subcommandGroup
                    .setName('balance')
                    .setDescription('balance')
                    .addSubcommand(new balanceAdd().data)
                    .addSubcommand(new balanceSet().data)
                )
                .addSubcommandGroup(subcommandGroup => subcommandGroup
                    .setName('profile')
                    .setDescription('profile description')
                    .addSubcommand(new profileSet().data)
                )
                .toJSON(),
                {}
        )
    }
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot): Promise<any> {
        if(!hasBotAdmin(interaction.user)) return interaction.reply({content: `Insufficient Permissions`, ephemeral: true})
        const subcommand = interaction.options.getSubcommand()
        const subcommandGroup = interaction.options.getSubcommandGroup()
        if(subcommand === 'add' && subcommandGroup === 'balance') {return new balanceAdd().execute(interaction, client)}
        else if(subcommand === 'set' && subcommandGroup === 'balance') {return new balanceSet().execute(interaction, client)}
        else if(subcommand === 'set' && subcommandGroup === 'profile') {return new profileSet().execute(interaction, client)}
    }
}

export default new admin()