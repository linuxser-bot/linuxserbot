const { handleWelcome } = require('../lib/welcome');
const { isWelcomeOn, getWelcome } = require('../lib/index');

async function welcomeCommand(sock, chatId, message, match) {
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, {
            text: '❌ This command can only be used in groups.'
        });
        return;
    }

    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';

    const matchText = text.split(' ').slice(1).join(' ').trim();

    if (!matchText) {
        return await sock.sendMessage(chatId, {
            text: `📥 *Welcome Message Setup*

✅ *.welcome on* — Enable welcome messages
🛠️ *.welcome set Your custom message* — Set a custom welcome message
🚫 *.welcome off* — Disable welcome messages

━━━━━━━━━━━━━━━

📌 *Available Variables*

• {user} - Mentions the new member 👤
• {group} - Shows group name 👥
• {description} - Shows group description 📖

━━━━━━━━━━━━━━━

✨ *Example:*

.welcome set 👋 Welcome {user}

🏡 Group: {group}

📖 {description}

Enjoy your stay! 🎉`
        });
    }

    await handleWelcome(sock, chatId, message, matchText);
}

async function handleJoinEvent(sock, id, participants) {
    const isWelcomeEnabled = await isWelcomeOn(id);
    if (!isWelcomeEnabled) return;

    const customMessage = await getWelcome(id);

    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'No description available';

    for (const participant of participants) {
        try {
            const participantString =
                typeof participant === 'string'
                    ? participant
                    : (participant.id || participant.toString());

            const user = participantString.split('@')[0];

            let displayName = user;

            try {
                const groupParticipants = groupMetadata.participants || [];
                const userParticipant = groupParticipants.find(
                    p => p.id === participantString
                );

                if (userParticipant?.name) {
                    displayName = userParticipant.name;
                }
            } catch (e) {
                console.log('Could not fetch display name');
            }

            let finalMessage;

            if (customMessage) {
                finalMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{description}/g, groupDesc);
            } else {
                const now = new Date();

                const timeString = now.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });

                finalMessage = `╭━━━〔 🌸 Welcome 🌸 〕━━━╮
┃ 👤 User : @${user}
┃ 👥 Members : ${groupMetadata.participants.length}
┃ ⏰ Time : ${timeString}
╰━━━━━━━━━━━━━━━╯

✨ Welcome to *${groupName}*

📖 Group Description:
${groupDesc}

🎉 Enjoy your stay and have fun!`;
            }

            await sock.sendMessage(id, {
              text: finalMessage,
              mentions: [participantString]
        });

        } catch (error) {
            console.error('Error sending welcome message:', error);

            const participantString =
                typeof participant === 'string'
                    ? participant
                    : (participant.id || participant.toString());

            const user = participantString.split('@')[0];

            await sock.sendMessage(id, {
                text: `🎉 Welcome @${user}!`,
                mentions: [participantString]
            });
        }
    }
}

module.exports = {
    welcomeCommand,
    handleJoinEvent
};
