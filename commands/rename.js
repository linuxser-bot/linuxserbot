const fs = require('fs'); const path = require('path'); const NodeID3 = require('node-id3');
async function renameCommand(sock, chatId, message) { try {
const quoted =
        message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || !quoted.audioMessage) {
        return await sock.sendMessage(
            chatId,
            {
                text: '❌ Reply to an audio file.'
            },
            { quoted: message }
        );
    }

    await sock.sendMessage(
        chatId,
        {
            text: '🎵 Processing Audio...'
        },
        { quoted: message }
    );

    /*
     * DOWNLOAD AUDIO HERE
     * Replace with your own Baileys download method
     */

    const audioPath = './temp/input.mp3';

    const tags = {
        title: '♪ 𝐕ɪʙᴇ 𝐁ʏ 𝐋ꜱ',
        artist: '𝐋ɪ፝֟፝ɴᴜꪎ 𝐒ᴇ𝚁 ⺓',
        album: '𝐋ɪ፝֟፝ɴᴜꪎ 𝐒ᴇ𝚁 ⺓',
        performerInfo: 'Linux Ser',
        image: './assets/bot_image.jpg'
    };

    NodeID3.write(tags, audioPath);

    await sock.sendMessage(
        chatId,
        {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: 'linuxser.mp3'
        },
        { quoted: message }
    );

    if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
    }

} catch (err) {
    console.error(err);

    await sock.sendMessage(
        chatId,
        {
            text: '❌ Failed to process audio.'
        },
        { quoted: message }
    );
}
}
module.exports = renameCommand;
