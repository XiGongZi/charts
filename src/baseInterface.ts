
/**
    用于给数组 @type IInputDataArr 每一项确定颜色  
    以接口的max和min为依据，范围内则使用对应的color  
 */
export interface ISpectraColor {
    max: number;
    min: number;
    color: string;
}
/**
 * canvas object
 */
export interface Ictx {
    ctx: CanvasRenderingContext2D;
}/**
    xy坐标
 */
export interface IsetPosi {
    x?: number;
    y?: number;
}

/**
 * ctx.fillText 需要用到的参数
 */
export interface IsetText extends IsetPosi {
    text?: string;
    textAlign?: CanvasTextAlign;
}
/**
 * waterFallTextInput 类需要传入的基本值
 */
export interface IwaterFallTextInput extends IsetText, Ictx {
    step?: number;
}

/**
 * 存储瀑布图每一行数据对应的颜色值
 */
export type IInputDataColorArr = Array<string>;
/**
 * 输入的元数据，应为每个元素都为number的数组
 */
export type IInputDataArr = Array<number>;


// RFChartsDraw

abstract class RFChartsDraw {
    draw(): void { }
    resize(): void { }
}

export interface ICanvasBase {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    drawArr: RFChartsDraw[]
}
export abstract class CalcOptions {
    // 设置属性
    setOptions(): void { }
    // 重置属性
    reset(): void { }
    // 计算相应位置
    getPosition(): void { }
    constructor() { }
}
abstract class DataOptions {
    calcOptions: CalcOptions = CalcOptions.constructor();
    // 元数据
    originData: IInputDataArr[] = [];
    // 设置属性
    setOptions(): void { }
    // 重置属性
    reset(): void { }
    // 计算相应位置
    getPosition(): void { }
}
// CreateCanvas 
export interface ICreateCanvas {
    dom: HTMLElement;
    canvasDomArr: ICanvasBase[];
    calcOptions: CalcOptions;
    dataOptions: DataOptions;
}

// Manager

// export interface IManager {
//     dom: HTMLElement;
//     // 画布管理，分层画布与draw对象
//     canvasClass: CreateCanvas;
//     // 画布位置计算模块，用于及时重置各个block的大小
//     calcOptions: CalcOptions;
//     // 渲染数据计算模块
//     dataOptions: DataOptions;
//     // 用户可设置的数项
//     userSetOptions: IUserSetOptions;
// }