import { IEntity, ILevelData, canvasWidth, canvasHeight } from "../core";
import { Block, Coin, Goal } from "./index";

export class Character implements IEntity {
    public id = "character"
    public visible = true
    private leveldata: ILevelData
    public position = { x: 0, y: 0 }
    public size = { x: canvasWidth / 16, y: canvasHeight / 9 }
    public coin = 0

    public get posX() { return this.position.x / this.size.x }
    public set posX(val: number) { this.position.x = val * this.size.x }
    public get posY() { return this.position.y / this.size.y }
    public set posY(val: number) { this.position.y = val * this.size.y }

    public constructor (leveldata: ILevelData) {
        this.leveldata = leveldata
    }

    public update() {
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (!this.visible) return
        ctx.fillStyle = "#00909e"
        ctx.beginPath()
        ctx.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.size.x / 3, 0, 2 * Math.PI, false)
        ctx.fill()
        // ctx.lineWidth = 1
        // ctx.strokeStyle = '#003300'
        // ctx.stroke()
    }

    public move(x: number, y: number) {
        const nextX = (16 + this.posX + x) % 16
        const nextY = (9 + this.posY + y) % 9

        for (const entity of this.leveldata.entities) {
            if (entity === this) continue
            if (entity.posX === nextX && entity.posY === nextY) {
                if (entity instanceof Block && entity.visible) return console.warn('Colision with', entity)
            }
        }

        this.posX = nextX
        this.posY = nextY

        for (const entity of this.leveldata.entities) {
            if (entity === this) continue
            if (entity.posX === this.posX && entity.posY === this.posY) {
                if (entity instanceof Coin && entity.visible) {
                    this.coin++
                    entity.collect()
                }
                if (entity instanceof Goal && entity.visible) {
                    entity.collect()
                }
            }
        }
    }
}