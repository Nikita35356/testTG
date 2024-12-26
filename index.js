const TelegramApi = require("node-telegram-bot-api");

const token = "7803813704:AAFyCriOTzrHrZj7z9rHQdmBrAh-dy1J8Q4";

const bot = new TelegramApi(token, {polling: true})

let users = []
let names = {

}

const start = () => {
    console.log("start")

    bot.setMyCommands([
        {command:'/gift',description:"Заработай подарок"}
    ])
    bot.onText(/\/start/i, msg => {
        console.log(msg)
        bot.sendMessage(msg.chat.id,"Напиши ешё /gift . Ты ведь не бот?)")
    })

    bot.onText(/\/gift/, msg => {
        if (users.indexOf(msg.from.id) >= 0) {
            bot.sendMessage(msg.chat.id,"Ты уже участвуешь. Ты один из "+users.length+" людей")
        } else {
            users.push(msg.from.id)
            bot.sendMessage(msg.chat.id,"Ты принял участие. Ты один из "+users.length+" людей")
            names[msg.from.id] = msg.from.username
            console.log(users)
        }
    })
    bot.onText(/\/dari/, msg => {
        let komy = []
        Object.assign(komy,users)
        let test = 0

        while ((test < 1000) && !isAllRand(komy,users)) {
            komy = komy.sort(() => Math.random() - 0.5)
            test++
        }
        if (isAllRand(komy,users)) {
            for (let i = 0; i < komy.length; i++) {
                bot.sendMessage(users[i],"Ты даришь подарок @"+names[komy[i]])
            }
        } else {
            bot.sendMessage(msg.chat.id,"Мне не получилось зарандомить :( \nПопробуй ещё раз")
        }

    })
}


function isAllRand(a,b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] == b[i]) return false
    }
    return true
}

start()