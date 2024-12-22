const { createCanvas, loadImage} = require("canvas")
const canvas = createCanvas(500, 500);
const context = canvas.getContext('2d');
const colors = require("./others/colors")
context.fillStyle = '#ffffff';
context.fillRect(0, 0, canvas.width, canvas.height);

let lastIdPhoto = -1;
let lastIdChat = -1;
let lastIdChatAttemp = -1;
let lastIdAttemp = -1;


const draw = async ( msg, bot ) => {
    const chatId = msg.chat.id;
    const text = msg.text.split(' ');
    try {
        text.shift();
        const type_premitiv = text.shift().toLowerCase();
        let x = 250, y = 250;
        getColor(text.shift())
        switch (type_premitiv) {
            case "прямоугольник":
                x = parseInt(text.shift())
                y = parseInt(text.shift())
                let width = parseInt(text.shift())
                let height = parseInt(text.shift())

                context.fillRect(x, y, width, height)
                break;
            case "текст":
                let sizeText = (text.shift())
                context.font = `${sizeText}px serif`

                x = parseInt(text.shift())
                y = parseInt(text.shift())
                context.fillText(text.join(' '),x,y)
                break;
            case "текстдокрая":
                let sizeTextTwo = (text.shift())
                context.font = `${sizeTextTwo}px serif`

                x = parseInt(text.shift())
                y = parseInt(text.shift())
                context.fillText(text.join(' '),x,y,500-x)
                break;
            case "квадрат":
                x = parseInt(text.shift())
                y = parseInt(text.shift())
                let size = parseInt(text.shift())

                context.fillRect(x, y, size, size)
                break;
            case "фон":
                context.fillRect(0,0,500,500)
                break
            case "круг":
                x = parseInt(text.shift())
                y = parseInt(text.shift())
                let r = parseInt(text.shift())
                context.beginPath()

                context.arc(x,y,r,0,360)
                context.fill()
                context.closePath()
                break;
            default:
                throw new Error("hz chto napisal")
                break;
        }
    } catch (e) {
        console.log(e)
        console.log(await bot.sendMessage(chatId,"Где-то случилась ошибочка :("))
    } finally {
        let sendPh = await bot.sendPhoto(chatId,canvas.toBuffer())
        if (lastIdPhoto === -1){
            lastIdChat = chatId
            lastIdPhoto = sendPh.message_id
        } else {
            bot.deleteMessage(lastIdChat,lastIdPhoto)
            lastIdChat = chatId
            lastIdPhoto = sendPh.message_id
        }
    }
    if (lastIdPhoto === -1){
        lastIdChatAttemp = chatId
        lastIdAttemp = msg.message_id
    } else {
        bot.deleteMessage(lastIdChatAttemp,lastIdAttemp)
        lastIdChatAttemp = chatId
        lastIdAttemp = msg.message_id
    }

}

function getColor(textIsColor) {
    console.log(textIsColor)
    textIsColor = textIsColor.toLowerCase();
    if (Object.keys(colors).indexOf(textIsColor) > -1) {
        context.fillStyle = colors[textIsColor]
    } else if(textIsColor[0] === "#") {
        context.fillStyle = textIsColor
    } else {
        return undefined
    }
}



module.exports = {
    draw: draw,
}
