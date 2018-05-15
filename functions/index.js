'use strict';

const functions = require('firebase-functions');
const {
    dialogflow,
    BasicCard,
    Button,
    SimpleResponse,
    BrowseCarousel,
    BrowseCarouselItem,
    Permission,
    Confirmation,
    MediaObject,
    Image,
    Suggestions,
    NewSurface
} = require('actions-on-google');

const app = dialogflow({
    debug: true
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent('HeroInfo', (conv) => {
    showHeroInfo(conv, conv.parameters['hero']);
});

app.intent('Start - yes - Hero response', (conv) => {
    showHeroInfo(conv, conv.parameters['hero']);
});

function showHeroInfo(conv, heroSelected) {
    console.log("Starting hero intent v1.3");
    console.log("Contexts: ", conv.contexts);
    console.log("Parameters: ", conv.parameters);

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

app.intent("Ask users Name", (conv) => {
    const options = {
        context: 'To address you by name',
        permissions: ['NAME'],
    };
    conv.ask(new Permission(options));
});

app.intent('Permission confirmation', (conv, input, granted) => {
    if (granted) {
        const name = conv.user.name;
        conv.ask(`Hi ${name.display}, thank you for providing your name`);
    } else {
        conv.ask('Ok, you can provide your name another time :(');
    }
});

app.intent("Save Favorite hero", function (conv, params) {
    const hero = params['hero'];
    conv.data.hero = hero;
    conv.ask(new Confirmation(`Should I remember that your favorite hero is ${hero}?`))
});

app.intent("remember_hero", function (conv, params, confirmation) {
        if (confirmation) {
            const hero = conv.data.hero;
            conv.user.storage.hero = hero;
            conv.close(`Amazing, your hero ${hero} has been saved, see you later`);
        } else {
            conv.close('Ok :( goodbye');
        }
    }
);

app.intent("Read Favorite hero", function (conv) {
    conv.ask(`Your favorite hero is ${conv.user.storage.hero}`);
});

app.intent("Default Welcome Intent", function (conv) {
    if (conv.user.last.seen) {
        const hero = conv.user.storage.hero;
        if (hero) {
            conv.ask(`Welcome back, your favorite hero is ${hero}`);
        } else {
            conv.ask('Welcome back');
        }
    } else {
        conv.ask('Welcome to the super hero game');
    }
});

app.intent("Play music", function (conv) {
    conv.ask("Here is a music");
    conv.ask(new MediaObject({
        name: 'Drums sample',
        url: 'https://sampleswap.org/mp3/artist/5101/Peppy--The-Firing-Squad_YMXB-160.mp3',
        description: 'Simple drums sample',
        image: new Image({
            url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Juke_joint_drummer.jpg',
            alt: 'Wikipedia drums'
        })
    }));

    conv.ask(new Suggestions(
        "Who is my favorite hero",
        "Goodbye"
    ))
});

app.intent("Show info about favorite hero", function (conv) {
    if (conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        const hero = conv.parameters['hero'];
        conv.user.storage.hero = hero;
        showHeroInfo(conv, hero);
    } else {
        conv.ask(new NewSurface({
            capabilities: ["actions.capability.SCREEN_OUTPUT"],
            context: "This device doesn't have a screen.",
            notificationTitle: "Caster IO Dialog continuation"
        }));
    }
});

app.intent("New surface", function (conv) {
    const hero = conv.user.storage.hero;
    showHeroInfo(conv, hero);
});