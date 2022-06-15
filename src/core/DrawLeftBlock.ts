

// 左侧文本与图例
export class DrawLeftBlock implements RFChartsDraw {
    ctx: CanvasRenderingContext2D;
    calcOptions: CalcOptions;
    times: number = 1;
    minMax: [number, number] = [0, 0];
    childHeightText: number = 0;
    leftBarShowTimes: number = 0;
    constructor(ctx: CanvasRenderingContext2D, calcOptions: CalcOptions) {
        this.ctx = ctx;
        this.calcOptions = calcOptions;
        this.reset()
    }
    resize(): void {
        this.reset();
        this.draw();
    }
    reset() {
        const { minMax, leftBarShowTimes, domHeight } = this.calcOptions.options;
        // 只有minmax和 leftBarShowTimes 都存在时 才继续
        if (!(minMax && leftBarShowTimes)) return;
        const times = (minMax[1] - minMax[0]) / leftBarShowTimes;
        this.times = times;
        this.minMax = minMax || [0, 0];
        this.leftBarShowTimes = leftBarShowTimes || 0;
        if (times <= 0) return;
        this.childHeightText = Math.floor(domHeight / times);
    }
    draw(): void {
        let { minMax, colorArr } = this.calcOptions.options;
        colorArr = colorArr || [];
        const { domHeight, leftBlock_color, leftBlock_Total } = this.calcOptions.options;
        const { leftBlock_text_xStart, leftBlock_color_xStart } = this.calcOptions.positions;
        const ctx = this.ctx;
        minMax = minMax || [0, 0];

        ctx.save();
        // 清除左侧文本与图例
        ctx.clearRect(0, 0, leftBlock_Total, domHeight);
        // 绘制左侧文本
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < this.times; i++) {
            ctx.fillText((minMax[1] - i * this.leftBarShowTimes).toString(), leftBlock_text_xStart + 12, this.childHeightText * i + 10);
        }
        ctx.fillText((minMax[0]).toString(), leftBlock_text_xStart + 12, domHeight - 4);
        // 生成色块范围
        const len = colorArr.length;
        const childHeight = domHeight / len;
        colorArr.forEach((ele, index) => {
            ctx.fillStyle = ele;
            ctx.fillRect(
                leftBlock_color_xStart,
                index * childHeight,
                leftBlock_color,
                childHeight
            );
        });

        ctx.restore();
    }

}