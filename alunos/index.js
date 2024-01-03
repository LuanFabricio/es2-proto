import { Database } from "../js/database.js";
import { createDataTable } from "../js/table.js";
import { createCityFilter, createDataGradeFilter, createDataPresenceFilter } from "../js/filter.js";
import { addExportBtn } from "../js/export.js";
import FilterHandler from "../js/filter_handler.js";

/**
* @typedef {import("./database.js").Data} Data
* @typedef {import("./database.js").Notas} Notas
* */

const db = new Database();

let currentData = db.findAll();

const $body = document.getElementsByTagName("body")[0];

const $dialogState = document.createElement("dialog");
const $btnDialogState = document.createElement("button");
$btnDialogState.innerText = "Adicionar filtro";
$btnDialogState.onclick = () => {
	$dialogState.open = true;
};
$body.appendChild($dialogState);

const $dialogData = document.createElement("dialog");
const $btnDialogData = document.createElement("button");
$btnDialogData.innerText = "Adicionar filtro";
$btnDialogData.onclick = () => {
	$dialogData.open = true;
};
$body.appendChild($dialogData);

const $mainTableDiv = document.createElement("div");
const $mainDiv = document.createElement("div");

$mainDiv.appendChild($btnDialogData);

const $dataCityFilterDiv = document.createElement("div");
$dataCityFilterDiv.id = "filters-city-div";
$dataCityFilterDiv.style = "display: flex;";

const dataCityFilter = [
	{
		name: "Filtro por município",
		onAdd: () => { 
			createCityFilter(db.findAll(), $mainTableDiv, $dataCityFilterDiv);
		}
	}
];

const $presenceFilterDiv = document.createElement("div");
$presenceFilterDiv.style = "display: flex;";
$presenceFilterDiv.id = "filters-presence-div";

const dataPresencefilterShape = [
	["Presença no dia 1: ", [0]],
	["Presença no dia 2: ", [1]],
	["Presença nos dois dias: ", [0, 1]],
];

const dataPresencefilter = dataPresencefilterShape.map(val => ({
	name: val[0].replace(": ", ""),
	onAdd: () => {
		createDataPresenceFilter($mainTableDiv, $presenceFilterDiv, currentData, val[0], val[1]);
	}
}));

// createDataPresenceFilter($mainTableDiv, $presenceFilterDiv, currentData, "Presença no dia 1: ", [0]);
// createDataPresenceFilter($mainTableDiv, $presenceFilterDiv, currentData, "Presença no dia 2: ", [1]);
// createDataPresenceFilter($mainTableDiv, $presenceFilterDiv, currentData, "Presença nos dois dias: ", [0, 1]);

$mainDiv.appendChild($dataCityFilterDiv);
$mainDiv.appendChild($presenceFilterDiv);

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

const dataGradeFilters = dataFiltros.map(val => ({
	name: val[0].replace(": ", ""),
	onAdd: () => {
		createDataGradeFilter($mainTableDiv, $dataFiltersDiv, currentData, val[0], val[1]);
	}
}));

// for (const [label, filterType] of dataFiltros) {
// 	createDataGradeFilter($mainTableDiv, $dataFiltersDiv, currentData, label, filterType);
// }

const dataFilters = dataPresencefilter.concat(dataGradeFilters).concat(dataCityFilter);

const dataFilterHandler = new FilterHandler(dataFilters, $dialogData);
dataFilterHandler.render();


$mainDiv.appendChild($dataFiltersDiv);

createDataTable(currentData, $mainTableDiv);

$mainDiv.appendChild($mainTableDiv);
addExportBtn($mainDiv);

$body.appendChild($mainDiv);
