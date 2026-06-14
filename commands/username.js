const usernames = [

"yng.[ur_name]",
"[ur_name].dump_",
"hy.[ur_name]",
"mosrly.[ur_name]",
"[ur_name].isdope",
"cosmic.dream",
"lunar.boy",
"velvet.soul",
"stardust.x",
"oceanic.vibes",
"nightwhisper",
"shadow.byte",
"frosted.soul",
"wildspirit.x",
"mystic.cloud",
"ghostly.vibe",
"voidwalker_x",
"pixel.prince",
"stormy.soul",
"crystal.moon",
"golden.aura",
"skywalker.vibes",
"midnight.echo",
"lost.in.stars",
"softcloud.x"

];

async function usernameCommand(sock, chatId, message) {
try {
const randomUsername =
usernames[
Math.floor(
Math.random() * usernames.length
)
];

    await sock.sendMessage(
        chatId,
        {
            text: `👤 Username Suggestion

✨ @${randomUsername}

— 𝐋ɪɴᴜх 𝐒ᴇʀ 🧃🕊️`
},
{ quoted: message }
);

} catch (err) {
    console.error('Username Error:', err);

    await sock.sendMessage(
        chatId,
        {
            text: `👤 Username Suggestion

✨ @moon.child

— 𝐋ɪɴᴜх 𝐒ᴇʀ 🧃🕊️`
},
{ quoted: message }
);
}
}

module.exports = usernameCommand;
