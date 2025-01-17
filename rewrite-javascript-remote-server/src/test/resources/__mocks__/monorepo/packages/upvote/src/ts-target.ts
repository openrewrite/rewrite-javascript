// @ts-nocheck
let isDone: boolean = false;
let lines: number = 42;
let name: string = 'Anders';
let isDone = false;
let lines = 42;
let name = 'Anders';
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false;
const numLivesForCat = 9;
numLivesForCat = 1;
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
console.log(Color[c]);
function bigHorribleAlert(): void {
  alert("I'm a little annoying box!");
}
let f1 = function (i: number): number {
  return i * i;
};
let f2 = function (i: number) {
  return i * i;
};
// let f3 = (i: number): number => {
//   return i * i;
// };
// let f4 = (i: number) => {
//   return i * i;
// };
// let f5 = (i: number) => i * i;
function f6(i: string | number): void {
  console.log('The value was ' + i);
}
interface Person {
  name: string;
  age?: number;
  move(): void;
}
// let p: Person = { name: 'Bobby', move: () => {} };
// let validPerson: Person = { name: 'Bobby', age: 42, move: () => {} };
// let invalidPerson: Person = { name: 'Bobby', age: true };
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function (src: string, sub: string) {
  return src.search(sub) != -1;
};
class Point {
  x: number;

  constructor(x: number, public y: number = 0) {
    this.x = x;
  }

  dist(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static origin = new Point(0, 0);
}
class PointPerson implements Person {
  name: string;
  move() {}
}
let p1 = new Point(10, 20);
let p2 = new Point(25);
class Point3D extends Point {
  constructor(x: number, y: number, public z: number = 0) {
    super(x, y);
  }

  dist(): number {
    let d = super.dist();
    return Math.sqrt(d * d + this.z * this.z);
  }
}
module Geometry {
  export class Square {
    constructor(public sideLength: number = 0) {}
    area() {
      return Math.pow(this.sideLength, 2);
    }
  }
}
let s1 = new Geometry.Square(5);
import G = Geometry;
let s2 = new G.Square(10);
class Tuple<T1, T2> {
  constructor(public item1: T1, public item2: T2) {}
}
interface Pair<T> {
  item1: T;
  item2: T;
}
let pairToTuple = function <T>(p: Pair<T>) {
  return new Tuple(p.item1, p.item2);
};
// let tuple = pairToTuple({ item1: 'hello', item2: 'world' });
let name = 'Tyrone';
let greeting = `Hi ${name}, how are you?`;
let multiline = `This is an example
of a multiline string`;
interface Person {
  readonly name: string;
  readonly age: number;
}
// var p1: Person = { name: 'Tyrone', age: 42 };
p1.age = 25;
// var p2 = { name: 'John', age: 60 };
var p3: Person = p2;
p3.age = 35;
p2.age = 45;
class Car {
  readonly make: string;
  readonly model: string;
  readonly year = 2018;
  constructor() {
    this.make = 'Unknown Make';
    this.model = 'Unknown Model';
  }
}
let numbers: Array<number> = [0, 1, 2, 3, 4];
let moreNumbers: ReadonlyArray<number> = numbers;
moreNumbers[5] = 5;
moreNumbers.push(5);
moreNumbers.length = 3;
numbers = moreNumbers;
type State =
  | { type: 'loading' }
  | { type: 'success'; value: number }
  | { type: 'error'; message: string };
declare const state: State;
if (state.type === 'success') {
  console.log(state.value);
} else if (state.type === 'error') {
  console.error(state.message);
}
type OrderSize = 'regular' | 'large';
type OrderItem = 'Espresso' | 'Cappuccino';
type Order = `A ${OrderSize} ${OrderItem}`;
let order1: Order = 'A regular Cappuccino';
let order2: Order = 'A large Espresso';
let order3: Order = 'A small Espresso';
let arrayOfAnyType = [1, 'string', false];
for (const val of arrayOfAnyType) {
  console.log(val);
}
let list = [4, 5, 6];
for (const i of list) {
  console.log(i);
}
for (const i in list) {
  console.log(i);
}
let foo = new Object();
foo.bar = 123;
foo.baz = 'hello world';
interface Foo {
  bar: number;
  baz: string;
}
let foo = new Object() as Foo;
foo.bar = 123;
foo.baz = 'hello world';
