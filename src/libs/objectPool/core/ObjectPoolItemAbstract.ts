export abstract class ObjectPoolItemAbstract {
    data: any;
    constructor() { }
    abstract resetObjectPoolItem(data: any): ObjectPoolItemAbstract;
    abstract getNewObjectPoolItem(): ObjectPoolItemAbstract;
}