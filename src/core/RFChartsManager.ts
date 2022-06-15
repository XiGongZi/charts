// 管控中心
export class RFChartsManager {
    dom: HTMLElement;
    // 画布管理，分层画布与draw对象
    canvasClass: CreateCanvas;
    // 画布位置计算模块，用于及时重置各个block的大小
    calcOptions: CalcOptions;
    // 渲染数据计算模块
    dataOptions: DataOptions;
    // 用户可设置的数项
    userSetOptions: IUserSetOptions;
    constructor(element: HTMLElement) {
        this.dom = element;
        this.userSetOptions = userDefaultSetting;
        this.calcOptions = new CalcOptions(element);
        this.dataOptions = new DataOptions(this.calcOptions);
        this.canvasClass = new CreateCanvas(element, this.calcOptions, this.dataOptions);
        this.canvasClass.setCanvas();
    }
    // 设置配置
    setOptions(options: IUserSetOptions) {
        // this.userSetOptions = {
        //     ...userDefaultSetting,
        //     ...options
        // }
        this.calcOptions.setOptions(options);
        this.resize();
        // this.canvasClass.setCanvas();
        // this.draw();
    }
    resize(): void {
        this.calcOptions.reset();
        this.canvasClass.resetCanvasBase();
        this.canvasClass.resize();
        // this.canvasClass.draw();
    }
    update(data: number[]): void {
        this.dataOptions.commit(data);
        this.canvasClass.draw();
    }
}