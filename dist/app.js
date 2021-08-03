"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = require("dotenv");
dotenv_1.config({
    path: __dirname + "/.env"
});
const client = new discord_js_1.Client();
client.on("ready", () => {
    console.log("I'm ready");
});
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const prefix = "!";
    if (message.author.bot)
        return;
    if (!message.guild)
        return;
    if (!message.content.startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (cmd === "ping") {
        message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
    if (cmd === "quote") {
        node_fetch_1.default("https://type.fit/api/quotes")
            .then(response => response.json())
            .then(quote => {
            const random = Math.floor(Math.random() * quote.length);
            const { text, author } = quote[random];
            const msg = message.channel.send(`*${text}* - **${author}**`);
        })
            .catch(err => console.log(err));
    }
    if (cmd === "command") {
        message.channel.send(" ```I only have\n!ping\n!quote\nI'm under Development Process, some new Features will be added soon ```  ");
    }
    if (cmd === "say") {
        if (message.deletable)
            message.delete();
        if (args.length < 1)
            message.reply("nothing to say")
                .then(m => m.delete({ timeout: 5000, reason: "idk" }));
        if (args[0].toLowerCase() === "embed") {
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#dd0ef0")
                .setDescription(args.slice(1).join(" "))
                .setTimestamp();
            message.channel.send(embed);
        }
    }
    if (cmd === "obamaballs") {
        message.channel.send("https://media.tenor.com/images/c6755016355961ff8f9a4301d4bbb07d/tenor.png");
    }
    if (cmd === "sussybaka") {
        message.channel.send("https://cdn.discordapp.com/attachments/871824935016865858/871846793879638087/static-assets-upload2210855008168198565.jpg");
    }
    if (cmd === "whois") {
        const userProfile = message.author.avatarURL();
        const userRoles = (_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.cache.map(r => r.name).slice(0, -1).toString().replace(/ ,/g, ",");
        const userHEX = (_c = message.member) === null || _c === void 0 ? void 0 : _c.displayHexColor;
        const createArray = message.author.createdAt.toString().split(" ");
        const createDate = `${createArray[1]} ${createArray[2]} - ${createArray[3]}`;
        const joinedArray = String((_d = message.guild.me) === null || _d === void 0 ? void 0 : _d.joinedAt).split(" ");
        const joinedDate = `${joinedArray[1]} ${joinedArray[2]} - ${joinedArray[3]}`;
        const exampleEmbed = new discord_js_1.MessageEmbed()
            .setColor(userHEX)
            .setTitle("User Info")
            .setAuthor(`@${message.author.username}`, userProfile)
            .setThumbnail(userProfile)
            .setDescription("Some description here")
            .addFields({
            name: "Joined",
            value: joinedDate,
            inline: true,
        }, {
            name: "Registered",
            value: createDate,
            inline: true,
        }, {
            name: `Roles [${userRoles === null || userRoles === void 0 ? void 0 : userRoles.split(" ").length}]`,
            value: userRoles,
            inline: true,
        })
            .setTimestamp()
            .setFooter(message.author.id, userProfile);
        message.channel.send(exampleEmbed);
    }
}));
client.on("guildMemberAdd", (newMember) => __awaiter(void 0, void 0, void 0, function* () {
}));
client.login(process.env.TOKEN);
