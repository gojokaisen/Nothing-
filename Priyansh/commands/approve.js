module.exports.config = {
    name: "approve",
    version: "1.1.0",
    hasPermssion: 2,
    credits: "Frank Kaumba",
    description: "Manage group chat approvals",
    commandCategory: "Admin",
    cooldowns: 5
};

const fs = require("fs");
const path = require("path");

const DATA_FOLDER = path.join(__dirname, "data");
const APPROVED_PATH = path.join(DATA_FOLDER, "approvedThreads.json");
const PENDING_PATH = path.join(DATA_FOLDER, "pendingThreads.json");

// Ensure data folder and files exist
module.exports.onLoad = () => {
    if (!fs.existsSync(DATA_FOLDER)) fs.mkdirSync(DATA_FOLDER);
    if (!fs.existsSync(APPROVED_PATH)) fs.writeFileSync(APPROVED_PATH, JSON.stringify([]));
    if (!fs.existsSync(PENDING_PATH)) fs.writeFileSync(PENDING_PATH, JSON.stringify([]));
}

module.exports.handleReply = async ({ event, api, handleReply }) => {
    if (handleReply.author !== event.senderID) return;

    const { body, threadID, messageID } = event;
    const approvedThreads = JSON.parse(fs.readFileSync(APPROVED_PATH));
    const pendingThreads = JSON.parse(fs.readFileSync(PENDING_PATH));

    if (handleReply.type === "pending" && body.toUpperCase() === "A") {
        const idBox = handleReply.threadId;
        
        approvedThreads.push(idBox);
        fs.writeFileSync(APPROVED_PATH, JSON.stringify(approvedThreads, null, 2));

        const index = pendingThreads.indexOf(idBox);
        if (index > -1) {
            pendingThreads.splice(index, 1);
            fs.writeFileSync(PENDING_PATH, JSON.stringify(pendingThreads, null, 2));
        }

        api.sendMessage(`✅ Successfully approved group: ${idBox}`, threadID, messageID);
    }
}

module.exports.run = async ({ event, api, args, Threads, Users }) => {
    const { threadID, messageID } = event;
    const approvedThreads = JSON.parse(fs.readFileSync(APPROVED_PATH));
    const pendingThreads = JSON.parse(fs.readFileSync(PENDING_PATH));

    const prefix = global.config.PREFIX;
    const subCommand = args[0]?.toLowerCase();
    const targetId = args[1] || threadID;

    const createThreadListMessage = async (threads, title) => {
        if (threads.length === 0) return `${title}\nNo threads found.`;

        let msg = `${title}: ${threads.length}\n`;
        for (let [index, threadId] of threads.entries()) {
            try {
                const threadInfo = await api.getThreadInfo(threadId);
                msg += `${index + 1}. ${threadInfo.threadName || 'Unknown Group'} (${threadId})\n`;
            } catch (error) {
                msg += `${index + 1}. Unable to fetch group info (${threadId})\n`;
            }
        }
        return msg;
    };

    switch (subCommand) {
        case "list":
        case "l":
            const listMsg = await createThreadListMessage(approvedThreads, "📋 Approved Groups");
            api.sendMessage(listMsg, threadID, messageID);
            break;

        case "pending":
        case "p":
            const pendingMsg = await createThreadListMessage(pendingThreads, "⏳ Pending Approval Groups");
            api.sendMessage(pendingMsg, threadID, messageID);
            break;

        case "del":
        case "d":
            if (!approvedThreads.includes(targetId)) 
                return api.sendMessage("❌ This group is not approved.", threadID, messageID);
            
            const index = approvedThreads.indexOf(targetId);
            approvedThreads.splice(index, 1);
            fs.writeFileSync(APPROVED_PATH, JSON.stringify(approvedThreads, null, 2));

            api.sendMessage(`🗑️ Removed group ${targetId} from approved list.`, threadID, messageID);
            break;

        case "help":
        case "h":
            const helpMessage = `
📌 Approve Command Help:
- ${prefix}approve list/l - View approved groups
- ${prefix}approve pending/p - View pending groups
- ${prefix}approve del/d [groupID] - Remove group from approved list
- ${prefix}approve [groupID] - Approve a specific group
            `;
            api.sendMessage(helpMessage, threadID, messageID);
            break;

        default:
            if (isNaN(targetId)) 
                return api.sendMessage("❌ Invalid group ID.", threadID, messageID);

            if (approvedThreads.includes(targetId)) 
                return api.sendMessage(`✅ Group ${targetId} is already approved.`, threadID, messageID);

            // Add to approved threads
            approvedThreads.push(targetId);
            fs.writeFileSync(APPROVED_PATH, JSON.stringify(approvedThreads, null, 2));

            api.sendMessage(`🎉 Group ${targetId} has been approved!`, threadID, messageID);
            break;
    }
}
