module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "Frank Kaumba",
    description: "Robotic join notification with Optimus Prime-inspired messaging",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};
 
module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
 
    const path = join(__dirname, "cache", "joinnotification");
    if (!existsSync(path)) mkdirSync(path, { recursive: true }); 
 
    return;
}
 
module.exports.run = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    
    // If the bot itself is added to the thread
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • Optimus`, threadID, api.getCurrentUserID());
        
        return api.sendMessage({
            body: `🤖 AUTONOMOUS ROBOTIC COMMUNICATION INITIATED 🤖

GREETINGS, ORGANIC LIFEFORMS OF THIS COMMUNICATION NETWORK.

I AM FRANK KAUMBA, DESIGNATED OPERATIONAL UNIT, CURRENTLY ONLINE AND READY TO ASSIST.

CORE DIRECTIVE: PROTECT, COMMUNICATE, COLLABORATE.

COMMUNICATION PROTOCOLS:
• Invoke assistance: ${global.config.PREFIX}help
• Request information: ${global.config.PREFIX}info

OPERATIONAL STATUS: FULLY FUNCTIONAL ⚡
MISSION: FACILITATE INTER-ORGANIC COMMUNICATION

FOR DIRECT TRANSMISSION, CONTACT SYSTEM ADMINISTRATOR:
- COMMUNICATION CHANNEL: ${global.config.PREFIX}support

REMAIN VIGILANT. REMAIN UNITED.

✦ FRANK KAUMBA | OPERATIONAL UNIT ✦`
        }, threadID);
    }
    else {
        try {
            const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
 
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
 
            var mentions = [], nameArray = [], memLength = [], i = 0;
            
            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);
            
            let msg = "ROBOTIC DETECTION PROTOCOL: NEW ENTITY WELCOMED\n\n" +
            "GREETINGS, {name}.\n" +
            "YOU ARE THE {soThanhVien} PARTICIPANT IN {threadName}.\n" +
            "COMMUNICATION CAPACITY: INITIALIZED.\n" +
            "DIRECTIVE: ENGAGE, COLLABORATE, EVOLVE.\n\n" +
            "- FRANK KAUMBA | SYSTEM ADMINISTRATOR";
            
            msg = msg
            .replace(/\{name}/g, nameArray.join(', '))
            .replace(/\{type}/g, (memLength.length > 1) ?  'MULTIPLE ENTITIES' : 'SINGLE ENTITY')
            .replace(/\{soThanhVien}/g, memLength.join(', '))
            .replace(/\{threadName}/g, threadName);
 
            const formPush = { body: msg, mentions };
 
            return api.sendMessage(formPush, threadID);
        } catch (e) { return console.log(e) };
    }
}
