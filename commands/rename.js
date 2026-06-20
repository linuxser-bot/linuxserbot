const fs = require('fs');
const path = require('path');
const axios = require('axios');
const NodeID3 = require('node-id3');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// ---------- HELPERS ----------
function parseArgs(text = '') {
    const parts = text.split(',').map(v => v.trim());

    return {
        title: parts[0] || 'Unknown Title',
        artist: parts[1] || 'Unknown Artist',
        album: parts[2] || 'Unknown Album',
        cover: parts[3] || null
    };
}

function isUrl(text = '') {
    return /^https?:\/\/\S+/i.test(text.trim());
}

async function downloadUrlBuffer(url) {
    const res = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 15000
    });
    return Buffer.from(res.data);
}

async function downloadWA(message, type = 'audio') {
    const stream = await downloadContentFromMessage(message, type);
    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
}

// ---------- MAIN ----------
async function renameCommand(sock, chatId, message, text = '') {
try {

    // 🔥 ALWAYS react first (prevents "bot not responding" feeling)
    await sock.sendMessage(chatId, {
        react: { text: "🎧", key: message.key }
    });

    if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

    const context = message.message?.extendedTextMessage?.contextInfo;

    const quoted = context?.quotedMessage;

    const { title, artist, album, cover } = parseArgs(text);

    let buffer = null;

    const firstArg = text.split(',')[0]?.trim();

    // ---------- CASE 1: URL ----------
    if (firstArg && isUrl(firstArg)) {
        buffer = await downloadUrlBuffer(firstArg);
    }

    // ---------- CASE 2: QUOTED AUDIO ----------
    else if (quoted?.audioMessage) {
        buffer = await downloadWA(quoted.audioMessage, 'audio');
    }

    // ---------- CASE 3: DIRECT AUDIO ----------
    else if (message.message?.audioMessage) {
        buffer = await downloadWA(message.message.audioMessage, 'audio');
    }

    // ---------- CASE 4: QUOTED DOCUMENT ----------
    else if (quoted?.documentMessage) {
        buffer = await downloadWA(quoted.documentMessage, 'document');
    }

    // ---------- CASE 5: DIRECT DOCUMENT ----------
    else if (message.message?.documentMessage) {
        buffer = await downloadWA(message.message.documentMessage, 'document');
    }

    // ---------- FAIL SAFE ----------
    if (!buffer) {
        await sock.sendMessage(chatId, {
            react: { text: "❌", key: message.key }
        });

        return sock.sendMessage(chatId, {
            text: `🎧 *Rename Usage*

.reply to audio/document OR use URL

.rename title, artist, album, cover_url`
        }, { quoted: message });
    }

    // ---------- SAVE ----------
    const filePath = path.join('./temp', `${Date.now()}.mp3`);
    fs.writeFileSync(filePath, buffer);

    // ---------- COVER ----------
    let coverBuffer = null;

    if (cover && isUrl(cover)) {
        try {
            const res = await axios.get(cover, {
                responseType: 'arraybuffer'
            });
            coverBuffer = Buffer.from(res.data);
        } catch {}
    }

    // ---------- TAG ----------
    NodeID3.write({
        title,
        artist,
        album,
        image: coverBuffer || undefined
    }, filePath);

    // ---------- SUCCESS ----------
    await sock.sendMessage(chatId, {
        react: { text: "✅", key: message.key }
    });

    await sock.sendMessage(chatId, {
        audio: fs.readFileSync(filePath),
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
    }, { quoted: message });

    fs.unlinkSync(filePath);

} catch (err) {

    console.error(err);

    await sock.sendMessage(chatId, {
        react: { text: "❌", key: message.key }
    });

    await sock.sendMessage(chatId, {
        text: `❌ Error:\n${err.message}`
    }, { quoted: message });

}

}

module.exports = renameCommand;
