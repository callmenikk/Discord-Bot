import { Client, GuildMember, MessageEmbed, User } from "discord.js";
import fetch from "node-fetch";
import { config } from "dotenv";
import Distube from "distube";

config({
  path: __dirname + "/.env",
});

type UserMessage = string | undefined;

interface QuoteInterface<T> {
  text: string;
  author: T;
}

const client: Client = new Client();

const distube: Distube = new Distube(client, {
  searchSongs: false,
  emitNewSongOnly: true,
});

client.on("ready", () => {
  console.log("I'm Online");
});

client.on("message", async (message) => {
  const prefix: string = "->";

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args: string[] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd: UserMessage = args.shift()?.toLowerCase();

  if (cmd === "ping") {
    message.channel.send(
      `๐ แจแแงแแแแแแ แแ แแก ${
        Date.now() - message.createdTimestamp
      }ms. แแ แแ แแแก แจแแงแแแแแแ แแ แแก ${Math.round(client.ws.ping)}ms`
    );
  }
  if (cmd === "quote") {
    fetch("https://type.fit/api/quotes")
      .then((response) => response.json())
      .then((quote) => {
        const random: number = Math.floor(Math.random() * quote.length);
        const { text, author }: QuoteInterface<string> = quote[random];

        message.channel.send(`*${text}* - **${author}**`);
      })
      .catch((err) => console.log(err));
  }
  if (cmd === "command") {
    const commandEmbed = new MessageEmbed()
      .setColor("#fff23d")
      .setTitle("แแ แซแแแแแแแแก แกแแ")
      .addFields(
        { name: "`->covid`", value: "Covid-19 แแแแแแแฃแ แ แกแขแแขแแกแขแแแ" },
        { name: "`->quote`", value: "แ แแแแแ แชแแขแแขแ" },
        { name: "`->play`", value: "แ แแแแก แแฃแกแแแแก แฎแแแแแ แแ แฎแจแ" },
        { name: "`->leave`", value: "แแแขแ แแแแแก แฎแแแแแแ แแ แฎแแแแ" },
        { name: "`->whois`", value: "แแแคแแ แแแชแแ แแฅแแแแก แจแแกแแฎแแ" },
        {
          name: "**แแแฆแแแ แ แแแแก แแแแแแแแแ**",
          value: "-",
        } 
      )
      .addFields(
        {
          name: "`->mute` / `unmute`",
          value: "แแฃแแแแก แแ แฎแกแแแก แแแฃแแก แแแแฎแแแ แแแแแก",
        },
        { name: "`->kick`", value: "แแแแแแก แแแแฎแแแ แแแแแก แกแแ แแแ แแแแ" },
        { name: "`->ban`", value: "แแแแก แแแแแก แแแแฎแแแ แแแแแก" }
      );

      message.channel.send(commandEmbed)
  }
  if (cmd === "whois") {
    const taggedUser: User | undefined = message.mentions.users.first();

    const userProfile: any = message.author.avatarURL();
    const userRolesLength: string[] | undefined = message.member?.roles.cache
      .map((r) => r.name)
      .slice(0, -1);
    const userHEX: any = message.member?.displayHexColor;
    const Roles: string[] | undefined = message.member?.roles.cache
      .map((e) => e.name)
      .slice(0, -1);

    const createArray: string[] = message.author.createdAt
      .toString()
      .split(" ");
    const createDate: string = `${createArray[1]} ${createArray[2]} - ${createArray[3]}`;

    const joinedArray: string[] = String(message.guild.me?.joinedAt).split(" ");
    const joinedDate: string = `${joinedArray[1]} ${joinedArray[2]} - ${joinedArray[3]}`;

    const exampleEmbed = new MessageEmbed()
      .setColor(userHEX)
      .setTitle("User Info")
      .setAuthor(`${message.author.tag}`, userProfile)
      .setThumbnail(userProfile)
      .addFields(
        {
          name: "แจแแแแฃแแ แแแ แกแแ แแแ แก",
          value: joinedDate,
          inline: true,
        },
        {
          name: "แแแ แแแแกแขแ แแ แแ",
          value: createDate,
          inline: true,
        },
        {
          name: `แ แแแแแ [${userRolesLength?.length}]`,
          value: Roles,
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter(message.author.id, userProfile);

    message.channel.send(exampleEmbed);
  }
  if (cmd === "covid") {
    fetch("https://api.covid19api.com/summary")
      .then((response) => response.json())
      .then((stats) => {
        const CovidData: any = stats.Global;

        const embed = new MessageEmbed()
          .setColor("#4f1e1b")
          .setTitle("Covid-19-แแก แแแแแแแฃแ แ แกแขแแขแแกแขแแแ")
          .setThumbnail(
            "https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg"
          )
          .addFields(
            {
              name: "แแฎแแแ แแแแแกแขแฃแ แแแฃแแ",
              value: String(CovidData.NewConfirmed).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "แกแแแ แแ แแแแแกแขแฃแ แแแฃแแ",
              value: String(CovidData.TotalConfirmed).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "แแฎแแแ แแแ แแแชแแแแแ",
              value: String(CovidData.NewDeaths).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "แแฎแแ แแแแแฏแแแแ แแแแแแฃแแแ แแแแแแแ",
              value: String(CovidData.NewRecovered).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: false,
            },
            {
              name: "แขแแขแแแฃแ  แแแแแฏแแแแ แแแแแแฃแแแ แแแแแแแ",
              value: String(CovidData.TotalRecovered).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: false,
            }
          );
        message.channel.send(embed);
      })
      .catch((err) => console.log(err));
  }
  if (cmd === "kick") {
    if (!message.member?.hasPermission("KICK_MEMBERS")) {
            let rejectEmbed = new MessageEmbed()
              .setColor("#ff4f4f")
              .setTitle("แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ")
            message.channel.send(rejectEmbed);
      return;
    }

    let mentionMember: GuildMember | undefined =
      message?.mentions?.members?.first();
    if (!mentionMember) {
      message.channel.send("แแแฎแแแ แฌแแ แแแแแแแ แ แแแแแ แแแแฎแแแ แแแแแก แแแแแแแแ แแกแฃแ แ");
      return;
    }
    let authorHighestRole: number = message.member.roles.highest.position;
    let mentionHighestRole: number = mentionMember.roles.highest.position;

    if (mentionHighestRole >= authorHighestRole) {
      message.reply("แจแแ แแแ  แแแแแแแ แจแแแแ แแแฆแแแ แ แแแแก แแ แแแแแ แ แแแแก แแฅแแแ แแแแแแแแก");
      return;
    }

    if (!mentionMember.kickable) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("แจแแ แแ  แแแฅแแก แฃแคแแแแ แแแแแแ แแก แแแแแแแแ แกแแ แแแ แแแแ");
      message.channel.send(rejectEmbed);
      return;
    }
    mentionMember
      .kick()
      .then(() => {
        let rejectEmbed = new MessageEmbed()
          .setColor("#52ff4d")
          .setTitle(
            `แแแแฎแแแ แแแแแ ${mentionMember?.user.tag} แแแแแแแฃแแแ แกแแ แแแ แแแแ`
          )
          .setFooter(message.author.id)
          .setTimestamp();

        message.channel.send(rejectEmbed);
      })
      .catch(console.error);
  }
  if (cmd === "mute") {
    let mentionMember: GuildMember | undefined =
      message?.mentions?.members?.first();

    let authorHighestRole: any = message.member?.roles.highest.position;
    let mentionHighestRole: any = mentionMember?.roles.highest.position;

    if (mentionHighestRole >= authorHighestRole) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("แจแแ แแ  แจแแแแซแแแ แแแแฃแขแ แจแแแแ แแแฆแแแ แแ แแแแแ แ แแแแก แแฅแแแ แแแแแแแแ");
      message.channel.send(rejectEmbed);
      return;
    }

    if (!message.member?.hasPermission("MANAGE_MESSAGES")) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ")
        .setFooter(message.author.id)
        .setTimestamp();

      message.channel.send(rejectEmbed);
    }
    const target: any = message.mentions.users.first();
    if (target) {
      const mainRole: any = message.guild.roles.cache.find(
        (role) => role.name === "แฌแแแ แ"
      );
      const muteRole: any = message.guild.roles.cache.find(
        (role) => role.name === "Muted"
      );

      let memeberTarget = message.guild.members.cache.get(target.id);
      memeberTarget?.roles.remove(mainRole?.id);
      memeberTarget?.roles.add(muteRole?.id);
    } else {
      let Embed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("แแแแฎแแแ แแแแแ แแ  แแ แกแแแแแก แกแแ แแแ แแ")
        .setTimestamp();

      message.channel.send(Embed);
    }
    let rejectEmbed = new MessageEmbed()
      .setColor("52ff4d")
      .setTitle(`${target.tag} แแแแแฃแขแ`);
    message.channel.send(rejectEmbed);
  }
  if (cmd === "unmute") {
    if (!message.member?.hasPermission("MANAGE_MESSAGES")) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ")

      message.channel.send(rejectEmbed);
    } else {
      const target: any = message.mentions.users.first();

      const mainRole: any = message.guild.roles.cache.find(
        (role) => role.name === "member"
      );
      const muteRole: any = message.guild.roles.cache.find(
        (role) => role.name === "Muted"
      );

      let memeberTarget = message.guild.members.cache.get(target.id);
      memeberTarget?.roles.add(mainRole?.id);
      memeberTarget?.roles.remove(muteRole?.id);

      const embed = new MessageEmbed()
        .setColor("#52ff4d")
        .setTitle(`แแแแฎแแแ แแแแ ${target.tag}-แก แแแแฎแกแแ แแแฃแแ`)
        .setTimestamp();
      message.channel.send(embed);
    }
  }
  if (cmd === "ban") {
    let banReason: string = args.join(" ").slice(22);
    if (!banReason) {
      banReason = "แแ  แแ แแก แแแฎแกแแแแแ";
    }

    const user: User | undefined = message.mentions.users.first();
    if (user) {
      const member: GuildMember | null = message.guild.members.resolve(user);
      if (member) {
        member
          .ban({
            reason: banReason,
          })
          .then(() => {
            const embed = new MessageEmbed()
              .setColor("#52ff4d")
              .setTitle(`แฌแแ แแแขแแแแ แแแแแแแ ${user.tag}`)
              .setTimestamp();
            message.channel.send(embed);
          })
          .catch((err) => {
            const embed = new MessageEmbed()
              .setColor("#ff4f4f")
              .setTitle(`โ แจแแ แแ  แแแฅแแก แแ แแ แซแแแแแแก แฃแคแแแแ!`);
            message.channel.send(embed);
          });
      } else {
        const embed = new MessageEmbed()
          .setColor("#ff4f4f")
          .setTitle(`โ แแแแฎแแแ แแแแแ แแ  แแ แกแแแแแก แกแแ แแแ แแ`);
        message.channel.send(embed);
      }
    } else {
      const embed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle(`โ แแแแฎแแแ แแแแแ แแ  แแ แกแแแแแก แกแแ แแแ แแ`);
      message.channel.send(embed);
    }
  }
  // Queue status template
  const status = (queue: any) =>
    `แฎแแแก แแแแ: \`${queue.volume}%\` | แคแแแขแ แแชแแ: \`${
      queue.filter || "Off"
    }\` | แแฃแแ: \`${
      queue.repeatMode
        ? queue.repeatMode == 2
          ? "แงแแแแ แกแแ"
          : "แแฃแกแแแ"
        : "Off"
    }\` | แแฃแขแแฉแแ แแแ: \`${queue.autoplay ? "On" : "Off"}\``;

  // DisTube event listeners, more in the documentation page
  distube
    .on("playSong", (message, queue, song) =>
      message.channel.send(
        `แแฎแแ แฉแแแ แแ \`${song.name}\` - \`${
          song.formattedDuration
        }\`\nแแแแฎแแแแแแ แแฅแแ: ${song.user.tag}\n${status(queue)}`
      )
    )
    .on("addSong", (message, queue, song) =>
      message.channel.send(
        `แแแแแแขแ ${song.name} - \`${song.formattedDuration}\` แกแแแจแ by ${song.user.tag} แแแแ `
      )
    )
    .on("playList", (message, queue, playlist, song) =>
      message.channel.send(
        `แฉแแแ แแ \`${playlist.name}\` playlist (${
          playlist.songs.length
        } songs).\nแแแแฎแแแแแแ แแฅแแ: ${song.user.tag}\nแแฎแแ แแแแแแแแ แแแแก \`${
          song.name
        }\` - \`${song.formattedDuration}\`\n${status(queue)}`
      )
    )
    .on("addList", (message, queue, playlist) =>
      message.channel.send(
        `แแแแแแขแ \`${playlist.name}\` แคแแแแแแกแข (${
          playlist.songs.length
        } songs) แกแแแจแ \n${status(queue)}`
      )
    )
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
      let i = 0;
      message.channel.send(
        `**แแแ แฉแแ แฅแแแแแแแ แแแ แแแแขแ แ**\n${result
          .map(
            (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
          )
          .join("\n")}\n*แจแแแงแแแแ 60 แฌแแแจแ แแแ แแ แแแขแ แแแแ แแ แฎแแแแ*`
      );
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`แจแแฌแงแแ แซแแแแ`))
    .on("error", (message, e) => {
      console.error(e);
      message.channel.send("แฌแแ แแแแจแแ แจแแชแแแแ: " + e);
    });

  if (cmd === "play") {
    if (!message.member?.voice.channel)
      return message.channel.send("แฏแแ  แจแแแแ แฎแแแแแ แแ แฎแจแ.");
    if (!args[0]) return message.channel.send("แจแแแงแแแแแ แแฃแกแแแแก แแแกแแฎแแแแแ.");

    distube.play(message, args.join(" "));
  }
  if (cmd === "leave") {
    if (!message.member?.voice.channel) return message.channel.send("แฏแแ  แจแแแแ แฎแแแแแ แแ แฎแจแ.");

    distube.stop(message);
    message.channel.send("แแแฎแแแแแแก ๐ค");
  }
});

client.login(process.env.TOKEN);
