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
