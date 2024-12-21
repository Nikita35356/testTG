const TelegramApi = require("node-telegram-bot-api");
const fs = require("node:fs");

const token = "7806178870:AAHfNYFvKu52lJFLUSncyHLeIkPPBb43PRE";
let isEditing = false;
const bot = new TelegramApi(token, {polling: true})

let USER_DATA = {};

const comands = {
    getInfoGame: /^\s*моя\sбаза/i,
    atacka: /^\s*атаковать/i,
}

const save = () => {
    if (!isEditing) return
    fs.writeFileSync('./userdata/svo_baza.json',
        JSON.stringify(USER_DATA.svo_baza),
        { encoding: "utf-8" })
    isEditing = false
}

const loadSnarads = (userId) => {
    while (
        (USER_DATA.svo_baza[userId].count < USER_DATA.svo_baza[userId].maxCount)
            && ((Math.floor(new Date().getTime()/1000)) - USER_DATA.svo_baza[userId].lastCreate > (60 - USER_DATA.svo_baza[userId].fabrics)*60)) {
        USER_DATA.svo_baza[userId].lastCreate += (60 - USER_DATA.svo_baza[userId].fabrics)*60
        USER_DATA.svo_baza[userId].count++
        isEditing = true
    }
}

const start = () => {
    try {
        const result = fs.readFileSync("./userdata/svo_baza.json", { encoding: "utf-8" });
        USER_DATA.svo_baza = JSON.parse(result)
    } catch (err) {console.error(err);}
    setInterval(save, 60000)
    console.log("start")
    bot.setMyCommands([
        {command:'/info',description:"Кто же это?"}
    ])

    bot.on('message',msg => {
        console.log(msg)
    })

    bot.onText(comands.getInfoGame, msg => {
        const chatId = msg.chat.id;
        const user = msg.from;
        loadSnarads(user.id)
        const thisData = USER_DATA.svo_baza[user.id.toString()];
        const sendText = `🔫 Досье военной базы им. ${user.first_name} ${user.last_name}:
Главный: @${user.username}

🔖 Имя зарядов: ${thisData.name || "Хз как звать"}
🧨 Готовых зарядов: ${thisData.count || 1} из ${thisData.maxCount || 1}
🏭 Военных заводов: ${thisData.fabricks || 1}
⏱️ 1 снаряд в ${(60 - (thisData.fabrics)||0)} минут

⚛️ Навыки:
🚀 Дальность палёта: ${thisData.round || 1}
💫 Уровень ПВО: ${thisData.PVO || 1}
💥 Сила ядерного снаряда: ${thisData.power || 1}

📊 Статистика:
💵 Бюджет: ${thisData.money || 0}
🦞Запущено ракет: ${thisData.upRockets || 0}
💢 Сбито ваших ракет: ${thisData.badRockets || 0}

🍪Попало ракет: ${thisData.endRockets || 0}
🩸В вас упало: ${thisData.downRockets || 0}`;
        bot.sendMessage(chatId,sendText)
    })

    bot.onText(comands.atacka, msg => {
        const chatId = msg.chat.id;
        const user = msg.from;
        if (msg.date - USER_DATA.svo_baza[user.id].lastAttack < 900) return bot.sendMessage(chatId,"🔥Твоя пушка слишком горячая🔥\n⏳Дай время ей остыть⏳\nМожно стрелять раз в 15 минут")
        if (msg.reply_to_message){
            console.log("до")
            console.log((USER_DATA.svo_baza[vragId].PVO))
            const vragId = msg.reply_to_message.from.id
            let lenTo = Math.floor(Math.random()*100) + 10 * (USER_DATA.svo_baza[vragId].PVO || 0)
            let radius = Math.floor(Math.random()*20)
            console.log("после")
            let silaPVO_Vrag = (USER_DATA.svo_baza[vragId].PVO || 1)
            let rangeRacket = (USER_DATA.svo_baza[user.id].range || 1) * 10
            let silaRack = (USER_DATA.svo_baza[user.id].power || 1)

            if (Math.min(lenTo-rangeRacket,0) > radius) {
                bot.sendMessage(chatId,"😔Упс... недолёт😔")
                USER_DATA.svo_baza[user.id].upRockets = (USER_DATA.svo_baza[user.id].upRockets||0)+1
            } else if(silaPVO_Vrag>silaRack || Math.random() > 0.1) {
                bot.sendMessage(chatId,"🚀ПВО врага было сильнее🎇\n(Зато салют)")
                USER_DATA.svo_baza[user.id].badRockets = (USER_DATA.svo_baza[user.id].badRockets||0)+1
                USER_DATA.svo_baza[user.id].upRockets = (USER_DATA.svo_baza[user.id].upRockets||0)+1
            } else {
                bot.sendMessage(chatId,"🥳Вы попали!🥳")
                USER_DATA.svo_baza[user.id].endRockets = (USER_DATA.svo_baza[user.id].endRockets|| 0)+1
            }
            isEditing = true
        }
    })

}

start()