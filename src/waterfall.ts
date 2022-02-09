/*
 * @Author: WangAnCheng 1079688386@qq.com
 * @Date: 2021-12-09 10:39:32
 * @Last Modified by: WangAnCheng 1079688386@qq.com
 * @Last Modified time: 2022-02-09 11:03:00
 */
import {ObjectPool} from "./utils";
interface IglobalConfig {
    // 左侧标题宽度
    leftBlockTitleWidth: number;
    // 文字颜色
    textColor: string;
    // 左侧图例色块宽度
    leftBlockColorWidth: number;
    // 左侧图例文本宽度
    leftBlockTextWidth: number;
    // 右侧文本宽度
    rightBlockTextWidth: number;
    // 总宽度
    totalWidth: number;
    // 色块左侧总宽度
    leftBarWidth: number;
    // 总高度度
    totalHeight: number;
    // 中间色块需要渲染的矩形总个数
    maxLen: number;
    // 右侧结束块宽度
    rightBlockEndWidth: number;
    // 右侧文本滚动显示个数
    rightTextGapNum: number;
    // 右侧文本滚动间隔
    rightTextGap: number;
    // 中间图表大小
    centerBlockWidth: number;
    // 每一行数据的高度
    divHeight: number;
    // y轴的范围
    minMax: Array<number>;
    // 左侧显示数据，y轴相邻数的差
    leftBarShowTimes: number;
    // 右侧文本开始坐标
    rightTextStartX: number;
    // 左侧显示的颜色梯度示例
    colorArr: Array<string>;
}
/**
    用于给数组 @type IInputDataArr 每一项确定颜色  
    以接口的max和min为依据，范围内则使用对应的color  
 */
interface IselectArround {
    max: number;
    min: number;
    color: string;
}
/**
 * canvas object
 */
interface Ictx {
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
interface IsetPosi {
    x?: number;
    y?: number;
}
/**
 * ctx.fillText 需要用到的参数
 */
interface IsetText extends IsetPosi {
    text?: string;
    textAlign?: CanvasTextAlign;
}
/**
 * waterFallTextInput 类需要传入的基本值
 */
interface IwaterFallTextInput extends IsetText, Ictx {
    step?: number;
}
/**
 * 输入的元数据，应为每个元素都为number的数组
 */
type IInputDataArr = Array<number>;
/**
 * 存储瀑布图每一行数据对应的颜色值
 */
type IInputDataColorArr = Array<string>;
// type IoriginData = Array<IInputDataArr>;
/**
    表示瀑布流的所有数据  
    数组的每一项是 IInputDataArr  
    
 */
type IoriginColor = Array<IInputDataColorArr>;
/**
 * 全局默认配置
 */
const globalConfig: IglobalConfig = {
    /**
     * 左侧图例色块宽度
     */
    leftBlockColorWidth: 20,
    /**
     * 文字颜色
    */
    textColor: '#000',
    /**
     * 左侧标题宽度
    */
    leftBlockTitleWidth: 100,
    /**
     * 左侧图例文本宽度
     */
    leftBlockTextWidth: 30,
    /**
     * 右侧文本宽度
     */
    rightBlockTextWidth: 60,
    /**
     * 总宽度
     */
    totalWidth: 900,
    /**
     * 色块左侧总宽度
     */
    leftBarWidth: 400,
    /**
     * 总高度度
     */
    totalHeight: 300,
    /**
     * 中间色块需要渲染的矩形总个数
     */
    maxLen: 100,
    /**
     * 右侧结束块宽度
    */
    rightBlockEndWidth: 20,
    /**
     * 右侧文本滚动显示个数
     */
    rightTextGapNum: 5,
    /**
     * 右侧文本滚动间隔
     */
    rightTextGap: 70,
    /**
     * 中间图表大小
     */
    centerBlockWidth: 0,
    /**
     * 每一行数据的高度
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
};

/**
    瀑布流文本绘制类    
    文本自动根据step  
    在使用draw方法后更新坐标  
 */
class WaterFallText implements IwaterFallTextInput {
    x:number=0;
    y:number=0;
    step;
    ctx: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    text="";
    textAlign;
    constructor({ ctx, step = 1, textAlign="left" }: IwaterFallTextInput) {
        this.step = step;
        this.ctx = ctx;
        this.textAlign = textAlign;
    }
    set({ x=0, y=0, text = 'left' }: IsetText) {
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
// 工具类
class Utils {
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
    setText({ textAlign = 'left', ctx, text = '', x = 0, y = 0 }: IwaterFallTextInput) {
        ctx.save();
        ctx.textAlign = textAlign;
        ctx.fillText(text, x, y);
        ctx.restore();
    }
    // 给定数组数值，输出对象的范围
    checkArround(arr: IInputDataArr = [], arrColor: IselectArroundArr = []): IInputDataColorArr {
        const res: IInputDataColorArr = [];
        // 算法优化
        // O(mn)  =>
        arr.forEach((ele) => {
            let flag = false;
            // 查找元数据每个成员所在范围对应的颜色，若超出范围则置入默认颜色
            arrColor.forEach((item) => {
                if (!flag) {
                    // 如果在范围内则push
                    if (ele >= item.min && ele <= item.max) {
                        flag = true;
                        res.push(item.color);
                    }
                }
            });
            // 如果不在范围内则填充灰色
            if (!flag) res.push('#f2f2f2');
        });
        return res;
    }
    /**
     *
     * @param param0 interface IglobalConfig
     * @returns 设置幅度颜色，后续根据颜色生成幅度与每一层刻度
     */
    genDataLimit({ minMax = [-20, 120], colorArr = [] }: IglobalConfig): IselectArroundArr {
        const finArr: IselectArroundArr = [];
        const min = minMax[0];
        const max = minMax[1];
        const arrLen = colorArr.length;
        const reduce = (max - min) / arrLen;
        colorArr.forEach((ele, index) => {
            const Arrmax = index ? finArr[index - 1].min : max;
            const Arrmin = index ? finArr[index - 1].min - reduce : max - reduce;
            finArr.push({
                max: Arrmax,
                min: Arrmin,
                color: ele
            });
        });
        return finArr;
    }
}
interface IDraw extends Ictx {
    element: string;
    globalConfig: IglobalConfig;
    dataLimit: IselectArroundArr;
    // 中间区域所需显示的像素数量
    pixelShow: number;
    originColor: IoriginColor;
    dateData: Array<WaterFallText | null>;
    checkIsDateNum: number;
    checkIsDateNumLimit: number;
    init: () => void;
    generateLeft: () => void;
    resetLeft: () => void;
    update: () => void;
    renderCenterImg: () => void;
    renderRightText: () => void;
    setRightDateHtml: (bool: boolean) => WaterFallText | null;
    commit: (_data: IInputDataArr) => void;
}
// Draw 主要逻辑与渲染
class Draw extends Utils implements IDraw {
    // CanvasRenderingContext2D 是windows内置的native code，不可实例化， 只能 CanvasRenderingContext2D.prototype 去填充默认
    ctx: CanvasRenderingContext2D = CanvasRenderingContext2D.prototype;
    element: string;
    globalConfig: IglobalConfig;
    dataLimit: IselectArroundArr = [];
    // 中间区域所需显示的像素数量
    pixelShow = 1;
    // originData = [];
    originColor: IoriginColor = [];
    dateData: Array<WaterFallText | null> = [];
    checkIsDateNum = 0;
    /**
     * 右侧时间文本间隔多少个渲染一次(当前70)
     */
    checkIsDateNumLimit = 70;
    constructor(element: string, data: object) {
        super();
        this.element = element;
        this.globalConfig = { ...globalConfig, ...data };
    }
    /**
     * @name init
     * @description 初始化方法，获取挂载节点，初始化基础样式，更新globalConfig配置信息， 初始化不变的背景
     */
    init() {
        // 不能为空且
        if (!this.element || typeof this.element !== 'string')
            return console.error("element must be string,and element !== '' !");
        // 创建2d区域
        const element: HTMLCanvasElement = document.getElementById(
            this.element
        ) as HTMLCanvasElement;
        this.ctx = element.getContext('2d') as CanvasRenderingContext2D;
        const ctx = this.ctx;
        if (!ctx) return;
        // 重置globalConfig
        const {
            leftBlockColorWidth,
            leftBlockTextWidth,
            leftBlockTitleWidth,
            rightBlockEndWidth,
            rightBlockTextWidth,
            textColor,
            divHeight,
            rightTextGapNum
        } = this.globalConfig;
        // 计算中间主要渲染区域的宽度
        const centerBlockWidth =
            element.width - leftBlockColorWidth - leftBlockTextWidth - leftBlockTitleWidth - rightBlockTextWidth-rightBlockEndWidth;
        this.globalConfig = {
            ...this.globalConfig,
            rightTextGap: parseInt((element.height / rightTextGapNum).toString(), 10),
            // 总宽度
            totalWidth: element.width,
            // 总高度度
            totalHeight: element.height,
            // 中间渲染色块的宽度
            centerBlockWidth,
            // 色块左侧总宽度
            leftBarWidth: leftBlockColorWidth + leftBlockTextWidth + leftBlockTitleWidth,
            // 中间色块需要渲染的矩形总个数
            maxLen: element.height / divHeight,
            // 右侧文本开始坐标
            rightTextStartX: element.width - rightBlockTextWidth - rightBlockEndWidth
        };
        // 设置右侧文本间隔
        this.checkIsDateNumLimit = this.globalConfig.rightTextGap;
        // 设置基础util工具方法
        // this.util = new Utils();
        // console.log(this);
        // 生成dataLimit方法，用以判断每一条数据所对应的色块
        this.dataLimit = this.genDataLimit(this.globalConfig);
        // 获取应显示的像素数量
        // console.log(this.globalConfig.centerBlockWidth);
        this.pixelShow = this.globalConfig.centerBlockWidth;
        // 是否需要乘以像素密度需要对应设备进行测试，暂保留此注释
        // this.globalConfig.centerBlockWidth * window.devicePixelRatio;
        // 初始化样式
        ctx.font = '12px serif';
        ctx.fillStyle = textColor;
        // 设置背景板
        this.resetLeft();
    }

    /**
     * @name generateLeft
     * @description 生成左边的阶梯图与文本
     */
    generateLeft() {
        const {
            minMax = [-20, 120],
            colorArr = [],
            leftBarShowTimes,
            totalHeight
        } = this.globalConfig;
        const ctx = this.ctx;
        // 生成title
        
        // 生成左侧图例文本
        const times = (minMax[1] - minMax[0]) / leftBarShowTimes;
        const childHeightText = totalHeight / times;
        for (let i = 0; i < times; i++) {
            this.setText({
                ctx,
                textAlign: 'center',
                x: 10+this.globalConfig.leftBlockTitleWidth,
                y: childHeightText * i + 10,
                text: (minMax[1] - i * leftBarShowTimes).toString()
            });
        }
        this.setText({
            ctx,
            textAlign: 'center',
            x: 10+this.globalConfig.leftBlockTitleWidth,
            y: totalHeight - 4,
            text: minMax[0].toString()
        });
        // 生成色块范围
        const len = colorArr.length;
        const childHeight = totalHeight / len;
        colorArr.forEach((ele, index) => {
            ctx.save();
            ctx.fillStyle = ele;
            ctx.fillRect(
                this.globalConfig.leftBlockTextWidth+this.globalConfig.leftBlockTitleWidth,
                index * childHeight,
                this.globalConfig.leftBlockColorWidth,
                childHeight
            );
            ctx.restore();
        });
    }

    /**
     * @name resetLeft
     * @description 重置左侧示例，先清除再绘制
     */
    resetLeft() {
        this.ctx.clearRect(0, 0, this.globalConfig.leftBarWidth, this.globalConfig.totalHeight);
        this.generateLeft();
    }

    /**
     * @name update
     * @description 调用 renderCenterImg() 和 renderRightText()
     */
    update() {
        // 渲染中间图像
        this.renderCenterImg();
        // 渲染右边文字
        this.renderRightText();
    }

    /**
     * @name renderCenterImg
     * @description 渲染中间区域内容
     */
    renderCenterImg() {
        // update
        const ctx = this.ctx;
        // console.log(this.globalConfig);
        // console.log(this.originColor);
        this.ctx.clearRect(
            this.globalConfig.leftBarWidth,
            0,
            this.globalConfig.leftBarWidth + this.globalConfig.centerBlockWidth,
            this.globalConfig.totalHeight
        );
        const x = this.globalConfig.leftBarWidth;
        const xEnd = this.globalConfig.rightTextStartX;
        this.originColor.forEach((ele, index) => {
            ctx.save();
            // ctx.fillRect(50, index * 2, this.globalConfig.centerBlockWidth, 2);
            const y = index * this.globalConfig.divHeight;
            // 右侧文本开始x坐标即中间画布的结束x坐标
            const lineargradient = ctx.createLinearGradient(x, y, xEnd, y);
            const len = ele.length;
            const times = 1 / len;
            ele.forEach((ele1, index1) => {
                lineargradient.addColorStop(index1 * times, ele1);
            });
            ctx.fillStyle = lineargradient;
            ctx.fillRect(
                this.globalConfig.leftBarWidth,
                y,
                this.globalConfig.centerBlockWidth,
                this.globalConfig.divHeight
            );
            ctx.restore();
        });
    }
    /**
     * @name renderRightText
     * @description 渲染右侧时间文本，清除右侧空间后，遍历dateData方法并调用draw绘制
     */
    renderRightText() {
        // clear rect
        this.ctx.clearRect(
            this.globalConfig.leftBarWidth + this.globalConfig.centerBlockWidth,
            0,
            this.globalConfig.rightBlockTextWidth,
            this.globalConfig.totalHeight
        );
        // redraw text
        this.dateData.forEach((ele) => {
            if (ele) {
                ele.draw();
            }
        });
    }
    /**
     * @name setRightDateHtml
     * @param {bool} bool 布尔值，是否创建 WaterFallText对象去渲染
     * @returns {null || WaterFallText} 根据bool值决定返回空或者WaterFallText对象
     * @description 根据布尔值创建并返回WaterFallText.draw()调用
     */
    setRightDateHtml(bool: boolean): WaterFallText | null {
        // console.log(bool);
        if (bool) {
            const date = this.getDate();
            const app = new WaterFallText({
                step: this.globalConfig.divHeight,
                ctx: this.ctx,
            });
            app.set({
                x: this.globalConfig.leftBarWidth + this.globalConfig.centerBlockWidth + 4,
                // ctx: this.ctx,
                y: 0,
                text: date
            })
            return app;
        } else {
            return null;
        }
    }
    /**
     *
     * @param {IInputDataArr} _data 最新数据，
     * @description 提交最新数据到内部存储空间，生成对应数据并且维护数据大小。执行完毕后调用 update() 方法更新数据
     */
    commit(_data: IInputDataArr) {
        // 【优化】根据需要显示的像素数量筛选出目标数量的数据
        const data = this.filter({ target: this.pixelShow, data: _data });
        if (!Array.isArray(data)) console.error('commit function need Array!');
        const len = this.originColor.length;
        // let len = this.originData.length;
        // 这里加20是为了让右侧时间文本下落到最后时能超出显示区域再移除
        if (len >= this.globalConfig.maxLen + 20) {
            // 如果长度超了，删除数组最后元素
            // this.originData.pop();
            this.originColor.pop();
            this.dateData.pop();
        }
        // this.originData.push(data);
        if (this.checkIsDateNum >= this.checkIsDateNumLimit) {
            this.checkIsDateNum = 0;
        }
        // 将元数据转换成目标色彩
        const colorArr = this.checkArround(data, this.dataLimit);
        // 添加进渲染队列
        this.originColor.unshift(colorArr);
        // this.originData.unshift(data);
        // checkIsDateNum 等于一个比 checkIsDateNumLimit小的数就可以了，这样checkIsDateNum在0到checkIsDateNumLimit循环的时候有一次对应上就赋值日期
        this.dateData.unshift(this.setRightDateHtml(!this.checkIsDateNum));
        this.update();
        this.checkIsDateNum++;
    }
}
interface IWaterFall {
    initData: number;
    initData1: number;
    isInit: boolean;
    element: string;
    chart: Draw;
    init: (data: object) => void;
    resize: () => void;
    update: (data: IInputDataArr) => void;
}
class WaterFall implements IWaterFall {
    initData = 0;
    initData1 = 0;
    isInit = false;
    element = '';
    chart;
    constructor(element: string) {
        if (!element) console.error("new WaterFall id('id');id is not defined!");
        this.element = element;
        this.chart = new Draw(this.element, {});
    }
    /**
     * @name init
     * @description 传入配置项，创建 Draw 类，并将所需参数设置进去
     */
    init(options = {}) {
        const chart = new Draw(this.element, options);
        chart.init();
        this.chart = chart;
        this.isInit = true;
    }
    /**
     * @name resize
     * @description 重新绘制图表（重置宽高）
     */
    resize() {
        this.chart.init();
    }
    /**
     * @name update
     * @description 传入每次需要更新的数据，会根据像素自动截取
     */
    update(data: IInputDataArr) {
        if (!this.isInit) return console.error('WaterFall need WaterFall.init() in the first!');
        this.chart.commit(data);
    }
}
export default WaterFall;
