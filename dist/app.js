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
const client = new discord_js_1.Client();
client.on("ready", () => {
    console.log("I'm ready");
});
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prefix = "|>";
    if (message.author.bot)
        return;
    if (!message.guild)
        return;
    if (!message.content.startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (cmd === "ping")
        message.channel.send("🏓  pong");
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
}));
client.login("ODcxNzExODI5NDg1ODMwMTg0.YQfS5w.BOKMRWP02owsTnllnpyOVw1a5BU");
