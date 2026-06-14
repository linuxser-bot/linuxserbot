const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

const { toPTT } = require('../lib/converter');

// ======================
// TTS COMMAND
// ======================

async function ttsCommand(
    sock,
    chatId,
    text,
    message,
    language = 'en'
) {

    // ======================
    // REACTION FUNCTION
    // ======================

    const react = async (
        emoji
    ) => {

        await sock.sendMessage(chatId, {

            react: {
                text: emoji,
                key: message.key
            }

        });

    };

    // ======================
    // CHECK TEXT
    // ======================

    if (!text) {

        await react('🎤');

        return sock.sendMessage(chatId, {

            text: `
*🎤 Text To Speech*

_🔊 Please provide text to convert into voice_

_📌 Example: .tts Hello world_

_🌷 Convert text into voice instantly ✨_
`.trim()

        }, { quoted: message });

    }

    // ======================
    // TEMP FILE
    // ======================

    const tempFile =
    path.join(

        __dirname,

`../assets/tts-${Date.now()}.mp3`

    );

    try {

        // ======================
        // LOADING REACTION
        // ======================

        await react('🎙️');

        // ======================
        // CREATE TTS
        // ======================

        const gtts =
        new gTTS(
            text,
            language
        );

        // ======================
        // SAVE MP3
        // ======================

        gtts.save(

            tempFile,

            async function (
                err
            ) {

                // ======================
                // SAVE ERROR
                // ======================

                if (err) {

                    console.error(err);

                    await react('❌');

                    return sock.sendMessage(chatId, {

                        text: `
*❌ TTS Error*

_🔊 Failed to generate voice message_

_📌 Please try again later_

_🌷 Try again ✨_
`.trim()

                    }, { quoted: message });

                }

                try {

                    // ======================
                    // READ MP3
                    // ======================

                    const audioBuffer =
                    fs.readFileSync(
                        tempFile
                    );

                    // ======================
                    // CONVERT TO OPUS
                    // ======================

                    const voiceBuffer =
                    await toPTT(

                        audioBuffer,
                        'mp3'

                    );

                    // ======================
                    // SEND VOICE NOTE
                    // ======================

                    await sock.sendMessage(chatId, {

                        audio:
                        voiceBuffer,

                        mimetype:
'audio/ogg; codecs=opus',

                        ptt: true

                    }, { quoted: message });

                    // ======================
                    // SUCCESS REACTION
                    // ======================

                    await react('✅');

                }

                catch (e) {

                    console.error(e);

                    await react('❌');

                    await sock.sendMessage(chatId, {

                        text: `
*❌ TTS Error*

_🔊 Failed to send voice message_

_📌 Please try again later_

_🌷 Try again ✨_
`.trim()

                    }, { quoted: message });

                }

                // ======================
                // CLEANUP
                // ======================

                setTimeout(() => {

                    if (
                        fs.existsSync(
                            tempFile
                        )
                    ) {

                        fs.unlinkSync(
                            tempFile
                        );

                    }

                }, 5000);

            }

        );

    }

    catch (error) {

        console.error(error);

        await react('❌');

        return sock.sendMessage(chatId, {

            text: `
*❌ TTS Error*

_⚠️ Something went wrong while processing_

_📌 Please try again later_

_🌷 Try again ✨_
`.trim()

        }, { quoted: message });

    }

}

module.exports = ttsCommand;
