module.exports.config = {
    name: "llama",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Frank Kaumba",
    description: "Chat with Llama AI",
    commandCategory: "ai",
    usages: "llama [question]",
    cooldowns: 5,
    dependencies: {
        "axios": "0.21.1"
    }
};

module.exports.run = async function({ api, event, args }) {
    const axios = require('axios');
    
    if (args.length === 0) {
        return api.sendMessage("Please provide a question for the Llama AI.", event.threadID, event.messageID);
    }

    const question = args.join(" ");
    const userId = event.senderID;
    const apiUrl = `https://kaiz-apis.gleeze.com/api/llama-ai?q=${encodeURIComponent(question)}&uid=${userId}&model=llama-model`;

    try {
        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.message) {
            return api.sendMessage(response.data.message, event.threadID, event.messageID);
        } else {
            return api.sendMessage("Sorry, I couldn't get a response from the Llama AI.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error("Llama AI API Error:", error);
        return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};
