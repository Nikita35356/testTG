const TelegramApi = require("node-telegram-bot-api");
const fs = require("node:fs");
const { draw } = require("./games/draw");

const token = "7806178870:AAHfNYFvKu52lJFLUSncyHLeIkPPBb43PRE";

const bot = new TelegramApi(token, {polling: true})


const comands = {
    draw: /^нарисовать/i
}




const start = () => {
    console.log("start")
    bot.setMyCommands([
        {command:'/info',description:"Кто же это?"}
    ])

    bot.onText(comands.draw,async msg => {
        draw(msg,bot)
    })
}

start()