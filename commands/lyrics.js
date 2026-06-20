const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle, message) {

    // 🎵 Start Reaction
    await sock.sendMessage(chatId, {
        react: {
            text: '🎵',
            key: message.key
        }
    });

    if (!songTitle) {
        return await sock.sendMessage(chatId, {
            text: `╭───❮ *ʟʏʀɪᴄꜱ* ❯
│
├ 🎵 ꜰɪɴᴅ ꜱᴏɴɢ ʟʏʀɪᴄꜱ
│
├ ⚡ ᴜꜱᴀɢᴇ:
│   .ʟʏʀɪᴄꜱ <ꜱᴏɴɢ ɴᴀᴍᴇ>
│
├ 📖 ᴇxᴀᴍᴘʟᴇ:
│   .ʟʏʀɪᴄꜱ ʙᴇʟɪᴇᴠᴇʀ
│
╰─────────────⦁`
        }, { quoted: message });
    }

    try {

        // 🔍 Searching Reaction
        await sock.sendMessage(chatId, {
            react: {
                text: '🔍',
                key: message.key
            }
        });

        let searchingMsg = await sock.sendMessage(chatId, {
    text: `_🔍 Searching ${songTitle}_`
     }, { quoted: message });

        const apiUrl =
            `https://lrclib.net/api/search?q=${encodeURIComponent(songTitle)}`;

        const res = await fetch(apiUrl);

        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {

            await sock.sendMessage(chatId, {
                react: {
                    text: '❌',
                    key: message.key
                }
            });

            return await sock.sendMessage(chatId, {
                edit: searchingMsg.key,
                text: `╭───❮ *ʟʏʀɪᴄꜱ* ❯
│
├ ❌ ɴᴏ ʟʏʀɪᴄꜱ ꜰᴏᴜɴᴅ
│
├ 🎵 ${songTitle}
│
╰─────────────⦁`
            });
        }

        const song = data[0];

        const lyrics =
            song.plainLyrics ||
            song.syncedLyrics ||
            null;

        if (!lyrics) {

            await sock.sendMessage(chatId, {
                react: {
                    text: '❌',
                    key: message.key
                }
            });

            return await sock.sendMessage(chatId, {
                edit: searchingMsg.key,
                text: `╭───❮ *ʟʏʀɪᴄꜱ* ❯
│
├ ❌ ʟʏʀɪᴄꜱ ᴜɴᴀᴠᴀɪʟᴀʙʟᴇ
│
├ 🎵 ${songTitle}
│
╰─────────────⦁`
        });
        }

        const maxChars = 4000;

        const output =
            lyrics.length > maxChars
                ? lyrics.substring(0, maxChars) + '\n\n...'
                : lyrics;

        // ✅ Success Reaction
        await sock.sendMessage(chatId, {
            react: {
                text: '✅',
                key: message.key
            }
        });

        return await sock.sendMessage(chatId, {
    edit: searchingMsg.key,
    text: `╭───❮ *ʟʏʀɪᴄꜱ* ❯
│
├ 🎵 ᴛɪᴛʟᴇ
│   ${song.trackName || songTitle}
│
├ 👤 ᴀʀᴛɪꜱᴛ
│   ${song.artistName || 'Unknown'}
│
╰─────────────⦁

${output}`
});

    } catch (error) {

        console.error('Lyrics Error:', error);

        await sock.sendMessage(chatId, {
            react: {
                text: '❌',
                key: message.key
            }
        });

        await sock.sendMessage(chatId, {
    edit: searchingMsg.key,
    text: `╭───❮ *ʟʏʀɪᴄꜱ* ❯
│
├ ❌ ꜰᴇᴛᴄʜ ꜰᴀɪʟᴇᴅ
│
├ 🔄 ᴘʟᴇᴀꜱᴇ ᴛʀʏ
├ ⏳ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ
│
╰─────────────⦁`
});
    }
}

module.exports = { lyricsCommand };