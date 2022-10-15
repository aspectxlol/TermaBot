import { Interaction, CacheType, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import Bot from "../structures/Bot";
import BotEvent from "../structures/BotEvents";

export default class CommandInteraction extends BotEvent<'interactionCreate'> {
    constructor(client: Bot) {
        super(
            client,
            'interactionCreate',
            false
        )
    }

    public async execute(interaction: Interaction<CacheType>): Promise<void> {
        if(!interaction.isCommand()) return
        const command = this.client.commands.get(interaction.commandName)
        if(!command) return
        try {
            const commandInteraction = interaction as ChatInputCommandInteraction<CacheType>
            await command.execute(commandInteraction, this.client)
        } catch(e: any) {
            let msg = "NULL";
            if (e instanceof Error) {
                msg = e.message;
            } else if (typeof e === "object" && e !== null) {
                msg = e.toString();
            }

            console.log(e);
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                    "❌ An error occurred while executing the command." +
                        `\`\`\`\n${msg}\`\`\``
                );

            if (interaction.deferred) {
                await interaction.editReply({
                    content: " ",
                    embeds: [errorEmbed],
                });
            } else if (interaction.replied) {
                await interaction.followUp({
                    content: " ",
                    embeds: [errorEmbed],
                });
            } else {
                await interaction.reply({
                    content: " ",
                    embeds: [errorEmbed],
                    ephemeral: true,
                });
            }
        }
    }
}