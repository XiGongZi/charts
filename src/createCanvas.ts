import { IwaterFallTextInput, IsetText } from './baseInterface';
// 创建管理画布
/**
 * 1. 分层
 * 2. 动静分离管理
 * 3. resize
 */
// 用户设置的参数
const userDefaultSetting: IUserSetOptions = {
    /**
     * 中间瀑布图每一行数据的高度
     */
    divHeight: 1,
    /**
     * y轴的范围
     */
    minMax: [-20, 120],
    /**
     * 右侧文本开始坐标
     */
    rightTextStartX: 800,
    /**
     * 左侧显示数据，y轴相邻数的差
     */
    leftBarShowTimes: 20,
    /**
     * 左侧显示的颜色梯度示例
     */
    colorArr: [
        '#FF0000',
        '#FF0000',
        '#FF3700',
        '#FF6E00',
        '#FFA500',
        '#FFDC00',
        '#EBFF00',
        '#CCFF00',
        '#8CFF00',
        '#65FF00',
        '#0FFF00',
        '#00FFBF',
        '#00FAFF',
        '#00C3FF',
        '#008BFF',
        '#0000FF'
    ]
}
interface IUserSetOptions {
    divHeight?: number;
    minMax?: [number, number];
    rightTextStartX?: number;
    leftBarShowTimes?: number;
    colorArr?: string[]
}
interface IOptions extends IUserSetOptions {
    domWidth: number;
    domHeight: number;
    // 瀑布图左侧总大小
    leftBlock_Total: number;
    leftBlock_title: number;
    leftBlock_text: number,
    leftBlock_color: number,
    // 瀑布图右侧总大小
    rightBlock_Total: number;
    // 瀑布图总大小
    centerBlock_Total: number;
}
interface ICanvasBase {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    drawArr: RFChartsDraw[]
}
class CreateCanvas {
    dom: HTMLElement;
    canvasDomArr: ICanvasBase[] = [];
    calcOptions: CalcOptions;
    constructor(element: HTMLElement, calcOptions: CalcOptions) {
        this.dom = element;
        this.calcOptions = calcOptions;
        // 设置dom宽高
        this.resize();
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
        this.calcOptions.reset()
        this.canvasDomArr.forEach((canvasBase: ICanvasBase) => {
            canvasBase.canvas.width = this.calcOptions.options.domWidth || 0;
            canvasBase.canvas.height = this.calcOptions.options.domHeight || 0;
        })
        this.draw();
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
        canvasDom.width = this.calcOptions.options.domWidth || 0;
        canvasDom.height = this.calcOptions.options.domHeight || 0;
        // 初始化 设置canvas相对定位
        canvasDom.style.position = 'absolute';
        // 初始化 设置canvas层级
        canvasDom.style.zIndex = index + '';
        // 初始化 设置canvas背景 测试用
        canvasDom.style.backgroundColor = 'rgba(255,0,0,0.5)';
        this.dom.appendChild(canvasDom);
        // 
        let ctx = canvasDom.getContext("2d", { alpha: index === 1 }) as CanvasRenderingContext2D;
        let text = new TestBlock(ctx, this.calcOptions);
        this.canvasDomArr.push({ canvas: canvasDom, ctx, drawArr: [text] });
        // 测试
        // this.test()
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

// 管控中心
class RFChartsManager {
    dom: HTMLElement;
    // 画布管理，分层画布与draw对象
    canvasClass: CreateCanvas;
    // 计算模块，用于及时重置各个block的大小
    calcOptions: CalcOptions;
    // 用户可设置的数项
    userSetOptions: IUserSetOptions;
    constructor(element: HTMLElement) {
        this.dom = element;
        this.userSetOptions = userDefaultSetting;
        this.calcOptions = new CalcOptions(element);
        this.canvasClass = new CreateCanvas(element, this.calcOptions);
    }
    // 设置配置
    setOptions(options: IUserSetOptions) {
        // this.userSetOptions = {
        //     ...userDefaultSetting,
        //     ...options
        // }
        this.calcOptions.setOptions(options);
        this.canvasClass.setCanvas();
        // this.draw();
    }
    resize(): void {
        this.canvasClass.resize();
        // this.canvasClass.draw();
    }
    commit(data: number[]): void {
        // 
    }
}
interface Iposition {
    leftBlock_xStart: number;
    leftBlock_xEnd: number;
    leftBlock_text_xStart: number;
    leftBlock_text_xEnd: number;
    leftBlock_color_xStart: number;
    leftBlock_color_xEnd: number;
    centerBlock_xStart: number;
    centerBlock_xEnd: number;
    rightBlock_xStart: number;
    rightBlock_xEnd: number;
}
class CalcOptions {
    options: IOptions = {
        domWidth: 0,
        domHeight: 0,
        leftBlock_Total: 0,
        leftBlock_title: 0,
        leftBlock_text: 30,
        leftBlock_color: 20,
        rightBlock_Total: 0,
        centerBlock_Total: 0,
        ...userDefaultSetting
    };
    positions: Iposition = {
        leftBlock_xStart: 0,
        leftBlock_xEnd: 0,
        leftBlock_text_xStart: 0,
        leftBlock_text_xEnd: 0,
        leftBlock_color_xStart: 0,
        leftBlock_color_xEnd: 0,
        centerBlock_xStart: 0,
        centerBlock_xEnd: 0,
        rightBlock_xStart: 0,
        rightBlock_xEnd: 0,
    };
    dom: HTMLElement;
    constructor(element: HTMLElement) {
        this.dom = element;
        this.reset()
    }
    setOptions(options: IUserSetOptions) {
        this.options = {
            ...this.options,
            ...options
        }
        this.reset()
    }
    reset() {
        // 设置dom宽高
        this.options.domWidth = this.dom.clientWidth;
        this.options.domHeight = this.dom.clientHeight;
        // ---------- 设置各个位置 ----------
        // 计算瀑布图左侧总大小
        this.options.leftBlock_Total = this.options.domWidth * 0.02 + 30;
        // 计算瀑布图右侧总大小
        this.options.rightBlock_Total = this.options.domWidth * 0.05;
        // 计算瀑布图总大小
        this.options.centerBlock_Total = this.options.domWidth * 0.93 - 30;
        // this.options = {
        //     ...this.options,
        // }
        this.positions = this.getPosition();
    }
    getPosition() {
        // ----- 示例 -----
        //  |  左侧-title 不填充内容 | 左侧-文字图例 | 左侧-颜色块图例  |  中间瀑布图  |  右侧文本  |
        // 左侧方块 起始位置
        let leftBlock_xStart = 0;
        // 左侧方块 结束位置
        let leftBlock_xEnd = this.options.leftBlock_Total;
        // 左侧-颜色块图例 起始位置
        let leftBlock_color_xStart = leftBlock_xEnd - this.options.leftBlock_color;
        // 左侧-颜色块图例 结束位置
        let leftBlock_color_xEnd = leftBlock_xEnd;
        // 左侧-文字图例 起始位置
        let leftBlock_text_xStart = leftBlock_color_xStart - this.options.leftBlock_text;
        // 左侧-文字图例 结束位置
        let leftBlock_text_xEnd = leftBlock_color_xStart;
        // 中间瀑布图 起始位置
        let centerBlock_xStart = this.options.leftBlock_Total;
        // 中间瀑布图 结束位置
        let centerBlock_xEnd = this.options.domWidth - this.options.rightBlock_Total;
        // 右侧方块 起始位置
        let rightBlock_xStart = centerBlock_xEnd;
        // 右侧方块 结束位置
        let rightBlock_xEnd = this.options.domWidth;
        return {
            leftBlock_xStart,
            leftBlock_xEnd,
            leftBlock_text_xStart,
            leftBlock_text_xEnd,
            leftBlock_color_xStart,
            leftBlock_color_xEnd,
            centerBlock_xStart,
            centerBlock_xEnd,
            rightBlock_xStart,
            rightBlock_xEnd,
        }
    }
}
class RFChartsDraw {
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
    draw() { }
}
class TestBlock extends RFChartsDraw {
    calcOptions: CalcOptions;
    constructor(ctx: CanvasRenderingContext2D, calcOptions: CalcOptions) {
        super(ctx);
        this.calcOptions = calcOptions;
    }
    draw(): void {
        this.ctx.save();
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.calcOptions.positions.leftBlock_xStart, 0, this.calcOptions.positions.leftBlock_xEnd - this.calcOptions.positions.leftBlock_xStart, this.calcOptions.options.domHeight);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.calcOptions.positions.leftBlock_color_xStart, 0, this.calcOptions.positions.leftBlock_color_xEnd - this.calcOptions.positions.leftBlock_color_xStart, this.calcOptions.options.domHeight);
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.calcOptions.positions.leftBlock_text_xStart, 0, this.calcOptions.positions.leftBlock_text_xEnd - this.calcOptions.positions.leftBlock_text_xStart, this.calcOptions.options.domHeight);
        this.ctx.fillStyle = '#880000';
        this.ctx.fillRect(this.calcOptions.positions.centerBlock_xStart, 0, this.calcOptions.positions.centerBlock_xEnd - this.calcOptions.positions.centerBlock_xStart, this.calcOptions.options.domHeight);
        this.ctx.fillStyle = '#888800';
        this.ctx.fillRect(this.calcOptions.positions.rightBlock_xStart, 0, this.calcOptions.positions.rightBlock_xEnd - this.calcOptions.positions.rightBlock_xStart, this.calcOptions.options.domHeight);
        this.ctx.restore();
    }
}
class TestText extends RFChartsDraw {
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }
    draw() {
        this.ctx.save();
        console.log(111)
        this.ctx.fillStyle = 'rgba(22,22,22,1)';
        this.ctx.fillText('测试', 100, 100);
        this.ctx.restore();
    }
}
/**
 * manager
 *      canvasArr
 *          canvasInfo
 *          DrawArr
 *              Text
 *              Line
 *              colorBlock
 *
 * 初始化 --》 计算对应位置 --》 生成draw对象 --》 绘制
 * commit数据 --》 更新draw对象 --》 绘制
 */