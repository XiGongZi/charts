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
class CreateCanvas {
    dom: HTMLElement;
    canvasDomArr: HTMLCanvasElement[] = [];
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
        this.canvasDomArr.forEach((canvasDom: HTMLCanvasElement) => {
            canvasDom.width = this.options.domWidth || 0;
            canvasDom.height = this.options.domHeight || 0;
        })
    }
    test() {

        this.canvasDomArr.forEach((canvasDom: HTMLCanvasElement) => {
            // 如果 canvasDom 不存在则跳下一个
            if (!canvasDom) return;
            let ctx = canvasDom.getContext("2d");
            // 如果 ctx 不存在则跳下一个
            if (!ctx) return;
            ctx.fillRect(0, 0, canvasDom.width, canvasDom.height);
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
        this.canvasDomArr.push(canvasDom);
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