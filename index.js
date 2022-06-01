const { Client, Intents, MessageEmbed, Constants } = require('discord.js'); // Importamos los objetos 'Client' e 'Intents' de Discord.js
const keepAlive = require("./server"); // Importar función para que eric no se muera
const ai = require("./ai.js");

// Creamos una variable para el usuario de discord (bot). Intents = Qué info necesita el bot para funcionar
const cliente = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = process.env['TOKEN']; // Contiene la información de acceso a la cuenta del bot

// Aquí van las biblias de texto que mostramos al usar ciertos comandos
const lenguajesSoportados = ['javascript', 'js', 'csharp', 'html', 'css', 'typescript', 'java', 'mysql', 'php', 'python', 'c', 'c++', 'swift', 'ruby', 'rust', 'go', 'r', 'perl', 'pascal', 'delphi'];

const miniEricDescripcion = "Mini Eric es un bot escrito en **JavaScript** creado con el propósito de servir a la Comisión 15.";
const botDescripcion = "Un bot es un algoritmo que realiza acciones pre-determinadas al recibir ciertos comandos.\n Puedes ver todos los comandos disponibles escribiendo **/** (sin enviar) y haciendo click sobre el icono de Mini Eric.\n\nAdemás, puedes compartir código al escribir el signo ! seguido del lenguaje de programación.\n\n*Ejemplo\n!javascript console.log('Hola mundo!');*";
const aiDescripcion = "Una Inteligencia Artificial (IA) es un sistema que aprende de una forma similar a la que nosotros humanos lo hacemos.\n\nGracias a OpenAI, puedes hablar con Mini Eric, pedirle que escriba código en el lenguaje que quieras, que te explique conceptos de programación, y prácticamente todo lo que te imagines. Haz la prueba usando /hey o /eric. \n\n*Si te interesa ver el código dentro de Mini Eric, usa el comando /codigo.*"
const footer = "Por cualquier problema o duda, puedes escribirme por Discord (Julián) o enviarme un email a j.gakusei11@gmail.com"

const index = "https://pastebin.com/kMADaBGT";
const server = "https://pastebin.com/fRA3m3zh";
const update = "6 de Mayo 2022";
const bullyVictima = { nombre: "Diego", username: "UshioVII", probabilidadBullying: 5};

// Imagenes
const miniEric = "https://i.imgur.com/yD8EwoR.png";
const miniEricMantenimiento = "https://i.imgur.com/P82CeQT.png";
const frustracion = "https://i.imgur.com/QECf80K.gif";
const pfp = "https://i.imgur.com/2hcHtRr.jpeg";

function random(min, max)
{
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function getChance(probabilityPercent)
  {
    if(random(1, 100) <= probabilityPercent)
    {
      return true;
    }
    
    return false;
  }

// Evento. Se realiza lo que está aquí adentro cuando el bot inicia sesión
cliente.on("ready", () => 
  { 
    console.log(`Sesión iniciada como ${cliente.user.tag}!`);

    ///////////////////////////////////////////////////////////////////////// Comandos /
    const testGuild = "642590523550597153"; // Guild que uso para realizar pruebas
    const guild = cliente.guilds.cache.get(testGuild); // Requiero la ID de mi guild de pruebas
    let comandos;

    //if(guild) // Si no comento la línea de código de 'const testGuild', los comandos solo aplican en mi guild de prueba
    if(false)
    {
      comandos = guild.commands;
    }
    else // Si la línea 'const testGuild' está comentada, entonces los comandos aplicaran a todos los grupos discord
    {
      comandos = cliente.application?.commands;
    }
    
    //// Comandos (definición para mostrar al escribir / en el chat)
    comandos?.create(
      {
        name: 'ping',
        description: 'Responde con "pong".',
      });

    comandos?.create(
      {
        name: 'lenguajes',
        description: 'Muestra los lenguajes soportados para el bloque de código.',
      });

    comandos?.create(
      {
        name: 'ayuda',
        description: 'Muestra información de ayuda, incluyendo comandos ! que se pueden usar e información de contacto.',
      });

    comandos?.create(
      {
        name: 'frustracion',
        description: 'Mini eric te ayuda a expresar tu frustración.',
      });

    comandos?.create(
      {
        name: 'codigo',
        description: '¿Tienes curiosidad sobre cómo funciona el código de Mini Eric? ¡Echa un vistazo!',
      });

    comandos?.create(
      {
        name: 'hey',
        description: '¿Necesitas ayuda con algo? ¿Quieres que Mini Eric haga algo por ti? ¡Pidele lo que sea!',
        options: [
          {
            name: "mensaje",
            description: "Escribe lo queres pedirle a Mini Eric.",
            required : true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
          }
        ]
      });
    
    comandos?.create(
      {
        name: 'codea',
        description: '¿Necesitas que Mini Eric escriba código por ti? ¡Explicale qué quieres y en qué lenguaje!',
        options: [
          {
            name: "consigna",
            description: "Escribe lo queres pedirle a Mini Eric.",
            required : true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
          },
          {
            name: "lenguaje",
            description: "Escribe el lenguaje que quieres que mini eric use.",
            required : true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
          }
        ]
      });

    comandos?.create(
      {
        name: 'simplifica',
        description: 'Dale un bloque de texto complicado y Mini Eric te lo va a explicar en palabras simples.',
        options: [
          {
            name: "mensaje",
            description: "Escribe lo queres que Mini Eric simplifique.",
            required : true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
          },
          {
            name: "longitud",
            description: "Escribe cuántos carácteres como máximo debería usar mini eric",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
          }
        ]
      });

    comandos?.create(
      {
        name: 'eric',
        description: '¿Quieres conversar con Mini Eric? ¿Tienes un pédido complejo? ¡Usa este comando!',
        options: [
          {
            name: "mensaje",
            description: "Escribele tu mensaje para Mini Eric.",
            required : true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
          },
          {
            name: "longitud",
            description: "Escribe cuántos carácteres como máximo debería usar mini eric",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
          }
        ]
      });
  });


//////////////////////////////////////////////////////////////// Comandos / (Procesos)
cliente.on("interactionCreate", async (interaction) => 
  {
    if(!interaction.isCommand())
    {
      return;
    }

    const { commandName, options } = interaction;

    if(commandName === "ping")
    {
      interaction.reply("pong");
    }
    else if (commandName === "frustracion")
    {
      const gif = new MessageEmbed()
        .setColor('#D82126')
	      .setImage(frustracion);

      interaction.reply(
        {
          embeds: [gif]
        })
    }
    else if(commandName === "lenguajes")
    {
      let lenguajes = "Puedes enviar bloques de código en los siguientes lenguajes:";

      for(let i = 0; i < lenguajesSoportados.length; i++)
        {
          lenguajes += "\n - **" + lenguajesSoportados[i] + "**";
        }
      lenguajes += "\n Simplemente escribe **!** seguido del lenguaje y un espacio, y tu código. \n         *Ejemplo: !javascript let test = 'Prueba';*";
      
      interaction.reply(
        {
          content: lenguajes,
          ephemeral: true,
        });
    }
    else if(commandName === "ayuda")
    {
      const ayudaEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Mini Eric')
        .setThumbnail(miniEric)
        .addFields(
          { name: '¿Qué es Mini Eric?', value: miniEricDescripcion },
          { name: '¿Qué es un bot?', value: botDescripcion },
          { name: 'Además, Mini Eric implementa una IA', value: aiDescripcion },
        )
        .setImage(pfp)
        .setFooter(
          { text: footer }
        );

      interaction.reply(
        {
          embeds: [ ayudaEmbed ],
          ephemeral: true
        }
      );
    }
    else if (commandName === "codigo")
    {
      const codigo = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Mini Eric contiene los siguientes archivos')
        .setImage(miniEricMantenimiento)
        .addFields(
            {name: 'index.js', value: index},
            {name: 'server.js', value: server}
        )
        .setFooter({text: "Última actualización: " + update});

      interaction.reply(
        {
          embeds: [codigo],
          ephemeral: true
        })
    }
    else if (commandName === "hey")
    {
      await interaction.deferReply();
      await ai.hey(interaction, options.getString("mensaje"));
    }
    else if (commandName === "codea")
    {
      await interaction.deferReply();
      await ai.codea(interaction, options.getString("consigna"), options.getString("lenguaje"));
    }
    else if (commandName === "simplifica")
    {
      await interaction.deferReply();
      await ai.simplifica(interaction, options.getString("mensaje"), options.getInteger("longitud"));
    }
    else if (commandName === "eric")
    {
      await interaction.deferReply();
      await ai.eric(interaction, options.getString("mensaje"), options.getInteger("longitud"));
    }
  });

//////////////////////////////////////////////////////////////////////////////////// Comandos !
// Evento. Se realiza lo que está adentro cuando alguien envia un mensaje
cliente.on("messageCreate", msg => 
  {
    if(msg.author.username === bullyVictima.username && getChance(bullyVictima.probabilidadBullying))
    {
      ai.bully(msg, bullyVictima.nombre);
    }
    if(msg.content.toLowerCase().includes("mini eric") || msg.content.toLowerCase().includes("minieric"))
    {
      ai.reply(msg, null);
    }
    if(msg.mentions.has(cliente.user))
    {
      msg.fetchReference()
        .then((contextMsg) => 
          {
            if(msg.author != cliente.user) 
            {
              ai.reply(msg, contextMsg.content);
            }
          })
        .catch(() => ai.reply(msg, null));
    }
    
    // Si mensaje no comienza con ! o no contiene ' ', omitir lo demás y no devolver nada.
    if(!msg.content.startsWith('!') || !msg.content.includes(' ')) return;
    const comando = msg.content.slice(1, msg.content.indexOf(' ')).toLowerCase(); // guardo el nombre del comando

    if(msg.content.length <= comando.length + 2) return; // Si no tiene contenido, omitir lo demás y no devolver nada.
    const contenido = msg.content.slice(comando.length + 2); // guardo el contenido adjunto al comando
    
    if(lenguajesSoportados.includes(comando))
    {
      msg.channel.send("```" + comando + "\n" + contenido + "```");
      msg.delete();
    }
    else if(comando === "eric")
    {
      ai.ericExclamation(msg, contenido);
    }
  });

/////////////////////////////////////////////////////////////////////////////////////////////////

keepAlive(); // Función para evitar que eric se muera 
cliente.login(token); // Función para iniciar sesión con la cuenta del bot