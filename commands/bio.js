const bios = [

"🌙 Dreamer • Explorer • Believer 🤍",
"☁️ Lost in thoughts, found in dreams ✨",
"🦋 Creating my own sunshine 🌷",
"🌊 Peace over perfection 🤍",
"🪐 Living quietly, shining brightly ✨",
"🎧 Music • Coffee • Midnight Thoughts ☕",
"🌸 Soft heart, strong mind 🤍",
"☁️ Chasing sunsets & dreams 🌅",
"🌙 Poetry hidden inside silence ✨",
"🕊️ Healing, growing, glowing 🤍",
"🌷 Smiling through every season ✨",
"🪐 Different hits better than perfect 🤍",
"🌊 Flowing through life gracefully ☁️",
"☕ Late nights & deep thoughts 🌙",
"✨ Just vibes and good energy 🤍",
"🦋 Becoming the best version of myself 🌷",
"🌙 Collecting memories, not things ☁️",
"🤍 Simplicity is my luxury ✨",
"🪐 Stardust mixed with ambition 🌙",
"🌸 Living a story worth telling ✨"

];

async function bioCommand(sock, chatId, message) {
try {
const randomBio =
bios[Math.floor(Math.random() * bios.length)];

    await sock.sendMessage(
        chatId,
        {
            text: `*📖 Random Bio*

${randomBio}

— 𝐋ɪɴᴜх 𝐒ᴇʀ 🧃🕊️`
},
{ quoted: message }
);

} catch (err) {
    console.error(err);

    await sock.sendMessage(
        chatId,
        {
            text: "❌ Failed to generate bio."
        },
        { quoted: message }
    );
}

}

module.exports = bioCommand;
