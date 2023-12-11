import { createStateTable } from "./cityTable.js";
import { resetTable } from "./table.js";

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
* @param {Map<string, { total: Notas, size: number[] }}>} $body 
* */
export function createGradeFilter($body, data, area) {
	const $gradeFilterDiv = document.createElement("div");
	const $gradeFilterLabel = document.createElement("label");
	$gradeFilterLabel.innerText = `Filtro da média ${area}: `

	$gradeFilterDiv.appendChild($gradeFilterLabel);

	const $gradeFilterMin = document.createElement("input");
	$gradeFilterMin.type = "number";
	$gradeFilterMin.style = "width: 55px;"
	$gradeFilterMin.defaultValue = 0;
	$gradeFilterMin.min = 0;
	$gradeFilterMin.step = 10;
	$gradeFilterMin.max = 1000;
	$gradeFilterMin.oninput = () => {
		const maxVal = parseInt($gradeFilterMax.value);
		let minVal = parseInt($gradeFilterMin.value);
		minVal = Math.max(minVal, 0);
		minVal = Math.min(minVal, 1000);

		$gradeFilterMin.value = minVal;

		const newData = gradeFilter(data, "geral", [minVal, maxVal]);
		const tableBuilder = () => {
			createStateTable(newData, $body);
		}
		resetTable($body, "state-table", tableBuilder);
	};
	$gradeFilterDiv.appendChild($gradeFilterMin);

	const $gradeFilterSeparator = document.createElement("label");
	$gradeFilterSeparator.innerText = " - "
	$gradeFilterDiv.appendChild($gradeFilterSeparator);

	const $gradeFilterMax = document.createElement("input");
	$gradeFilterMax.type = "number";
	$gradeFilterMax.style = "width: 55px;"
	$gradeFilterMax.defaultValue = 1000;
	$gradeFilterMax.min = 0;
	$gradeFilterMax.step = 10;
	$gradeFilterMax.max = 1000;
	$gradeFilterMax.oninput = () => {
		const minVal = parseInt($gradeFilterMin.value);
		let maxVal = parseInt($gradeFilterMax.value);
		maxVal = Math.max(maxVal, 0);
		maxVal = Math.min(maxVal, 1000);

		$gradeFilterMax.value = maxVal;
		const newData = gradeFilter(data, "geral", [minVal, maxVal]);
		const tableBuilder = () => {
			createStateTable(newData, $body);
		}
		resetTable($body, "state-table", tableBuilder);
	};

	$gradeFilterDiv.appendChild($gradeFilterMax);

	$body.append($gradeFilterDiv);
}

/**
* @param {Map<string, {total: Notas, size: number[]}>} data 
* @param {string} gradeType 
* @param {number[]} range 
* @returns {Map<string, {total: Notas, size: number[]}>}
* */
function gradeFilter(data, filterType, range) {
	const gradeFilter = {
		"geral": () => {
			/** @type {Map<string, { total: Nota, size: number[] }>} */
			const newData = new Map();
			const [low, high] = range;

			for (const key of data.keys()) {
				const row = data.get(key);

				if (row) {
					const grade = row.total.geral;
					if (grade >= low && grade <= high) {
						newData.set(key, row);
					}
				}
			}

			return newData;
		},
	};

	const filter = gradeFilter[filterType];

	if (filter) {
		return filter();
	}

	throw new Error("[ERROR] filterType not implemented.");
}