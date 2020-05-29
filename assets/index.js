const canvasWidth = 640 * 2;
const canvasHeight = 360 * 2;
var Command;
(function (Command) {
    Command["None"] = "none";
    Command["Start"] = "start";
    Command["Up"] = "up";
    Command["Down"] = "down";
    Command["Left"] = "left";
    Command["Right"] = "right";
})(Command || (Command = {}));

const speechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition);
const homonyms = new Map();
homonyms.set(Command.Start, ['stop', 'tart', 'next']);
homonyms.set(Command.Left, ['lift', 'lyft', 'let', "let's", "late", "list", "west", "reflect", "like", "lights"]);
homonyms.set(Command.Right, ['write', 'wright', 'bright', "east", "fright"]);
homonyms.set(Command.Down, ["don't know", "don't", "doan", "done", "dumb", "dawn", "$", "south", "sauce", "twown", "on", "donna", "down", "doll"]);
homonyms.set(Command.Up, ['oak', 'hope', "north", "notes", "nose"]);
function matchCommands(cmd, msg) {
    for (const text of homonyms.get(cmd)) {
        if (msg.indexOf(text) === -1)
            continue;
        return msg.replace(text, cmd);
    }
    return msg;
}
function process(msg) {
    let txt = msg.toLowerCase().trim();
    for (const cmd of homonyms.keys()) {
        txt = matchCommands(cmd, txt);
    }
    return txt.trim().split(' ').filter(x => homonyms.has(x)).map(x => x);
}
function voiceRecognitionStart(callback) {
    const recognition = new speechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;
    recognition.interimResults = true;
    // let processed = 0
    // recognition.onaudiostart = (evt) => console.log('onaudiostart', evt)
    // recognition.onaudioend = (evt) => console.log('onaudioend', evt)
    // recognition.onerror = (evt) => console.log('onerror', evt)
    recognition.onend = () => {
        // console.log('onend', evt)
        recognition.start();
    };
    recognition.onresult = function (evt) {
        // if (evt.resultIndex <= processed) return
        var interim_transcript = '';
        var final_transcript = '';
        var requiredConfidence = 0.75;
        for (var i = evt.resultIndex; i < evt.results.length; ++i) {
            if (evt.results[i].confidence <= requiredConfidence)
                continue;
            if (evt.results[i].isFinal) {
                final_transcript += evt.results[i][0].transcript;
            }
            else {
                interim_transcript += evt.results[i][0].transcript;
            }
        }
        console.log(evt, `${interim_transcript} || ${final_transcript} => ${process(final_transcript)}`);
        let resInter = process(interim_transcript);
        if (resInter && resInter.length > 0) {
            recognition.abort();
            // processed = evt.resultIndex
            return callback(resInter);
        }
        let resFinal = process(final_transcript);
        if (resFinal && resFinal.length > 0) {
            recognition.abort();
            // processed = evt.resultIndex
            return callback(resFinal);
        }
    };
    recognition.start();
}

var levelIntro = {
    player: { x: -5, y: -5, visible: false },
    blocks: [],
    texts: [
        {
            x: 0.5,
            y: 0.5,
            value: `Ready to Rumble !?`,
            size: 40,
            animStrength: 0.2,
            animDuration: 0.05,
            voice: true
        },
        {
            x: 0.5,
            y: 0.85,
            value: `say "Start" to ... start !`,
            size: 18
        }
    ]
};

var levelCredits = {
    player: { x: -5, y: -5, visible: false },
    blocks: [],
    texts: [
        {
            x: 0.5,
            y: 0.5,
            value: `Congratulation !`,
            size: 40,
            animStrength: 0.2,
            animDuration: 0.05,
            voice: 0.05
        },
        {
            x: 0.5,
            y: 0.65,
            value: `You got it :p`,
            size: 24,
            animStrength: 0.2,
            animDuration: 0.05
        },
        {
            x: 0.88,
            y: 0.98,
            value: `say "Next" to continue`,
            size: 14,
            animStrength: 0.2,
            animDuration: 0.05
        },
        {
            x: 0.88,
            y: 0.98,
            value: `OK Google, tell me a joke !`,
            visible: false,
            voice: 2
        },
        {
            x: 0.88,
            y: 0.98,
            value: `Alexa, tell me a joke !`,
            visible: false,
            voice: 10
        }
    ]
};

var levelChallenge = {
    player: { x: -5, y: -5, visible: false },
    blocks: [],
    texts: [
        {
            x: 0.5,
            y: 0.5,
            value: `OK you got it`,
            size: 30,
            animStrength: 0.2,
            animDuration: 0.05,
            voice: true
        },
        {
            x: 0.88,
            y: 0.98,
            value: `say "Next" to continue`,
            size: 14,
            animStrength: 0.2,
            animDuration: 0.05
        }
    ]
};

var level1 = {
    player: { x: 3, y: 2, visible: true },
    blocks: [
        { id: "wall1", x: 6, y: 2, visible: false },
        { id: "wall2", x: 6, y: 1, visible: false },
        { id: "wall3", x: 6, y: 0, visible: false }
    ],
    coins: [
        { id: "coin1", x: 5, y: 2, visible: true },
        { id: "coin2", x: 7, y: 2, visible: false }
    ],
    goals: [
        { id: "goal1", x: 9, y: 2, visible: false }
    ],
    triggers: [
        { id: "appearcoin1", target: "coin2", set: { visible: true }, conditions: { coin: 1 } },
        { id: "appearwall1", target: "wall1", set: { visible: true }, conditions: { coin: 1 } },
        { id: "appearwall2", target: "wall2", set: { visible: true }, conditions: { coin: 1 } },
        { id: "appearwall3", target: "wall3", set: { visible: true }, conditions: { coin: 1 } },
        { id: "appeargoal", target: "goal1", set: { visible: true }, conditions: { coin: 2 } }
    ],
    texts: [
        { x: 0.1, y: 0.98, value: "Level 1: Try to get it !", size: 12, animStrength: 0.0001 }
    ]
};

var level2 = {
    player: { x: 1, y: 5, visible: true },
    // player: { x: 8, y: 3 },
    blocks: [
        { x: 0, y: 8, visible: true },
        { x: 0, y: 7, visible: true },
        { x: 0, y: 6, visible: true },
        { x: 0, y: 5, visible: true },
        { x: 1, y: 1, visible: true },
        { x: 1, y: 2, visible: true },
        { x: 1, y: 3, visible: true },
        { x: 2, y: 3, visible: true },
        { x: 2, y: 4, visible: true },
        { x: 2, y: 5, visible: true },
        { x: 2, y: 6, visible: true },
        { x: 2, y: 8, visible: true },
        { x: 3, y: 1, visible: true },
        { x: 3, y: 4, visible: true },
        { x: 4, y: 1, visible: true },
        { x: 4, y: 2, visible: true },
        { x: 4, y: 4, visible: true },
        { x: 4, y: 6, visible: true },
        { x: 4, y: 7, visible: true },
        { x: 4, y: 8, visible: true },
        { x: 5, y: 0, visible: true },
        { x: 5, y: 1, visible: true },
        { x: 5, y: 4, visible: true },
        { x: 5, y: 8, visible: true },
        { x: 6, y: 3, visible: true },
        { x: 6, y: 4, visible: true },
        { x: 6, y: 6, visible: true },
        { x: 7, y: 1, visible: true },
        { x: 7, y: 2, visible: true },
        { x: 7, y: 3, visible: true },
        { x: 7, y: 6, visible: true },
        { x: 7, y: 7, visible: true },
        { x: 7, y: 8, visible: true },
        { x: 8, y: 5, visible: true },
        { x: 8, y: 6, visible: true },
        { x: 8, y: 8, visible: true },
        { x: 9, y: 0, visible: true },
        { x: 9, y: 1, visible: true },
        { x: 9, y: 3, visible: true },
        { x: 10, y: 0, visible: true },
        { x: 10, y: 3, visible: true },
        { x: 10, y: 4, visible: true },
        { x: 10, y: 6, visible: true },
        { x: 10, y: 7, visible: true },
        { x: 10, y: 8, visible: true },
        { x: 11, y: 0, visible: true },
        { x: 11, y: 4, visible: true },
        { x: 11, y: 7, visible: true },
        { x: 12, y: 0, visible: true },
        { x: 12, y: 4, visible: true },
        { x: 12, y: 5, visible: true },
        { x: 12, y: 7, visible: true },
        { x: 13, y: 0, visible: true },
        { x: 13, y: 7, visible: true },
        { x: 14, y: 0, visible: true },
        { x: 14, y: 4, visible: true },
        { x: 14, y: 5, visible: true },
        { x: 15, y: 5, visible: true },
        { x: 15, y: 7, visible: true },
        { id: "wall1", x: 9, y: 2, visible: false },
        { id: "wall2", x: 13, y: 4, visible: false },
    ],
    coins: [
        { id: "coin1", x: 0, y: 1, visible: true },
        { id: "coin2", x: 3, y: 7, visible: true },
        { id: "coin3", x: 14, y: 2, visible: true },
        { id: "coin4", x: 8, y: 2, visible: true },
        { id: "coin5", x: 13, y: 6, visible: true }
    ],
    goals: [
        { id: "goal1", x: 12, y: 2, visible: true }
    ],
    triggers: [
        { id: "appearwall1", target: "wall1", set: { visible: true }, conditions: { from: "coin4" } },
        { id: "appearwall2", target: "wall2", set: { visible: true }, conditions: { from: "coin5" } },
    ],
    texts: [
        { x: 0.1, y: 0.98, value: "Level 2: aMazing !", size: 12, animStrength: 0.0001 }
    ]
};

const Levels = [
    levelIntro,
    level1,
    levelChallenge,
    level2,
    levelCredits
];

class Block {
    constructor() {
        this.id = "block-*";
        this.visible = true;
        this.position = { x: 0, y: 0 };
        this.size = { x: canvasWidth / 16, y: canvasHeight / 9 };
    }
    get posX() { return this.position.x / this.size.x; }
    set posX(val) { this.position.x = val * this.size.x; }
    get posY() { return this.position.y / this.size.y; }
    set posY(val) { this.position.y = val * this.size.y; }
    update() {
    }
    render(ctx) {
        if (!this.visible)
            return;
        ctx.beginPath();
        ctx.fillStyle = "#142850";
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.stroke();
    }
}

class Character {
    constructor(leveldata) {
        this.id = "character";
        this.visible = true;
        this.position = { x: 0, y: 0 };
        this.size = { x: canvasWidth / 16, y: canvasHeight / 9 };
        this.coin = 0;
        this.leveldata = leveldata;
    }
    get posX() { return this.position.x / this.size.x; }
    set posX(val) { this.position.x = val * this.size.x; }
    get posY() { return this.position.y / this.size.y; }
    set posY(val) { this.position.y = val * this.size.y; }
    update() {
    }
    render(ctx) {
        if (!this.visible)
            return;
        ctx.fillStyle = "#00909e";
        ctx.beginPath();
        ctx.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.size.x / 3, 0, 2 * Math.PI, false);
        ctx.fill();
        // ctx.lineWidth = 1
        // ctx.strokeStyle = '#003300'
        // ctx.stroke()
    }
    move(x, y) {
        const nextX = (16 + this.posX + x) % 16;
        const nextY = (9 + this.posY + y) % 9;
        for (const entity of this.leveldata.entities) {
            if (entity === this)
                continue;
            if (entity.posX === nextX && entity.posY === nextY) {
                if (entity instanceof Block && entity.visible)
                    return console.warn('Colision with', entity);
            }
        }
        this.posX = nextX;
        this.posY = nextY;
        for (const entity of this.leveldata.entities) {
            if (entity === this)
                continue;
            if (entity.posX === this.posX && entity.posY === this.posY) {
                if (entity instanceof Coin && entity.visible) {
                    this.coin++;
                    entity.collect();
                }
                if (entity instanceof Goal && entity.visible) {
                    entity.collect();
                }
            }
        }
    }
}

class Text {
    constructor() {
        this.id = "text";
        this.visible = true;
        this.position = { x: 0, y: 0 };
        this.posX = -1;
        this.posY = -1;
        this.text = "text";
        this.size = 30;
        this.scale = 1;
        this.duration = 0;
        this.animStrength = 0.25;
        this.animDuration = 1;
        this.voice = 0;
        this.firstRender = true;
    }
    update(dt) {
        this.duration += dt;
        this.scale = 1 + Math.sin(this.duration * this.animDuration) * this.animStrength;
    }
    render(ctx) {
        if (this.firstRender) {
            if (this.voice > 0) {
                setTimeout(() => {
                    var msg = new SpeechSynthesisUtterance(this.text);
                    window.speechSynthesis.speak(msg);
                }, this.voice * 1000);
            }
            this.firstRender = false;
        }
        if (!this.visible)
            return;
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.translate(this.position.x + 1, this.position.y + 1);
        ctx.scale(this.scale, this.scale);
        ctx.fillText(this.text, 0, 0);
        ctx.scale(1 / this.scale, 1 / this.scale);
        ctx.translate(-this.position.x - 1, -this.position.y - 1);
        ctx.fillStyle = "#333";
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.scale, this.scale);
        ctx.fillText(this.text, 0, 0);
        ctx.scale(1 / this.scale, 1 / this.scale);
        ctx.translate(-this.position.x, -this.position.y);
    }
}

class Coin {
    constructor(leveldata) {
        this.id = "coin-*";
        this.visible = true;
        this.position = { x: 0, y: 0 };
        this.size = { x: canvasWidth / 16, y: canvasHeight / 9 };
        this.leveldata = leveldata;
    }
    get posX() { return this.position.x / this.size.x; }
    set posX(val) { this.position.x = val * this.size.x; }
    get posY() { return this.position.y / this.size.y; }
    set posY(val) { this.position.y = val * this.size.y; }
    update() {
    }
    render(ctx) {
        if (!this.visible)
            return;
        ctx.beginPath();
        ctx.fillStyle = "#27496d";
        ctx.fillRect(this.position.x + this.size.x * 0.25, this.position.y + this.size.y * 0.25, this.size.x / 2, this.size.y / 2);
        ctx.stroke();
    }
    collect() {
        this.visible = false;
        this.leveldata.refresh(this.id);
    }
}

class Goal {
    constructor(leveldata) {
        this.id = "goal-*";
        this.visible = true;
        this.position = { x: 0, y: 0 };
        this.size = { x: canvasWidth / 16, y: canvasHeight / 9 };
        this.leveldata = leveldata;
    }
    get posX() { return this.position.x / this.size.x; }
    set posX(val) { this.position.x = val * this.size.x; }
    get posY() { return this.position.y / this.size.y; }
    set posY(val) { this.position.y = val * this.size.y; }
    update() {
    }
    render(ctx) {
        if (!this.visible)
            return;
        ctx.beginPath();
        ctx.fillStyle = "#ffcd3c";
        ctx.fillRect(this.position.x + this.size.x * 0.25, this.position.y + this.size.y * 0.25, this.size.x / 2, this.size.y / 2);
        ctx.stroke();
    }
    collect() {
        this.leveldata.complete();
    }
}

// Get Canvas & Context
const canvas = document.getElementById('canvas');
if (!canvas)
    throw 'No canvas defined';
const ctx = canvas.getContext('2d');
if (!ctx)
    throw 'No 2D Context';
ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;
// Update & Render management
const entities = new Set();
let last = 0;
function update(time) {
    const dt = Math.round((time - last) * 10) / 10000;
    last = time;
    // update
    for (const entity of entities)
        entity.update(dt);
    // clear & render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const entity of entities)
        entity.render(ctx);
    window.requestAnimationFrame(update);
}
let lvl = 0;
let levelData;
function loadLevel(id) {
    console.log("load level", id);
    lvl = id;
    entities.clear();
    const level = Levels[id];
    const triggerIds = new Set();
    levelData = {
        refresh: function (src) {
            console.log('refresh level', this, src);
            if (!this.level.triggers)
                return;
            const char = this.character;
            for (const trigger of this.level.triggers) {
                if (triggerIds.has(trigger.id))
                    continue;
                for (const condType in trigger.conditions) {
                    console.log('check', trigger, condType, char.coin, trigger.conditions[condType]);
                    if (condType === "coin" && char.coin >= trigger.conditions[condType]) {
                        console.log('set entity', trigger.target);
                        for (const entity of entities) {
                            if (entity.id === trigger.target) {
                                entity.visible = !!trigger.set.visible;
                                console.log('set visibility', entity, trigger.set.visible);
                            }
                        }
                        triggerIds.add(trigger.id);
                    }
                    if (condType === "from" && src === trigger.conditions[condType]) {
                        console.log('set entity', trigger.target);
                        for (const entity of entities) {
                            if (entity.id === trigger.target) {
                                entity.visible = !!trigger.set.visible;
                                console.log('set visibility', entity, trigger.set.visible);
                            }
                        }
                        triggerIds.add(trigger.id);
                    }
                }
            }
        },
        complete: function () {
            loadLevel(lvl < Levels.length - 1 ? lvl + 1 : 0);
        },
        level,
        entities,
        character: null
    };
    // Initialize Blocks
    for (const data of level.blocks) {
        const block = new Block();
        if (data.id)
            block.id = data.id;
        block.visible = data.visible;
        block.posX = data.x;
        block.posY = data.y;
        entities.add(block);
        console.log(block);
    }
    // Initialize Coins
    if (level.coins) {
        for (const data of level.coins) {
            const coin = new Coin(levelData);
            if (data.id)
                coin.id = data.id;
            coin.visible = data.visible;
            coin.posX = data.x;
            coin.posY = data.y;
            entities.add(coin);
        }
    }
    if (level.goals) {
        for (const data of level.goals) {
            const goal = new Goal(levelData);
            if (data.id)
                goal.id = data.id;
            goal.visible = data.visible;
            goal.posX = data.x;
            goal.posY = data.y;
            entities.add(goal);
        }
    }
    // Initialize Texts
    if (level.texts) {
        for (const data of level.texts) {
            const txt = new Text();
            if (data.voice)
                txt.voice = data.voice;
            txt.position.x = ctx.canvas.width * data.x;
            txt.position.y = ctx.canvas.height * data.y;
            txt.text = data.value;
            txt.visible = data.visible !== false;
            if (data.size)
                txt.size = data.size;
            if (data.animStrength)
                txt.animStrength = data.animStrength;
            if (data.animDuration)
                txt.animDuration = data.animDuration;
            entities.add(txt);
        }
    }
    // for (var i = 0; i < 3; i++) {
    //     const ball = new Ball()
    //     ball.radius = rngMinMax(8, 24)
    //     ball.position.x = rngMinMax(0 + ball.radius, canvas.width - ball.radius)
    //     ball.position.y = rngMinMax(0 + ball.radius, canvas.height - ball.radius)
    //     ball.velocity.x = Math.random() * 50 - 25
    //     ball.velocity.y = Math.random() * 50 - 25
    //     entities.add(ball)
    // }
    // Initialize Character
    const character = new Character(levelData);
    character.posX = level.player.x;
    character.posY = level.player.y;
    character.visible = level.player.visible;
    entities.add(character);
    levelData.character = character;
}
loadLevel(lvl);
window.requestAnimationFrame(update);
voiceRecognitionStart((commands) => {
    const character = levelData.character;
    for (const cmd of commands) {
        switch (cmd) {
            case Command.Start:
                if (!levelData.level.goals || levelData.level.goals.length === 0)
                    levelData.complete();
                break;
            case Command.Up:
                character.move(0, -1);
                break;
            case Command.Down:
                character.move(0, 1);
                break;
            case Command.Left:
                character.move(-1, 0);
                break;
            case Command.Right:
                character.move(1, 0);
                break;
        }
    }
});
