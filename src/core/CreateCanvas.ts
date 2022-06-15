import { CalcOptions } from "./CalcOptions"
import { DataOptions } from "./DataOptions"
import { DrawLeftBlock } from "./DrawLeftBlock"
import { DrawCenterWaterfall } from "./DrawCenterWaterfall"
import { DrawRightTimeText } from "./DrawRightTimeText"
export class CreateCanvas {
    dom: HTMLElement;
    canvasDomArr: ICanvasBase[] = [];
    calcOptions: CalcOptions;
    dataOptions: DataOptions;
    constructor(element: HTMLElement, calcOptions: CalcOptions, dataOptions: DataOptions) {
        this.dom = element;
        this.calcOptions = calcOptions;
        this.dataOptions = dataOptions;
        // 设置dom宽高
        // this.resize();
    }
    resetCalcOptions(calcOptions: CalcOptions) {
        this.calcOptions = calcOptions;
    }
    draw() {
        // this.resetCalcOptions(this.calcOptions);
        // 分层绘画 当前为canvas dom层
        this.canvasDomArr.forEach((canvasBase: ICanvasBase) => {
            // 分层绘画 当前为单个canvas 层
            canvasBase.drawArr.forEach((draw: RFChartsDraw) => {
                draw.draw();
            })
        });
    }
    // resize
    resize() {
        this.canvasDomArr.forEach((canvasBase: ICanvasBase) => {
            // 分层绘画 当前为单个canvas 层
            canvasBase.drawArr.forEach((draw: RFChartsDraw) => {
                draw.resize();
            })
        });
    }
    resetCanvasBase() {
        // 重置dom属性
        // this.calcOptions.reset()
        // 为每一个canvas同步新尺寸
        this.canvasDomArr.forEach((canvasBase: ICanvasBase) => {
            canvasBase.canvas.width = this.calcOptions.options.domWidth || 0;
            canvasBase.canvas.height = this.calcOptions.options.domHeight || 0;
            canvasBase.canvas.style.height =
                (this.calcOptions.options.domHeight || 0) + "px";
        })
        // this.draw();
    }
    // set canvas
    setCanvas(index: number = 1) {
        let canvasDom = document.createElement('canvas');
        // 初始化 设置canvas宽高
        canvasDom.width = this.calcOptions.options.domWidth || 0;
        canvasDom.height = this.calcOptions.options.domHeight || 0;
        canvasDom.style.height = (this.calcOptions.options.domHeight || 0) + "px";
        // 初始化 设置canvas相对定位
        canvasDom.style.position = 'absolute';
        // 初始化 设置canvas层级
        canvasDom.style.zIndex = index + '';
        // 初始化 设置canvas背景 测试用
        // canvasDom.style.backgroundColor = 'rgba(255,0,0,0.5)';
        this.dom.appendChild(canvasDom);
        // 
        let ctx = canvasDom.getContext("2d", { alpha: index === 1 }) as CanvasRenderingContext2D;
        let drawArr = [];
        // 左侧图例
        drawArr.push(new DrawLeftBlock(ctx, this.calcOptions))
        // 中间瀑布图
        drawArr.push(new DrawCenterWaterfall(ctx, this.calcOptions, this.dataOptions))
        // 右侧时间文本
        drawArr.push(new DrawRightTimeText(ctx, this.calcOptions, this.dataOptions))
        this.canvasDomArr.push({ canvas: canvasDom, ctx, drawArr });
        // 测试
        // this.test()
        // this.draw()
    }
}