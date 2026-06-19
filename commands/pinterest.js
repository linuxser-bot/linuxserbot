const axios = require('axios');

async function pinterestCommand(sock, chatId, message, link) {
try {

    if (!link) {
        return await sock.sendMessage(chatId, {
            text:

`📌 Pinterest Downloader

Usage:
.pinterest <link>

Example:
.pinterest https://pin.it/xxxxx`
}, { quoted: message });
}

    await sock.sendMessage(chatId, {
        text: '📥 Downloading Pinterest media...'
    }, { quoted: message });

    const { data } = await axios.get(
        `https://api-faa.my.id/faa/pin-down?url=${encodeURIComponent(link)}`,
        { timeout: 30000 }
    );

    const mediaUrl =
        data?.result?.url ||
        data?.result?.media ||
        data?.result?.download ||
        data?.url ||
        data?.media ||
        data?.download;

    if (!mediaUrl) {
        throw new Error('Media URL not found in API response');
    }

    const isVideo =
        mediaUrl.endsWith('.mp4') ||
        mediaUrl.includes('.mp4');

    if (isVideo) {
        await sock.sendMessage(chatId, {
            video: { url: mediaUrl },
            caption: '✅ Pinterest Video Downloaded'
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, {
            image: { url: mediaUrl },
            caption: '✅ Pinterest Image Downloaded'
        }, { quoted: message });
    }

} catch (error) {

    console.error('Pinterest Error:', error);

    await sock.sendMessage(chatId, {
        text:

`❌ Download failed.

Possible reasons:
• Invalid Pinterest link
• API is offline
• API response format changed`
}, { quoted: message });
}
}

module.exports = pinterestCommand;
