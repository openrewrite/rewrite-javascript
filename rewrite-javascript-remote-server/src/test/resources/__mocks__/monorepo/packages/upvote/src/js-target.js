// Single-line comments start with two slashes.
/* Multiline comments start with slash-star,
   and end with star-slash */
doStuff();
doStuff();
3;
1.5;
1 + 1;
0.1 + 0.2;
8 - 1;
10 * 2;
35 / 5;
5 / 2;
10 % 2;
30 % 4;
18.5 % 7;
1 << 2;
(1 + 3) * 2;
Infinity;
-Infinity;
NaN;
true;
false;
('abc');
('Hello, world');
!true;
!false;
1 === 1;
2 === 1;
1 !== 1;
2 !== 1;
1 < 10;
1 > 10;
2 <= 2;
2 >= 2;
'Hello ' + 'world!';
'1, 2, ' + 3;
'Hello ' + ['world', '!'];
13 + !0;
'13' + !0;
'a' < 'b';
'5' == 5;
null == undefined;
'5' === 5;
null === undefined;
'This is a string'.charAt(0);
'Hello world'.substring(0, 5);
'Hello'.length;
null;
undefined;

var someVar = 5;
someOtherVar = 10;
var someThirdVar;
var someFourthVar = 2,
  someFifthVar = 4;
someVar += 5;
someVar *= 10;
someVar++;
someVar--;
var myArray = ['Hello', 45, true];
myArray[1];
myArray.push('World');
myArray.length;
myArray[3] = 'Hello';
myArray.unshift(3);
someVar = myArray.shift();
myArray.push(3);
someVar = myArray.pop();
var myArray0 = [32, false, 'js', 12, 56, 90];
myArray0.join(';');
myArray0.slice(1, 4);
myArray0.splice(2, 4, 'hi', 'wr', 'ld');
var myObj = new Object();
// var myObj = { key1: 'Hello', key2: 'World' };
// var myObj = { myKey: 'myValue', 'my other key': 4 };
myObj['my other key'];
myObj.myKey;
myObj.myThirdKey = true;
myObj.myFourthKey;
var count = 1;
if (count == 3) {
} else if (count == 4) {
} else {
}
while (true) {}
var input;
do {
  input = getInput();
} while (!isValid(input));
for (var i = 0; i < 5; i++) {}
outer: for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    if (i == 5 && j == 5) {
      break outer;
    }
  }
}
var description = '';
var person = new Object();
person.fname = 'Paul';
person.lname = 'Ken';
person.age = 18;
for (var x in person) {
  description += person[x] + ' ';
}
var myPets = '';
var pets = ['cat', 'dog', 'hamster', 'hedgehog'];
for (var pet of pets) {
  myPets += pet + ' ';
}
if (house.size == 'big' && house.colour == 'blue') {
  house.contains = 'bear';
}
if (colour == 'red' || colour == 'blue') {
}
var name = otherName || 'default';
grade = 'B';
switch (grade) {
  case 'A':
    console.log('Great job');
    break;
  case 'B':
    console.log('OK job');
    break;
  case 'C':
    console.log('You can do better');
    break;
  default:
    console.log('Oy vey');
    break;
}
function myFunction(thing) {
  return thing.toUpperCase();
}
myFunction('foo');
function myFunction() {
  return;
  const thisIs = 'unreachable';
}
myFunction();
function myFunction() {}
setTimeout(myFunction, 5000);
function myFunction() {}
setInterval(myFunction, 5000);
setTimeout(function () {}, 5000);
if (true) {
  var i = 5;
}
i;
(function () {
  var temporary = 5;

  window.permanent = 10;
})();
temporary;
permanent;
function sayHelloInFiveSeconds(name) {
  var prompt = 'Hello, ' + name + '!';

  function inner() {
    alert(prompt);
  }
  setTimeout(inner, 5000);
}
sayHelloInFiveSeconds('Adam');
var myObj = new Object();

myOvj.myFunc = function () {
  return 'Hello world!';
};

myObj.myFunc();
(myObj.myString = 'Hello world!'),
  (myObj.myFunc = function () {
    return this.myString;
  });
myObj.myFunc();
var myFunc = myObj.myFunc;
myFunc();
var myOtherFunc = function () {
  return this.myString.toUpperCase();
};
myObj.myOtherFunc = myOtherFunc;
myObj.myOtherFunc();
var anotherFunc = function (s) {
  return this.myString + s;
};
anotherFunc.call(myObj, ' And Hello Moon!');
anotherFunc.apply(myObj, [' And Hello Sun!']);
Math.min(42, 6, 27);
Math.min([42, 6, 27]);
Math.min.apply(Math, [42, 6, 27]);
var boundFunc = anotherFunc.bind(myObj);
boundFunc(' And Hello Saturn!');
var product = function (a, b) {
  return a * b;
};
var doubler = product.bind(this, 2);
doubler(8);
var MyConstructor = function () {
  this.myNumber = 5;
};
myNewObj = new MyConstructor();
myNewObj.myNumber;
var myObj = new Object();
myObj.myString = 'Hello world!';

var myPrototype = new Object();

myPrototype.meaningOfLife = 42;
myPrototype.myFunc = function () {
  return this.myString.toLowerCase();
};

myObj.__proto__ = myPrototype;
myObj.meaningOfLife;
myObj.myFunc();
myPrototype.__proto__ = new Object();
myPrototype.myBoolean = true;
myObj.myBoolean;
myPrototype.meaningOfLife = 43;
myObj.meaningOfLife;
for (var x in myObj) {
  console.log(myObj[x]);
}
for (var x in myObj) {
  if (myObj.hasOwnProperty(x)) {
    console.log(myObj[x]);
  }
}
var myObj = Object.create(myPrototype);
myObj.meaningOfLife;
MyConstructor.prototype = new Object();

MyConstructor.prototype.myNumber = 5;
MyConstructor.prototype.getMyNumber = function () {
  return this.myNumber;
};
var myNewObj2 = new MyConstructor();
myNewObj2.getMyNumber();
myNewObj2.myNumber = 6;
myNewObj2.getMyNumber();
var myNumber = 12;
var myNumberObj = new Number(12);
myNumber == myNumberObj;
typeof myNumber;
typeof myNumberObj;
myNumber === myNumberObj;
if (0) {
}
if (new Number(0)) {
}
String.prototype.firstCharacter = function () {
  return this.charAt(0);
};
'abc'.firstCharacter();
if (Object.create === undefined) {
  Object.create = function (proto) {
    var Constructor = function () {};
    Constructor.prototype = proto;

    return new Constructor();
  };
}
let name = 'Billy';
name = 'William';
const pi = 3.14;
pi = 4.13;
// const isEven = (number) => {
//   return number % 2 === 0;
// };
isEven(7);
function isEven(number) {
  return number % 2 === 0;
}
add(1, 8);
// const add = (firstNumber, secondNumber) => {
//   return firstNumber + secondNumber;
// };

export const coolKeyword = 'export';
