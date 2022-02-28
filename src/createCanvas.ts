import { ISpectraColor, IInputDataArr } from './baseInterface';
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

class Utils {
    constructor() { }
    // 从源数据中过滤出目标数量，尽量平均
    filter({ target = 300, data = [] }: { target: number; data: IInputDataArr }): IInputDataArr {
        const len = data.length;
        // 小于等于target
        if (len <= target) return data;
        // 若大于target
        /**
         * 先按照矩形拆成目标个数的格子
         * 然后取每一个格子内的最后一个整数，作为下标去取源数据对应的像素颜色
         */
        const step = len / target;
        const arr: IInputDataArr = [];
        let num = step;
        for (let i = 0; i < target; i++) {
            arr.push(data[Math.floor(num) - 1]);
            num += step;
        }
        return arr;
    }
    getDate(): string {
        const datetime = new Date();
        const hh = datetime.getHours();
        const MF = datetime.getMinutes();
        const mf = MF < 10 ? '0' + MF : MF;
        const SS = datetime.getSeconds();
        const ss = SS < 10 ? '0' + SS : SS;
        return hh + ':' + mf + ':' + ss;
    }
}
class CreateCanvas {
    dom: HTMLElement;
    canvasDomArr: ICanvasBase[] = [];
    calcOptions: CalcOptions;
    constructor(element: HTMLElement, calcOptions: CalcOptions) {
        this.dom = element;
        this.calcOptions = calcOptions;
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
        this.calcOptions.reset()
        this.canvasDomArr.forEach((canvasBase: ICanvasBase) => {
            canvasBase.canvas.width = this.calcOptions.options.domWidth || 0;
            canvasBase.canvas.height = this.calcOptions.options.domHeight || 0;
        })
        this.draw();
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
        // canvasDom.style.backgroundColor = 'rgba(255,0,0,0.5)';
        this.dom.appendChild(canvasDom);
        // 
        let ctx = canvasDom.getContext("2d", { alpha: index === 1 }) as CanvasRenderingContext2D;
        let drawArr = [];
        // drawArr.push(new TestBlock(ctx, this.calcOptions))
        drawArr.push(new DrawLeftBlock(ctx, this.calcOptions))

        this.canvasDomArr.push({ canvas: canvasDom, ctx, drawArr });
        // 测试
        // this.test()
        this.draw()
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
        leftBlock_color: 10,
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
    spectraColor: ISpectraColor[] = [];
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
        // 如果用户设置了参数 再reset
        if (options) this.reset()
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
        this.genSpectraColor(this.options)
        console.log(this.spectraColor)
    }

    /**
     *
     * @param param0 interface IglobalConfig
     * @returns 设置幅度颜色，后续根据颜色生成幅度与每一层刻度
     */
    genSpectraColor({ minMax = [-20, 120], colorArr = [] }: IOptions) {
        const spectraColor: ISpectraColor[] = [];
        const min = minMax[0];
        const max = minMax[1];
        const arrLen = colorArr.length;
        const reduce = (max - min) / arrLen;
        colorArr.forEach((ele, index) => {
            const Arrmax = index ? spectraColor[index - 1].min : max;
            const Arrmin = index ? spectraColor[index - 1].min - reduce : max - reduce;
            spectraColor.push({
                max: Arrmax,
                min: Arrmin,
                color: ele
            });
        });
        this.spectraColor = spectraColor;
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
class RFChartsDraw extends Utils {
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
    }
    draw() { }
}
// 绘制中间瀑布图
class DrawCenterWaterfall extends RFChartsDraw {
    ctx: CanvasRenderingContext2D;
    calcOptions: CalcOptions;
    constructor(ctx: CanvasRenderingContext2D, calcOptions: CalcOptions) {
        super(ctx);
        this.ctx = ctx;
        this.calcOptions = calcOptions;
    }
}
// 左侧文本与图例
class DrawLeftBlock extends RFChartsDraw {
    ctx: CanvasRenderingContext2D;
    calcOptions: CalcOptions;
    times: number = 1;
    minMax: [number, number] = [0, 0];
    childHeightText: number = 0;
    leftBarShowTimes: number = 0;
    constructor(ctx: CanvasRenderingContext2D, calcOptions: CalcOptions) {
        super(ctx);
        this.ctx = ctx;
        this.calcOptions = calcOptions;
        this.reset()
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
/**
 * manager
 *      canvasArr
 *          canvasInfo
 *          DrawArr
 *              Text
 *              Line
 *              colorBlock
 * 
 *      dataControl
 *
 * 初始化 --》 计算对应位置 --》 生成draw对象 --》 绘制
 * commit数据 --》 更新draw对象 --》 绘制
 * 
 * dataControl
 * 输入: 元数据，number[]
 * 输出: 颜色数组，color-string[] 元数据 number[]
 */