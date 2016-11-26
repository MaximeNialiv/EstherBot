'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Hhhmm...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say(`Bonjour, je m'appelle CYOP, pour Choose Your Own Path, et je peux te raconter une histoire dont tu es le héros ;) \n Commence simplement par la page 0 en cliquant sur le bouton correspondant. Navigues entre les pages en cliquant sur le bouton correspondant ou en tapant le numéro de page souhaité.\n %[0](postback:lol) `)
                .then(() => 'speak');
        }
    },
    speak: {
        prompt: (bot) => bot.say(`Avant de commencer à discuter, je dois te prévenir, je comprends les mots-clés, mais les phrases m\'échappent... \n Mais ne t\'inquiètes pas ${name} , on va bien arriver à discuter :) `),
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(` Désolé ${name}... Je ne suis qu'un BOT, qu'un reflet... Je ne comprends pas tout, utilise des mots simples, ou les boutons proposés`).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
    /* shifumi: {
        receive: (bot, message) => {
            let upperText = message.text.trim().toUpperCase();
            function processMessage() {
                var computerChoice = Math.random();
                    if (computerChoice < 0.34) {computerChoice = "PAPIER";
                    } else if(computerChoice <= 0.67) {computerChoice = "CAILLOU";
                    } else {computerChoice = "CISEAUX";
                };
            }
            case "PAPIER ": 
                if (computerChoice === "CISEAUX"){
                    return bot.say (`scissors wins`); 
                }else{
                    return bot.say (`paper wins`);
                };
            case "CAILLOU": 
                if (computerChoice === "CISEAUX"){
                    return bot.say (`rocks wins`); 
                }else {
                    return bot.say (`paper wins`);
                };
            case "CISEAUX": 
                if (computerChoice === "PAPIER "){
                    return bot.say (`scissors wins`);
                }else{
                    return bot.say (`rocks wins`);
                    
                };
                }
            }
            
        }
    }, */
});
