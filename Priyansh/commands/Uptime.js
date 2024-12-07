module.exports.config = {
    name: "uptime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Frank Kaumba",
    description: "Check bot's uptime and system information",
    commandCategory: "system",
    usages: "uptime",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = function({ api, event, args }) {
    const os = require('os');
    const moment = require('moment');
    
    const uptime = process.uptime();
    const days = Math.floor(uptime / (24 * 3600));
    const hours = Math.floor((uptime % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
        freeMemory: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    };

    const uptimeMessage = `Bot Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s\n\n` +
                          `System Information:\n` +
                          `Platform: ${systemInfo.platform}\n` +
                          `Architecture: ${systemInfo.arch}\n` +
                          `CPU Cores: ${systemInfo.cpus}\n` +
                          `Total Memory: ${systemInfo.totalMemory}\n` +
                          `Free Memory: ${systemInfo.freeMemory}
                          
                          autobots roll out🤖`;

    return api.sendMessage(uptimeMessage, event.threadID, event.messageID);
};
