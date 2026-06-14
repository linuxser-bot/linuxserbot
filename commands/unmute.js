async function unmuteCommand(sock, chatId) {
    await sock.groupSettingUpdate(chatId, 'not_announcement'); // Unmute the group
    await sock.sendMessage(chatId, { text: '_✅ The group has been unmuted_' });
}

module.exports = unmuteCommand;
