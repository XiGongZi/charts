## WaterFall 使用

#### WaterFall

- 描述
  对外直接暴露的类

| 方法名      | 参数    | 备注                                           |
| ----------- | ------- | ---------------------------------------------- |
| constructor | string  | 传入 canvas 元素 ID，获取生成目标画布          |
| init        | options | 传入配置项，创建 Draw 类，并将所需参数设置进去 |
| update      | array   | 传入每次需要更新的数据，会根据像素自动截取     |
| resize      | null    | 重新绘制图表（重置宽高）                       |

#### Draw

- 描述
  WaterFall 主要类

| 方法名           | 参数             | 备注                                                                                           |
| ---------------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| constructor      | element, options | 根据用户输入重置 globalConfig 配置                                                             |
| init             | null             | 初始化 Draw 类，获取画布，根据画布参数重置 globalConfig 配置，设置静态背景板                   |
| generateLeft     | null             | 生成左边的阶梯图与文本                                                                         |
| resetLeft        | null             | 重置左侧示例，先清除再绘制                                                                     |
| update           | null             | 调用 renderCenterImg() 和 renderRightText()                                                    |
| renderCenterImg  | null             | 渲染中间区域内容                                                                               |
| renderRightText  | null             | 渲染右侧时间文本，清除右侧空间后，遍历 dateData 方法并调用 draw 绘制                           |
| setRightDateHtml | boolean          | 根据布尔值创建并返回 WaterFallText 对象，对象内包括绘制方法，通过 WaterFallText.draw()调用     |
| commit           | array[int]       | 提交最新数据到内部存储空间，生成对应数据并且维护数据大小。执行完毕后调用 update() 方法更新数据 |

#### Utils

- 描述
  工具类

| 方法名       | 参数                                                    | 备注                                           |
| ------------ | ------------------------------------------------------- | ---------------------------------------------- |
| filter       | {target:int,data:array}                                 | 平均从源数据 data 中过滤出目标数量 target      |
| getDate      | null                                                    | 获取当前时刻时间，返回 hh:mm:ss                |
| setText      | { textAlign = "left", ctx, text = "", x = 0, y = 0 }    | 根据坐标绘制文本                               |
| checkArround | arr=[int,int] arrColor=[{max:int,min:int,color:string}] | 给定数组数值，输出对象的范围                   |
| genDataLimit | {minMax: [-20, 120],colorArr: [],}                      | 设置幅度颜色，后续根据颜色生成幅度与每一层刻度 |

#### WaterFallText

- 描述
  右侧可以一直向下滚动的文本。初始化时传入画布对象，xy 坐标，文本内容与对其方式，和步长。每次更新数据时调用 draw 方法时重新计算新的坐标位置并绘制

| 方法名      | 参数                                                           | 备注                                         |
| ----------- | -------------------------------------------------------------- | -------------------------------------------- |
| constructor | { x:int, y:int, ctx, step = 1, text = "", textAlign = "left" } | 传入 画布对象，基础文本样式，x y 坐标 和步长 |
| draw        | null                                                           | y 轴坐标加上步长并在新坐标绘制文本           |
| fillText    | null                                                           | 根据新配置绘制文本                           |
| update      | x:int,y:int                                                    | 根据新传入的 x y 坐标绘制文本                |
