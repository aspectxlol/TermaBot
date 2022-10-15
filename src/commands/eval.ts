import { ActionRowBuilder, ModalSubmitInteraction, CacheType, ChatInputCommandInteraction, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Bot from "../structures/Bot";
import BotCommands from "../structures/BotCommands";
import { hasBotAdmin } from "../tools/userPerms";
import { check } from "../utils/utils";

class Eval extends BotCommands {
    constructor() {
        super(
            new SlashCommandBuilder()
            .setName('eval')
            .setDescription('evaluate some typescript code')
            .addStringOption(option =>
                option.setName("code")
                    .setDescription("If you are going to execute multiline codes leave this option empty.")
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option.setName("ephemeral")
                    .setDescription("If you want the code executed to be only shown for you select 'True'")
                    .setRequired(false)
            )
            .toJSON(),
            {
                timeout: 1
            }
        )
    }
    public async execute(interaction: ChatInputCommandInteraction<CacheType>, client: Bot): Promise<any> {
        if(!hasBotAdmin(interaction.user)) return interaction.reply({content: `insufficient permissions`, ephemeral: true})
        if(!interaction.options.getString('code')) {
            const modal = new ModalBuilder()
                .setTitle('code')
                .setCustomId(`eval`)
                .addComponents(new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(new TextInputBuilder()
                        .setCustomId('code')
                        .setLabel('Code')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('the code to be executed')
                        .setRequired(true)
                    )
                )
            interaction.showModal(modal)
            const filter = (interaction: ModalSubmitInteraction<CacheType>) => interaction.customId === `eval`
            interaction.awaitModalSubmit({filter: filter, time: 120000}).then(inter => check(inter, inter.fields.getTextInputValue('code')!, false))
        } else {
            check(interaction, interaction.options.getString('code')!, interaction.options.getBoolean('ephmeral') || false)
        }
    }
}

export default new Eval()