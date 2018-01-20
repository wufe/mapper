export declare type ElementsType<T> = T[keyof T];
export declare type ElementSelector<T> = (object: T) => ElementsType<T>;
export declare type StringElementSelector<T> = keyof T;
