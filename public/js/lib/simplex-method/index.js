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
			size: this.size
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

		console.dir(condParts);


		return `
		$$${F},$$
		$$\\begin{cases} ${condParts.join(' \\\\ ')} \\end{cases},$$
		$$x_i \\ge 0,  i = \\overline{1..${this.c.length}}.$$
		`;
	}
}
