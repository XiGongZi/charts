
/**
 * @description 纳特-波尔 全景扫描处理方法
 */
interface IonRecords_nateBoer_B_PScan {
    current: any;
    type: string;
    startfreq: string;
    stepfreq: string;
}
const onRecords_nateBoer_B_PScan = ({
    current,
    type,
    startfreq,
    stepfreq,
}: IonRecords_nateBoer_B_PScan) => {
    // console.log('onRecord 类型 - >', type, startfreq, stepfreq)
    //如果是频谱数据才进行处理
    let currentTrace: number[] = current.data.split(",");
    let freqPoint: number[] = [];
    let pointCount = currentTrace.length;
    for (let i = 0; i < pointCount; i++) {
        //原子封装接口返回的数据大了10倍 因此此处需要进行处理 并转换为dBm值-107
        currentTrace[i] = parseFloat((parseFloat(currentTrace[i] + "") / 10) + "");
        freqPoint.push(
            parseInt("" + (parseInt(startfreq + "") + i * parseInt(stepfreq + "")) / 1000000)
        );
    }
    return {
        x: freqPoint,
        y: currentTrace,
    };
};
export class GetSocketData {
    ws: WebSocket = WebSocket.constructor();
    constructor() {
        // this.ws = new WebSocket("ws://192.168.0.173:3000/ws"); //公网
    }
    stop() {
        this.ws.close();
    }
    start(func: Function = () => { }) {
        this.ws = new WebSocket("ws://192.168.0.173:3000/ws"); //公网
        let ws = this.ws;
        let obj = {};
        obj = {};
        ws.onopen = () => {
            console.log("纳特实时调用websocket连接已打开...");
            let cmd = JSON.stringify(obj);
            console.log("cmd:", cmd);
            ws.send(cmd);
        };
        ws.onmessage = (evt) => {
            // console.log("##########频谱图表收到信息#############");
            // console.log(evt)
            let traceData = evt.data;
            let traceDataObj = JSON.parse(traceData);
            // console.log(traceDataObj)
            if (traceDataObj.type === "status" || traceDataObj.type === undefined) {
                return;
            }
            if (
                traceDataObj.bizResText !== undefined &&
                traceDataObj.bizResText !== "ok"
            ) {
                console.log("状态:", JSON.stringify(traceDataObj));
            } else {
                // console.log(traceDataObj)
                const { x, y } = onRecords_nateBoer_B_PScan(traceDataObj);
                // flow.update(y);
                func(x, y);
            }
        };

        ws.onclose = () => {
            // lineChart.hideLoading();
            console.log("纳特实时调用websocket连接已关闭...");
        };
    }
}