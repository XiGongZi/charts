
export class WaterFallText implements IwaterFallTextInput {
    x: number = 0;
    y: number = 0;
    step;
    ctx: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    text = "";
    textAlign;
    constructor({ ctx, step = 1, textAlign = "left" }: IwaterFallTextInput) {
        this.step = step;
        this.ctx = ctx;
        this.textAlign = textAlign;
    }
    resetX(x: number) {
        this.x = x;
    }
    set({ x = 0, y = 0, text = 'left' }: IsetText) {
        this.x = x;
        this.y = y;
        this.text = text;
    }
    draw() {
        this.y = this.y + this.step;
        this.fillText();
    }
    fillText() {
        this.ctx.save();
        this.ctx.textAlign = this.textAlign;
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(this.text, this.x, this.y);
        this.ctx.restore();
    }
    update(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.fillText();
    }
}