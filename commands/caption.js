const captions = [

"🌙 Making memories one moment at a time ✨",

"☁️ Lost in the right direction 🤍",

"🦋 Happiness looks good on me 🌷",

"✨ Just living, learning, and growing 🤍",

"🌊 Collecting moments, not things ☁️",

"🌸 Smiling through every chapter 🌙",

"🪐 Some days are pure magic ✨",

"☕ Coffee first, everything else later 🌷",

"🎧 Vibing through life one song at a time 🌙",

"🌅 Chasing sunsets and dreams ☁️",

"🤍 Simplicity is the ultimate beauty ✨",

"🌊 Peaceful mind. Grateful heart. Happy soul. ☁️",

"🦋 Becoming the person I once dreamed of 🌷",

"🌙 Less perfection, more authenticity ✨",

"☁️ The best is yet to come 🤍",

"🪐 Stay close to people who feel like sunshine ☀️",

"🌸 Blooming at my own pace 🌷",

"✨ Creating a life I love 🤍",

"🌊 Flow with confidence and grace ☁️",

"🌙 Every picture tells a story ✨",

"May baby: handle with heat 🔥",

"Pretty, with a touch of love 💕",

"Soft-hearted, deeply yours 🌸",

"Glowing differently when it’s real 💖",

"Pretty eyes, holding your reflection ✨",

"Love has made me softer 💗",

"Just a pretty soul, in love 🕊️",

"Calm, graceful, and yours 🤍",

"Love looks more beautiful on me 💞",

"A little love, a lot of glow 🌷",

"Pretty vibes, wrapped in your love 💓",

"I don't complete, I dominate 👑",

"Built from pressure 💎",

"Silence is my strategy 🤫",

"Watch me Rise 🚀",

"Different by design 🧬",

"Calc but Dangerous 📈",

"Focused on my own lane 🎯",

"Self-made Mindset 🔥",

"Respect over attention 💯",

"Fearless moves only 🐺",

"Success is the only option 🏆",

"Rare, not regular 🌟",

"No excuses, just result 📈🙂‍↔️",

"Born to lead 👊🏻",

"I create my own lane 🛣️",

"Confidence speaks louder 🤫📈",

"Hustle in silence 🖤",

"Pressure makes diamonds 💎",

"He’s not perfect, but he’s perfectly mine ✨",

"Strong heart, gentle soul 🖤",

"No big words, just real feelings 🖤",

"Comfort over chaos, always him 🤍",

"No rush, no fear — just him 🖤",

"I disappeared to upgrade.\n2026 is the reveal.",

"The break made me dangerous.\n2026 proves it.",

"2025 taught me silence.\n2026 will hear my name.",

"This is not the end.\nThe game has just begin.\n2026 ✦",

"Work in progress ✨",

"Me vs me 🪞",

"Calm face clear mind 🤍",

"Silently building 🌑",

"Still growing 🌱",

"Me but better 🖤",

"Calm moves clear intent ⚡️",

"Private growth 🌑",

"Soft but focused ✨",

"Bills ask for money.\nFreedom asks for mindset. ⚜️",

"Lifestyle is rented.\nLegacy is built.",

"Poor think legality.\nRich think longevity.",

"Rich mindset = patience + discipline + silence.",

"Discipline > motivation",

"“Back. Better. Unbothered.”",

"“No noise. Just growth.” 😌🖤",

"“I’m not here to impress. I’m here to improve.” 😌",

"“Same roots, sharper mindset.” 🔥",

"“Different pace. Same direction.” 🔥",

];

async function captionCommand(sock, chatId, message) {
try {
const randomCaption =
captions[
Math.floor(Math.random() * captions.length)
];

    await sock.sendMessage(
        chatId,
        {
            text: `📸 Caption

${randomCaption}

— 𝐋ɪɴᴜх 𝐒ᴇʀ 🧃🕊️`
},
{ quoted: message }
);

} catch (err) {
    console.error('Caption Error:', err);

    await sock.sendMessage(
        chatId,
        {
            text: `📸 Caption

✨ Life is beautiful 🤍

— 𝐋ɪɴᴜх 𝐒ᴇʀ 🧃🕊️`
},
{ quoted: message }
);
}
}

module.exports = captionCommand;
