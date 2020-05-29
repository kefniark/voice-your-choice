import { IEntity } from "../core"

export class Text implements IEntity {
    public id = "text"
    public visible = true
    public position = { x: 0, y: 0 }
    public posX = -1
    public posY = -1

    public text = "text"
    public size = 30
    public scale = 1
    public duration = 0
    public animStrength = 0.25
    public animDuration = 1

    public voice = 0
    private firstRender = true

    public update(dt: number) {
        this.duration += dt
        this.scale = 1 + Math.sin(this.duration * this.animDuration) * this.animStrength
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (this.firstRender ) {
            if (this.voice > 0) {
                setTimeout(() => {
                    var msg = new SpeechSynthesisUtterance(this.text)
                    window.speechSynthesis.speak(msg)
                }, this.voice * 1000)
            }

            this.firstRender = false
        }
        if (!this.visible) return

        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = "center";

        ctx.fillStyle = "#FFF"
        ctx.translate(this.position.x + 1, this.position.y + 1);
        ctx.scale(this.scale, this.scale);
        ctx.fillText(this.text, 0, 0);
        ctx.scale(1/this.scale, 1/this.scale);
        ctx.translate(-this.position.x - 1, -this.position.y - 1);

        ctx.fillStyle = "#333"
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.scale, this.scale);
        ctx.fillText(this.text, 0, 0);
        ctx.scale(1/this.scale, 1/this.scale);
        ctx.translate(-this.position.x, -this.position.y);
    }
}