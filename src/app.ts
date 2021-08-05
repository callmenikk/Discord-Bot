import {
  Client,
  Collection,
  ColorResolvable,
  GuildMember,
  Message,
  MessageEmbed,
  MessageMentions,
  Role,
  RoleResolvable,
  User,
  UserResolvable,
} from "discord.js";
import fetch from "node-fetch";
import { config } from "dotenv";
import { badWords } from "./badwords";
import { resolve } from "path/posix";

config({
  path: __dirname + "/.env",
});

type UserMessage = string | undefined;

interface QuoteInterface<T> {
  text: string;
  author: T;
}

interface Player {
  name: string;
  dice?: number | undefined;
}

const playerone: Player = {
  name: "",
  dice: undefined,
};

const playertwo: Player = {
  name: "",
  dice: undefined,
};

const client = new Client();

client.on("ready", () => {
  console.log("I'm Online");
});

client.on("message", async (message) => {
  const prefix: string = "!";

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
      `🏓 Latency is ${
        Date.now() - message.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`
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
    message.channel.send(
      " ```I only have\n!ping\n!quote\nI'm under Development Process, some new Features will be added soon ```  "
    );
  }
  if (cmd === "say") {
    if (message.deletable) message.delete();

    if (args.length < 1)
      message
        .reply("nothing to say")
        .then((m) => m.delete({ timeout: 5000, reason: "idk" }));

    if (args[0].toLowerCase() === "embed") {
      const userHEX: any = message.member?.displayHexColor;

      const embed = new MessageEmbed()
        .setColor(userHEX)
        .setDescription(args.slice(1).join(" "))
        .setTimestamp();
      message.channel.send(embed);
    }
  }
  if (cmd === "obamaballs") {
    message.channel.send(
      "https://media.tenor.com/images/c6755016355961ff8f9a4301d4bbb07d/tenor.png"
    );
  }
  if (cmd === "sussybaka") {
    message.channel.send(
      "https://cdn.discordapp.com/attachments/871824935016865858/871846793879638087/static-assets-upload2210855008168198565.jpg"
    );
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
      .setDescription("Some description here")
      .addFields(
        {
          name: "Joined",
          value: joinedDate,
          inline: true,
        },
        {
          name: "Registered",
          value: createDate,
          inline: true,
        },
        {
          name: `Roles [${userRolesLength?.length}]`,
          value: Roles,
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter(message.author.id, userProfile);

    message.channel.send(exampleEmbed);
  }
  if (cmd === "roll") {
    const dice: number = Math.floor(Math.random() * 5) + 1;

    message.channel.send(`You get the ${dice}`);
  }
  if (cmd === "covid") {
    fetch("https://api.covid19api.com/summary")
      .then((response) => response.json())
      .then((stats) => {
        const CovidData: any = stats.Global;

        const embed = new MessageEmbed()
          .setColor("#4f1e1b")
          .setTitle("Covid-19 Global Stats")
          .setThumbnail(
            "https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg"
          )
          .addFields(
            {
              name: "New Confirmed",
              value: String(CovidData.NewConfirmed).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "Total Confirmed",
              value: String(CovidData.TotalConfirmed).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "New Deaths",
              value: String(CovidData.NewDeaths).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: true,
            },
            {
              name: "New Recovered",
              value: String(CovidData.NewRecovered).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              ),
              inline: false,
            },
            {
              name: "Total Recovered",
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
      message.channel.send("You have no permissions to do that");
      return;
    }

    let mentionMember: GuildMember | undefined =
      message?.mentions?.members?.first();
    if (!mentionMember) {
      message.channel.send("Please Mention Which Member Must Be Kicked");
      return;
    }
    let authorHighestRole: number = message.member.roles.highest.position;
    let mentionHighestRole: number = mentionMember.roles.highest.position;

    if (mentionHighestRole >= authorHighestRole) {
      message.reply("You can`t kick members with equal or higher position");
      return;
    }

    if (!mentionMember.kickable) {
      message.reply("I have no permissions to kick this user");
      return;
    }
    mentionMember
      .kick()
      .then(() =>{
        let rejectEmbed = new MessageEmbed()
          .setColor("#52ff4d")
          .setTitle(`Member ${mentionMember?.user.tag} has kicked out from server`)
          .setFooter(message.author.id)
          .setTimestamp();

        message.channel.send(rejectEmbed);
      })
      .catch(console.error);
  }
  if (cmd === "mute") {
    if (!message.member?.hasPermission("MANAGE_MESSAGES")) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("You Don't have permission to do that")
        .setFooter(message.author.id)
        .setTimestamp();

      message.channel.send(rejectEmbed);
    }
    const target: any = message.mentions.users.first();
    if (target) {
      const mainRole: any = message.guild.roles.cache.find(
        (role) => role.name === "member"
      );
      const muteRole: any = message.guild.roles.cache.find(
        (role) => role.name === "Muted"
      );

      let memeberTarget = message.guild.members.cache.get(target.id);
      memeberTarget?.roles.remove(mainRole?.id);
      memeberTarget?.roles.add(muteRole?.id);

      message.channel.send(`${target} has been muted`);
    } else {
      message.reply("User Not Found");
    }
  }
  if (cmd === "unmute") {
    if (!message.member?.hasPermission("MANAGE_MESSAGES")) {
      let rejectEmbed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle("You Don't have permission to do that")
        .setFooter(message.author.id)
        .setTimestamp();

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

      message.channel.send(`${target} has been unmuted`);
    }
  }
  if (cmd === "ban") {
    let banReason: string = args.join(" ").slice(22);
    if(!banReason){
      banReason = "Not Mentioned"
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
              .setTitle(`Successfully banned ${user.tag}`)
              .setTimestamp();
            message.channel.send(embed)
          })
          .catch((err) => {
            const embed = new MessageEmbed()
              .setColor("#ff4f4f")
              .setTitle(`❌ You Do Not Have Permission To Do That`)
              .setTimestamp();
            message.channel.send(embed);
          });
      } else {
        const embed = new MessageEmbed()
          .setColor("#ff4f4f")
          .setTitle(`❌ User Doesn't Exist`)
          .setTimestamp();
        message.channel.send(embed);
      }
    } else {
      const embed = new MessageEmbed()
        .setColor("#ff4f4f")
        .setTitle(`❌ User Doesn't Exist`)
        .setTimestamp();
      message.channel.send(embed);
    }
  }
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  for (let i = 0; i < badWords.length; i++) {
    if (message.content.toLowerCase().includes(badWords[i])) {
      if (message.deletable) message.delete();
      message.reply("Do Not Use Bad Words");
    }
  }
});

client.login(process.env.TOKEN);
