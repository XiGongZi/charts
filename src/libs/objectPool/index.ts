import { ObjectPoolManager, ObjectPoolManagerAbstract, ObjectPoolItemAbstract, ObjectPool } from "./core/index";

/**
class Test extends ObjectPoolItemAbstract {
    data: any;
    constructor() {
        super();
    }
    resetObjectPoolItem(data: any) {
        this.data = data;
        return this;
    }
    getNewObjectPoolItem() {
        return new Test();
    }
}
 */
export { ObjectPoolManager, ObjectPoolManagerAbstract, ObjectPoolItemAbstract, ObjectPool };
