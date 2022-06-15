
export class CalcOptions {
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
    // 瀑布图 每一个数据值区间所对应的颜色限制
    spectraColor: ISpectraColor[] = [];
    dom: HTMLElement;
    constructor(element: HTMLElement) {
        this.dom = element;
        this.reset()
        this.genSpectraColor(this.options)
    }
    setOptions(options: IUserSetOptions) {
        this.options = {
            ...this.options,
            ...options
        }
        // 如果用户设置了参数 再reset
        if (options) {
            this.reset()
            this.genSpectraColor(this.options)
        }
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
        // console.log(this.spectraColor)
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