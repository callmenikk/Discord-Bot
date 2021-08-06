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
      `🏓 შეყოვნება არის ${
        Date.now() - message.createdTimestamp
      }ms. ეი პი აის შეყოვნება არის ${Math.round(client.ws.ping)}ms`
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
      .setTitle("ბრძანებების სია")
      .addFields(
        { name: "`->covid`", value: "Covid-19 გლობალური სტატისტიკა" },
        { name: "`->quote`", value: "რენდომ ციტატა" },
        { name: "`->play`", value: "რთავს მუსიკას ხმოვან არხში" },
        { name: "`->leave`", value: "ბოტი გადის ხმოვანი არხიდან" },
        { name: "`->whois`", value: "ინფორმაცია თქვენს შესახებ" },
        {
          name: "**მაღალი როლის კომანდები**",
          value: "-",
        } 
      )
      .addFields(
        {
          name: "`->mute` / `unmute`",
          value: "მუთავს ან ხსნის მიუთს მომხმარებელს",
        },
        { name: "`->kick`", value: "აგდებს მომხმარებელს სერვერიდან" },
        { name: "`->ban`", value: "ბანს ადებს მომხმარებელს" }
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
          name: "შემოუერთდა სერვერს",
          value: joinedDate,
          inline: true,
        },
        {
          name: "დარეგისტრირდა",
          value: createDate,
          inline: true,
        },
        {
          name: `როლები [${userRolesLength?.length}]`,
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
          .setTitle("Covid-19-ის გლობალური სტატისტიკა")
          .setThumbnail(
            "https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg"
          )
          .addFields(
            {
              name: "ახალი დადასტურებული",
              value: String(CovidData.NewConfirmed).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "საერთო დადასტურებული",
              value: String(CovidData.TotalConfirmed).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "ახალი გარდაცვლილი",
              value: String(CovidData.NewDeaths).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "ახალ გამოჯანმრთელებულთა ოდენობა",
              value: String(CovidData.NewRecovered).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: false,
            },
            {
              name: "ტოტალურ გამოჯანმრთელებულთა ოდენობა",
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
              .setTitle("შენ არ გაქვს ამ ბრძანების უფლება")
            message.channel.send(rejectEmbed);
      return;
    }

    let mentionMember: GuildMember | undefined =
      message?.mentions?.members?.first();
    if (!mentionMember) {
      message.channel.send("გთხოვთ წარადგინოთ რომელი მომხმარებლის გაგადება გსურთ");
      return;
    }
    let authorHighestRole: number = message.member.roles.highest.position;
    let mentionHighestRole: number = mentionMember.roles.highest.position;

    if (mentionHighestRole >= authorHighestRole) {
      message.reply("შენ ვერ გააგდებ შენზე მაღალი როლის ან იგივე როლის მქონე ადამიანს");
      return;
    }

    if (!mentionMember.kickable) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("შენ არ გაქვს უფლება გააგდო ეს ადამიანი სერვერიდან");
      message.channel.send(rejectEmbed);
      return;
    }
    mentionMember
      .kick()
      .then(() => {
        let rejectEmbed = new MessageEmbed()
          .setColor("#52ff4d")
          .setTitle(
            `მომხმარებელი ${mentionMember?.user.tag} გაგდებულია სერვერიდან`
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
        .setTitle("შენ არ შეგიძლია დამუტო შენზე მაღალი ან იგივე როლის მქონე ადამიანი");
      message.channel.send(rejectEmbed);
      return;
    }

    if (!message.member?.hasPermission("MANAGE_MESSAGES")) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("შენ არ გაქვს ამ ბრძანების უფლება")
        .setFooter(message.author.id)
        .setTimestamp();

      message.channel.send(rejectEmbed);
    }
    const target: any = message.mentions.users.first();
    if (target) {
      const mainRole: any = message.guild.roles.cache.find(
        (role) => role.name === "წევრი"
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
        .setTitle("მომხმარებელი არ არსებობს სერვერზე")
        .setTimestamp();

      message.channel.send(Embed);
    }
    let rejectEmbed = new MessageEmbed()
      .setColor("52ff4d")
      .setTitle(`${target.tag} დაიმუტა`);
    message.channel.send(rejectEmbed);
  }
  if (cmd === "unmute") {
    if (!message.member?.hasPermission("MANAGE_MESSAGES")) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("შენ არ გაქვს ამ ბრძანების უფლება")

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
        .setTitle(`მომხმარებელ ${target.tag}-ს მოეხსნა მიუთი`)
        .setTimestamp();
      message.channel.send(embed);
    }
  }
  if (cmd === "ban") {
    let banReason: string = args.join(" ").slice(22);
    if (!banReason) {
      banReason = "არ არის ნახსენები";
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
              .setTitle(`წარმატებით დაიბანა ${user.tag}`)
              .setTimestamp();
            message.channel.send(embed);
          })
          .catch((err) => {
            const embed = new MessageEmbed()
              .setColor("#ff4f4f")
              .setTitle(`❌ შენ არ გაქვს ამ ბრძანების უფლება!`);
            message.channel.send(embed);
          });
      } else {
        const embed = new MessageEmbed()
          .setColor("#ff4f4f")
          .setTitle(`❌ მომხმარებელი არ არსებობს სერვერზე`);
        message.channel.send(embed);
      }
    } else {
      const embed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle(`❌ მომხმარებელი არ არსებობს სერვერზე`);
      message.channel.send(embed);
    }
  }
  // Queue status template
  const status = (queue: any) =>
    `ხმის დონე: \`${queue.volume}%\` | ფილტრაცია: \`${
      queue.filter || "Off"
    }\` | ლუპი: \`${
      queue.repeatMode
        ? queue.repeatMode == 2
          ? "ყველა სია"
          : "მუსიკა"
        : "Off"
    }\` | აუტოჩართვა: \`${queue.autoplay ? "On" : "Off"}\``;

  // DisTube event listeners, more in the documentation page
  distube
    .on("playSong", (message, queue, song) =>
      message.channel.send(
        `ახლა ჩაირთო \`${song.name}\` - \`${
          song.formattedDuration
        }\`\nმოთხოვნილი იქნა: ${song.user.tag}\n${status(queue)}`
      )
    )
    .on("addSong", (message, queue, song) =>
      message.channel.send(
        `დაემატა ${song.name} - \`${song.formattedDuration}\` სიაში by ${song.user.tag} მიერ`
      )
    )
    .on("playList", (message, queue, playlist, song) =>
      message.channel.send(
        `ჩაირთო \`${playlist.name}\` playlist (${
          playlist.songs.length
        } songs).\nმოთხოვნილი იქნა: ${song.user.tag}\nახლა მიმდინარეობს \`${
          song.name
        }\` - \`${song.formattedDuration}\`\n${status(queue)}`
      )
    )
    .on("addList", (message, queue, playlist) =>
      message.channel.send(
        `დაემატა \`${playlist.name}\` ფლეილისტ (${
          playlist.songs.length
        } songs) სიაში \n${status(queue)}`
      )
    )
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
      let i = 0;
      message.channel.send(
        `**აირჩიე ქვევიდან პარამეტრი**\n${result
          .map(
            (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
          )
          .join("\n")}\n*შეიყვანე 60 წამში თორემ ბოტი გავა არხიდან*`
      );
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`შეწყდა ძიება`))
    .on("error", (message, e) => {
      console.error(e);
      message.channel.send("წარმოიშვა შეცდომა: " + e);
    });

  if (cmd === "play") {
    if (!message.member?.voice.channel)
      return message.channel.send("ჯერ შედით ხმოვან არხში.");
    if (!args[0]) return message.channel.send("შეიყვანეთ მუსიკის დასახელება.");

    distube.play(message, args.join(" "));
  }
  if (cmd === "leave") {
    if (!message.member?.voice.channel) return message.channel.send("ჯერ შედით ხმოვან არხში.");

    distube.stop(message);
    message.channel.send("ნახვამდის 🤍");
  }
});

client.login(process.env.TOKEN);
