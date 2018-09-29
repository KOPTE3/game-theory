import math from '../lib/math.js';
import SimplexMethod from '../lib/simplex-method/index.js';


console.log('Лабораторная работа №1');

const p1 = document.getElementById('p1');
const p2 = document.getElementById('p2');
const p3 = document.getElementById('p3');
const p4 = document.getElementById('p4');
const div1 = document.getElementById('div1');
const section1 = document.getElementById('section1');
const section2 = document.getElementById('section2');

const task = window.task = new SimplexMethod({
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
console.dir(task.print());

task.canonize();

p2.innerHTML = task.print();

task.matrixPrepare();

div1.innerHTML = task.printSimplexTable();

for (let iter = 0; iter <= task.c.length; iter++) {
	if (task.isBaseSolutionValid()) {
		break;
	}

	const div = document.createElement('div');
	const stepStrong = document.createElement('strong');
	const resolvingItemP = document.createElement('p');
	const resultDiv = document.createElement('div');
	div.appendChild(stepStrong);
	div.appendChild(resolvingItemP);
	div.appendChild(resultDiv);

	stepStrong.textContent = `Итерация ${iter + 1}`;

	const resolvingItem = task.baseSolutionFindResolvingItem();

	resolvingItemP.textContent = `Разрешающий элемент: 
	строка \\( x_{${task.freeVars[resolvingItem.row - 1]}} \\),
	столбец \\( x_{${task.basisVars[resolvingItem.coll - 1]}} \\),
	`;

	task.transformJordan(resolvingItem);

	resultDiv.innerHTML = task.printSimplexTable();

	section1.appendChild(div);
}

p3.innerHTML = task.printSolution();

for (let iter = 0; iter <= task.c.length; iter++) {
	if (task.isOptimalSolutionValid()) {
		break;
	}

	const div = document.createElement('div');
	const stepStrong = document.createElement('strong');
	const resolvingItemP = document.createElement('p');
	const resultDiv = document.createElement('div');
	div.appendChild(stepStrong);
	div.appendChild(resolvingItemP);
	div.appendChild(resultDiv);

	stepStrong.textContent = `Итерация ${iter + 1}`;

	const resolvingItem = task.optimalSolutionFindResolvingItem();

	resolvingItemP.textContent = `Разрешающий элемент:
	строка \\( x_{${task.freeVars[resolvingItem.row - 1]}} \\),
	столбец \\( x_{${task.basisVars[resolvingItem.coll - 1]}} \\),
	`;

	task.transformJordan(resolvingItem);

	resultDiv.innerHTML = task.printSimplexTable();

	section2.appendChild(div);
}

p4.innerHTML = task.printSolution();

