/** @typedef {import(".").Data} Data */
/** @typedef {import(".").Notas} Notas */

/**
* @param {Data[]} data 
* @returns {Map<string, {total: Notas, size: number}>}
* */
export function calcMetrics(data) {
	/** @type {Map<string, {total: Notas, size: number}>} */
	const stateGrades = new Map();

	for (const { municipio, notas, presenca }  of data) {
		// Candidato Eliminado.
		if (presenca[0] == 2 || presenca[1] == 2) {
			continue;
		}

		const currentStateGrade = stateGrades.get(municipio);

		if (currentStateGrade) {
			currentStateGrade.total = addAllNotes(currentStateGrade.total, notas);
			const size = getSizeCount(presenca);

			for (let i = 0; i < size.length; i++) {
				currentStateGrade.size[i] += size[i];
			}

			stateGrades.set(municipio, currentStateGrade);
		} else {
			stateGrades.set(municipio, { total: notas, size: getSizeCount(presenca) });
		}
	}
	
	for (const key of stateGrades.keys()) {
		const currentStateGrade = stateGrades.get(key);

		if (currentStateGrade) {
			stateGrades.set(key, calcGradesAverage(currentStateGrade));
		}
	}

	return stateGrades;
}

/**
* @param {Notas} grade1 
* @param {Notas} grade2
* @returns {Notas}
* */
function addAllNotes(grade1, grade2) {
	grade1.cn += grade2.cn;
	grade1.lc += grade2.lc;
	grade1.ch += grade2.ch;
	grade1.mt += grade2.mt;
	grade1.geral += grade2.geral;

	grade1.redacao.total += grade2.redacao.total;
	for (let i = 0; i < grade1.redacao.comps.length; i++) {
		grade1.redacao.comps[i] += grade2.redacao.comps[i];
	}

	return grade1;
}

/**
* @param {number[]} presenca
* */
function getSizeCount(presenca) {
	let size = [0, 0, 1];

	for (let i = 0; i < presenca.length; i++) {
		if (presenca[i] == 1) {
			size[i] = 1;
		}
	}

	return size;
}

/**
* @param {{total: Notas, size: number[]}} grades 
* */
function calcGradesAverage(grades) {
	// Ver se é válido considerar os dias que o candidato faltou
	const size = grades.size;
	if (size[1] > 0) {
		grades.total.cn /= size[1];
		grades.total.mt /= size[1];
	}
	if (size[0] > 0) {
		grades.total.ch /= size[0];
		grades.total.lc /= size[0];
		grades.total.redacao.total /= size[0];

		const compsLength = grades.total.redacao.comps.length;
		for (let i = 0; i < compsLength; i++) {
			grades.total.redacao.comps[i] /= size[0];
		}
	}

	grades.total.geral /= size[2];

	return grades;
}
