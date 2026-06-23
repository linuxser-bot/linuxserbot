const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {

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

        const listMessage = {
            text,
            footer: "⚡ Linux Ser Bot",

            title: "🤖 ALIVE MENU",
            buttonText: "📜 OPEN MENU",

            sections: [
                {
                    title: "MAIN COMMANDS",
                    rows: [
                        { title: "📜 Menu", rowId: ".menu", description: "Open full command list" },
                        { title: "⚡ Ping", rowId: ".ping", description: "Check bot speed" },
                        { title: "👑 Owner", rowId: ".owner", description: "Bot owner info" },
                        { title: "📊 Runtime", rowId: ".runtime", description: "Check uptime details" }
                    ]
                }
            ]
        };

        await sock.sendMessage(chatId, listMessage, { quoted: message });

    } catch (err) {
        console.log("Alive error:", err);

        await sock.sendMessage(chatId, {
            text: "❌ Alive failed"
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
