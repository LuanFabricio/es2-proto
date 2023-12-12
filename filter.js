import { createStateTable } from "./cityTable.js";
import { createDataTable, resetTable } from "./table.js";

/**
* @typedef {import("./database.js").Notas} Notas
* @typedef {import("./database.js").Data} Data
* */

/**
* @param {Data[]} data 
* @param {HTMLBodyElement} $body
* */
export function createCityFilter(data, $body) {
	const $cityFilterDiv = document.createElement("div");
	const $filterLabel = document.createElement("label");
	$filterLabel.innerText = "Filtro por município: ";

	$cityFilterDiv.appendChild($filterLabel);

	/**
	* @type {Set<string>}
	* */
	const cities = new Set();

	for (const row of data) {
		cities.add(row.municipio);
	}

	const $filter = document.createElement("select");
	$filter.id = "city-filter";
	const $allFilter = document.createElement("option");
	$allFilter.value = "Todos";
	$allFilter.innerText = "Todos";

	$filter.appendChild($allFilter);
	$filter.value = $allFilter.value;

	for (const city of cities) {
		const $option = document.createElement("option");
		$option.value = city;
		$option.innerText = city;

		$filter.appendChild($option);
	}

	$filter.onchange = () => {
		const newFilterValue = $filter.value;
		
		if (newFilterValue == $allFilter.value) {
			currentData = db.findAll();
		} else {
			currentData = data.filter((val) => val.municipio == newFilterValue);
		}

		resetTable($body, "main-table");
	};

	$cityFilterDiv.appendChild($filter);

	$body.appendChild($cityFilterDiv);
}

/**
* @param {HTMLBodyElement} $body 
* @param {HTMLDivElement} $target 
* @param {Map<string, {total: Notas, size: number[]}>} data
* @param {string} labelText 
* @param {string} area 
* */
export function createCityGradeFilter($body, $target, data, labelText, area) {
	const $gradeFilterDiv = document.createElement("div");
	$gradeFilterDiv.style = "margin: 0px 10px;";
	const $gradeFilterLabel = document.createElement("label");
	$gradeFilterLabel.innerText = labelText;

	$gradeFilterDiv.appendChild($gradeFilterLabel);
	$gradeFilterDiv.appendChild(document.createElement("br"));

	const $gradeFilterMin = createFilterInput(0);
	$gradeFilterMin.oninput = () => {
		const maxVal = parseInt($gradeFilterMax.value | "0");
		let minVal = parseInt($gradeFilterMin.value | "0");
		minVal = Math.max(minVal, 0);
		minVal = Math.min(minVal, 1000);

		$gradeFilterMin.value = minVal;

		const newData = cityGradeFilter(data, area, [minVal, maxVal]);
		const tableBuilder = () => {
			createStateTable(newData, $body);
		}
		resetTable($body, "state-table", tableBuilder);
	};
	$gradeFilterDiv.appendChild($gradeFilterMin);

	const $gradeFilterSeparator = document.createElement("label");
	$gradeFilterSeparator.innerText = " - "
	$gradeFilterDiv.appendChild($gradeFilterSeparator);

	const $gradeFilterMax = createFilterInput(1000);
	$gradeFilterMax.oninput = () => {
		const minVal = parseInt($gradeFilterMin.value | "0");
		let maxVal = parseInt($gradeFilterMax.value | "0");
		maxVal = Math.max(maxVal, 0);
		maxVal = Math.min(maxVal, 1000);

		$gradeFilterMax.value = maxVal;
		const newData = cityGradeFilter(data, area, [minVal, maxVal]);
		const tableBuilder = () => {
			createStateTable(newData, $body);
		}
		resetTable($body, "state-table", tableBuilder);
	};

	$gradeFilterDiv.appendChild($gradeFilterMax);

	$target.appendChild($gradeFilterDiv);
}

/**
* @param {Map<string, {total: Notas, size: number[]}>} data 
* @param {string} gradeType 
* @param {number[]} range 
* @returns {Map<string, {total: Notas, size: number[]}>}
* */
function cityGradeFilter(data, filterType, range) {
	/** @type {Map<string, { total: Notas, size: number[] }>} */
	const newData = new Map();
	const [low, high] = range;

	for (const key of data.keys()) {
		const row = data.get(key);

		if (row) {
			const grade = filterType == "redacao" ? row.total.redacao.total : row.total[filterType];
			if (grade >= low && grade <= high) {
				newData.set(key, row);
			}
		}
	}

	return newData;
}

/**
* @param {HTMLBodyElement} $body 
* @param {HTMLDivElement} $target 
* @param {Data[]} data
* @param {string} labelText 
* @param {string} area 
* */
export function createDataGradeFilter($body, $target, data, labelText, area) {
	const $gradeFilterDiv = document.createElement("div");
	$gradeFilterDiv.style = "margin: 0px 10px;";
	const $gradeFilterLabel = document.createElement("label");
	$gradeFilterLabel.innerText = labelText;

	$gradeFilterDiv.appendChild($gradeFilterLabel);
	$gradeFilterDiv.appendChild(document.createElement("br"));

	const $gradeFilterMin = createFilterInput(0);
	$gradeFilterMin.oninput = () => {
		const maxVal = parseInt($gradeFilterMax.value | "0");
		let minVal = parseInt($gradeFilterMin.value | "0");
		minVal = Math.max(minVal, 0);
		minVal = Math.min(minVal, 1000);

		$gradeFilterMin.value = minVal;

		const newData = dataGradeFilter(data, area, [minVal, maxVal]);
		const tableBuilder = () => {
			createDataTable(newData, $body);
		}
		resetTable($body, "main-table", tableBuilder);
	};
	$gradeFilterDiv.appendChild($gradeFilterMin);

	const $gradeFilterSeparator = document.createElement("label");
	$gradeFilterSeparator.innerText = " - "
	$gradeFilterDiv.appendChild($gradeFilterSeparator);

	const $gradeFilterMax = createFilterInput(1000);
	$gradeFilterMax.oninput = () => {
		const minVal = parseInt($gradeFilterMin.value | "0");
		let maxVal = parseInt($gradeFilterMax.value | "0");
		maxVal = Math.max(maxVal, 0);
		maxVal = Math.min(maxVal, 1000);

		$gradeFilterMax.value = maxVal;
		const newData = dataGradeFilter(data, area, [minVal, maxVal]);
		const tableBuilder = () => {
			createDataTable(newData, $body);
		}
		resetTable($body, "main-table", tableBuilder);
	};

	$gradeFilterDiv.appendChild($gradeFilterMax);

	$target.appendChild($gradeFilterDiv);
}

/**
* @param {number} defaultValue 
* @returns {HTMLInputElement}
* */
function createFilterInput(defaultValue) {
	const $gradeFilter = document.createElement("input");
	$gradeFilter.type = "number";
	$gradeFilter.style = "width: 55px;"
	$gradeFilter.defaultValue = defaultValue;
	$gradeFilter.min = 0;
	$gradeFilter.step = 10;
	$gradeFilter.max = 1000;

	return $gradeFilter
}

/**
* @param {Data[]} data 
* @param {string} gradeType 
* @param {number[]} range 
* @returns {Data[]}
* */
function dataGradeFilter(data, filterType, range) {
	/** @type {Data[]} */
	const newData = [];
	const [low, high] = range;

	for (const row of data) {
		const grade = filterType == "redacao" ? row.notas.redacao.total : row.notas[filterType];
		if (grade >= low && grade <= high) {
			newData.push(row)
		}
	}

	return newData;
}
