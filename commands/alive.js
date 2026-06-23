const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {

        // react
        await sock.sendMessage(chatId, {
            react: {
                text: "🎯",
                key: message.key
            }
        });

        const username = message.pushName || "User";

        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const text = `👋 ʜᴇʏ ${username}
ɪ ᴀᴍ 𝐋ɪɴᴜx 𝐒ᴇʀ ʙᴏᴛ ᴀʟɪᴠᴇ ɴᴏᴡ!

⚡ ᴠᴇʀꜱɪᴏɴ: ${settings.version || "3.0.7"}
⏰ ʀᴜɴᴛɪᴍᴇ: ${hours}h ${minutes}m ${seconds}s`;

        // ✅ v7 WORKING INTERACTIVE BUTTON (nativeFlow)
        const msg = {
            text,
            footer: "⚡ Linux Ser Bot",
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📜 MENU",
                            id: ".menu"
                        })
                    }
                ]
            }
        };

        await sock.sendMessage(chatId, msg, { quoted: message });

    } catch (err) {
        console.error("Alive Error:", err);

        await sock.sendMessage(chatId, {
            text: "❌ Alive command failed"
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
