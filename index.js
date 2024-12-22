const TelegramApi = require("node-telegram-bot-api");
const fs = require("node:fs");
const { draw } = require("./games/draw");

const token = "7806178870:AAHfNYFvKu52lJFLUSncyHLeIkPPBb43PRE";

const bot = new TelegramApi(token, {polling: true})


const comands = {
    draw: /^нарисовать/i,
    info: /^\/info/i,
    stop: /^\/stopplease/i
}




const start = () => {
    console.log("start")
    bot.setMyCommands([
        {command:'/info',description:"Кто же это?"}
    ])

    bot.onText(comands.draw, async msg => {
        draw(msg,bot)
    })
bot.onText(commands.stop, async msg => {
    bot.sendMessage(msg.chat.id,"ухожу")
    bot.close()
})
    
    bot.onText(comands.info, async msg => {
        bot.sendMessage(msg.chat.id,`Короткие записи:
x - координа x (от 0 до 500)
y - координа y (от 0 до 500)
color - цвет основные цвета возможны в виде слов, более точный цвет записывать как HEX
size - размер  в пикселях
text - текст

Команды:
начало последующих команд - "нарисовать"

1. фон {color}
2. квадрат {color} {x} {y} {size}
3. прямоугольник {color} {x} {y} {size_width} {size_height}
4. текст {color} {size_font} {x} {y} {text}
5. круг {color} {x} {y} {radios}`)
    })
}

start()
