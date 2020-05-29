import { IEntity, canvasWidth, canvasHeight } from "../core";

export class Block implements IEntity {
    public id = "block-*"
    public visible = true
    public position = { x: 0, y: 0 }
    public size = { x: canvasWidth / 16, y: canvasHeight / 9 }

    public get posX() { return this.position.x / this.size.x }
    public set posX(val: number) { this.position.x = val * this.size.x }
    public get posY() { return this.position.y / this.size.y }
    public set posY(val: number) { this.position.y = val * this.size.y }

    public update() {
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (!this.visible) return
        ctx.beginPath()
        ctx.fillStyle = "#142850"
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
        ctx.stroke()
    }
}