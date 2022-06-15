import { CalcOptions } from "./CalcOptions"
import { DataOptions } from "./DataOptions"
// 绘制中间瀑布图
export class DrawCenterWaterfall implements RFChartsDraw {
    ctx: CanvasRenderingContext2D;
    calcOptions: CalcOptions;
    dataOptions: DataOptions;
    // originLineargradient: CanvasGradient[] = [];
    constructor(ctx: CanvasRenderingContext2D, calcOptions: CalcOptions, dataOptions: DataOptions) {
        this.ctx = ctx;
        this.calcOptions = calcOptions;
        this.dataOptions = dataOptions;
    }
    resize(): void {
        // this.reset();
        // 渐变带全部重新设置
        let originLineargradient: CanvasGradient[] = [];
        const {
            leftBlock_Total,
        } = this.calcOptions.options;
        const { centerBlock_xEnd } = this.calcOptions.positions;
        this.dataOptions.colorArr.forEach((ele, index) => {
            const lineargradient = this.createLinearGradient(leftBlock_Total, index, centerBlock_xEnd, index, this.ctx, ele);
            originLineargradient.push(lineargradient);
        });
        this.dataOptions.resetOriginLineargradient(originLineargradient);
        this.draw();
    }
    /**
     * @name renderCenterImg
     * @description 渲染中间区域内容
     */
    draw() {
        // update
        const ctx = this.ctx;
        const {
            leftBlock_Total,
            centerBlock_Total
        } = this.calcOptions.options;
        const rightTextStartX = this.calcOptions.positions.rightBlock_xStart || 0;
        const { colorArr } = this.dataOptions;
        colorArr.forEach((ele, index) => {
            ctx.save();
            const y = index;
            // 右侧文本开始x坐标即中间画布的结束x坐标
            let lineargradient: CanvasGradient;
            // 将 lineargradient 存储起来避免每次都计算一遍
            if (index && this.dataOptions.originLineargradient[index]) {
                lineargradient = this.dataOptions.originLineargradient[index];
            } else {
                lineargradient = this.createLinearGradient(leftBlock_Total, y, rightTextStartX, y, ctx, ele);
                this.dataOptions.setOriginLineargradient(lineargradient);
                // this.checkIsNeedPopData(this.originLineargradient, domHeight);
            }
            // lineargradient = this.createLinearGradient(leftBlock_Total, y, rightTextStartX || 0, y, ctx, ele);
            ctx.fillStyle = lineargradient;
            ctx.fillRect(
                leftBlock_Total,
                y,
                centerBlock_Total,
                1
            );
            ctx.restore();
        });
    }
    // 画矩形
    private createLinearGradient(x: number, y: number, w: number, h: number, ctx: CanvasRenderingContext2D, ele: string[]) {
        const lineargradient = ctx.createLinearGradient(x, y, w, h);
        const len = ele.length;
        const times = (1 / len);
        // 这一块是否可以存储起来避免每次都计算一遍？
        ele.forEach((ele1, index1) => {

            lineargradient.addColorStop(index1 * times, ele1);
        });
        return lineargradient;
    }
}