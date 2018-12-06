import math from '../lib/math.js';

const COALITIONS = [
	[],

	[1],
	[2],
	[3],
	[4],

	[1, 2],
	[1, 3],
	[1, 4],
	[2, 3],
	[2, 4],
	[3, 4],

	[1, 2, 3],
	[1, 2, 4],
	[1, 3, 4],
	[2, 3, 4],

	[1, 2, 3, 4]
];

const WEIGHTS = [
	0,
	2,
	1,
	1,

	2,
	4,
	4,
	4,

	2,
	4,
	4,
	7,

	8,
	8,
	6,
	10
];

const map = new Map();

for (let i = 0; i < COALITIONS.length; i++) {
	console.log('[' + COALITIONS[i] + ']', WEIGHTS[i]);
	map.set(COALITIONS[i] + '', WEIGHTS[i]);
}
console.dir(map);

/**
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number[]}
 */
function pere(a, b) {
	const r = [];
	for (const number of a) {
		if (b.includes(number)) {
			r.push(number);
		}
	}
	return r;
}


/**
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number[]}
 */
function obje(a, b) {
	return [...new Set([...a, ...b])].sort();
}

/**
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number[]}
 */
function minus(a, b) {
	return a.filter(item => !b.includes(item));
}

function logW(arr) {
	console.log('W(' + arr + ')=', map.get(arr + ''));

}

function superAdditivity() {
	for (const c1 of COALITIONS) {
		for (const c2 of COALITIONS) {
			if (pere(c1, c2).length === 0) {
				const o = obje(c1, c2);

				const w1 = map.get(c1 + '');
				const w2 = map.get(c2 + '');
				const w12 = map.get(o + '');

				// logW(c1);
				// logW(c2);
				// logW(o);
				// console.log();

				if (w12 < w1 + w2) {
					console.warn('Игра не является супераддитивной:');
					logW(c1);
					logW(c2);
					console.log('Их объединение');
					logW(o);
					return;
				}
			}
		}
	}
	console.info('Игра является супераддитивной');
}

superAdditivity();

function convexity() {
	for (const c1 of COALITIONS) {
		for (const c2 of COALITIONS) {
			const p = pere(c1, c2);
			const o = obje(c1, c2);

			const w1 = map.get(c1 + '');
			const w2 = map.get(c2 + '');
			const wP = map.get(p + '');
			const wO = map.get(o + '');

			// logW(c1);
			// logW(c2);
			// logW(o);
			// console.log();

			if (wP + wO < w1 + w2) {
				console.warn('Игра не является выпуклой:');
				logW(c1);
				logW(c2);
				console.log('Их пересечение');
				logW(p);
				console.log('Их объединение');
				logW(o);
				return;
			}
		}
	}
	console.info('Игра является выпуклой');
}

convexity();

function findShapley() {
	const shapley = [];
	// math.factorial(n)
	for (let i = 1; i <= 4; i++) {
		let temp = [];
		for (const coalition of COALITIONS) {
			if (coalition.includes(i)) {
				temp.push(
					math.factorial(coalition.length - 1) *
					math.factorial(4 - coalition.length) *
					(map.get(coalition + '') - map.get(minus(coalition, [i]) + ''))
				);
			}
		}

		shapley.push(math.sum(...temp) / math.factorial(4));
	}

	console.info('Вектор Шепли:', shapley);

	console.log('Сумма вектора Шепли', math.sum(...shapley));

	if (math.sum(...shapley) !== map.get([1, 2, 3, 4] + '')) {
		console.warn('Условие групповой рационализации не выполняется');
	} else {
		console.info('Условие групповой рационализации выполняется');
	}

	for (let i = 1; i <= 4; i++) {
		if (shapley[i - 1] < map.get([1] + '')) {
			console.warn('Условие индивидуальной рационализации не выполняется для вектора [', i, ']');
		} else {
			console.info('Условие индивидуальной рационализации выполняется для вектора [', i, ']');
		}
	}
}

findShapley();
