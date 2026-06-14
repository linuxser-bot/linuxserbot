const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { UploadFileUgu, TelegraPh } = require('../lib/uploader');

async function getMediaBufferAndExt(message) {
    const m = message.message || {};

    if (m.imageMessage) {
        const stream = await downloadContentFromMessage(m.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks), ext: '.jpg' };
    }

    if (m.videoMessage) {
        const stream = await downloadContentFromMessage(m.videoMessage, 'video');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks), ext: '.mp4' };
    }

    if (m.audioMessage) {
        const stream = await downloadContentFromMessage(m.audioMessage, 'audio');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks), ext: '.mp3' };
    }

    if (m.documentMessage) {
        const stream = await downloadContentFromMessage(m.documentMessage, 'document');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);

        const fileName = m.documentMessage.fileName || 'file.bin';
        const ext = path.extname(fileName) || '.bin';

        return { buffer: Buffer.concat(chunks), ext };
    }

    if (m.stickerMessage) {
        const stream = await downloadContentFromMessage(m.stickerMessage, 'sticker');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);

        return { buffer: Buffer.concat(chunks), ext: '.webp' };
    }

    return null;
}

async function getQuotedMediaBufferAndExt(message) {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

    if (!quoted) return null;

    return getMediaBufferAndExt({ message: quoted });
}

async function urlCommand(sock, chatId, message) {
    try {

        // 🔗 React Emoji
        await sock.sendMessage(chatId, {
            react: { text: '🔗', key: message.key }
        });

        // Prefer current message media, else quoted media
        let media = await getMediaBufferAndExt(message);

        if (!media) media = await getQuotedMediaBufferAndExt(message);

        if (!media) {
            await sock.sendMessage(chatId, {
                text: `
*📎 URL Converter*

_❌ Please reply to or send media_

_to generate a direct URL_

_🌷 Try again ✨_
`.trim()
            }, { quoted: message });

            return;
        }

        const tempDir = path.join(__dirname, '../temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempPath = path.join(tempDir, `${Date.now()}${media.ext}`);

        fs.writeFileSync(tempPath, media.buffer);

        let url = '';

        try {

            if (
                media.ext === '.jpg' ||
                media.ext === '.png' ||
                media.ext === '.webp'
            ) {

                try {
                    url = await TelegraPh(tempPath);

                } catch {

                    const res = await UploadFileUgu(tempPath);

                    url = typeof res === 'string'
                        ? res
                        : (res.url || res.url_full || JSON.stringify(res));
                }

            } else {

                const res = await UploadFileUgu(tempPath);

                url = typeof res === 'string'
                    ? res
                    : (res.url || res.url_full || JSON.stringify(res));
            }

        } finally {

            setTimeout(() => {
                try {
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                    }
                } catch {}
            }, 2000);
        }

        if (!url) {

            await sock.sendMessage(chatId, {
                react: { text: '❌', key: message.key }
            });

            await sock.sendMessage(chatId, {
                text: `
*❌ Upload Failed*

_⚠️ Unable to upload media_

_📌 Please try again later_

_🌷 Retry again ✨_
`.trim()
            }, { quoted: message });

            return;
        }

        // ✅ Success Reaction
        await sock.sendMessage(chatId, {
            react: { text: '✅', key: message.key }
        });

        const stylishMessage = `
*🔗 Media URL*

_📎 Your file has been uploaded successfully_

_🌐 URL: ${url}_
`.trim();

        await sock.sendMessage(chatId, {
            text: stylishMessage
        }, { quoted: message });

    } catch (error) {

        console.error('[URL] error:', error?.message || error);

        await sock.sendMessage(chatId, {
            react: { text: '❌', key: message.key }
        });

        await sock.sendMessage(chatId, {
            text: `
*❌ Error*

_⚠️ Failed to convert media into URL_

_📌 Please try again_

_🌷 Something went wrong ✨_
`.trim()
        }, { quoted: message });
    }
}

module.exports = urlCommand;
