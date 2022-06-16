/**
*
* @description 创建mock数据
*
* @param { number } limit 随机的长度
*
* @return { number[][] } 返回一个 每一元素为长度800的数组 数组， 每一元素的数字在0-100中随机
*
* @date 2022-06-15
*
* @author WangAnCheng
*
*/
export function createMockData(limit: number): number[][] {
    const data: number[][] = [];
    for (let i = 0; i < 100; i++) {
        const arr: number[] = [];
        for (let j = 0; j < limit; j++) {
            arr.push(getRandom(0, 100));
        }
        data.push(arr);
    }
    return data;
}
/**
*
* @description 获取随机数
*
* @param { number } min min
* @param { number } max max
*
* @return { number } range between min and max
*
* @date 2022-06-15
*
* @author WangAnCheng
*
*/
function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
