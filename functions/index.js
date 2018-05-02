'use strict';

const functions = require('firebase-functions');
const {
    dialogflow,
    BasicCard,
    Button,
    SimpleResponse,
    BrowseCarousel,
    BrowseCarouselItem
} = require('actions-on-google');

const app = dialogflow({
    debug: true
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent('HeroInfo', (conv) => {
    showHeroInfo(conv);
});

app.intent('Start - yes - Hero response', (conv) => {
    showHeroInfo(conv);
});

function showHeroInfo(conv) {
    console.log("Starting hero intent v1.3");
    console.log("Contexts: ", conv.contexts);
    console.log("Parameters: ", conv.parameters);

    let heroSelected = conv.parameters['Hero'];
    console.log("heroSelected: ", heroSelected);

    switch (heroSelected) {
        case 'thor':
            thor();
            break;
        case 'hulk':
            hulk();
            break;
        case 'ironman':
            ironMan();
            break;
        default:
            notFound();
    }

    function thor() {
        console.log("Thor called");

        conv.ask(new SimpleResponse({
            speech: "Thor is son of odin!",
            text: "Thor is son of odin!"
        }));
    }

    function hulk() {
        console.log("Hulk called");

        conv.ask("More info about Hulk");
        conv.ask(new BasicCard({
            title: "Hulk",
            image: {
                url: "https://upload.wikimedia.org/wikipedia/en/5/59/Hulk_%28comics_character%29.png",
                accessibilityText: "Hulk Smash!"
            },
            buttons:
                new Button({
                    title: "More info",
                    url: "https://en.wikipedia.org/wiki/Hulk_(comics)"
                })
        }));
    }

    function ironMan() {
        console.log("IronMan called");

        conv.ask("Iron Man and his enemies:");
        conv.ask(new BrowseCarousel({
            items: [
                new BrowseCarouselItem({
                    title: "Mandarin",
                    image: {
                        url: "https://upload.wikimedia.org/wikipedia/en/d/dd/Mandrin1.jpg",
                        accessibilityText: "Mandarin"
                    },
                    url: "https://en.wikipedia.org/wiki/Mandarin_(comics)"
                }),
                new BrowseCarouselItem({
                    title: "Doctor Doom",
                    image: {
                        url: "https://upload.wikimedia.org/wikipedia/en/7/79/Doctor_Doom_Thor_Vol_1_600.png",
                        accessibilityText: "Doctor Doom"
                    },
                    url: "https://en.wikipedia.org/wiki/Doctor_Doom"
                }), new BrowseCarouselItem({
                    title: "Spymaster",
                    image: {
                        url: "https://upload.wikimedia.org/wikipedia/en/8/88/Spymaster.png",
                        accessibilityText: "Spymaster"
                    },
                    url: "https://en.wikipedia.org/wiki/Spymaster_(comics)#Spymaster_I"
                })
            ]
        }));
    }

    function notFound() {
        conv.ask("Hero not found");
    }
}
