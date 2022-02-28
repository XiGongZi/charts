
/**
    用于给数组 @type IInputDataArr 每一项确定颜色  
    以接口的max和min为依据，范围内则使用对应的color  
 */
export interface IselectArround {
    max: number;
    min: number;
    color: string;
}
/**
 * canvas object
 */
export interface Ictx {
    ctx: CanvasRenderingContext2D;
}
/**
    用于给数组 @type IInputDataArr 每一项确定颜色  
    每一项都有max min color属性  
    以每一项的max和min为依据，范围内则使用对应的color  
 */
type IselectArroundArr = Array<IselectArround>;
/**
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
 * 输入的元数据，应为每个元素都为number的数组
 */
export type IInputDataArr = Array<number>;