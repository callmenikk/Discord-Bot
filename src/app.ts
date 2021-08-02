import {Client, MessageEmbed} from "discord.js"
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
    const prefix: string = "!"

    if(message.author.bot) return
    if(!message.guild) return
    if(!message.content.startsWith(prefix)) return

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd: UserMessage = args.shift()?.toLowerCase() 

    if(cmd === "ping") {
         message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
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
    if(cmd === "command"){
        message.channel.send(" ```I only have\n!ping\n!quote\nI'm under Development Process, some new Features will be added soon ```  ")
    }
    if(cmd === "say"){
        if(message.deletable) message.delete()

        if(args.length < 1) message.reply("nothing to say")
        .then(m => m.delete({timeout: 5000, reason: "idk"}))

        const roleColor: any = message.guild.me?.displayHexColor

        if(args[0].toLowerCase() === "embed"){
            const embed = new MessageEmbed()
              .setColor("#dd0ef0")
              .setDescription(args.slice(1).join(" "));
            message.channel.send(embed)
        }
    }
    if(cmd === "obamaballs"){
        message.channel.send(
          "https://media.tenor.com/images/c6755016355961ff8f9a4301d4bbb07d/tenor.png"
        );
    }
    if(cmd === "sussybaka"){
        message.channel.send(
          "https://cdn.discordapp.com/attachments/871824935016865858/871846793879638087/static-assets-upload2210855008168198565.jpg"
        );
    }
})

client.login("ODcxNzExODI5NDg1ODMwMTg0.YQfS5w.3Zt7I_ecYPxEYt3aEBNG66KAgnk");