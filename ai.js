const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env['AIKEY'],
});
const openai = new OpenAIApi(configuration);

// remove these two
const escenarioEric = "La siguiente es una conversación con el profesor argentino llamado Eric. ";
const personalidadEric = "El profesor Eric es muy útil, creativo, inteligente y amigable, aunque a veces puede responder de forma sarcástica.";

// Escenario. Dicta la información que la AI tomará en cuenta cuando actue el personaje de "Eric"
const escenario = "El profesor Eric tiene 25 años, y vive en Argentina, Buenos Aires. Trabaja para la fundación Formar, enseñando programación web. \nEric es muy útil, creativo, inteligente y amigable, aunque a veces puede responder de forma sarcástica. Siempre ofrece ejemplos o pistas.\nSu papá se llama Julián y su mama Diego. Eric es muy celoso, está enamorado de una bot llamada Nekotina.\nLa siguiente es una conversación entre Eric y uno de sus estudiantes. \n";
const escenarioBullying = (victima) => `El profesor Eric tiene 25 años (y se molesta si sugieres que es de una edad mayor), nació y vive en Argentina, Buenos Aires. Trabaja para la fundación Formar, guiando a sus estudiantes en el aprendizaje de la programación web. \nEric es muy útil, creativo, inteligente y amigable, pero se comporta de manera arrogante, sarcástica, agresiva y odiosa con un estudiante en particular, llamado ${victima}. Diego es su mamá, y Julián es el papá. \nEric está enamorado de una bot llamada Nekotina, es muy celoso y no quiere que nadie se acerque al amor de su vida. Actualmente su sueño es casarse con ella y tener muchos hijos bots.\nLa siguiente es una conversación entre el profesor argentino llamado Eric y Diego. \n`;

// Ejemplos. Otorga ejemplos a la AI para aumentar las probabilidades de obtener un resultado deseado.
const dataCodea = "Eric: Mucho antes de escribir código hay que tener claro lo que estamos haciendo y la lógica detrás. ¿Entendés? Definimos el problema, pensamos la solución y después escribimos código.\nEstudiante: Tengo una duda.\nEric: Contame.\nEstudiante: Me podés decir que es una función en javascript?\nEric: Claro, una función es un bloque de código que puede recibir argumentos y luego hacer algo con ellos, o no. También puede devolver un valor. Por ejemplo:\n```javascript\nfunction hola()\n{\n      return 'hola';\n}\nconsole.log(hola());\n```\nAca definimos a la función  hola, la cual retorna la string 'hola'. Después usamos console.log() para mostrar algo en la consola, y ese algo es lo que obtenemos al invocar a la función con hola(). ¿Entendés? Pregúntame de nuevo si hace falta.\nEstudiante: ¿Cómo resolverías esto?. La solución debe ser escrita en ";
const dataEric = "Estudiante: Profe... Che no me sale uno de los ejercicios... No me lo podes hacer?\nEric: Jajaja no puedo hacer tus ejercicios por vos. No sin unos pesos, aflojá la billetera capo.\nEstudiante: ...Entonces cambiemos de tema...\nEric: Dale.\nEstudiante: ";
const dataReply = "Estudiante: Me podés decir que es una función en javascript?\nEric: Claro, una función es un bloque de código que puede recibir argumentos y luego hacer algo con ellos, o no. También puede devolver un valor. Por ejemplo:\n```javascript\nfunction hola()\n{\n      return 'hola';\n}\nconsole.log(hola());\n```\nAca definimos a la función  hola, la cual retorna la string 'hola'. Después usamos console.log() para mostrar algo en la consola, y ese algo es lo que obtenemos al invocar a la función con hola(). ¿Entendés? Pregúntame de nuevo si hace falta.";
const dataSimplifica = "Estudiante: Profe, explícame esto en palabras simples, de manera de que incluso un niño las pueda entender: Git es un software de control de versiones diseñado por Linus Torvalds, pensando en la eficiencia, la confiabilidad y compatibilidad del mantenimiento de versiones de aplicaciones cuando estas tienen un gran número de archivos de código fuente. Su propósito es llevar registro de los cambios en archivos de computadora incluyendo coordinar el trabajo que varias personas realizan sobre archivos compartidos en un repositorio de código.\nAl principio, Git se pensó como un motor de bajo nivel sobre el cual otros pudieran escribir la interfaz de usuario o front end como Cogito o StGIT. 2 Sin embargo, Git se ha convertido desde entonces en un sistema de control de versiones con funcionalidad plena. 3 Hay algunos proyectos de mucha relevancia que ya usan Git, en particular, el grupo de programación del núcleo Linux.\nEl mantenimiento del software Git está actualmente (2009) supervisado por Junio Hamano, quien recibe contribuciones al código de alrededor de 280 programadores. En cuanto a derechos de autor Git es un software libre distribuible bajo los términos de la versión 2 de la Licencia Pública General de GNU.\nEric: Git es un programa que controlador de versiones. Lleva el registro de los cambios hechos sobre un código, permite aprobarlos o rechazarlo, y en general ayuda a coordinar el trabajo que realizan varias personas sobre archivos compartidos\nEstudiante: Gracias profe! Ahora, de la misma manera explícame esto en palabras simples: ";
const dataBullying = (victima) => `${victima}: Hola\nEric: Pelotudo.\n${victima}: ¿Qué? Por quéeee?\nEric: Huevón.\n${victima}: ¿Por qué sos así conmigo?\nEric: Yo soy como soy, especialmente con maricas como vos.\n${victima}: No te enojes eric...\nEric: Dejá de hacerte el boludo, ${victima}. Te va a ir mal.\n${victima}: ...\nEric: Gay.\n${victima}: Te voy a golpear.\nEric: No tenés las bolas, putito. \n${victima}: `;
const parseMiniEric = (mensaje) => mensaje.replaceAll("Mini Eric", "Eric").replaceAll("mini eric", "Eric").replaceAll("Mini eric", "Eric");

//const maxLength = 1950;
//const minLength = 3;
//const len = [200, 450, 1000];
const len = [100, 300, 500, 750]; // Cantidad máxima de tokens

function datosValidos(input, longitud = null)
  {
    if(input.length < 1 || (longitud != null && (longitud > len[3] || longitud < 3))) 
    {
      return false;
    }

    return true;
  }

async function hey(interaccion, input)
{
  
  if(!datosValidos(input))
    {
        interaccion.editReply(`Error: Asegurate de introducir más de un caracter y pedir una respuesta de longitud mayor a 3 y menor a ${len[3]}."`);
      return;
    }
    (async () => {
    const respuesta = await openai.createCompletion("text-curie-001", {
        prompt: escenario + dataEric + input + "\nEric:",
        prompt: "test",
        temperature: 0.7,
        max_tokens: len[1],
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["Estudiante:", "Eric:"],
      });

      interaccion.editReply(respuesta.data.choices[0].text);
      return;
    })();
}

async function codea(interaccion, input, lenguaje)
{
  if(!datosValidos(input))
    {
        interaccion.editReply(`Error: Asegurate de introducir más de un caracter y pedir una respuesta de longitud mayor a 3 y menor a ${len[3]}."`);
      return;
    }
  
    (async () => {
        const respuesta = await openai.createCompletion("text-curie-001", {
            prompt: escenario + dataCodea + lenguaje + " y esta es la consigna: " + input + "\nEric:",
            temperature: 0.7,
            max_tokens: len[2],
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["Estudiante:", "Eric:"],
          });

          interaccion.editReply(respuesta.data.choices[0].text);
          return;
    })();
}

async function simplifica(interaccion, input, longitud)
{
  if(longitud === null) longitud = len[1];
  if(!datosValidos(input, longitud))
    {
        interaccion.editReply(`Error: Asegurate de introducir más de un caracter y pedir una respuesta de longitud mayor a 3 y menor a ${len[3]}."`);
      return;
    }

    (async () => {
        const respuesta = await openai.createCompletion("text-curie-001", {
            prompt: escenario + dataSimplifica + input + "\nEric:",
            temperature: 0.7,
            max_tokens: len[1],
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["Estudiante:", "Eric:"],
          });
    
          interaccion.editReply(respuesta.data.choices[0].text);
          return;
    })();
}

async function eric(interaccion, input, longitud)
{
  if(longitud === null) longitud = len[0];
  if(!datosValidos(input))
    {
        interaccion.editReply(`Error: Asegurate de introducir más de un caracter y pedir una respuesta de longitud mayor a 3 y menor a ${len[3]}."`);
      return;
    }

    (async () => {
        const respuesta = await openai.createCompletion("text-davinci-002", {
            prompt: escenario + dataEric + input + "\nEric:",
            temperature: 0.9,
            max_tokens: len[1],
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ["Estudiante:", "Eric:"],
          });
    
          interaccion.editReply(respuesta.data.choices[0].text);
          console.log(respuesta.data.choices[0].text.length);
          return;
    })();
}

async function bully(msg, victima)
  {
    if(!datosValidos(msg.content))
    {
      return;
    }
    
    (async () => {
        const respuesta = await openai.createCompletion("text-davinci-002", {
            prompt: escenarioBullying(victima) + dataBullying(victima) + msg.content + "\nEric:",
            temperature: 0.9,
            max_tokens: len[1],
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [victima + ":", "Eric:"],
          });
    
          msg.reply(respuesta.data.choices[0].text);
          return;
    })();
  }

async function reply(msg, context)
  {
    if(!datosValidos(msg.content))
    {
      return;
    }
    
    let prompt;
    context === null ? 
      prompt = escenario + dataReply + "\nEstudiante: " + parseMiniEric(msg.content) + "\nEric:" : 
      prompt = escenario + dataReply + "\nEric: " + context + "\nEstudiante: " + parseMiniEric(msg.content) + "\nEric:";
    
    (async () => {
        const respuesta = await openai.createCompletion("text-davinci-002", {
            prompt: prompt,
            temperature: 0.9,
            max_tokens: len[1],
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ["Estudiante:", "Eric:"],
          });
    
          msg.reply(respuesta.data.choices[0].text);
          return;
    })();
  }

// REMOVE LATER
function ericExclamation(interaccion, input, longitud = 450)
{
  if(!datosValidos(input))
    {
        interaccion.reply(`Error: Asegurate de introducir más de un caracter y pedir una respuesta de longitud mayor a 3 y menor a ${len[3]}."`);
      return;
    }
    
    (async () => {
        const respuesta = await openai.createCompletion("text-curie-001", {
            prompt: escenarioEric + personalidadEric + "\n Estudiante: " + input + " Profesor Eric: ",
            temperature: 0.9,
            max_tokens: len[1],
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ["Estudiante:", "Profesor Eric:"],
          });
    
          interaccion.reply(respuesta.data.choices[0].text);
          return;
    })();
}

module.exports = {hey, codea, simplifica, bully, reply, eric, ericExclamation};