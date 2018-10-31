import math, {toTex} from '../lib/math.js';

const s1 = document.getElementById('s1');

const a = math.fraction(-5, 1);
const b = math.fraction(9, 2);
const c = math.fraction(15, 1);
const d = math.fraction(-9, 2);
const e = math.fraction(-9, 1);

function H(x, y) {
	const X = math.fraction(x);
	const Y = math.fraction(y);
	const s1 = math.multiply(math.multiply(X, X), a);
	const s2 = math.multiply(math.multiply(Y, Y), b);
	const s3 = math.multiply(math.multiply(X, Y), c);
	const s4 = math.multiply(d, X);
	const s5 = math.multiply(e, Y);

	return [s1, s2, s3, s4, s5].reduce(function (summ, s) {
		return math.add(summ, s);
	}, 0);
}

for (let N = 2; N <= 7; N++) {
	const div = document.createElement('div');
	const h3 = document.createElement('h3');
	h3.textContent = `\\( \\mathbf{N} = ${N} \\)`;

	div.appendChild(h3);
	s1.appendChild(div);

	const table = document.createElement('table');
	const tbody = document.createElement('tbody');
	table.appendChild(tbody);
	s1.appendChild(table);

	table.classList.add('big-table');

	const tr0 = document.createElement('tr');
	const td0 = document.createElement('td');
	tr0.appendChild(td0);
	tbody.appendChild(tr0);
	for (let xi = 0; xi <= N; xi++) {
		const td = document.createElement('td');
		td.textContent = `\\( x_{${xi}} = ${toTex(math.add(0, math.multiply(xi, math.divide(math.fraction(1), math.fraction(N)))))} \\)`;

		tr0.appendChild(td);
	}

	const ARR = [];
	for (let yj = 0; yj <= N; yj++) {
		const tr = document.createElement('tr');
		const td0 = document.createElement('td');
		tr.appendChild(td0);
		tbody.appendChild(tr);

		const Yj = math.add(0, math.multiply(yj, math.divide(math.fraction(1), math.fraction(N))));

		td0.textContent = `\\( y_{${yj}} = ${toTex(Yj)} \\)`;
		const line = [];
		ARR.push(line);
		for (let xi = 0; xi <= N; xi++) {

			const Xi = math.add(0, math.multiply(xi, math.divide(math.fraction(1), math.fraction(N))));
			const td = document.createElement('td');
			tr.appendChild(td);

			const Hij = math.number(H(Xi, Yj));
			const h = math.format(Hij, {precision: 3});

			td.textContent = `\\( ${h} \\)`;

			line.push({
				n: Hij,
				td
			});

		}
	}

	const strmins = [];

	for (let yj = 0; yj <= N; yj++) {
		const line = ARR[yj];
		let strI = 0;
		let strmin = line[strI].n;
		for (let xi = 0; xi <= N; xi++) {
			if (math.smaller(line[xi].n, strmin)) {
				strI = xi;
				strmin = line[xi].n;
			}
		}

		line[strI].td.classList.add('strmin');
		strmins.push(line[strI].n);
	}

	const collmaxs = [];

	for (let xi = 0; xi <= N; xi++) {
		let rowJ = 0;
		let rowmax = ARR[rowJ][xi].n;

		for (let yj = 0; yj <= N; yj++) {
			if (math.larger(ARR[yj][xi].n, rowmax)) {
				rowJ = yj;
				rowmax = ARR[yj][xi].n;
			}
		}

		ARR[rowJ][xi].td.classList.add('collmax');
		collmaxs.push(ARR[rowJ][xi].n);
	}

	if (!table.querySelector('.strmin.collmax')) {
		const strong1 = document.createElement('strong');
		s1.appendChild(strong1);

		strong1.textContent = 'Седловой точки нет';
	}

	const maxstrmins = Math.max(...strmins);
	const mincollmaxs = Math.min(...collmaxs);
	const gameValue = (maxstrmins + mincollmaxs) / 2;

	const maxstrminsDiv = document.createElement('div');
	const mincollmaxsDiv = document.createElement('div');
	const gameValueDiv = document.createElement('div');

	mincollmaxsDiv.textContent = `Верхняя граница \\( ${math.format(mincollmaxs, {precision: 3})} \\), x${collmaxs.indexOf(mincollmaxs)}`;
	maxstrminsDiv.textContent = `Нижняя граница \\( ${math.format(maxstrmins, {precision: 3})} \\), y${strmins.indexOf(maxstrmins)}`;
	gameValueDiv.textContent = `Цена игры \\( ${math.format(gameValue, {precision: 3})} \\)`;

	s1.appendChild(mincollmaxsDiv);
	s1.appendChild(maxstrminsDiv);
	s1.appendChild(gameValueDiv);
}
