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
const distube_1 = __importDefault(require("distube"));
dotenv_1.config({
    path: __dirname + "/.env",
});
const client = new discord_js_1.Client();
const distube = new distube_1.default(client, {
    searchSongs: false,
    emitNewSongOnly: true,
});
client.on("ready", () => {
    console.log("I'm Online");
});
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const prefix = "->";
    if (message.author.bot)
        return;
    if (!message.guild)
        return;
    if (!message.content.startsWith(prefix))
        return;
    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (cmd === "ping") {
        message.channel.send(`๐ แจแแงแแแแแแ แแ แแก ${Date.now() - message.createdTimestamp}ms. แแ แแ แแแก แจแแงแแแแแแ แแ แแก ${Math.round(client.ws.ping)}ms`);
    }
    if (cmd === "quote") {
        node_fetch_1.default("https://type.fit/api/quotes")
            .then((response) => response.json())
            .then((quote) => {
            const random = Math.floor(Math.random() * quote.length);
            const { text, author } = quote[random];
            message.channel.send(`*${text}* - **${author}**`);
        })
            .catch((err) => console.log(err));
    }
    if (cmd === "command") {
        const commandEmbed = new discord_js_1.MessageEmbed()
            .setColor("#fff23d")
            .setTitle("แแ แซแแแแแแแแก แกแแ")
            .addFields({ name: "`->covid`", value: "Covid-19 แแแแแแแฃแ แ แกแขแแขแแกแขแแแ" }, { name: "`->quote`", value: "แ แแแแแ แชแแขแแขแ" }, { name: "`->play`", value: "แ แแแแก แแฃแกแแแแก แฎแแแแแ แแ แฎแจแ" }, { name: "`->leave`", value: "แแแขแ แแแแแก แฎแแแแแแ แแ แฎแแแแ" }, { name: "`->whois`", value: "แแแคแแ แแแชแแ แแฅแแแแก แจแแกแแฎแแ" }, {
            name: "**แแแฆแแแ แ แแแแก แแแแแแแแแ**",
            value: "-",
        })
            .addFields({
            name: "`->mute` / `unmute`",
            value: "แแฃแแแแก แแ แฎแกแแแก แแแฃแแก แแแแฎแแแ แแแแแก",
        }, { name: "`->kick`", value: "แแแแแแก แแแแฎแแแ แแแแแก แกแแ แแแ แแแแ" }, { name: "`->ban`", value: "แแแแก แแแแแก แแแแฎแแแ แแแแแก" });
        message.channel.send(commandEmbed);
    }
    if (cmd === "whois") {
        const taggedUser = message.mentions.users.first();
        const userProfile = message.author.avatarURL();
        const userRolesLength = (_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.cache.map((r) => r.name).slice(0, -1);
        const userHEX = (_c = message.member) === null || _c === void 0 ? void 0 : _c.displayHexColor;
        const Roles = (_d = message.member) === null || _d === void 0 ? void 0 : _d.roles.cache.map((e) => e.name).slice(0, -1);
        const createArray = message.author.createdAt
            .toString()
            .split(" ");
        const createDate = `${createArray[1]} ${createArray[2]} - ${createArray[3]}`;
        const joinedArray = String((_e = message.guild.me) === null || _e === void 0 ? void 0 : _e.joinedAt).split(" ");
        const joinedDate = `${joinedArray[1]} ${joinedArray[2]} - ${joinedArray[3]}`;
        const exampleEmbed = new discord_js_1.MessageEmbed()
            .setColor(userHEX)
            .setTitle("User Info")
            .setAuthor(`${message.author.tag}`, userProfile)
            .setThumbnail(userProfile)
            .addFields({
            name: "แจแแแแฃแแ แแแ แกแแ แแแ แก",
            value: joinedDate,
            inline: true,
        }, {
            name: "แแแ แแแแกแขแ แแ แแ",
            value: createDate,
            inline: true,
        }, {
            name: `แ แแแแแ [${userRolesLength === null || userRolesLength === void 0 ? void 0 : userRolesLength.length}]`,
            value: Roles,
            inline: false,
        })
            .setTimestamp()
            .setFooter(message.author.id, userProfile);
        message.channel.send(exampleEmbed);
    }
    if (cmd === "covid") {
        node_fetch_1.default("https://api.covid19api.com/summary")
            .then((response) => response.json())
            .then((stats) => {
            const CovidData = stats.Global;
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#4f1e1b")
                .setTitle("Covid-19-แแก แแแแแแแฃแ แ แกแขแแขแแกแขแแแ")
                .setThumbnail("https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg")
                .addFields({
                name: "แแฎแแแ แแแแแกแขแฃแ แแแฃแแ",
                value: String(CovidData.NewConfirmed).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: true,
            }, {
                name: "แกแแแ แแ แแแแแกแขแฃแ แแแฃแแ",
                value: String(CovidData.TotalConfirmed).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: true,
            }, {
                name: "แแฎแแแ แแแ แแแชแแแแแ",
                value: String(CovidData.NewDeaths).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: true,
            }, {
                name: "แแฎแแ แแแแแฏแแแแ แแแแแแฃแแแ แแแแแแแ",
                value: String(CovidData.NewRecovered).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: false,
            }, {
                name: "แขแแขแแแฃแ  แแแแแฏแแแแ แแแแแแฃแแแ แแแแแแแ",
                value: String(CovidData.TotalRecovered).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: false,
            });
            message.channel.send(embed);
        })
            .catch((err) => console.log(err));
    }
    if (cmd === "kick") {
        if (!((_f = message.member) === null || _f === void 0 ? void 0 : _f.hasPermission("KICK_MEMBERS"))) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ");
            message.channel.send(rejectEmbed);
            return;
        }
        let mentionMember = (_h = (_g = message === null || message === void 0 ? void 0 : message.mentions) === null || _g === void 0 ? void 0 : _g.members) === null || _h === void 0 ? void 0 : _h.first();
        if (!mentionMember) {
            message.channel.send("แแแฎแแแ แฌแแ แแแแแแแ แ แแแแแ แแแแฎแแแ แแแแแก แแแแแแแแ แแกแฃแ แ");
            return;
        }
        let authorHighestRole = message.member.roles.highest.position;
        let mentionHighestRole = mentionMember.roles.highest.position;
        if (mentionHighestRole >= authorHighestRole) {
            message.reply("แจแแ แแแ  แแแแแแแ แจแแแแ แแแฆแแแ แ แแแแก แแ แแแแแ แ แแแแก แแฅแแแ แแแแแแแแก");
            return;
        }
        if (!mentionMember.kickable) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("แจแแ แแ  แแแฅแแก แฃแคแแแแ แแแแแแ แแก แแแแแแแแ แกแแ แแแ แแแแ");
            message.channel.send(rejectEmbed);
            return;
        }
        mentionMember
            .kick()
            .then(() => {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#52ff4d")
                .setTitle(`แแแแฎแแแ แแแแแ ${mentionMember === null || mentionMember === void 0 ? void 0 : mentionMember.user.tag} แแแแแแแฃแแแ แกแแ แแแ แแแแ`)
                .setFooter(message.author.id)
                .setTimestamp();
            message.channel.send(rejectEmbed);
        })
            .catch(console.error);
    }
    if (cmd === "mute") {
        let mentionMember = (_k = (_j = message === null || message === void 0 ? void 0 : message.mentions) === null || _j === void 0 ? void 0 : _j.members) === null || _k === void 0 ? void 0 : _k.first();
        let authorHighestRole = (_l = message.member) === null || _l === void 0 ? void 0 : _l.roles.highest.position;
        let mentionHighestRole = mentionMember === null || mentionMember === void 0 ? void 0 : mentionMember.roles.highest.position;
        if (mentionHighestRole >= authorHighestRole) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("แจแแ แแ  แจแแแแซแแแ แแแแฃแขแ แจแแแแ แแแฆแแแ แแ แแแแแ แ แแแแก แแฅแแแ แแแแแแแแ");
            message.channel.send(rejectEmbed);
            return;
        }
        if (!((_m = message.member) === null || _m === void 0 ? void 0 : _m.hasPermission("MANAGE_MESSAGES"))) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ")
                .setFooter(message.author.id)
                .setTimestamp();
            message.channel.send(rejectEmbed);
        }
        const target = message.mentions.users.first();
        if (target) {
            const mainRole = message.guild.roles.cache.find((role) => role.name === "แฌแแแ แ");
            const muteRole = message.guild.roles.cache.find((role) => role.name === "Muted");
            let memeberTarget = message.guild.members.cache.get(target.id);
            memeberTarget === null || memeberTarget === void 0 ? void 0 : memeberTarget.roles.remove(mainRole === null || mainRole === void 0 ? void 0 : mainRole.id);
            memeberTarget === null || memeberTarget === void 0 ? void 0 : memeberTarget.roles.add(muteRole === null || muteRole === void 0 ? void 0 : muteRole.id);
        }
        else {
            let Embed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("แแแแฎแแแ แแแแแ แแ  แแ แกแแแแแก แกแแ แแแ แแ")
                .setTimestamp();
            message.channel.send(Embed);
        }
        let rejectEmbed = new discord_js_1.MessageEmbed()
            .setColor("52ff4d")
            .setTitle(`${target.tag} แแแแแฃแขแ`);
        message.channel.send(rejectEmbed);
    }
    if (cmd === "unmute") {
        if (!((_o = message.member) === null || _o === void 0 ? void 0 : _o.hasPermission("MANAGE_MESSAGES"))) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ");
            message.channel.send(rejectEmbed);
        }
        else {
            const target = message.mentions.users.first();
            const mainRole = message.guild.roles.cache.find((role) => role.name === "member");
            const muteRole = message.guild.roles.cache.find((role) => role.name === "Muted");
            let memeberTarget = message.guild.members.cache.get(target.id);
            memeberTarget === null || memeberTarget === void 0 ? void 0 : memeberTarget.roles.add(mainRole === null || mainRole === void 0 ? void 0 : mainRole.id);
            memeberTarget === null || memeberTarget === void 0 ? void 0 : memeberTarget.roles.remove(muteRole === null || muteRole === void 0 ? void 0 : muteRole.id);
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#52ff4d")
                .setTitle(`แแแแฎแแแ แแแแ ${target.tag}-แก แแแแฎแกแแ แแแฃแแ`)
                .setTimestamp();
            message.channel.send(embed);
        }
    }
    if (cmd === "ban") {
        let banReason = args.join(" ").slice(22);
        if (!banReason) {
            banReason = "แแ  แแ แแก แแแฎแกแแแแแ";
        }
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.members.resolve(user);
            if (member) {
                member
                    .ban({
                    reason: banReason,
                })
                    .then(() => {
                    const embed = new discord_js_1.MessageEmbed()
                        .setColor("#52ff4d")
                        .setTitle(`แฌแแ แแแขแแแแ แแแแแแแ ${user.tag}`)
                        .setTimestamp();
                    message.channel.send(embed);
                })
                    .catch((err) => {
                    const embed = new discord_js_1.MessageEmbed()
                        .setColor("#ff4f4f")
                        .setTitle(`โ แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ!`);
                    message.channel.send(embed);
                });
            }
            else {
                const embed = new discord_js_1.MessageEmbed()
                    .setColor("#ff4f4f")
                    .setTitle(`โ แแแแฎแแแ แแแแแ แแ  แแ แกแแแแแก แกแแ แแแ แแ`);
                message.channel.send(embed);
            }
        }
        else {
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle(`โ แแแแฎแแแ แแแแแ แแ  แแ แกแแแแแก แกแแ แแแ แแ`);
            message.channel.send(embed);
        }
    }
    // Queue status template
    const status = (queue) => `แฎแแแก แแแแ: \`${queue.volume}%\` | แคแแแขแ แแชแแ: \`${queue.filter || "Off"}\` | แแฃแแ: \`${queue.repeatMode
        ? queue.repeatMode == 2
            ? "แงแแแแ แกแแ"
            : "แแฃแกแแแ"
        : "Off"}\` | แแฃแขแแฉแแ แแแ: \`${queue.autoplay ? "On" : "Off"}\``;
    // DisTube event listeners, more in the documentation page
    distube
        .on("playSong", (message, queue, song) => message.channel.send(`แแฎแแ แฉแแแ แแ \`${song.name}\` - \`${song.formattedDuration}\`\nแแแแฎแแแแแแ แแฅแแ: ${song.user.tag}\n${status(queue)}`))
        .on("addSong", (message, queue, song) => message.channel.send(`แแแแแแขแ ${song.name} - \`${song.formattedDuration}\` แกแแแจแ by ${song.user.tag} แแแแ `))
        .on("playList", (message, queue, playlist, song) => message.channel.send(`แฉแแแ แแ \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nแแแแฎแแแแแแ แแฅแแ: ${song.user.tag}\nแแฎแแ แแแแแแแแ แแแแก \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`))
        .on("addList", (message, queue, playlist) => message.channel.send(`แแแแแแขแ \`${playlist.name}\` แคแแแแแแกแข (${playlist.songs.length} songs) แกแแแจแ \n${status(queue)}`))
        // DisTubeOptions.searchSongs = true
        .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**แแแ แฉแแ แฅแแแแแแแ แแแ แแแแขแ แ**\n${result
            .map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
            .join("\n")}\n*แจแแแงแแแแ 60 แฌแแแจแ แแแ แแ แแแขแ แแแแ แแ แฎแแแแ*`);
    })
        // DisTubeOptions.searchSongs = true
        .on("searchCancel", (message) => message.channel.send(`แจแแฌแงแแ แซแแแแ`))
        .on("error", (message, e) => {
        console.error(e);
        message.channel.send("แฌแแ แแแแจแแ แจแแชแแแแ: " + e);
    });
    if (cmd === "play") {
        if (!((_p = message.member) === null || _p === void 0 ? void 0 : _p.voice.channel))
            return message.channel.send("แฏแแ  แจแแแแ แฎแแแแแ แแ แฎแจแ.");
        if (!args[0])
            return message.channel.send("แจแแแงแแแแแ แแฃแกแแแแก แแแกแแฎแแแแแ.");
        distube.play(message, args.join(" "));
    }
    if (cmd === "leave") {
        if (!((_q = message.member) === null || _q === void 0 ? void 0 : _q.voice.channel))
            return message.channel.send("แฏแแ  แจแแแแ แฎแแแแแ แแ แฎแจแ.");
        distube.stop(message);
        message.channel.send("แแแฎแแแแแแก ๐ค");
    }
}));
client.login(process.env.TOKEN);
