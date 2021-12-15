## WaterFall 使用

```javascript
import rfCharts from "rf-charts";
// 传入canvas的元素ID
let flow = new rfCharts.WaterFall("canvasID");
// 初始化
flow.init(options);
// 更新数据 传入每一行应显示的数据数组,如 [2,3,1,4,5]
flow.update(array);
```

#### methods

| 方法名 | 参数   | 备注                                   |
| ------ | ------ | -------------------------------------- |
| init   | object | 基础配置项，可不填                     |
| update | array  | 每次需要更新的数据，会根据像素自动截取 |
| resize | none   | 重新绘制图表（重置宽高）               |

#### options

| 配置字段            | 类型           | 备注                             |
| ------------------- | -------------- | -------------------------------- |
| colorArr            | array          | 左侧显示的颜色梯度示例的颜色数组 |
| leftBlockColorWidth | int            | 左侧图例色块宽度 默认 20px       |
| leftBlockTextWidth  | int            | 左侧图例文本宽度 默认 30px       |
| rightBlockTextWidth | int            | 右侧文本宽度 默认 60px           |
| rightTextGapNum     | int            | 右侧文本滚动显示个数 默认 5px    |
| divHeight           | int            | 每一行数据的高度 默认 1px        |
| minMax              | array[int,int] | y 轴的范围 默认[-20,120]         |
| leftBarShowTimes    | int            | y 轴相邻显示数的差 默认 20       |
