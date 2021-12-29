/*
 * @Author: WangAnCheng 1079688386@qq.com
 * @Date: 2021-12-09 10:39:32
 * @Last Modified by: WangAnCheng 1079688386@qq.com
 * @Last Modified time: 2021-12-17 08:52:27
 */
let globalConfig = {
  // 左侧图例色块宽度
  leftBlockColorWidth: 20,
  // 左侧图例文本宽度
  leftBlockTextWidth: 30,
  // 右侧文本宽度
  rightBlockTextWidth: 60,
  // 总宽度
  totalWidth: 900,
  // 总高度度
  totalHeight: 300,
  // 右侧文本滚动显示个数
  rightTextGapNum: 5,
  // 右侧文本滚动间隔
  rightTextGap: 70,
  // 中间图表大小
  centerBlockWidth: 0,
  // 每一行数据的高度
  divHeight: 1,
  // y轴的范围
  minMax: [-20, 120],
  // 左侧显示数据，y轴相邻数的差
  leftBarShowTimes: 20,
  // 左侧显示的颜色梯度示例
  colorArr: [
    "#FF0000",
    "#FF3700",
    "#FF6E00",
    "#FFA500",
    "#FFDC00",
    "#EBFF00",
    "#CCFF00",
    "#8CFF00",
    "#65FF00",
    "#0FFF00",
    "#00FFBF",
    "#00FAFF",
    "#00C3FF",
    "#008BFF",
    "#0000FF",
  ],
};
// 文本自动根据step重新绘制在新位置的类
class WaterFallText {
  constructor({ x, y, ctx, step = 1, text = "", textAlign = "left" }) {
    this.x = x;
    this.y = y;
    this.step = step;
    this.ctx = ctx;
    this.text = text;
    this.textAlign = textAlign;
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
  update(x, y) {
    this.x = x;
    this.y = y;
    this.fillText();
  }
}
// 工具类
class Utils {
  // 从源数据中过滤出目标数量，尽量平均
  filter({ target = 300, data = [] }) {
    let len = data.length;
    //小于等于target
    if (len <= target) return data;
    // 若大于target
    /**
     * 先按照矩形拆成目标个数的格子
     * 然后取每一个格子内的最后一个整数，作为下标去取源数据对应的像素颜色
     */
    let step = len / target;
    let arr = [];
    let num = step;
    for (let i = 0; i < target; i++) {
      arr.push(data[Math.floor(num) - 1]);
      num += step;
    }
    return arr;
  }
  getDate() {
    let datetime = new Date();
    let hh = datetime.getHours();
    let MF = datetime.getMinutes();
    let mf = MF < 10 ? "0" + MF : MF;
    let SS = datetime.getSeconds();
    let ss = SS < 10 ? "0" + SS : SS;
    return hh + ":" + mf + ":" + ss;
  }
  setText({ textAlign = "left", ctx, text = "", x = 0, y = 0 }) {
    ctx.save();
    ctx.textAlign = textAlign;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  // 给定数组数值，输出对象的范围
  checkArround(
    //
    arr = [1, 2, 29],
    arrColor = [
      {
        max: 10,
        min: 0,
        color: "rgb(0, 117, 128)",
      },
    ]
  ) {
    let res = [];
    // 算法优化
    // O(mn)  =>
    arr.forEach((ele, index) => {
      let flag = false;
      arrColor.forEach((item) => {
        if (!flag) {
          let equal = ele >= item.min && ele <= item.max;
          if (equal) (flag = true), res.push(item.color);
        }
      });
      // 如果不在范围内则填充灰色
      if (!flag) res.push("#f2f2f2");
    });
    return res;
  }
  // 设置幅度颜色，后续根据颜色生成幅度与每一层刻度
  genDataLimit({ minMax = [-20, 120], colorArr = [] }) {
    let finArr = [];
    let min = minMax[0];
    let max = minMax[1];
    let arrLen = colorArr.length;
    let reduce = (max - min) / arrLen;
    colorArr.forEach((ele, index) => {
      let Arrmax = index ? finArr[index - 1].min : max;
      let Arrmin = index ? finArr[index - 1].min - reduce : max - reduce;
      finArr.push({
        max: Arrmax,
        min: Arrmin,
        color: ele,
      });
    });
    return finArr;
  }
}
// Draw 主要逻辑与渲染
class Draw extends Utils {
  constructor(element, data) {
    super();
    this.element = element;
    this.globalConfig = { ...globalConfig, ...data };
  }
  ctx;
  globalConfig;
  dataLimit;
  // 中间区域所需显示的像素数量
  pixelShow;
  originData = [];
  originColor = [];
  dateData = [];
  checkIsDateNum = 0;
  checkIsDateNumLimit = 70;
  /**
   * @name init
   * @description 初始化方法，获取挂载节点，初始化基础样式，更新globalConfig配置信息， 初始化不变的背景
   */
  init() {
    // 创建2d区域
    let element = document.getElementById(this.element);
    this.ctx = element.getContext("2d");
    let ctx = this.ctx;
    // 是否需要乘以像素密度需要对应设备进行测试，暂保留此注释
    // this.globalConfig.centerBlockWidth * window.devicePixelRatio;
    // 初始化样式
    ctx.font = "12px serif";
    // 重置globalConfig
    let {
      leftBlockColorWidth,
      leftBlockTextWidth,
      rightBlockTextWidth,
      divHeight,
      rightTextGapNum,
    } = this.globalConfig;
    // 计算中间主要渲染区域的宽度
    let centerBlockWidth =
      element.width -
      leftBlockColorWidth -
      leftBlockTextWidth -
      rightBlockTextWidth;
    this.globalConfig = {
      ...this.globalConfig,
      rightTextGap: parseInt(element.height / rightTextGapNum),
      // 总宽度
      totalWidth: element.width,
      // 总高度度
      totalHeight: element.height,
      // 中间渲染色块的宽度
      centerBlockWidth,
      // 色块左侧总宽度
      leftBarWidth: leftBlockColorWidth + leftBlockTextWidth,
      // 中间色块需要渲染的矩形总个数
      maxLen: element.height / divHeight,
      // 右侧文本开始坐标
      rightTextStartX: element.width - rightBlockTextWidth,
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
    // 设置背景板
    this.resetLeft();
  }

  /**
   * @name generateLeft
   * @description 生成左边的阶梯图与文本
   */
  generateLeft() {
    let {
      minMax = [-20, 120],
      colorArr = [],
      leftBarShowTimes,
      totalHeight,
    } = this.globalConfig;
    let ctx = this.ctx;
    // 生成左侧图例
    let times = (minMax[1] - minMax[0]) / leftBarShowTimes;
    let childHeightText = totalHeight / times;
    for (let i = 0; i < times; i++) {
      this.setText({
        ctx,
        textAlign: "left",
        x: 10,
        y: childHeightText * i + 10,
        text: minMax[1] - i * leftBarShowTimes,
      });
    }
    this.setText({
      ctx,
      textAlign: "left",
      x: 10,
      y: totalHeight - 4,
      text: minMax[0],
    });
    // 生成色块范围
    let len = colorArr.length;
    let childHeight = totalHeight / len;
    colorArr.forEach((ele, index) => {
      ctx.save();
      ctx.fillStyle = ele;
      ctx.fillRect(
        this.globalConfig.leftBlockTextWidth,
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
    this.ctx.clearRect(
      0,
      0,
      this.globalConfig.leftBarWidth,
      this.globalConfig.totalHeight
    );
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
    let ctx = this.ctx;
    // console.log(this.globalConfig);
    // console.log(this.originColor);
    this.ctx.clearRect(
      this.globalConfig.leftBarWidth,
      0,
      this.globalConfig.leftBarWidth + this.globalConfig.centerBlockWidth,
      this.globalConfig.totalHeight
    );
    let x = this.globalConfig.leftBarWidth;
    let xEnd = this.globalConfig.rightTextStartX;
    this.originColor.forEach((ele, index) => {
      ctx.save();
      // ctx.fillRect(50, index * 2, this.globalConfig.centerBlockWidth, 2);
      let y = index * this.globalConfig.divHeight;
      // 右侧文本开始x坐标即中间画布的结束x坐标
      let lineargradient = ctx.createLinearGradient(x, y, xEnd, y);
      let len = ele.length;
      let times = 1 / len;
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
    this.ctx.clearRect(
      this.globalConfig.leftBarWidth + this.globalConfig.centerBlockWidth,
      0,
      this.globalConfig.rightBlockTextWidth,
      this.globalConfig.totalHeight
    );
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
  setRightDateHtml(bool) {
    // console.log(bool);
    if (bool) {
      let date = this.getDate();
      return new WaterFallText({
        x:
          this.globalConfig.leftBarWidth +
          this.globalConfig.centerBlockWidth +
          4,
        y: 0,
        step: this.globalConfig.divHeight,
        ctx: this.ctx,
        text: date,
      });
    } else {
      return null;
    }
  }
  /**
   *
   * @param {Array} data 最新数据，
   * @description 提交最新数据到内部存储空间，生成对应数据并且维护数据大小。执行完毕后调用 update() 方法更新数据
   */
  commit(_data) {
    // 【优化】根据需要显示的像素数量筛选出目标数量的数据
    let data = this.filter({ target: this.pixelShow, data: _data });
    // console.log(_data.length);
    // console.log(this.pixelShow);
    // log 测试data数据 请删除
    // if (window.handleFlag) console.log(this.globalConfig, this.dateData);
    if (!Array.isArray(data)) console.error("commit function need Array!");
    let len = this.originData.length;
    if (len >= this.globalConfig.maxLen + 20) {
      // 如果长度超了，删除数组最后元素
      this.originData.pop();
      this.originColor.pop();
      this.dateData.pop();
    }
    // this.originData.push(data);

    // console.log(data[0] + data[1] + data[2] + data[3]);

    if (this.checkIsDateNum >= this.checkIsDateNumLimit) {
      this.checkIsDateNum = 0;
    }
    let colorArr = this.checkArround(data, this.dataLimit);
    this.originColor.unshift(colorArr);
    this.originData.unshift(colorArr);
    // checkIsDateNum 等于一个比 checkIsDateNumLimit小的数就可以了，这样checkIsDateNum在0到checkIsDateNumLimit循环的时候有一次对应上就赋值日期
    this.dateData.unshift(this.setRightDateHtml(!!!this.checkIsDateNum));
    this.update();
    this.checkIsDateNum++;
  }
}
class WaterFall {
  constructor(element) {
    if (!element) console.error("new WaterFall id('id');id is not defined!");
    this.element = element;
  }
  initData = 0;
  initData1 = 0;
  isInit = false;
  chart;
  /**
   * @name init
   * @description 传入配置项，创建 Draw 类，并将所需参数设置进去
   */
  init(options = {}) {
    let chart = new Draw(this.element, options);
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
  update(data) {
    if (!this.isInit)
      return console.error("WaterFall need WaterFall.init() in the first!");
    this.chart.commit(data);
  }
}
export default WaterFall;
