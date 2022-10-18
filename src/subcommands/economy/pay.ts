import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChatInputCommandInteraction, ComponentType, EmbedBuilder, Emoji } from "discord.js";
import Bot from "../../structures/Bot";
import { addBalance, getProfile, removeBalance } from "../../tools/database/economy";
import { v4 } from 'uuid'
import { TAX_AMOUNT_IN_PERCENTAGE } from "../../constants";
import { addReceipts } from "../../tools/database/receipts";

export default class pay {
    interaction: ChatInputCommandInteraction<CacheType>
    client: Bot

    constructor(interaction: ChatInputCommandInteraction, client: Bot) {
        this.interaction = interaction
        this.client = client
    }

    public async execute() {
        const amount = this.interaction.options.getNumber('amount')
        const taxed = amount! - ((TAX_AMOUNT_IN_PERCENTAGE / 100) * amount!)

        const senderProfile = await getProfile(this.interaction.user.id)
        if(!senderProfile) return this.interaction.reply({content: `you dont have a profile`})
        const receiverProfile = await getProfile(this.interaction.options.getUser('user')?.id!)
        if(!receiverProfile) return this.interaction.reply({content: `they dont have a profile`})

        const confirmationEmbed = new EmbedBuilder()
            .setTitle(`Confirm That You are paying [${receiverProfile.rank}] ${(await this.client.users.fetch(receiverProfile.id)).username}`)
            .setDescription(`You Are Paying [${receiverProfile.rank}] ${(await this.client.users.fetch(receiverProfile.id)).username}: ${taxed} TermaCoins`)
            .setColor('Blue')
        
        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
            )
            .addComponents(new ButtonBuilder()
                .setCustomId('deny')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
            )
        
        const confirm = await this.interaction.reply({embeds: [confirmationEmbed], components: [button]})
        const filter = (interaction: ButtonInteraction<CacheType>) => {
            interaction.deferUpdate();
            return interaction.user.id === interaction.user.id;
        }
        confirm.awaitMessageComponent({
            filter,
            componentType: ComponentType.Button,
            time: 30000
        })
        .then(async (interaction) => {
            if(interaction.customId === 'confirm') {
                if(!(interaction.user.id == this.interaction.user.id)) return
                const confirmedEmbed = new EmbedBuilder()
                    .setTitle(`payment confirmed towards [${receiverProfile.rank}] ${(await this.client.users.fetch(receiverProfile.id)).username} of ${taxed} TermaCoins`)
                    .setColor('Green')
                this.interaction.editReply({content: ``, embeds: [confirmedEmbed], components: []})

                removeBalance(`${this.interaction.user.id}`, amount!).then(() => {
                    addBalance(`${this.interaction.options.getUser('user')?.id!}`, taxed)
                    const id = v4()
                    addReceipts(
                        this.interaction.user.id,
                        this.interaction.options.getUser('user')?.id!,
                        taxed,
                        id
                    )
                    const receipt = new EmbedBuilder()
                        .setTitle('Payment Successfull')
                        .setDescription(`Payment ID: ${id}`)
                        .setColor('Blue')
                    this.interaction.channel?.send({embeds: [receipt]})
                })
            } else {
                if(!(interaction.user.id == this.interaction.user.id)) return
                const deniedEmbed = new EmbedBuilder()
                    .setTitle(`payment denied towards [${receiverProfile.rank}] ${(await this.client.users.fetch(receiverProfile.id)).username} of ${taxed} TermaCoins`)
                    .setColor('Red')
                this.interaction.editReply({content: ``, embeds: [deniedEmbed], components: []})
            }
        })
        .catch(err => err);
    }
}