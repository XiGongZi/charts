

import { WaterFallText } from "../core/WaterFallText";
type TcheckIsNeedPopData = Array<number>[] | Array<WaterFallText | null> | CanvasGradient[] | Array<string>[]
/**
*
* @description 工具类 
*
* @date 2022-06-14
*
* @author WangAnCheng
*
*/

export class Utils {
    constructor() { }
    static checkIsNeedPopData(arr: TcheckIsNeedPopData, limit: number) {
        if (arr.length >= limit + 20) arr.pop()
    }
    // 从源数据中过滤出目标数量，尽量平均
    static filter({ target = 300, data = [] }: { target: number; data: Array<number> }): Array<number> {
        const len = data.length;
        // 小于等于target
        if (len <= target) return data;
        // 若大于target
        /**
         * 先按照矩形拆成目标个数的格子
         * 然后取每一个格子内的最后一个整数，作为下标去取源数据对应的像素颜色
         */
        const step = len / target;
        const arr: Array<number> = [];
        let num = step;
        for (let i = 0; i < target; i++) {
            arr.push(data[Math.floor(num) - 1]);
            num += step;
        }
        return arr;
    }

    // 给定数组数值，输出对象的范围
    static checkArround(arr: Array<number> = [], arrColor: ISpectraColor[] = []): Array<string> {
        const res: Array<string> = [];
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
    static getDate(): string {
        const datetime = new Date();
        const hh = datetime.getHours();
        const MF = datetime.getMinutes();
        const mf = MF < 10 ? '0' + MF : MF;
        const SS = datetime.getSeconds();
        const ss = SS < 10 ? '0' + SS : SS;
        return hh + ':' + mf + ':' + ss;
    }
}