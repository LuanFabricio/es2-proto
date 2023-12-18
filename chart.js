/**
* @typedef {import("./database.js").Notas} Notas
* */

/**
* @param {string} id 
* @returns {HTMLCanvasElement}
* */
export function createChartCanvas(id) {
	const $canvas = document.createElement("canvas");
	$canvas.id = id;

	return $canvas;
}

/**
* @param {HTMLCanvasElement} $chart
* @param {Map<string, {total: Notas, size: number[]}>} data 
* */
export function createCityChart($chart, data) {
	const labels = [];
	const labelData = [];

	for (const key of data.keys()) {
		const row = data.get(key);

		if (row) {
			labels.push(key);
			labelData.push(row.total.geral);
		}
	}

	new Chart($chart, {
		type: "bar",
		data: {
			labels,
			datasets: [{
				label: "Média geral",
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
