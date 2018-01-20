export type ElementsType<T> = T[keyof T];

export type ElementSelector<T> = (object: T) => ElementsType<T>;
export type StringElementSelector<T> = keyof T;
