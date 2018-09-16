import {toPolynomial, toTex} from '../math.js';

const temp = {
	leq: '\\leq',
	geq: '\\geq',
	e: '=',
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
		this.A = task.A;
		this.b = task.b;
		this.aspiration = task.aspiration;
		this.conditions = task.conditions;
	}

	print() {
		let F = 'F = ' + toPolynomial(this.c, 'x') + ' \\to ';
		if (this.aspiration === 'max') {
			F += '\\mathrm{max}'
		} else {
			F += '\\mathrm{min}'
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
		`
	}
}
