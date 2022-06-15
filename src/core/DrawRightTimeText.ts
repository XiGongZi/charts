
// 绘制右侧时间文本
export class DrawRightTimeText implements RFChartsDraw {
    ctx: CanvasRenderingContext2D;
    calcOptions: CalcOptions;
    dataOptions: DataOptions;
    constructor(ctx: CanvasRenderingContext2D, calcOptions: CalcOptions, dataOptions: DataOptions) {
        this.ctx = ctx;
        this.calcOptions = calcOptions;
        this.dataOptions = dataOptions;
    }
    resize(): void {
        // 暂时只考虑横向拉伸
        // 需要重置x
        let newX = this.calcOptions.positions.rightBlock_xStart + 4;
        this.dataOptions.dateArr.forEach(ele => {
            if (ele) {
                ele.x = newX;
            }
        })
        this.draw()
    }
    /**
     * @name setRightDateHtml
     * @param {bool} bool 布尔值，是否创建 WaterFallText对象去渲染
     * @returns {null || WaterFallText} 根据bool值决定返回空或者WaterFallText对象
     * @description 根据布尔值创建并返回WaterFallText.draw()调用
     */
    private setRightDateHtml(bool: boolean): WaterFallText | null {
        // console.log(bool);
        const { rightBlock_xStart } = this.calcOptions.positions;
        // 是否显示右侧文本 showRightText
        let isShow = this.calcOptions.options.showRightText;
        if (isShow && bool) {
            const date = Utils.getDate();
            const app = new WaterFallText({
                step: 1,
                ctx: this.ctx,
            });
            app.set({
                x: rightBlock_xStart + 4,
                // ctx: this.ctx,
                y: 0,
                text: date
            })
            return app;
        } else {
            return null;
        }
    }
    draw(): void {
        const { rightBlock_Total, domHeight } = this.calcOptions.options;
        const { rightBlock_xStart } = this.calcOptions.positions;

        this.ctx.clearRect(
            rightBlock_xStart,
            0,
            rightBlock_Total,
            domHeight
        );
        // redraw text
        this.dataOptions.dateArr.forEach((ele) => {
            if (ele) {
                ele.draw();
            }
        });
        this.dataOptions.setDateWaterText(this.setRightDateHtml(!this.dataOptions.checkIsDateNum));
    }
}