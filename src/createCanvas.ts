import { IwaterFallTextInput, IsetText } from './baseInterface';
// 创建管理画布
/**
 * 1. 分层
 * 2. 动静分离管理
 * 3. resize
 */
interface IOptions {
    domWidth?: number;
    domHeight?: number;
}
interface ICanvasBase {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    drawArr: RFChartsDraw[]
}
class CreateCanvas {
    dom: HTMLElement;
    canvasDomArr: ICanvasBase[] = [];
    options: IOptions = {
        domWidth: 0,
        domHeight: 0
    };
    constructor(element: HTMLElement) {
        this.dom = element;
        // 设置dom宽高
        this.resize();
    }
    // resize
    resize() {
        this.options.domHeight = this.dom.clientHeight;
        this.options.domWidth = this.dom.clientWidth;
        // 设置canvas宽高
        this.canvasDomArr.forEach((canvasBase: ICanvasBase) => {
            canvasBase.canvas.width = this.options.domWidth || 0;
            canvasBase.canvas.height = this.options.domHeight || 0;
        })
    }
    test() {
        this.canvasDomArr.forEach((canvasBase: ICanvasBase) => {
            // 如果 canvasBase.canvas 不存在则跳下一个
            if (!canvasBase.canvas) return;
            // let ctx = canvasBase.canvas.getContext("2d");
            // 如果 ctx 不存在则跳下一个
            if (!canvasBase.ctx) return;
            canvasBase.ctx.fillStyle = 'rgba(255,255,0,0.5)';
            canvasBase.ctx.fillRect(canvasBase.canvas.width / 4, canvasBase.canvas.height / 4, canvasBase.canvas.width / 2, canvasBase.canvas.height / 2);
        })
    }
    // set canvas
    setCanvas(index: number = 1) {
        let canvasDom = document.createElement('canvas');
        // 初始化 设置canvas宽高
        canvasDom.width = this.options.domWidth || 0;
        canvasDom.height = this.options.domHeight || 0;
        // 初始化 设置canvas相对定位
        canvasDom.style.position = 'absolute';
        // 初始化 设置canvas层级
        canvasDom.style.zIndex = index + '';
        // 初始化 设置canvas背景 测试用
        canvasDom.style.backgroundColor = 'rgba(255,0,0,0.5)';
        this.dom.appendChild(canvasDom);
        // 
        let ctx = canvasDom.getContext("2d", { alpha: index === 1 }) as CanvasRenderingContext2D;
        let text = new WaterFallText({ ctx });
        this.canvasDomArr.push({ canvas: canvasDom, ctx, drawArr: [text] });
        // 测试
        this.test()
    }
}
/**
 * 职能：创建管理画布对象，自适应尺寸变化
 */
export class RFCharts {
    constructor() {
    }
    init(element: HTMLElement) {
        if (!element) console.error('element is null');
        return new RFChartsManager(element);
    }
}

interface IRFCharts {
    resize(): void;
    commit(data: number[]): void;
}
// 管控中心
class RFChartsManager implements IRFCharts {
    dom: HTMLElement;
    canvasClass: CreateCanvas;
    constructor(element: HTMLElement) {
        this.dom = element;
        this.canvasClass = new CreateCanvas(element);
    }
    // 设置配置
    setOptions(options: IOptions) {
        this.canvasClass.setCanvas();
    }
    resize(): void {
        this.canvasClass.resize();
    }
    commit(data: number[]): void {
        // 
    }
}

// 绘制对象
/**
 * 意图：包装canvas，将图表各个基础元素绘制信息设置到 Draw 中，统一通过 内部draw方法绘制
 * 明确设置几种类型 根据类型创建draw对象
 */
interface IRFChartsDraw {
    draw(): void;
}
// interface IRFChartsDrawOptions {
//     type: string;
// }
class RFChartsDraw {
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
}
class WaterFallText extends RFChartsDraw implements IwaterFallTextInput {
    x: number = 0;
    y: number = 0;
    step;
    ctx: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    text = "";
    textAlign;
    constructor({ ctx, step = 1, textAlign = "left" }: IwaterFallTextInput) {
        super(ctx);
        this.step = step;
        this.ctx = ctx;
        this.textAlign = textAlign;
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
        this.ctx.fillText(this.text, this.x, this.y);
        this.ctx.restore();
    }
    update(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.fillText();
    }
}
/**
 * manager
 *      canvasArr
 *          canvasInfo
 *          DrawArr
 */

// 对象池
// class RFChartsPool {
//     // 池子
//     pool: IRFChartsDraw[] = [];
//     constructor() {
//         // 初始化
//     }
//     // 回收
//     recycle(draw: IRFChartsDraw) {
//         this.pool.push(draw);
//     }
//     // 创建
//     create() {
//         let draw = new RFChartsDraw(this.ctx);
//         return draw;
//     }
// }