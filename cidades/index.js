import { Database } from "../js/database.js";
import { calcMetrics } from "../js/metricas.js";
import { createStateTableFromArray } from "../js/cityTable.js";
import { createCityGradeFilter, createCityPresenceFilter } from "../js/filter.js";
import createCityGradeSortBy, { cityGradeSortBy } from "../js/sort.js";
import mapToArray from "../js/utils.js";
import { addExportBtn } from "../js/export.js";
import { createChart, createPresenceChart } from "../js/chart.js";
import FilterHandler from "../js/filter_handler.js";

/**
* @typedef {import("./database.js").Data} Data
* @typedef {import("./database.js").Notas} Notas
* */

const db = new Database();

let currentData = db.findAll();

document.title = "Cidades";
const $body = document.getElementsByTagName("body")[0];

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


const $dialogState = document.createElement("dialog");
const $btnDialogState = document.createElement("button");
$btnDialogState.innerText = "Adicionar filtro";
$btnDialogState.onclick = () => {
	$dialogState.open = true;
};
$body.appendChild($dialogState);
$body.appendChild($btnDialogState);

const $cityPresenceFilters = document.createElement("div");
$cityPresenceFilters.style = "display: flex;";
$cityPresenceFilters.id = "filters-grade-div";

const $stateDiv = document.createElement("div");

const statePresenceFiltersShape = [
	["Presença dia 1: ", [0]],
        ["Presença dia 2: ", [1]],
        ["Presença nos dias 1 e 2: ", [0, 1]],
];

const statePresenceFilters = statePresenceFiltersShape.map(val => ({
	name: val[0].replace(": ", ""),
	onAdd: () => { 
		createCityPresenceFilter($stateDiv, $cityPresenceFilters, averageGrades, val[0], val[1]);
	}
}))

// createCityPresenceFilter($stateDiv, $cityPresenceFilters, averageGrades, "Presença dia 1: ", [0]);
// createCityPresenceFilter($stateDiv, $cityPresenceFilters, averageGrades, "Presença dia 2: ", [1]);
// createCityPresenceFilter($stateDiv, $cityPresenceFilters, averageGrades, "Presença nos dias 1 e 2: ", [0, 1]);

$body.appendChild($cityPresenceFilters);

const $filtersDiv = document.createElement("div");
$filtersDiv.style = "display: flex;";
$filtersDiv.id = "filters-grade-div";

const filtros = [
	["Média Ciências da Natureza: ", "cn"],
	["Média Ciências Humanas: ", "ch"],
	["Média Linguagens e Códigos: ", "lc"],
	["Média Matemática: ", "mt"],
	["Média Redação: ", "redacao"],
	["Média geral: ", "geral"]
];

// // let currentAverageGrades = new Map(averageGrades);
// for (const [label, filterType] of filtros) {
// 	// currentAverageGrades = new Map(currentAverageGrades);
// 	createCityGradeFilter($stateDiv, $filtersDiv, averageGrades, label, filterType);
// }

$body.appendChild($filtersDiv);

const $gradeSortDiv = document.createElement("div");
$gradeSortDiv.style = "display: flex;";
$gradeSortDiv.id = "sort-city-div";

createCityGradeSortBy($stateDiv, $gradeSortDiv, averageGrades, "Organize por: ");

$body.appendChild($gradeSortDiv);

// currentAverageGrades = new Map(averageGrades);
const sortedAverageGrades = cityGradeSortBy(mapToArray(averageGrades), "municipio")
createStateTableFromArray(sortedAverageGrades, $stateDiv);
$body.appendChild($stateDiv);
addExportBtn($body);

$body.appendChild(document.createElement("br"));
// createStateTableFromArray([{ city: "M1", total: { cn: 400, ch: 400, lc: 400, mt: 400, redacao: { comps: [120,120,120,120,120], total: 600 }, geral: 600}, size: [50, 50] }], $body)

// const $chartCity = createChartCanvas("city-geral-chart");
// createCityChart($chartCity, averageGrades, "geral", "Média geral");
// 
// $chartDiv.style = "height:40vh; width:80vw;";
// 
// $chartDiv.appendChild($chartCity);

const chartDivs1 = [
	{ title: "Média redação", grade: "redação" },
	{ title: "Média LC", grade: "lc" },
	{ title: "Média CH", grade: "ch" },
];

const $chartDiv1 = document.createElement("div");
$chartDiv1.style = "display: flex; alignt-items: center; justify-content: space-around;"

chartDivs1.forEach(({ title, grade }) => {
	const $chartDiv = document.createElement("div");
	createChart(`city-${grade}-chart`, averageGrades, grade, title, $chartDiv);
	$chartDiv1.appendChild($chartDiv);
})

const chartDivs2 = [
	{ title: "Média MT", grade: "mt" },
	{ title: "Média geral", grade: "geral" },
	{ title: "Média CN", grade: "cn" },
];

const $chartDiv2 = document.createElement("div");
$chartDiv2.style = "display: flex; alignt-items: center; justify-content: space-around;"

chartDivs2.forEach(({ title, grade }) => {
	const $chartDiv = document.createElement("div");
	createChart(`city-${grade}-chart`, averageGrades, grade, title, $chartDiv);
	$chartDiv2.appendChild($chartDiv);
})

const $chartDiv3 = document.createElement("div");
$chartDiv3.style = "display: flex; alignt-items: center; justify-content: space-around;"
const $chartPresenceDiv = document.createElement("div");
createPresenceChart(`city-presence-chart`, averageGrades, $chartPresenceDiv);
$chartDiv3.appendChild($chartPresenceDiv);

const $chartDivGroup = document.createElement("div");

$chartDivGroup.appendChild($chartDiv1);
$chartDivGroup.appendChild($chartDiv2);
$chartDivGroup.appendChild($chartDiv3);

$body.appendChild($chartDivGroup);

const stateGradeFilters = filtros.map(filter => ({
 		name: filter[0].replace(":", ""), 
 		onAdd: () => {
 			createCityGradeFilter($stateDiv, $filtersDiv, averageGrades, filter[0], filter[1]);
 		}
}));

const stateFilters = statePresenceFilters.concat(stateGradeFilters);

const stateFilterHandler = new FilterHandler(stateFilters, $dialogState);
stateFilterHandler.render();

