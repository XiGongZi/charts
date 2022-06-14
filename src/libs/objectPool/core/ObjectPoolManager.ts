import { ObjectPool } from "./ObjectPool";
import { ObjectPoolItemAbstract } from "./ObjectPoolItemAbstract";

export abstract class ObjectPoolManagerAbstract<T> {
    originObj: T;
    poolObj: ObjectPool<T>;
    constructor(originObj: T, limit: number = 10) {
        this.originObj = originObj;
        this.poolObj = new ObjectPool<T>(limit);
    }
    abstract getNewObj(data: any): T;
    abstract resetPool(data: ObjectPool<T>): void;
    abstract create(data: any): T;
    abstract recycle(item: T): void;
    abstract recycleLists(items: T[]): void;
    abstract clear(): void;
}

export class ObjectPoolManager extends ObjectPoolManagerAbstract<ObjectPoolItemAbstract> {
    public getNewObj(data: any) {
        return this.originObj.getNewObjectPoolItem().resetObjectPoolItem(data);
    }
    public resetPool(data: ObjectPool<ObjectPoolItemAbstract>) {
        this.poolObj = data;
    }
    public create(data: any): ObjectPoolItemAbstract {
        const item = this.poolObj.get();
        if (item) return item.resetObjectPoolItem(data);
        return this.getNewObj(data);
    }
    public recycle(item: ObjectPoolItemAbstract) {
        this.poolObj.push(item);
    }
    public recycleLists(items: ObjectPoolItemAbstract[]) {
        items.forEach(item => this.recycle(item));
    }
    public clear() {
        this.poolObj.clear();
    }
}
