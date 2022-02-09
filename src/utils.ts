// object pool for reuse
export class ObjectPool<T> {
    private _pool: T[];
    private _maxSize: number;

    constructor(maxSize: number) {
        this._pool = [];
        this._maxSize = maxSize;
    }

    public get(): T|null|undefined {
        if (this._pool.length > 0) {
            return this._pool.pop();
        }
        return null;
    }

    public push(item: T) {
        if (this._pool.length < this._maxSize) {
            this._pool.push(item);
        }
    }

    public clear() {
        this._pool = [];
    }
}
