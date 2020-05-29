import { IEntity, ILevelData, canvasWidth, canvasHeight } from "../core";

export class Goal implements IEntity {
    public id = "goal-*"
    public visible = true
    private leveldata: ILevelData
    public position = { x: 0, y: 0 }
    public size = { x: canvasWidth / 16, y: canvasHeight / 9 }

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
        ctx.beginPath()
        ctx.fillStyle = "#ffcd3c"
        ctx.fillRect(this.position.x + this.size.x * 0.25, this.position.y + this.size.y * 0.25, this.size.x / 2, this.size.y / 2)
        ctx.stroke()
    }

    public collect() {
        this.leveldata.complete()
    }
}