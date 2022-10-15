import { GuildMember, User } from "discord.js";

const BOT_ADMINS = [
    '695882756671930400'
]

export const hasGuildAdmin = (member: GuildMember) => {
    return member.permissions.has([ 'Administrator' ], true)
}

export const hasBotAdmin = (user: User) => {
    return BOT_ADMINS.some(admin => admin === user.id)
}