import math, {toTex} from '../lib/math.js';


console.log('Лабораторная работа №4');


const tbody1 = document.getElementById('tbody1');
const span1 = document.getElementById('span1');
const span2 = document.getElementById('span2');

function f(x) {
	return Math.cos(x) * Math.tanh(x);
}

const A = 1.5;
const B = 4;

const eps = 0.1;

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
