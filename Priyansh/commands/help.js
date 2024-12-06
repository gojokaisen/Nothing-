module.exports.config = {
    name: "help",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐅𝐫𝐚𝐧𝐤 𝐊𝐚𝐮𝐦𝐛𝐚",
    description: "EF Prime Command Guide",
    commandCategory: "system",
    usages: "[Command Name]",
    cooldowns: 1,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 300
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
        "helpList": '[ There are %1 commands on this EF Prime bot, Use: "%2help nameCommand" to know how to use! ]',
        "user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot"
    }
};

module.exports.handleEvent = function({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body === "undefined" || !body.startsWith("help")) return;

    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
    if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase())) return;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    return api.sendMessage(
        getText(
            "moduleInfo", 
            command.config.name, 
            command.config.description, 
            `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
            command.config.commandCategory, 
            command.config.cooldowns, 
            ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
            command.config.credits
        ), 
        threadID, 
        messageID
    );
};

module.exports.run = function({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (!command) {
        const arrayInfo = [];
        const page = parseInt(args[0]) || 1;
        const numberOfOnePage = 10;
        let msg = "";
        
        for (let [name] of commands) {
            arrayInfo.push(name);
        }

        arrayInfo.sort();
        
        const startSlice = numberOfOnePage * (page - 1);
        const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);
        
        returnArray.forEach((item, index) => {
            msg += `「 ${startSlice + index + 1} 」${prefix}${item}\n`;
        });
        
        const siu = `EF Prime Command list 📄\nMade by Frank Kaumba 🤖\nFor More Information type /help (command name) ✨\n󰂆 󰟯 󰟰 󰟷 󰟺 󰟵 󰟫`;
        
        const text = `\nPage (${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)})\n`;
        
        return api.sendMessage(siu + "\n\n" + msg + text, threadID, async (error, info) => {
            if (autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
                return api.unsendMessage(info.messageID);
            }
        }, messageID);
    }

    return api.sendMessage(
        getText(
            "moduleInfo", 
            command.config.name, 
            command.config.description, 
            `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, 
            command.config.commandCategory, 
            command.config.cooldowns, 
            ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), 
            command.config.credits
        ), 
        threadID, 
        messageID
    );
};
