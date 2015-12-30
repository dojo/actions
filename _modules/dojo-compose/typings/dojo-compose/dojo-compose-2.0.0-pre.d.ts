declare module 'dojo-compose/aspect' {
	export interface AdvisingFunction extends Function {
	    next: AdvisingFunction;
	    previous: AdvisingFunction;
	}
	export interface DispatchAdvice<T> {
	    before?: BeforeAdvice[];
	    after?: AfterAdvice<T>[];
	    joinPoint: Function;
	}
	export interface BeforeAdvice {
	    (...args: any[]): any[] | void;
	}
	export interface AfterAdvice<T> {
	    (result: T, ...args: any[]): T;
	}
	export interface AroundAdvice<T> {
	    (origFn: GenericFunction<T>): (...args: any[]) => T;
	}
	export enum AdviceType {
	    Before = 0,
	    After = 1,
	    Around = 2,
	}
	export interface GenericFunction<T> {
	    (...args: any[]): T;
	}
	export function before<T>(joinPoint: GenericFunction<T>, advice: BeforeAdvice): GenericFunction<T>;
	export function after<T>(joinPoint: GenericFunction<T>, advice: AfterAdvice<T>): GenericFunction<T>;
	export function around<T>(joinPoint: GenericFunction<T>, advice: AroundAdvice<T>): GenericFunction<T>;

}
declare module 'dojo-compose/compose' {
	import { BeforeAdvice, AfterAdvice, AroundAdvice } from 'dojo-compose/aspect';
	export interface GenericClass<T> {
	    new (...args: any[]): T;
	    prototype: T;
	}
	export interface ComposeInitializationFunction<O> {
	    (options?: O): void;
	}
	export interface ComposeFactory<O, T> {
	    extend<U>(extension: U): ComposeFactory<O, T & U>;
	}
	export interface Compose {
	    extend<O, A, B>(base: ComposeFactory<O, A>, extension: B): ComposeFactory<O, A & B>;
	}
	export interface ComposeFactory<O, T> {
	    mixin<P, U>(mixin: GenericClass<U>): ComposeFactory<O, T & U>;
	    mixin<P, U>(mixin: ComposeFactory<P, U>): ComposeFactory<O & P, T & U>;
	}
	export interface Compose {
	    mixin<O, A, B>(base: ComposeFactory<O, A>, mixin: GenericClass<B>): ComposeFactory<O, A & B>;
	    mixin<O, P, A, B>(base: ComposeFactory<O, A>, mixin: ComposeFactory<P, B>): ComposeFactory<O & P, A & B>;
	}
	export interface OverlayFunction<T> {
	    (proto: T): void;
	}
	export interface ComposeFactory<O, T> {
	    overlay(overlayFunction: OverlayFunction<T>): ComposeFactory<O, T>;
	}
	export interface Compose {
	    overlay<O, A>(base: ComposeFactory<O, A>, overlayFunction: OverlayFunction<A>): ComposeFactory<O, A>;
	}
	export interface AspectAdvice {
	    before?: {
	        [method: string]: BeforeAdvice;
	    };
	    after?: {
	        [method: string]: AfterAdvice<any>;
	    };
	    around?: {
	        [method: string]: AroundAdvice<any>;
	    };
	}
	export interface GenericFunction<T> {
	    (...args: any[]): T;
	}
	export interface ComposeFactory<O, T> {
	    from(base: GenericClass<any>, method: string): ComposeFactory<O, T>;
	    from(base: ComposeFactory<any, any>, method: string): ComposeFactory<O, T>;
	    before(method: string, advice: BeforeAdvice): ComposeFactory<O, T>;
	    after<P>(method: string, advice: AfterAdvice<P>): ComposeFactory<O, T>;
	    around<P>(method: string, advice: AroundAdvice<P>): ComposeFactory<O, T>;
	    aspect(advice: AspectAdvice): ComposeFactory<O, T>;
	}
	export interface Compose {
	    from<T extends Function>(base: GenericClass<any>, method: string): T;
	    from<T extends Function>(base: ComposeFactory<any, any>, method: string): T;
	    before<T>(base: GenericClass<any>, method: string, advice: BeforeAdvice): GenericFunction<T>;
	    before<T>(base: ComposeFactory<any, any>, method: string, advice: BeforeAdvice): GenericFunction<T>;
	    before<T>(method: GenericFunction<T>, advice: BeforeAdvice): GenericFunction<T>;
	    after<T>(base: GenericClass<any>, method: string, advice: AfterAdvice<T>): GenericFunction<T>;
	    after<T>(base: ComposeFactory<any, any>, method: string, advice: AfterAdvice<T>): GenericFunction<T>;
	    after<T>(method: GenericFunction<T>, advice: AfterAdvice<T>): GenericFunction<T>;
	    around<T>(base: GenericClass<any>, method: string, advice: AroundAdvice<T>): GenericFunction<T>;
	    around<T>(base: ComposeFactory<any, any>, method: string, advice: AroundAdvice<T>): GenericFunction<T>;
	    around<T>(method: GenericFunction<T>, advice: AroundAdvice<T>): GenericFunction<T>;
	    aspect<O, A>(base: ComposeFactory<O, A>, advice: AspectAdvice): ComposeFactory<O, A>;
	}
	export interface ComposeFactory<O, T> {
	    (options?: O): T;
	    prototype: T;
	}
	export interface Compose {
	    <O, A>(base: GenericClass<A>, initFunction?: ComposeInitializationFunction<O>): ComposeFactory<O, A>;
	    <O, A, P>(base: ComposeFactory<O, A>, initFunction?: ComposeInitializationFunction<P>): ComposeFactory<O & P, A>;
	    <O, A>(base: A, initFunction?: ComposeInitializationFunction<O>): ComposeFactory<O, A>;
	    create<O, A>(base: GenericClass<A>, initFunction?: ComposeInitializationFunction<O>): ComposeFactory<O, A>;
	    create<O, A, P>(base: ComposeFactory<O, A>, initFunction?: ComposeInitializationFunction<P>): ComposeFactory<O & P, A>;
	    create<O, A>(base: A, initFunction?: ComposeInitializationFunction<O>): ComposeFactory<O, A>;
	} const compose: Compose;
	export default compose;

}
