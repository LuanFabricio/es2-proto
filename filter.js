import { createStateTableFromMap } from "./cityTable.js";
import { Database } from "./database.js";
import { createDataTable, resetTable } from "./table.js";
import { Database } from "./database.js";

/**
* @typedef {import("./database.js").Notas} Notas
* @typedef {import("./database.js").Data} Data
* */

/**
* @param {Data[]} data 
* @param {HTMLBodyElement} $body
* @param {HTMLDivElement} $target
* */
export function createCityFilter(data, $body, $target) {
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
		
		let currentData;
		if (newFilterValue == $allFilter.value) {
			const db = new Database();
			currentData = db.findAll();
		} else {
			currentData = data.filter((val) => val.municipio == newFilterValue);
		}

		const tableBuilder = () => {
			createDataTable(currentData, $body);
		};

		resetTable("main-table", tableBuilder);
	};

	$cityFilterDiv.appendChild($filter);

	$target.appendChild($cityFilterDiv);
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
			createStateTableFromMap(newData, $body);
		}
		resetTable("state-table", tableBuilder);
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
			createStateTableFromMap(newData, $body);
		}
		resetTable("state-table", tableBuilder);
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
		resetTable("main-table", tableBuilder);
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
		resetTable("main-table", tableBuilder);
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

/**
* @param {HTMLBodyElement} $body 
* @param {HTMLDivElement} $target
* @param {Data[]} data 
* @param {string} label 
* @param {number[]} days 
* */
export function createDataPresenceFilter($body, $target, data, label, days) {
	const $presenceFilterDiv = document.createElement("div");
	$presenceFilterDiv.style = "margin: 0px 10px;";
	const $presenceFilterLabel = document.createElement("label");
	$presenceFilterLabel.innerText = label;

	$presenceFilterDiv.appendChild($presenceFilterLabel);

	const $selector = document.createElement("select");

	const options = [["Todos", -1], ["Presente", 1], ["Ausente", 0], ["Eliminado", 2]];
	options.forEach(([option, value]) => {
		const $option = document.createElement("option");
		$option.value = value;
		$option.innerText = option;

		$selector.appendChild($option);
	});
	$selector.value = -1;

	$selector.onchange = () => {
		const newData = dataPresenceFilter(data, $selector.value, days);

		const tableBuilder = () => {
			createDataTable(newData, $body);
		};

		resetTable("main-table", tableBuilder);
	}

	$presenceFilterDiv.appendChild($selector);

	$target.appendChild($presenceFilterDiv);
}

/**
* @param {Data[]} data 
* @param {string} option 
* @param {number[]} days 
* @returns {Data[]}
* */
function dataPresenceFilter(data, option, days) {
	if(option == -1) {
		return data;
	}

	return data.filter(row => {
		for (const day of days) {
			if (row.presenca[day] != option) {
				return false;
			}
		}
		return true;
	});
}

/**
* @param {HTMLBodyElement} $body 
* @param {HTMLDivElement} $target
* @param {Map<string, {total: Notas[], size: number[]}>} data 
* @param {string} label 
* @param {number[]} days 
* */
export function createCityPresenceFilter($body, $target, data, label, days) {
	const $presenceFilterDiv = document.createElement("div");
	$presenceFilterDiv.style = "margin: 0px 10px;";
	const $presenceFilterLabel = document.createElement("label");
	$presenceFilterLabel.innerText = label;

	$presenceFilterDiv.appendChild($presenceFilterLabel);

	const $presenceFilterMin = createFilterInput(0);
	const $presenceFilterMax = createFilterInput(100);

	$presenceFilterMin.oninput = () => {
		let minVal = parseInt($presenceFilterMin.value || "0");
		const maxVal = parseInt($presenceFilterMax.value || "0");

		minVal = Math.min(minVal, 100);
		minVal = Math.max(minVal, 0);
		$presenceFilterMin.value = minVal;
		
		const newData = cityPresenceFilter(data, [minVal, maxVal], days);

		const tableBuilder = () => {
			createStateTableFromMap(newData, $body);
		}
		resetTable("state-table", tableBuilder);
	}

	$presenceFilterMax.oninput = () => {
		const minVal = parseInt($presenceFilterMin.value || "0");
		let maxVal = parseInt($presenceFilterMax.value || "0");
		
		maxVal = Math.min(maxVal, 100);
		maxVal = Math.max(maxVal, 0);
		$presenceFilterMax.value = maxVal;

		const newData = cityPresenceFilter(data, [minVal, maxVal], days);

		const tableBuilder = () => {
			createStateTableFromMap(newData, $body);
		}
		resetTable("state-table", tableBuilder);
	}

	$presenceFilterDiv.appendChild($presenceFilterMin);
	const $presenceFilterSeparator = document.createElement("span");
	$presenceFilterSeparator.innerText = " - ";
	$presenceFilterDiv.appendChild($presenceFilterSeparator);
	$presenceFilterDiv.appendChild($presenceFilterMax);

	const $presenceFilterPercentage = document.createElement("label");
	$presenceFilterPercentage.innerText = "%";
	$presenceFilterDiv.appendChild($presenceFilterPercentage);

	$target.appendChild($presenceFilterDiv);
}

/**
* @param {Map<string, {total: Notas[], size: number[]}>} data 
* @param {string} range 
* @param {number[]} days 
* @returns {Map<string, {total: Notas[], size: number[]}>}
* */
function cityPresenceFilter(data, range, days) {
	/** @type {Map<string, {total: Notas[], size: number[]}>} */
	const newData = new Map();

	const [low, high] = range;

	for (const key of data.keys()) {
		const row = data.get(key);

		const isValid = () => {
			for (const day of days) {
				const presence = row.size[day];
				if (!(low <= presence && high >= presence)) {
					return false;
				}
			}
			return true;
		}

		console.log(row, range, days);
		if (row && isValid()) {
			newData.set(key, row);
		}
	}

	return newData;
}
