import { IEntity, canvasHeight, canvasWidth } from "../core"

export class Ball implements IEntity {
    public id = "ball-*"
    public visible = true
    public position = { x: 0, y: 0 }
    public velocity = { x: 0, y: 0 }
    public posX = -1
    public posY = -1
    public radius = 50

    public update(dt: number) {
        this.position.x += this.velocity.x * dt
        this.position.y += this.velocity.y * dt
        if (this.position.x - this.radius < 0) this.velocity.x = Math.abs(this.velocity.x)
        if (this.position.x + this.radius > canvasWidth) this.velocity.x = -Math.abs(this.velocity.x)
        if (this.position.y - this.radius < 0) this.velocity.y = Math.abs(this.velocity.y)
        if (this.position.y + this.radius > canvasHeight) this.velocity.y = -Math.abs(this.velocity.y)
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (!this.visible) return
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        ctx.stroke()
    }
}