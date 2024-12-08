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

const techQuotes = [
    "“Technology is best when it brings people together.” – Matt Mullenweg",
    "“It has become appallingly obvious that our technology has exceeded our humanity.” – Albert Einstein",
    "“The art challenges the technology, and the technology inspires the art.” – John Lasseter",
    "“Technology is a useful servant but a dangerous master.” – Christian Lous Lange",
    "“The great growling engine of change – technology.” – Alvin Toffler"
];

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
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    const arrayInfo = Array.from(commands.values());
    const categories = {};

    arrayInfo.forEach(command => {
        const category = command.config.commandCategory || 'Miscellaneous';
        if (!categories[category]) categories[category] = [];
        categories[category].push(command.config.name);
    });

    const numberOfOnePage = 2;
    const page = parseInt(args[0]) || 1;
    const startSlice = numberOfOnePage * (page - 1);

    const selectedCategories = Object.entries(categories).slice(startSlice, startSlice + numberOfOnePage);
    const quote = techQuotes[Math.floor(Math.random() * techQuotes.length)];

    let msg = "EF Prime Command List シ︎\n";
    selectedCategories.forEach(([category, commands], index) => {
        msg += `⌈ ${category.toUpperCase()} ⌋\n`;
        commands.forEach(cmd => {
            msg += `${cmd}, `;
        });
        msg = msg.slice(0, -2); // Remove the last comma and space
        msg += '\n\n';
    });

    msg += `Page (${page}/${Math.ceil(Object.keys(categories).length / numberOfOnePage)})\n`;
    msg += `\nMade with ❥︎\nFor more information, type /help [command name]\n`;
    msg += `${quote}`;

    return api.sendMessage(msg, threadID, async (error, info) => {
        if (autoUnsend) {
            await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
            return api.unsendMessage(info.messageID);
        }
    }, messageID);
};
