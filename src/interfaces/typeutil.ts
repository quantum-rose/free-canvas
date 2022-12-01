/**
 * 声明任意长度的元组（太多会爆栈）
 */
export type Tuple<L extends number, T, R extends T[] = []> = R['length'] extends L ? R : Tuple<L, T, [T, ...R]>;

/**
 * 获取元组的第一项
 */
export type Shift<T extends any[]> = T extends [infer P, ...any[]] ? P : undefined;

/**
 * 删除元组的第一项，返回其余的
 */
export type Shifted<T extends any[]> = T extends [any, ...infer P] ? P : [];

/**
 * 获取元组的最后一项
 */
export type Pop<T extends any[]> = T extends [...any[], infer P] ? P : undefined;

/**
 * 删除元组的最后一项，返回其余的
 */
export type Poped<T extends any[]> = T extends [...infer P, any] ? P : [];

/**
 * 将元组转为对象
 */
export type TupleToObject<T extends (number | string | symbol)[]> = { [key in T[number]]: key };

/**
 * 获取元组的长度
 */
export type Length<T extends any[]> = T['length'];

/**
 * 获取 Promise 结果的类型
 */
export type Awaited<T extends Promise<any>> = T extends Promise<infer P> ? (P extends Promise<any> ? Awaited<P> : P) : never;

/**
 * 判断两个类型是否相同
 */
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * Split
 */
type Split<Str extends string, Spt extends string = ','> = Str extends `${infer A}${Spt}${infer B}` ? [A, ...Split<B, Spt>] : [Str];

type Path = 'E:/studio/free-canvas/src/interfaces/typeutil.ts';
type PathArray = Split<Path, '/'>; // ["E:", "studio", "free-canvas", "src", "interfaces", "typeutil.ts"]

type CHJ = '0,1,2,3,4,5,6,7,8,9';
type CHJArray = Split<CHJ, ','>; // ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

type EmptyArray = Split<''>; //  [""]

/**
 * Join
 */
type CanJoin = string | number | boolean | null | undefined;
type Join<Arr extends CanJoin[], Spt extends string = ','> = Arr extends [infer A extends CanJoin, ...infer B]
    ? B extends [CanJoin, ...CanJoin[]]
        ? `${A}${Spt}${Join<B, Spt>}`
        : `${A}`
    : '';

type NumberArr = [1, 2, 3, 4];
type NumberStr = Join<NumberArr, ','>; // "1,2,3,4"

type StringArr = ['a', 'b', 'c', 'd'];
type StringStr = Join<StringArr, '-'>; // "a-b-c-d"

type EmptyStr = Join<[]>; // ""

type Special = Join<['a', 1, true, null, undefined]>; // "a,1,true,null,undefined"
