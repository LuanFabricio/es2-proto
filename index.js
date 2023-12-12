import { Database } from "./database.js";
import { createDataTable, resetTable } from "./table.js";
import { calcMetrics } from "./metricas.js";
import { createStateTable } from "./cityTable.js";
import { createCityGradeFilter, createCityFilter, createDataGradeFilter } from "./filter.js";

/**
* @typedef {import("./database.js").Data} Data
* @typedef {import("./database.js").Notas} Notas
* */

const db = new Database();

let currentData = db.findAll();

const $body = document.getElementsByTagName("body")[0];

const $mainTableDiv = document.createElement("div");
createCityFilter(db.findAll(), $mainTableDiv);

const $dataFiltersDiv = document.createElement("div");
$dataFiltersDiv.style = "display: flex;";
$dataFiltersDiv.id = "filters-grade-div";

const dataFiltros = [
	["Ciências da Natureza: ", "cn"],
	["Ciências Humanas: ", "ch"],
	["Linguagens e Códigos: ", "lc"],
	["Matemática: ", "mt"],
	["Redação: ", "redacao"],
	["Média geral: ", "geral"],
];

for (const [label, filterType] of dataFiltros) {
	createDataGradeFilter($mainTableDiv, $dataFiltersDiv, currentData, label, filterType);
}

$mainTableDiv.appendChild($dataFiltersDiv);

createDataTable(currentData, $mainTableDiv);

$body.appendChild($mainTableDiv);

const averageGrades = calcMetrics(currentData);

console.log(averageGrades);

const nCandidatos = currentData.length;
/**
* @type {Map<string, {total: Notas, size: number[]}>}
* */
const presencaPorEstado = new Map();
const presencaGeral = [0, 0];

for (const key of averageGrades.keys()) {
	const state = averageGrades.get(key);
	const presenca = presencaPorEstado.get(key);

	for (let i = 0; i < presencaGeral.length; i++) {
		presencaGeral[i] += state.size[i];
	}

	if (presenca) {
		for (let i = 0; i < presencaGeral.length; i++) {
			presenca[i] += state.size[i];
		}
	}
}

console.table(presencaGeral);
console.log(nCandidatos);

for (const key of averageGrades.keys()) {
	const presenca = averageGrades.get(key);

	const [d1, d2, d3] = presenca.size;

	const pD1 = (d1 / d3).toFixed(4) * 100;
	console.log(`[${key}]Presença dia 1: ${d1}/${d3} (${pD1}%)`);

	const pD2 = (d2 / d3).toFixed(4) * 100;
	console.log(`[${key}]Presença dia 2: ${d2}/${d3} (${pD2}%)`);

	presenca.size[0] = pD1;
	presenca.size[1] = pD2;

	averageGrades.set(key, presenca);
}

$body.appendChild(document.createElement("br"));

const $filtersDiv = document.createElement("div");
$filtersDiv.style = "display: flex;";
$filtersDiv.id = "filters-grade-div";

createCityGradeFilter($body, $filtersDiv, averageGrades, "Filtro da média geral: ", "geral");

const filtros = [
	["Média das notas de Ciências da Natureza: ", "cn"],
	["Média das notas de Ciências Humanas: ", "ch"],
	["Média das notas de Linguagens e Códigos: ", "lc"],
	["Média das notas de Matemática: ", "mt"],
	["Média das notas de Redação: ", "redacao"],
];

// let currentAverageGrades = new Map(averageGrades);
for (const [label, filterType] of filtros) {
	// currentAverageGrades = new Map(currentAverageGrades);
	createCityGradeFilter($body, $filtersDiv, averageGrades, label, filterType);
}

$body.appendChild($filtersDiv);

// currentAverageGrades = new Map(averageGrades);
createStateTable(averageGrades, $body);
