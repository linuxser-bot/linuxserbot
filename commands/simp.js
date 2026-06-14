const fetch = require('node-fetch');

async function simpCommand(sock, chatId, quotedMsg, mentionedJid, sender) {
    try {
        // Target user
        let who = quotedMsg
            ? quotedMsg.sender
            : mentionedJid && mentionedJid[0]
                ? mentionedJid[0]
                : sender;

        // Profile picture
        let avatarUrl;

        try {
            avatarUrl = await sock.profilePictureUrl(who, 'image');
        } catch {
            avatarUrl = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';
        }

        // API
        const apiUrl = `https://some-random-api.com/canvas/misc/simpcard?avatar=${encodeURIComponent(avatarUrl)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const imageBuffer = await response.buffer();

        // Send image
        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: '*your religion is simping*'
        });

    } catch (error) {
        console.error('SIMP ERROR:', error);

        await sock.sendMessage(chatId, {
            text: '❌ Failed to generate simp card.'
        });
    }
}

module.exports = { simpCommand };
