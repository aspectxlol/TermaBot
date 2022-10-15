import { AutocompleteInteraction, CacheType, Interaction } from "discord.js";
import Bot from "../structures/Bot";
import BotEvent from "../structures/BotEvents";
import unban from '../commands/moderation/unban'

export default class AutocompleteInteractionEvent extends BotEvent<'interactionCreate'> {
    constructor(client: Bot) {
        super(
            client,
            'interactionCreate',
            false
        )
    }

    public async execute(interaction: Interaction<CacheType>): Promise<void> {
        if(!interaction.isAutocomplete()) return;
        const autointer = interaction as AutocompleteInteraction<CacheType>
        if(autointer.commandName === unban.data.name) return unban.autocomplete(autointer)
    }
}