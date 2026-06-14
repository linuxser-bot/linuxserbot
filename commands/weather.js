const axios = require('axios');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

module.exports = async (sock, chatId, message, city) => {

    try {

        const apiKey = "4902c0f2550f58298ad4146a92b65e10";

        if (!city) {
            return sock.sendMessage(chatId, {
                text: "_❌ Please provide a city name_"
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🌦️', key: message.key }
        });

        const { data } = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        // ⚡ STEP 1
        let sent = await sock.sendMessage(chatId, {
            text: "_🌍 Initializing weather system..._"
        }, { quoted: message });

        await delay(900);

        // ⚡ STEP 2 (IMPORTANT FIX HERE)
        sent = await sock.sendMessage(chatId, {
            text: "_🌐 Connecting to server..._",
            edit: sent.key   // 🔥 MUST reassign
        });

        await delay(900);

        // ⚡ STEP 3
        sent = await sock.sendMessage(chatId, {
            text: "_🌦️ Fetching weather data..._",
            edit: sent.key
        });

        await delay(900);

        // ⚡ FINAL
        const finalMessage = `
╭───〔 🌦️ ᴡᴇᴀᴛʜᴇʀ ʀᴇᴩᴏʀᴛ 〕───╮
│ 📍 ᴄɪᴛʏ : ${data.name}, ${data.sys.country}
│ 🌡 ᴛᴇᴍᴘ : ${data.main.temp}°C
│ 🤒 ғᴇᴇʟs : ${data.main.feels_like}°C
│ 💧 ʜᴜᴍɪᴅɪᴛʏ : ${data.main.humidity}%
│ 🌬 ᴡɪɴᴅ : ${data.wind.speed} m/s
│ ☁️ ᴄᴏɴᴅɪᴛɪᴏɴ : ${data.weather[0].description}
│ 📊 ᴘʀᴇssᴜʀᴇ : ${data.main.pressure} hPa
╰────────────────────────────╯
`;

        await sock.sendMessage(chatId, {
            text: finalMessage,
            edit: sent.key
        });

    } catch (err) {

        console.log("EDIT ERROR:", err);

        await sock.sendMessage(chatId, {
            text: "❌ Weather system error"
        }, { quoted: message });
    }
};
