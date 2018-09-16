import math from '../lib/math.js';
import SimplexMethod from '../lib/simplex-method/index.js';


console.log('Лабораторная работа №1');

const p1 = document.getElementById('p1');
const p2 = document.getElementById('p2');

const task = new SimplexMethod({
	c: [
		math.number(6),
		math.number(6),
		math.number(6)
	],
	b: [
		math.number(5),
		math.number(3),
		math.number(8)
	],
	aspiration: 'max',
	conditions: ['leq', 'leq', 'leq'],
	A: [
		[math.number(4), math.number(1), math.number(1)],
		[math.number(1), math.number(2), math.number(0)],
		[math.number(0), math.fraction(1, 2), math.number(4)]
	]
});

p1.innerHTML = task.print();

task.canonize();

p2.innerHTML = task.print();

