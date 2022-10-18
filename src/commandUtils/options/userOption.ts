import { SlashCommandUserOption } from "discord.js";

export default class userOption {
    data: SlashCommandUserOption

    constructor() {
        this.data = new SlashCommandUserOption()
            .setName('user')
            .setDescription('the user')
    }
}