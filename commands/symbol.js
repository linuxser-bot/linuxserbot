const symbols = [

"⋆.˚✮🎧✮˚.⋆",
"✿˚ ༘ ⋆｡♡˚",
"ֶָ֢⊹𐙚",
"‧₊˚ ☁️⋅♡𓂃 ࣪ ִֶָ☾.",
"✦",
"✧",
"⋆⭒˚.⋆🪐 ⋆⭒˚.⋆",
"°‧🫧⋆.ೃ࿔*:･",
"𐙚˙⋆.˚ ᡣ𐭩",
"⋆.˚ ☾⭒.˚",
".✦ ݁˖",
"𖦹",
"𓂃",
"𓇼",
"𓆉",
"𖹭",
"꩜",
"𓍼",
"𖤓",
"𓊈",
"𓊉",
"♡",
"♥",
"❥",
"➳",
"➺",
"✿",
"𑁍",
"𖧷",
"❦",
"⚝",
"⚘",
"☁︎",
"⋆",
"⭒"

];

async function symbolCommand(sock, chatId, message) {
try {
const randomSymbol =
symbols[
Math.floor(
Math.random() * symbols.length
)
];

    await sock.sendMessage(
        chatId,
        {
            text: `✨ Symbol

${randomSymbol}

— 𝐋ɪɴᴜх 𝐒ᴇʀ 🧃🕊️`
},
{ quoted: message }
);

} catch (err) {
    console.error(err);

    await sock.sendMessage(
        chatId,
        {
            text: `✨ ♡

— 𝐋ɪɴᴜх 𝐒ᴇʀ 🧃🕊️`
},
{ quoted: message }
);
}
}

module.exports = symbolCommand;
