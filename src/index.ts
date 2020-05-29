import { IEntity, Command, ILevelData, canvasHeight, canvasWidth } from "./core";
import { voiceRecognitionStart } from "./controls/voice";
import { Levels } from "./levels/index";
import { Character, Block, Text, Coin, Goal } from "./entities/index";

// Get Canvas & Context
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
if (!canvas) throw 'No canvas defined'
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D
if (!ctx) throw 'No 2D Context'
ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

// Update & Render management
const entities = new Set<IEntity>()

let last = 0
function update(time: number) {
    const dt = Math.round((time - last) * 10) / 10000
    last = time

    // update
    for (const entity of entities) entity.update(dt)

    // clear & render
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const entity of entities) entity.render(ctx)

    window.requestAnimationFrame(update)
}

let lvl = 0
let levelData: ILevelData

function loadLevel(id: number) {
    console.log("load level", id)
    lvl = id
    entities.clear()
    const level = Levels[id]

    const triggerIds: Set<string> = new Set()
    levelData = {
        refresh: function(src?: string) {
            console.log('refresh level', this, src)
            if (!this.level.triggers) return
            const char = this.character as Character

            for (const trigger of this.level.triggers) {
                if (triggerIds.has(trigger.id)) continue
                for (const condType in trigger.conditions) {
                    console.log('check', trigger, condType, char.coin, trigger.conditions[condType])
                    if (condType === "coin" && char.coin >= trigger.conditions[condType]) {
                        console.log('set entity', trigger.target)
                        for (const entity of entities) {
                            if (entity.id === trigger.target) {
                                entity.visible = !!trigger.set.visible
                                console.log('set visibility', entity, trigger.set.visible )
                            }
                        }
                        triggerIds.add(trigger.id)
                    }
                    if (condType === "from" && src === trigger.conditions[condType]) {
                        console.log('set entity', trigger.target)
                        for (const entity of entities) {
                            if (entity.id === trigger.target) {
                                entity.visible = !!trigger.set.visible
                                console.log('set visibility', entity, trigger.set.visible )
                            }
                        }
                        triggerIds.add(trigger.id)
                    }
                }
            }
        },
        complete: function () {
            loadLevel(lvl < Levels.length - 1 ? lvl + 1 : 0)
        },
        level,
        entities,
        character: null as any
    }

    // Initialize Blocks
    for (const data of level.blocks) {
        const block = new Block()
        if (data.id) block.id = data.id
        block.visible = data.visible
        block.posX = data.x
        block.posY = data.y
        entities.add(block)
        console.log(block)
    }

    // Initialize Coins
    if (level.coins) {
        for (const data of level.coins) {
            const coin = new Coin(levelData)
            if (data.id) coin.id = data.id
            coin.visible = data.visible
            coin.posX = data.x
            coin.posY = data.y
            entities.add(coin)
        }
    }

    if (level.goals) {
        for (const data of level.goals) {
            const goal = new Goal(levelData)
            if (data.id) goal.id = data.id
            goal.visible = data.visible
            goal.posX = data.x
            goal.posY = data.y
            entities.add(goal)
        }
    }

    // Initialize Texts
    if (level.texts) {
        for (const data of level.texts) {
            const txt = new Text()
            if (data.voice) txt.voice = data.voice
            txt.position.x = ctx.canvas.width * data.x
            txt.position.y = ctx.canvas.height * data.y
            txt.text = data.value
            txt.visible = data.visible !== false
            if (data.size) txt.size = data.size
            if (data.animStrength) txt.animStrength = data.animStrength
            if (data.animDuration) txt.animDuration = data.animDuration
            entities.add(txt)
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
    const character = new Character(levelData)
    character.posX = level.player.x
    character.posY = level.player.y
    character.visible = level.player.visible
    entities.add(character)

    levelData.character = character
}
loadLevel(lvl)

window.requestAnimationFrame(update)
voiceRecognitionStart((commands) => {
    const character = levelData.character as Character
    for (const cmd of commands) {
        switch (cmd) {
            case Command.Start:
                if (!levelData.level.goals || levelData.level.goals.length === 0) levelData.complete()
                break;
            case Command.Up:
                character.move(0, -1)
                break;
            case Command.Down:
                character.move(0, 1)
                break;
            case Command.Left:
                character.move(-1, 0)
                break;
            case Command.Right:
                character.move(1, 0)
                break;
        }
    }
})