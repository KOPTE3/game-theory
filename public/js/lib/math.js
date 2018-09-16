const math = window.math;

math.config({
	number: 'Fraction'
});

export default math;

export function toTex (number) {
	switch (math.typeof(number)) {
		case 'Fraction': {
			return `${number.s === 1 ? '' : '-'}\\dfrac{${number.n}}{${number.d}}`;
		}
		case 'number': {
			return number.toString();
		}
	}
}

export function toPolynomial (coeffs, variable) {
	const summands = [];
	coeffs.forEach(function (coeff, pos) {
		if (math.equal(coeff, 0)) {
			return;
		}

		let sign = '';
		if (math.larger(coeff, 0) && summands.length > 0) {
			sign = '+';
		}

		const summand = `${sign} ${toTex(coeff)}${variable}_{${pos + 1}}`;
		summands.push(summand);
	});

	return summands.join(' ');
}
