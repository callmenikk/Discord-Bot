import {Client} from "discord.js"
import fetch from "node-fetch"

type UserMessage = string | undefined
interface QuoteInterface<T>{
    text: string,
    author: T
}

const client = new Client()

client.on("ready", ()=> {
    console.log("I'm ready")
})

client.on("message", async message => {
    const prefix: string = "|>"

    if(message.author.bot) return
    if(!message.guild) return
    if(!message.content.startsWith(prefix)) return

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd: UserMessage = args.shift()?.toLowerCase() 

    if(cmd === "ping") message.channel.send("🏓  pong")
    if(cmd === "quote"){
         fetch("https://type.fit/api/quotes")
        .then(response => response.json())
        .then(quote => {
            const random: number = Math.floor(Math.random() * quote.length)
            const {text, author}: QuoteInterface<string> = quote[random]

            const msg = message.channel.send(`*${text}* - **${author}**`)
        })
        .catch(err => console.log(err))
    }
})

client.login("ODcxNzExODI5NDg1ODMwMTg0.YQfS5w.BOKMRWP02owsTnllnpyOVw1a5BU");