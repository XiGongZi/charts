import { WaterFallText } from "./WaterFallText"
import { CalcOptions } from "./CalcOptions"
import { Utils } from "../utils/common"
// 做数据转换与存储
export class DataOptions {
    // ctx: CanvasRenderingContext2D;
    calcOptions: CalcOptions;
    // 元数据
    originData: Array<number>[] = [];

    // 用以存储渐变色lineargradient对象，避免重复创建
    originLineargradient: CanvasGradient[] = [];
    // 颜色数组
    colorArr: Array<string>[] = [];
    dateArr: Array<WaterFallText | null> = [];
    checkIsDateNum = -1;
    /**
     * 右侧时间文本间隔多少个渲染一次(当前70)
     */
    checkIsDateNumLimit = 70;
    constructor(options: CalcOptions) {
        // this.ctx = ctx;
        this.calcOptions = options;
    }
    resetOriginLineargradient(originLineargradient: CanvasGradient[]) {
        this.originLineargradient = originLineargradient;
    }
    setOriginLineargradient(lineargradient: CanvasGradient) {
        this.originLineargradient.unshift(lineargradient);
    }
    setDateWaterText(date: WaterFallText | null) {
        this.dateArr.unshift(date);
    }
    commit(data: Array<number>) {
        if (!Array.isArray(data)) throw new Error('commit function need Array!');
        // data = this.filter({ data: data, target: this.calcOptions.options.centerBlock_Total });
        const { domHeight } = this.calcOptions.options;
        Utils.checkIsNeedPopData(this.dateArr, domHeight);
        Utils.checkIsNeedPopData(this.originData, domHeight);
        Utils.checkIsNeedPopData(this.colorArr, domHeight);
        Utils.checkIsNeedPopData(this.originLineargradient, domHeight);
        // 将元数据转换成目标色彩
        if (this.checkIsDateNum >= this.checkIsDateNumLimit) {
            this.checkIsDateNum = -1;
        }
        // console.log(this.checkIsDateNum)
        const colorArr = Utils.checkArround(data, this.calcOptions.spectraColor);
        // this.createLinearGradient(leftBarWidth, y, rightTextStartX, y, ctx, ele);
        // 添加进渲染队列
        this.colorArr.unshift(colorArr);
        this.originData.unshift(data);
        // this.dateArr.unshift(this.setRightDateHtml(!this.checkIsDateNum));
        // console.log(this.originData.length);
        // checkIsDateNum 等于一个比 checkIsDateNumLimit小的数就可以了，这样checkIsDateNum在0到checkIsDateNumLimit循环的时候有一次对应上就赋值日期
        // this.dateData.unshift(this.setRightDateHtml(!this.checkIsDateNum));
        // this.update();
        this.checkIsDateNum++;
    }
}