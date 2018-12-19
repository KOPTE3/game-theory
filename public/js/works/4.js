import math, {toTex} from '../lib/math.js';


console.log('Лабораторная работа №4');


const tbody1 = document.getElementById('tbody1');
const tbody2 = document.getElementById('tbody2');
const span1 = document.getElementById('span1');
const span2 = document.getElementById('span2');
const span3 = document.getElementById('span3');
const span4 = document.getElementById('span4');

function f(x) {
	return Math.cos(x) * Math.tanh(x);
}

const A = 1.5;
const B = 4;

const eps = 0.1;

const F = 1.618;

function optimalPassiveSearch() {
	const N = ((B - A) / (eps / 2)) - 1;
	const points = [0];
	let min = Infinity;
	let minIndex = 0;
	for (let i = 0; i < N; i++) {
		const x = A + (eps / 2) * (i + 1);
		points.push(x);

		const tr = document.createElement('tr');
		const td1 = document.createElement('td');
		const td2 = document.createElement('td');
		const td3 = document.createElement('td');

		td1.textContent = i + 1;
		td2.textContent = x.toPrecision(5);

		const r = f(x);
		if (r < min) {
			min = r;
			minIndex = i + 1;
		}

		td3.textContent = r.toPrecision(5);

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);

		tbody1.appendChild(tr);
	}

	console.dir({min, minIndex});

	span1.innerHTML = `\\( f_{min} \\approx f(x_{${minIndex}}) = ${min.toPrecision(5)} \\)`;
	span2.innerHTML = `\\( [${points[minIndex - 1].toPrecision(5)}, ${points[minIndex + 1].toPrecision(5)}] \\)`;
}

optimalPassiveSearch();

function goldenSectionSearch() {
	let a = A;
	let b = B;
	let step = 1;
	while (b - a > eps) {
		const x1 = b - (b - a) / F;
		const x2 = a + (b - a) / F;

		const y1 = f(x1);
		const y2 = f(x2);

		const tr = document.createElement('tr');
		const td1 = document.createElement('td');
		const td2 = document.createElement('td');
		const td3 = document.createElement('td');
		const td4 = document.createElement('td');
		const td5 = document.createElement('td');
		const td6 = document.createElement('td');
		const td7 = document.createElement('td');

		td1.textContent = step;
		td2.textContent = a.toPrecision(5);
		td3.textContent = b.toPrecision(5);
		td4.textContent = x1.toPrecision(5);
		td5.textContent = x2.toPrecision(5);
		td6.textContent = y1.toPrecision(5);
		td7.textContent = y2.toPrecision(5);

		if (y1 >= y2) {
			a = x1;
		} else {
			b = x2;
		}

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
		tr.appendChild(td6);
		tr.appendChild(td7);

		tbody2.appendChild(tr);

		step++;
	}

	console.dir({a, b});
	const x_min = (a+b)/2;
	span3.innerHTML = `\\( f_{min} \\approx f(${x_min.toPrecision(5)}) = ${f(x_min).toPrecision(5)} \\)`;
	span4.innerHTML = `\\( [${a.toPrecision(5)}, ${b.toPrecision(5)}] \\)`;
}

goldenSectionSearch();
