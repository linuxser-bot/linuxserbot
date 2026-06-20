const fs = require('fs');
const path = require('path');
const NodeID3 = require('node-id3');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { execSync } = require('child_process');

async function renameCommand(sock, chatId, message) {

try {

    const context = message.message?.extendedTextMessage?.contextInfo;
    const quoted = context?.quotedMessage;

    const media =
        quoted?.audioMessage ||
        quoted?.documentMessage ||
        message.message?.audioMessage ||
        message.message?.documentMessage;

    if (!media) {
        return sock.sendMessage(chatId, {
            text: '❌ Reply to audio or document file.'
        }, { quoted: message });
    }

    const progress = await sock.sendMessage(chatId, {
        text: '🎧 Processing audio...'
    }, { quoted: message });

    if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

    // ---------- UNIQUE ID ----------
    const id = Date.now();

    // ---------- DOWNLOAD ----------
    const buffer = await downloadMediaMessage(
        {
            key: message.key,
            message: quoted || message.message
        },
        'buffer',
        {},
        {}
    );

    const rawPath = path.join('./temp', `raw_${id}.ogg`);
    const mp3Path = path.join('./temp', `linuxser_${id}.mp3`);

    fs.writeFileSync(rawPath, buffer);

    // ---------- CONVERT TO REAL MP3 ----------
    execSync(`ffmpeg -y -i "${rawPath}" -ar 44100 -ac 2 "${mp3Path}"`);

    fs.unlinkSync(rawPath);

    // ---------- COVER IMAGE ----------
    const coverPath = path.join(__dirname, '../assets/bot_image.jpeg');

    let coverBuffer = null;
    if (fs.existsSync(coverPath)) {
        coverBuffer = fs.readFileSync(coverPath);
    }

    // ---------- ID3 TAGS ----------
    const tags = {
        title: '𝐋ɪɴᴜx 𝐒ᴇʀ - Renamed Audio',
        artist: '𝐋ɪ፝֟፝ɴᴜꪎ 𝐒ᴇ𝚁 ⺓',
        album: 'Linux Ser Collection',

        APIC: coverBuffer
            ? {
                mime: 'image/jpeg',
                type: 3,
                description: 'cover',
                data: coverBuffer   // ✔ correct format
            }
            : undefined
    };

    NodeID3.write(tags, mp3Path);

    // ---------- SUCCESS ----------
    await sock.sendMessage(chatId, {
        text: '✅ Audio renamed & tagged successfully',
        edit: progress.key
    });

    await sock.sendMessage(chatId, {
        audio: fs.readFileSync(mp3Path),
        mimetype: 'audio/mpeg',
        fileName: `linuxser-${id}.mp3`
    }, { quoted: message });

    fs.unlinkSync(mp3Path);

} catch (err) {

    console.error('Rename Error:', err);

    await sock.sendMessage(chatId, {
        text: `❌ Error:\n${err.message}`
    }, { quoted: message });

}

}

module.exports = renameCommand;
