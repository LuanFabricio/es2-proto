/**
* @typedef {import("./database.js").Notas} Notas
* */

/**
* @param {string} id 
* @param {Map<string, {total: Notas, size: number[]}>} data 
* @param {string} grade 
* @param {string} title
* @param {HTMLDivElement} $target 
* */
export function createChart(id, data, grade, title, $target) {
	const $chart = createChartCanvas(id);
	createCityChart($chart, data, grade, title);

	$target.style = "height:320px; width:320px;";

	$target.appendChild($chart);
}

/**
* @param {string} id 
* @param {Map<string, {total: Notas, size: number[]}>} data 
* @param {HTMLDivElement} $target 
* */
export function createPresenceChart(id, data, $target) {
	const $chart = createChartCanvas(id);
	createCityPresenceChart($chart, data);

	$target.style = "height:320px; width:320px;";

	$target.appendChild($chart);
}

/**
* @param {string} id 
* @returns {HTMLCanvasElement}
* */
export function createChartCanvas(id) {
	const $canvas = document.createElement("canvas");
	$canvas.id = id;
	$canvas.width = 320;
	$canvas.height = 320;

	console.log($canvas);

	return $canvas;
}

/**
* @param {HTMLCanvasElement} $chart
* @param {Map<string, {total: Notas, size: number[]}>} data 
* */
function createCityPresenceChart($chart, data) {
	const labels = [];
	const day1 = [];
	const day2 = [];

	for (const key of data.keys()) {
		const row = data.get(key);

		if (row) {
			labels.push(key);
			day1.push(row.size[0]);
			day2.push(row.size[1]);
		}
	}

	new Chart($chart, {
		type: "bar",
		data: {
			labels,
			datasets: [
				{
					label: "Presença no dia 1(%)",
					data: day1,
					borderWidth: 1
				},
				{
					label: "Presença no dia 2(%)",
					data: day2,
					borderWidth: 1
				},
			]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});
}

/**
* @param {HTMLCanvasElement} $chart
* @param {Map<string, {total: Notas, size: number[]}>} data 
* @param {string} grade 
* @param {string} title 
* */
export function createCityChart($chart, data, grade, title) {
	const labels = [];
	const labelData = [];

	for (const key of data.keys()) {
		const row = data.get(key);

		if (row) {
			labels.push(key);
			labelData.push(getGradeData(row, grade));
		}
	}

	new Chart($chart, {
		type: "bar",
		data: {
			labels,
			datasets: [{
				label: title,
				data: labelData,
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});
}

/**
* @param {{ total: Notas, size: number[] }} data 
* @param {string} grade 
* */
function getGradeData(data, grade) {
	if (grade == "redação") {
		return data.total.redacao.total;
	}

	return data.total[grade];
}
