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
        message.channel.send(`🏓 შეყოვნება არის ${Date.now() - message.createdTimestamp}ms. ეი პი აის შეყოვნება არის ${Math.round(client.ws.ping)}ms`);
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
            .setTitle("ბრძანებების სია")
            .addFields({ name: "`->covid`", value: "Covid-19 გლობალური სტატისტიკა" }, { name: "`->quote`", value: "რენდომ ციტატა" }, { name: "`->play`", value: "რთავს მუსიკას ხმოვან არხში" }, { name: "`->leave`", value: "ბოტი გადის ხმოვანი არხიდან" }, { name: "`->whois`", value: "ინფორმაცია თქვენს შესახებ" }, {
            name: "**მაღალი როლის კომანდები**",
            value: "-",
        })
            .addFields({
            name: "`->mute` / `unmute`",
            value: "მუთავს ან ხსნის მიუთს მომხმარებელს",
        }, { name: "`->kick`", value: "აგდებს მომხმარებელს სერვერიდან" }, { name: "`->ban`", value: "ბანს ადებს მომხმარებელს" });
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
            name: "შემოუერთდა სერვერს",
            value: joinedDate,
            inline: true,
        }, {
            name: "დარეგისტრირდა",
            value: createDate,
            inline: true,
        }, {
            name: `როლები [${userRolesLength === null || userRolesLength === void 0 ? void 0 : userRolesLength.length}]`,
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
                .setTitle("Covid-19-ის გლობალური სტატისტიკა")
                .setThumbnail("https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg")
                .addFields({
                name: "ახალი დადასტურებული",
                value: String(CovidData.NewConfirmed).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: true,
            }, {
                name: "საერთო დადასტურებული",
                value: String(CovidData.TotalConfirmed).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: true,
            }, {
                name: "ახალი გარდაცვლილი",
                value: String(CovidData.NewDeaths).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: true,
            }, {
                name: "ახალ გამოჯანმრთელებულთა ოდენობა",
                value: String(CovidData.NewRecovered).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                inline: false,
            }, {
                name: "ტოტალურ გამოჯანმრთელებულთა ოდენობა",
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
                .setTitle("შენ არ გაქვს ამ ბრძანების უფლება");
            message.channel.send(rejectEmbed);
            return;
        }
        let mentionMember = (_h = (_g = message === null || message === void 0 ? void 0 : message.mentions) === null || _g === void 0 ? void 0 : _g.members) === null || _h === void 0 ? void 0 : _h.first();
        if (!mentionMember) {
            message.channel.send("გთხოვთ წარადგინოთ რომელი მომხმარებლის გაგადება გსურთ");
            return;
        }
        let authorHighestRole = message.member.roles.highest.position;
        let mentionHighestRole = mentionMember.roles.highest.position;
        if (mentionHighestRole >= authorHighestRole) {
            message.reply("შენ ვერ გააგდებ შენზე მაღალი როლის ან იგივე როლის მქონე ადამიანს");
            return;
        }
        if (!mentionMember.kickable) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("შენ არ გაქვს უფლება გააგდო ეს ადამიანი სერვერიდან");
            message.channel.send(rejectEmbed);
            return;
        }
        mentionMember
            .kick()
            .then(() => {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#52ff4d")
                .setTitle(`მომხმარებელი ${mentionMember === null || mentionMember === void 0 ? void 0 : mentionMember.user.tag} გაგდებულია სერვერიდან`)
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
                .setTitle("შენ არ შეგიძლია დამუტო შენზე მაღალი ან იგივე როლის მქონე ადამიანი");
            message.channel.send(rejectEmbed);
            return;
        }
        if (!((_m = message.member) === null || _m === void 0 ? void 0 : _m.hasPermission("MANAGE_MESSAGES"))) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("შენ არ გაქვს ამ ბრძანების უფლება")
                .setFooter(message.author.id)
                .setTimestamp();
            message.channel.send(rejectEmbed);
        }
        const target = message.mentions.users.first();
        if (target) {
            const mainRole = message.guild.roles.cache.find((role) => role.name === "წევრი");
            const muteRole = message.guild.roles.cache.find((role) => role.name === "Muted");
            let memeberTarget = message.guild.members.cache.get(target.id);
            memeberTarget === null || memeberTarget === void 0 ? void 0 : memeberTarget.roles.remove(mainRole === null || mainRole === void 0 ? void 0 : mainRole.id);
            memeberTarget === null || memeberTarget === void 0 ? void 0 : memeberTarget.roles.add(muteRole === null || muteRole === void 0 ? void 0 : muteRole.id);
        }
        else {
            let Embed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("მომხმარებელი არ არსებობს სერვერზე")
                .setTimestamp();
            message.channel.send(Embed);
        }
        let rejectEmbed = new discord_js_1.MessageEmbed()
            .setColor("52ff4d")
            .setTitle(`${target.tag} დაიმუტა`);
        message.channel.send(rejectEmbed);
    }
    if (cmd === "unmute") {
        if (!((_o = message.member) === null || _o === void 0 ? void 0 : _o.hasPermission("MANAGE_MESSAGES"))) {
            let rejectEmbed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle("შენ არ გაქვს ამ ბრძანების უფლება");
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
                .setTitle(`მომხმარებელ ${target.tag}-ს მოეხსნა მიუთი`)
                .setTimestamp();
            message.channel.send(embed);
        }
    }
    if (cmd === "ban") {
        let banReason = args.join(" ").slice(22);
        if (!banReason) {
            banReason = "არ არის ნახსენები";
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
                        .setTitle(`წარმატებით დაიბანა ${user.tag}`)
                        .setTimestamp();
                    message.channel.send(embed);
                })
                    .catch((err) => {
                    const embed = new discord_js_1.MessageEmbed()
                        .setColor("#ff4f4f")
                        .setTitle(`❌ შენ არ გაქვს ამ ბრძანების უფლება!`);
                    message.channel.send(embed);
                });
            }
            else {
                const embed = new discord_js_1.MessageEmbed()
                    .setColor("#ff4f4f")
                    .setTitle(`❌ მომხმარებელი არ არსებობს სერვერზე`);
                message.channel.send(embed);
            }
        }
        else {
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#ff4f4f")
                .setTitle(`❌ მომხმარებელი არ არსებობს სერვერზე`);
            message.channel.send(embed);
        }
    }
    // Queue status template
    const status = (queue) => `ხმის დონე: \`${queue.volume}%\` | ფილტრაცია: \`${queue.filter || "Off"}\` | ლუპი: \`${queue.repeatMode
        ? queue.repeatMode == 2
            ? "ყველა სია"
            : "მუსიკა"
        : "Off"}\` | აუტოჩართვა: \`${queue.autoplay ? "On" : "Off"}\``;
    // DisTube event listeners, more in the documentation page
    distube
        .on("playSong", (message, queue, song) => message.channel.send(`ახლა ჩაირთო \`${song.name}\` - \`${song.formattedDuration}\`\nმოთხოვნილი იქნა: ${song.user.tag}\n${status(queue)}`))
        .on("addSong", (message, queue, song) => message.channel.send(`დაემატა ${song.name} - \`${song.formattedDuration}\` სიაში by ${song.user.tag} მიერ`))
        .on("playList", (message, queue, playlist, song) => message.channel.send(`ჩაირთო \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nმოთხოვნილი იქნა: ${song.user.tag}\nახლა მიმდინარეობს \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`))
        .on("addList", (message, queue, playlist) => message.channel.send(`დაემატა \`${playlist.name}\` ფლეილისტ (${playlist.songs.length} songs) სიაში \n${status(queue)}`))
        // DisTubeOptions.searchSongs = true
        .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**აირჩიე ქვევიდან პარამეტრი**\n${result
            .map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
            .join("\n")}\n*შეიყვანე 60 წამში თორემ ბოტი გავა არხიდან*`);
    })
        // DisTubeOptions.searchSongs = true
        .on("searchCancel", (message) => message.channel.send(`შეწყდა ძიება`))
        .on("error", (message, e) => {
        console.error(e);
        message.channel.send("წარმოიშვა შეცდომა: " + e);
    });
    if (cmd === "play") {
        if (!((_p = message.member) === null || _p === void 0 ? void 0 : _p.voice.channel))
            return message.channel.send("ჯერ შედით ხმოვან არხში.");
        if (!args[0])
            return message.channel.send("შეიყვანეთ მუსიკის დასახელება.");
        distube.play(message, args.join(" "));
    }
    if (cmd === "leave") {
        if (!((_q = message.member) === null || _q === void 0 ? void 0 : _q.voice.channel))
            return message.channel.send("ჯერ შედით ხმოვან არხში.");
        distube.stop(message);
        message.channel.send("ნახვამდის 🤍");
    }
}));
client.login(process.env.TOKEN);
