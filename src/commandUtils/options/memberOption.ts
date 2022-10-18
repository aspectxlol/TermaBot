import { SlashCommandUserOption } from "discord.js";

export default class memberOption {
    public data: SlashCommandUserOption

    constructor(isRequired: boolean) {
        this.data = new SlashCommandUserOption()
            .setName('member')
            .setDescription('the member')
            .setRequired(isRequired)
    }
}