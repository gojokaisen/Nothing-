module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐅𝐫𝐚𝐧𝐤 𝐊𝐚𝐮𝐦𝐛𝐚",
  description: "Retrieve EF Prime Command Protocol",
  commandCategory: "System",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body, senderID } = event;

  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }

  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data; 
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  
  var arr = [
    "mpre", "mprefix", "prefix", "what prefix", 
    "bot prefix", "what is prefix", "prefix info", 
    "how to use bot", "bot command", "ef prime prefix"
  ];

  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body.toLowerCase() === i.toLowerCase() || body === str) {
      const prefix = threadSetting.PREFIX || global.config.PREFIX;
      
      return out(`🤖 EF PRIME PREFIX: [ ${prefix} ]
ఌ︎
Use this prefix to activate commands!`);
    }
  });
};

module.exports.run = async({ event, api }) => {
  const prefix = global.config.PREFIX;
  
  return api.sendMessage(`🤖 EF PRIME PREFIX: [ ${prefix} ]
ت︎
Type commands after this prefix!`, event.threadID);
};
