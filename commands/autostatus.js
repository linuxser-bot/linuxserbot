const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

// Path to store auto status configuration
const configPath = path.join(__dirname, '../data/autoStatus.json');

// Initialize config file if it doesn't exist
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({
        enabled: false,
        reactOn: false
    }));
}

async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!msg.key.fromMe && !isOwner) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used by the owner!'
            });
        }

        // Read current config
        let config = JSON.parse(fs.readFileSync(configPath));

        // No arguments
        if (!args || args.length === 0) {
            const status = config.enabled ? 'enabled' : 'disabled';
            const reactStatus = config.reactOn ? 'enabled' : 'disabled';

            return await sock.sendMessage(chatId, {
                text:
`*📱✨ Auto Status Control*

*👀 Auto Status View:* ${status}

*💫 Status Reactions:* ${reactStatus}

*🛠️ Commands*

*🟢 .autostatus on*
↳ _Enable auto status view_

*🔴 .autostatus off*
↳ _Disable auto status view_

*💚 .autostatus react on*
↳ _Enable status reactions_

*🩶 .autostatus react off*
↳ _Disable status reactions_

_🌷 Customize how your bot interacts with status updates ✨_`
            });
        }

        const command = args[0].toLowerCase();

        // Enable auto status
        if (command === 'on') {

            config.enabled = true;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 2)
            );

            return await sock.sendMessage(chatId, {
                text:
`_✅ Auto status view enabled!_`
            });

        }

        // Disable auto status
        else if (command === 'off') {

            config.enabled = false;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 2)
            );

            return await sock.sendMessage(chatId, {
                text:
`_❌ Auto status view disabled!_`
            });

        }

        // React settings
        else if (command === 'react') {

            if (!args[1]) {
                return await sock.sendMessage(chatId, {
                    text:
`*❌ Invalid Option*

*💫 Please specify:*

_🟢 .autostatus react on_
_🔴 .autostatus react off_

_🌷 Try again with a valid option ✨_`
                });
            }

            const reactCommand = args[1].toLowerCase();

            // Enable reactions
            if (reactCommand === 'on') {

                config.reactOn = true;

                fs.writeFileSync(
                    configPath,
                    JSON.stringify(config, null, 2)
                );

                return await sock.sendMessage(chatId, {
                    text:
`_💫 Status reactions enabled!_`
                });

            }

            // Disable reactions
            else if (reactCommand === 'off') {

                config.reactOn = false;

                fs.writeFileSync(
                    configPath,
                    JSON.stringify(config, null, 2)
                );

                return await sock.sendMessage(chatId, {
                    text:
`_❌ Status reactions disabled!_`
                });

            }

            // Invalid react command
            else {

                return await sock.sendMessage(chatId, {
                    text:
`*❌ Invalid Command*

💫 Use:

_🟢 .autostatus react on_
_🔴 .autostatus react off_

_🌷 Try again with a valid option ✨_`
                });

            }
        }

        // Invalid command
        else {

            return await sock.sendMessage(chatId, {
                text:
`*❌ Invalid Command*

💫 Use:

_🟢 .autostatus react on_
_🔴 .autostatus react off_

_🌷 Try again with a valid option ✨_`
            });

        }

    } catch (error) {

        console.error('Error in autostatus command:', error);

        return await sock.sendMessage(chatId, {
            text:
`❌ Error occurred while managing auto status!

${error.message}`
        });
    }
}

// Check auto status enabled
function isAutoStatusEnabled() {
    try {

        const config = JSON.parse(
            fs.readFileSync(configPath)
        );

        return config.enabled;

    } catch (error) {

        console.error(
            'Error checking auto status config:',
            error
        );

        return false;
    }
}

// Check status reaction enabled
function isStatusReactionEnabled() {
    try {

        const config = JSON.parse(
            fs.readFileSync(configPath)
        );

        return config.reactOn;

    } catch (error) {

        console.error(
            'Error checking status reaction config:',
            error
        );

        return false;
    }
}

// React to status
async function reactToStatus(sock, statusKey) {
    try {

        if (!isStatusReactionEnabled()) {
            return;
        }

        await sock.relayMessage(
            'status@broadcast',
            {
                reactionMessage: {
                    key: {
                        remoteJid: 'status@broadcast',
                        id: statusKey.id,
                        participant:
                            statusKey.participant ||
                            statusKey.remoteJid,
                        fromMe: false
                    },
                    text: '💚'
                }
            },
            {
                messageId: statusKey.id,
                statusJidList: [
                    statusKey.remoteJid,
                    statusKey.participant ||
                    statusKey.remoteJid
                ]
            }
        );

    } catch (error) {

        console.error(
            '❌ Error reacting to status:',
            error.message
        );
    }
}

// Handle status updates
async function handleStatusUpdate(sock, status) {
    try {

        if (!isAutoStatusEnabled()) {
            return;
        }

        // Delay to avoid rate limit
        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );

        // messages.upsert
        if (
            status.messages &&
            status.messages.length > 0
        ) {

            const msg = status.messages[0];

            if (
                msg.key &&
                msg.key.remoteJid === 'status@broadcast'
            ) {

                try {

                    await sock.readMessages([msg.key]);

                    // React if enabled
                    await reactToStatus(sock, msg.key);

                } catch (err) {

                    if (
                        err.message?.includes(
                            'rate-overlimit'
                        )
                    ) {

                        console.log(
                            '⚠️ Rate limit hit, retrying...'
                        );

                        await new Promise(resolve =>
                            setTimeout(resolve, 2000)
                        );

                        await sock.readMessages([msg.key]);

                    } else {

                        throw err;
                    }
                }

                return;
            }
        }

        // Direct status
        if (
            status.key &&
            status.key.remoteJid === 'status@broadcast'
        ) {

            try {

                await sock.readMessages([status.key]);

                await reactToStatus(
                    sock,
                    status.key
                );

            } catch (err) {

                if (
                    err.message?.includes(
                        'rate-overlimit'
                    )
                ) {

                    console.log(
                        '⚠️ Rate limit hit, retrying...'
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, 2000)
                    );

                    await sock.readMessages([
                        status.key
                    ]);

                } else {

                    throw err;
                }
            }

            return;
        }

        // Status reactions
        if (
            status.reaction &&
            status.reaction.key.remoteJid ===
                'status@broadcast'
        ) {

            try {

                await sock.readMessages([
                    status.reaction.key
                ]);

                await reactToStatus(
                    sock,
                    status.reaction.key
                );

            } catch (err) {

                if (
                    err.message?.includes(
                        'rate-overlimit'
                    )
                ) {

                    console.log(
                        '⚠️ Rate limit hit, retrying...'
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, 2000)
                    );

                    await sock.readMessages([
                        status.reaction.key
                    ]);

                } else {

                    throw err;
                }
            }

            return;
        }

    } catch (error) {

        console.error(
            '❌ Error in auto status view:',
            error.message
        );
    }
}

module.exports = {
    autoStatusCommand,
    handleStatusUpdate
};
