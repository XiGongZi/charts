export abstract class ObjectPoolItemAbstract {
    data: any;
    constructor() { }
    abstract resetObjectPoolItem(data: any): ObjectPoolItemAbstract;
    abstract getNewObjectPoolItem(): ObjectPoolItemAbstract;
}
export class ObjectPool {
    private limit = 10;
    private originObj: ObjectPoolItemAbstract;
    private pool: ObjectPoolItemAbstract[] = [];
    constructor(originObj: ObjectPoolItemAbstract, limit?: number) {
        this.originObj = originObj;
        if (limit) this.limit = limit;
        this.pool = [originObj];
    }
    private getNewObj(data: any) {
        return this.originObj.getNewObjectPoolItem().resetObjectPoolItem(data);
    }
    public create(data: any): ObjectPoolItemAbstract {
        return this.pool.pop()?.resetObjectPoolItem(data) || this.getNewObj(data);
    }
    public recycle(item: ObjectPoolItemAbstract) {
        if (this.pool.length > this.limit) return;
        this.pool.push(item);
    }
    public recycleLists(items: ObjectPoolItemAbstract[]) {
        items.forEach(item => this.recycle(item));
    }
}
