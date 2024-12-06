module.exports.config = {
    name: "info",
    version: "1.0.2", 
    hasPermssion: 0,
    credits: "Frank Kaumba",
    description: "Bot and Admin Information",
    commandCategory: "System",
    cooldowns: 1,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": "",
        "moment-timezone": ""
    }
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];
    const moment = require("moment-timezone");

    // Calculate uptime
    const time = process.uptime(),
          hours = Math.floor(time / (60 * 60)),
          minutes = Math.floor((time % (60 * 60)) / 60),
          seconds = Math.floor(time % 60);

    // Get current time
    const currentTime = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");

    // Prepare message
    const infoMessage = `🤖 EF PRIME BOT INFORMATION 🤖

📌 Bot Name: ${global.config.BOTNAME}
🔧 Bot Prefix: ${global.config.PREFIX}

👑 Bot Developer: Frank Kaumba
🌐 Facebook: https://facebook.com/efkidtrapgamer

⏰ Current Time: ${currentTime}
🕒 Uptime: ${hours}:${minutes}:${seconds}

💡 Need help? Contact the developer!

Thank you for using ${global.config.BOTNAME} 💖`;

    // Send message
    return api.sendMessage(infoMessage, event.threadID);
};
