import math, {toTex} from '../lib/math.js';


console.log('Лабораторная работа №3');

const A = math.matrix([
	[math.fraction(4, 1), math.fraction(8, 1)],
	[math.fraction(2, 1), math.fraction(10, 1)],
]);

const B = math.matrix([
	[math.fraction(7, 1), math.fraction(3, 1)],
	[math.fraction(1, 1), math.fraction(6, 1)],
]);

const invA = math.inv(A);
const invB = math.inv(B);

const uMatrix = math.ones(2);
const nu1 = math.divide(1, math.multiply(uMatrix, math.multiply(invA, math.transpose(uMatrix))));
const nu2 = math.divide(1, math.multiply(uMatrix, math.multiply(invB, math.transpose(uMatrix))));
const xs = math.multiply(nu2, math.multiply(uMatrix, invB));
const ys = math.multiply(nu1, math.multiply(invA, math.transpose(uMatrix)));

console.dir({xs, ys});


window.span1.outerHTML = toTex(nu1);
window.span2.outerHTML = toTex(nu2);
window.span3.outerHTML = `(${toTex(xs.get([0]))}, ${toTex(xs.get([1]))})`;
window.span4.outerHTML = `(${toTex(ys.get([0]))}, ${toTex(ys.get([1]))})`;
