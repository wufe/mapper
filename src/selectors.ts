export type ElementsType<T> = T[keyof T];

export type ElementSelector<T> = (object: T) => any;
export type StringElementSelector<T> = keyof T;
