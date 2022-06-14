export abstract class ObjectPoolAbstract {
    data: any;
    constructor() { }
    abstract resetObjectPoolItem(data: any): ObjectPoolAbstract;
    abstract getNewObjectPoolItem(): ObjectPoolAbstract;
}
export class ObjectPool {
    limit = 10;
    originObj: ObjectPoolAbstract;
    pool: ObjectPoolAbstract[] = [];
    constructor(originObj: ObjectPoolAbstract, limit?: number) {
        this.originObj = originObj;
        if (limit) this.limit = limit;
        this.pool = [originObj];
    }
    getNewObj(data: any) {
        return this.originObj.getNewObjectPoolItem().resetObjectPoolItem(data);
    }
    create(data: any): ObjectPoolAbstract {
        return this.pool.pop()?.resetObjectPoolItem(data) || this.getNewObj(data);
    }
    recycle(item: ObjectPoolAbstract) {
        if (this.pool.length > this.limit) return;
        this.pool.push(item);
    }
    recycleLists(items: ObjectPoolAbstract[]) {
        items.forEach(item => this.recycle(item));
    }
}
