import math, {toPolynomial, toTex} from '../math.js';

const temp = {
	leq: '\\leq',
	geq: '\\geq',
	e: '='
};

export default class SimplexMethod {
	/**
	 * @param {number[]} task.c
	 * @param {number[]} task.b
	 * @param {number[][]} task.A
	 * @param {'min' | 'max'} task.aspiration
	 * @param {Array<'leq' | 'geq' | 'e'>} task.conditions
	 */
	constructor(task) {
		this.c = task.c;
		this.b = task.b;
		this.A = task.A;
		this.aspiration = task.aspiration;
		this.conditions = task.conditions;

		this.inverted = false;
		this.size = this.c.length;

		this.basis = [];
		this.free = [];
		for (let n = 1; n <= this.size; n++) {
			this.basis.push(n);
		}

		this.ST = null;
	}

	matrixPrepare() {
		this.free.forEach(function (n, pos) {
			if (math.equal(this.A[pos][n - 1], -1)) {
				this.A[pos] = this.A[pos].map(item => math.unaryMinus(item));
				this.b[pos] = math.unaryMinus(this.b[pos]);
			}
		}.bind(this));

		const ST = [];
		const FRow = this.free.length;
		for (let i = 0; i < this.free.length + 1; i++) {
			ST.push([]);
		}

		for (let i = 0; i < this.free.length; i++) {
			ST[i][0] = this.b[i];
			this.basis.forEach(function (j) {
				ST[i][j] = this.A[i][j - 1];
			}.bind(this));
		}

		ST[FRow][0] = math.number(0);
		this.basis.forEach(function (j) {
			ST[FRow][j] = math.unaryMinus(this.c[j - 1]);
		}.bind(this));

		this.ST = ST;
		this.freeVars = this.free.slice(0);
		this.basisVars = this.basis.slice(0);
	}

	printSimplexTable() {
		const tableHead = `
<tr>
	<th></th>
	<th>\\( s_{i0} \\)</th>
	${this.basisVars.map(n => `<th>\\( x_{${n}} \\)</th>`).join('')}
</tr>
		`;

		const trs = [];
		const FRow = this.ST.length - 1;

		this.freeVars.forEach(function (n, i) {
			const tr = `
<tr>
	<td>\\( x_{${n}} \\)</td>
	${this.ST[i].map(function (_, j) {
				return `<td>\\( ${toTex(this.ST[i][j])} \\)</td>`;
			}.bind(this)).join('')}
</tr>
			`;

			trs.push(tr);
		}.bind(this));

		trs.push(`
<tr>
	<td>\\( F \\)</td>
	${this.ST[FRow].map(function (_, j) {
			return `<td>\\( ${toTex(this.ST[FRow][j])} \\)</td>`;
		}.bind(this)).join('')}
</tr>
		`);

		const tableHTML = `
		<table class="simplex-table">
			<thead>${tableHead}</thead>
			<tbody>${trs.join('')}</tbody>
		</table>
		`;

		return tableHTML;
	}

	isBaseSolutionValid() {
		const FRow = this.ST.length - 1;
		return this.ST.every((line, i) => {
			if (i === FRow) {
				return true;
			}

			return math.largerEq(line[0], 0);
		});
	}

	isOptimalSolutionValid() {
		const FRow = this.ST.length - 1;
		return this.ST[FRow].every((num, i) => {
			if (i === 0) {
				return true;
			}

			return math.smallerEq(num, 0);
		});
	}

	baseSolutionFindResolvingItem() {
		const FRow = this.ST.length - 1;
		if (this.isBaseSolutionValid()) {
			throw new Error('Опорное решение уже найдено');
		}

		const s0NegativeRow = this.ST.findIndex((line) => math.smaller(line[0], 0));
		const resolvingColl = this.ST[s0NegativeRow].findIndex((item, pos) => {
			if (pos === 0) {
				return;
			}

			return math.smaller(item, 0);
		});

		if (resolvingColl === -1) {
			throw new Error('Нет допустимых решений');
		}

		let min = Infinity;
		let minIndex = -1;

		this.ST.forEach((line, pos) => {
			if (pos === FRow) {
				return;
			}

			const quotient = math.divide(line[0], line[resolvingColl]);
			if (math.larger(quotient, 0) && math.smaller(quotient, min)) {
				min = quotient;
				minIndex = pos;
			}
		});

		if (minIndex === -1) {
			throw new Error('Что-то пошло не так');
		}

		return {
			row: minIndex + 1,
			coll: resolvingColl
		};
	}

	optimalSolutionFindResolvingItem() {
		const FRow = this.ST.length - 1;
		if (this.isOptimalSolutionValid()) {
			throw new Error('Оптимальное решение уже найдено');
		}

		const resolvingColl = this.ST[FRow].findIndex((item, pos) => {
			if (pos === 0) {
				return;
			}

			return math.larger(item, 0);
		});

		if (resolvingColl === -1) {
			throw new Error('Оптимальное решение уже найдено');
		}

		let min = Infinity;
		let minIndex = -1;

		this.ST.forEach((line, pos) => {
			if (pos === FRow) {
				return;
			}

			if (math.smallerEq(line[resolvingColl], 0)) {
				return;
			}

			const quotient = math.divide(line[0], line[resolvingColl]);
			if (math.larger(quotient, 0) && (min === Infinity || math.smaller(quotient, min))) {
				min = quotient;
				minIndex = pos;
			}
		});

		if (minIndex === -1) {
			throw new Error('Оптимального решения не существует');
		}

		return {
			row: minIndex + 1,
			coll: resolvingColl
		};
	}

	transformJordan({row, coll}) {
		const rows = this.ST.length;
		const colls = this.ST[0].length;
		const ST = this.ST;
		const newST = [];
		for (let i = 0; i < rows; i++) {
			newST.push([]);
			for (let j = 0; j < colls; j++) {
				newST[i][j] = math.number(0);
			}
		}

		const R = row - 1;
		const K = coll;

		// разрешающий элемент
		newST[R][K] = math.divide(math.fraction(1), math.fraction(ST[R][K]));

		// разрешающая строка
		for (let j = 0; j < colls; j++) {
			if (j === K) {
				continue;
			}

			newST[R][j] = math.divide(math.fraction(ST[R][j]), math.fraction(ST[R][K]));
		}

		// разрешающий столбец
		for (let i = 0; i < rows; i++) {
			if (i === R) {
				continue;
			}

			newST[i][K] = math.divide(math.unaryMinus(math.fraction(ST[i][K])), math.fraction(ST[R][K]));
		}

		// остальные элементы
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < colls; j++) {
				if (i === R || j === K) {
					continue;
				}

				newST[i][j] = math.subtract(
					math.fraction(ST[i][j]),
					math.divide(
						math.multiply(math.fraction(ST[i][K]), math.fraction(ST[R][j])),
						math.fraction(ST[R][K])
					)
				);
			}
		}

		this.ST = newST;

		const temp = this.freeVars[row - 1];
		this.freeVars[row - 1] = this.basisVars[coll - 1];
		this.basisVars[coll - 1] = temp;
	}

	printSolution() {
		let html = '';
		const xVector = [];
		for (let n = 1; n <= this.c.length; n++) {
			if (this.basisVars.includes(n)) {
				html += `
					$$ x_{${n}}=0 \\geq 0, $$
				`;
				xVector.push(math.fraction(0));
				continue;
			}

			const row = this.freeVars.indexOf(n);
			if (row === -1) {
				throw new Error(`Что-то пошло не так`);
			}

			html += `
				$$ x_{${n}}=${toTex(this.ST[row][0])} \\geq 0, $$
			`;
			xVector.push(math.fraction(this.ST[row][0]));
		}

		const F = xVector.reduce(function (sum, x, position) {
			return math.add(sum, math.multiply(x, this.c[position]));
		}.bind(this), math.fraction(0));

		html += `
			$$ F${this.inverted ? '\'' : ''}=${toTex(F)} $$
		`;

		if (this.inverted) {
			html += `
				$$ F=${toTex(math.unaryMinus(F))} $$
			`;
		}

		return html;
	}

	canonize() {
		if (this.aspiration === 'max') {
			this.c = this.c.map(item => math.unaryMinus(item));
			this.inverted = true;
			this.aspiration = 'min';
		}

		this.conditions.forEach(function (condition, pos) {
			switch (condition) {
				case 'leq': {
					this.c.push(math.number(0));
					this.A.forEach(function (line, p) {
						if (p === pos) {
							line.push(math.number(1));
						} else {
							line.push(math.number(0));
						}
					});
					this.free.push(this.c.length);
					break;
				}

				case 'geq': {
					this.c.push(math.number(0));
					this.A.forEach(function (line, p) {
						if (p === pos) {
							line.push(math.number(-1));
						} else {
							line.push(math.number(0));
						}
					});
					this.free.push(this.c.length);
					break;
				}

				case 'e': {
					break;
				}
			}

			this.conditions[pos] = 'e';
		}.bind(this));
	}

	clone() {
		return new SimplexMethod({
			c: this.c.map(item => math.clone(item)),
			b: this.b.map(item => math.clone(item)),
			A: this.A.map(line => line.map(item => math.clone(item))),
			aspiration: this.aspiration,
			conditions: this.conditions.slice(0),

			inverted: this.inverted,
			size: this.size,

			basis: this.basis.slice(0),
			free: this.free.slice(0)
		});
	}

	print() {
		let F = `F${this.inverted ? '\'' : ''} = ${toPolynomial(this.c, 'x')} \\to `;
		if (this.aspiration === 'max') {
			F += '\\mathrm{max}';
		} else {
			F += '\\mathrm{min}';
		}

		const condParts = [];
		this.A.forEach(function (a, pos) {
			let line = '';
			line += toPolynomial(a, 'x');
			line += ` ${temp[this.conditions[pos]]} `;
			line += toTex(this.b[pos]);

			condParts.push(line);
		}.bind(this));

		return `
		$$${F},$$
		$$\\begin{cases} ${condParts.join(' \\\\ ')} \\end{cases},$$
		$$x_i \\ge 0,  i = \\overline{1..${this.c.length}}.$$
		`;
	}
}
