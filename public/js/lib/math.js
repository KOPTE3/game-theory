const math = window.math;

math.config({
	number: 'Fraction'
});

export default math;

export function toTex (number) {
	if (math.isInteger(number)) {
		number = math.number(number);
	}

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

		let coeffStr = '';
		if (!math.equal(coeff, 1)) {
			coeffStr = toTex(coeff);
		}

		const summand = `${sign} ${coeffStr}${variable}_{${pos + 1}}`;
		summands.push(summand);
	});

	return summands.join(' ');
}
