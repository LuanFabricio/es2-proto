/**
* @typedef {import("./database.js").Notas} Notas
* */

import { createStateTableFromArray } from "./cityTable.js";
import { resetTable } from "./table.js";
import mapToArray from "./utils.js";

/**
* @param {HTMLBodyElement} $body
* @param {HTMLDivElement} $target
* @param {Map<string, {total: Notas, size: number[]}>} data 
* @param {string} grade 
* @param {string} label 
* */
export default function createCityGradeSortBy($body, $target, data, label) {
	const $gradeSortDiv = document.createElement("div");

	const $gradeSortLabel = document.createElement("label");
	$gradeSortLabel.innerText = label;

	$gradeSortDiv.appendChild($gradeSortLabel);

	const $select = document.createElement("select");
	const options = [["Município", "municipio"], ["Média CN", "cn"], ["Média CH", "ch"], ["Média LC", "lc"], ["Média MT", "mt"], ["Média Redação", "redacao"], ["Média Geral", "geral"]];

	for (const [option, value] of options) {
		const $option = document.createElement("option");

		$option.innerText = option;
		$option.value = value;

		$select.appendChild($option);
	}

	$select.value = "municipio";
	$select.onchange = () => {
		const value = $select.value;

		const sortedData = cityGradeSortBy(mapToArray(data), value);

		const tableBuilder = () => {
			createStateTableFromArray(sortedData, $body);
		};

		resetTable("state-table", tableBuilder);
	};

	$gradeSortDiv.appendChild($select);

	$target.appendChild($gradeSortDiv);
}

/**
* @param {{city: string, total: Notas, size: number[]}[]} data 
* @param {string} grade 
	* @returns {{total: Notas, size: number[], }}
* */
export function cityGradeSortBy(data, grade) {
	return data.sort((a, b) => {
		if (grade == "municipio") {
			const scoreA = a.city.charCodeAt(0);
			const scoreB = b.city.charCodeAt(0);

			return scoreA-scoreB;
		}

		const gradeA = grade == "redacao" ? a.total.redacao.total : a.total[grade];
		const gradeB = grade == "redacao" ? b.total.redacao.total : b.total[grade];

		return gradeA - gradeB;
	});
}
