/**
    用于给数组 @type  Array<number> 每一项确定颜色  
    以接口的max和min为依据，范围内则使用对应的color  
 */
interface ISpectraColor {
    max: number;
    min: number;
    color: string;
}