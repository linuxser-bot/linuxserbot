const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {

        // 🔘 reaction
        await sock.sendMessage(chatId, {
            react: {
                text: "🎯",
                key: message.key
            }
        });

        const username = message.pushName || "User";

        // ⏱ uptime
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const text = `👋 ʜᴇʏ ${username},
ɪ ᴀᴍ 𝐋ɪɴᴜx 𝐒ᴇʀ ʙᴏᴛ ᴀʟɪᴠᴇ ɴᴏᴡ!

📌 ᴛʏᴘᴇ *.menu* ᴛᴏ ᴏᴩᴇɴ ᴄᴏᴍᴍᴀɴᴅ ʟɪꜱᴛ.

⚡ ᴠᴇʀꜱɪᴏɴ: ${settings.version || "3.0.7"}
⏰ ʀᴜɴᴛɪᴍᴇ: ${hours}h ${minutes}m ${seconds}s`;

        // 🔥 FIXED BUTTON FORMAT (IMPORTANT)
        const buttonMessage = {
            text: text,
            footer: "⚡ Linux Ser Bot",
            templateButtons: [
                {
                    index: 1,
                    quickReplyButton: {
                        displayText: "📜 MENU",
                        id: ".menu"
                    }
                }
            ]
        };

        await sock.sendMessage(chatId, buttonMessage, { quoted: message });

    } catch (error) {
        console.error("Alive Command Error:", error);

        await sock.sendMessage(chatId, {
            text: "❌ Failed to check bot status."
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
