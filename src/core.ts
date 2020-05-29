export const canvasWidth = 640 * 2
export const canvasHeight = 360 * 2
export interface IEntity {
    id: string
    visible: boolean
    posX: number
    posY: number
    update(dt: number): void
    render(ctx: CanvasRenderingContext2D): void
}

export interface ILevelData {
    refresh: (id?: string) => void
    complete: () => void
    level: any
    entities: Set<IEntity>
    character: IEntity
}

export const enum Command {
    None = "none",
    Start = "start",
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right"
}

