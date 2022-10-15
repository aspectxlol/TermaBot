import { AutocompleteInteraction, ChatInputCommandInteraction, PermissionResolvable, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'
import Bot from './Bot'

export type BotCommandOpt = {
    timeout?: number;
};

export default abstract class BotCommands {
    public readonly data: RESTPostAPIApplicationCommandsJSONBody
    public readonly timeout?: number;
    public readonly requiredPerms?: PermissionResolvable;
    // autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>

    constructor(data: RESTPostAPIApplicationCommandsJSONBody, options: BotCommandOpt) {
        this.data = data
        this.timeout = options.timeout
    }

    public abstract execute(
        interaction: ChatInputCommandInteraction,
        client: Bot
    ): Promise<void>;
}