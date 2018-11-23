import math, {toTex} from '../lib/math.js';


console.log('Лабораторная работа №2');

const div1 = document.getElementById('div1');
const div2 = document.getElementById('div2');
const divx = document.getElementById('divx');
const divy = document.getElementById('divy');
const diveps = document.getElementById('diveps');
const tbody = document.getElementById('tbody');

const C = math.matrix([
	[
		math.fraction(6, 1),
		math.fraction(18, 1),
		math.fraction(5, 1)
	],
	[
		math.fraction(17, 1),
		math.fraction(13, 1),
		math.fraction(15, 1)
	],
	[
		math.fraction(9, 1),
		math.fraction(13, 1),
		math.fraction(19, 1)
	]
]);

const invC = math.inv(C);
console.dir(invC);


div1.textContent = `
		$$\\mathbf{C}^{-1} = \\begin{pmatrix}
		${toTex(invC.get([0, 0]))} & ${toTex(invC.get([0, 1]))} & ${toTex(invC.get([0, 2]))} \\\\
		${toTex(invC.get([1, 0]))} & ${toTex(invC.get([1, 1]))} & ${toTex(invC.get([1, 2]))} \\\\
		${toTex(invC.get([2, 0]))} & ${toTex(invC.get([2, 1]))} & ${toTex(invC.get([2, 2]))}
		\\end{pmatrix}$$
`;

const uMatrix = math.ones(3);
let xSolution = math.multiply(invC, math.transpose(uMatrix));
xSolution = math.divide(xSolution, math.multiply(uMatrix, math.multiply(invC, math.transpose(uMatrix))));

console.log(xSolution);

let ySolution = math.multiply(uMatrix, invC);
ySolution = math.divide(ySolution, math.multiply(uMatrix, math.multiply(invC, math.transpose(uMatrix))));

console.log(ySolution);

const vSolution = math.divide(1, math.multiply(uMatrix, math.multiply(invC, math.transpose(uMatrix))));

console.log(vSolution);


div2.textContent += `
		$$\\mathbf{x}^* = \\dfrac{\\mathbf{C}^{-1}\\mathbf{u}^T}{\\mathbf{u}\\mathbf{C}^{-1}\\mathbf{u}^T} = (${toTex(xSolution.get([0]))}\\approx${math.format(math.number(xSolution.get([0])), {precision: 4})}, ${toTex(xSolution.get([1]))}\\approx${math.format(math.number(xSolution.get([1])), {precision: 4})}, ${toTex(xSolution.get([2]))}\\approx${math.format(math.number(xSolution.get([2])), {precision: 4})})$$
`;

div2.textContent += `
		$$\\mathbf{y}^* = \\dfrac{\\mathbf{u}\\mathbf{C}^{-1}}{\\mathbf{u}\\mathbf{C}^{-1}\\mathbf{u}^T} = (${toTex(ySolution.get([0]))}\\approx${math.format(math.number(ySolution.get([0])), {precision: 4})}, ${toTex(ySolution.get([1]))}\\approx${math.format(math.number(ySolution.get([1])), {precision: 4})}, ${toTex(ySolution.get([2]))}\\approx${math.format(math.number(ySolution.get([2])), {precision: 4})})$$
`;

div2.textContent += `
		$$\\mathbf{v} = \\dfrac{1}{\\mathbf{u}\\mathbf{C}^{-1}\\mathbf{u}^T} = ${toTex(vSolution)}\\approx${math.format(math.number(vSolution), {precision: 4})}$$
`;

const N = 25;
const xs = [0, 0, 0];
const ys = [0, 0, 0];

const chooses = {
	x: [0, 0, 0],
	y: [0, 0, 0]
};

function getX() {
	let i = 0;
	xs.forEach(function (n, idx) {
		if (xs[idx] > xs[i]) {
			i = idx;
		}
	});

	return i;
}

function getY() {
	let i = 0;
	ys.forEach(function (n, idx) {
		if (ys[idx] < ys[i]) {
			i = idx;
		}
	});

	return i;
}

let Eps = null;

for (let k = 1; k <= N; k++) {
	const tr = document.createElement('tr');
	tbody.appendChild(tr);

	const getTd = function () {
		const td = document.createElement('td');
		tr.appendChild(td);
		return td;
	};
	let td;
	td = getTd();

	td.textContent = k;

	const x_i = getX();
	const y_i = getY();

	chooses.x[x_i]++;
	chooses.y[y_i]++;

	xs[0] += math.number(C.get([0, y_i]));
	xs[1] += math.number(C.get([1, y_i]));
	xs[2] += math.number(C.get([2, y_i]));

	ys[0] += math.number(C.get([x_i, 0]));
	ys[1] += math.number(C.get([x_i, 1]));
	ys[2] += math.number(C.get([x_i, 2]));

	td = getTd();
	td.textContent = `\\( x_{${x_i + 1}} \\)`;

	td = getTd();
	td.textContent = `\\( y_{${y_i + 1}} \\)`;

	td = getTd();
	td.textContent = xs[0];
	td = getTd();
	td.textContent = xs[1];
	td = getTd();
	td.textContent = xs[2];

	td = getTd();
	td.textContent = ys[0];
	td = getTd();
	td.textContent = ys[1];
	td = getTd();
	td.textContent = ys[2];


	const vmax = math.fraction(xs[getX()], k);
	td = getTd();
	td.textContent = `\\( ${toTex(vmax)} \\)`;

	const vmin = math.fraction(ys[getY()], k);
	td = getTd();
	td.textContent = `\\( ${toTex(vmin)} \\)`;

	const v = math.divide(math.add(vmin, vmax), 2);

	td = getTd();
	td.textContent = `\\( ${toTex(v)}\\approx${math.format(math.number(v), {precision: 4})} \\)`;

	const eps = math.divide(math.subtract(vmax, vmin), 2);

	td = getTd();
	td.textContent = `\\( ${toTex(eps)}\\approx${math.format(math.number(eps), {precision: 4})} \\)`;

	Eps = eps;
}

console.log(chooses);

divx.textContent = `$$
	\\mathbf{x}[${N}] = (${toTex(math.fraction(chooses.x[0], N))}\\approx${math.format(math.number(math.fraction(chooses.x[0], N)), {precision: 4})}, ${toTex(math.fraction(chooses.x[1], N))}\\approx${math.format(math.number(math.fraction(chooses.x[1], N)), {precision: 4})}, ${toTex(math.fraction(chooses.x[2], N))}\\approx${math.format(math.number(math.fraction(chooses.x[2], N)), {precision: 4})})
$$`;

divy.textContent = `$$
	\\mathbf{y}[${N}] = (${toTex(math.fraction(chooses.y[0], N))}\\approx${math.format(math.number(math.fraction(chooses.y[0], N)), {precision: 4})}, ${toTex(math.fraction(chooses.y[1], N))}\\approx${math.format(math.number(math.fraction(chooses.y[1], N)), {precision: 4})}, ${toTex(math.fraction(chooses.y[2], N))}\\approx${math.format(math.number(math.fraction(chooses.y[2], N)), {precision: 4})})
$$`;

diveps.textContent = `$$
	\\varepsilon = (${toTex(Eps)})
$$`;
