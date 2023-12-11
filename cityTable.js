import { createTableHeader } from "./table.js";

/**
* @param {Map<string, {total: Notas, size: number[]}>} data 
* @param {HTMLBodyElement} data 
* */
export function createStateTable(data, $body) {
	const $table = document.createElement("table");
	$table.id = "state-table";

	createTableHeader($table);
	
	const columnGradesKeys = ["cn", "ch", "lc", "mt"];

	for (const key of data.keys()) {
		const row = data.get(key);

		if (!row) {
			continue;
		}

		const $row = document.createElement("tr");

		const $thMunicipio = document.createElement("th");
		$thMunicipio.innerText = key;
		$row.appendChild($thMunicipio);

		for (const key of columnGradesKeys) {
			const $th = document.createElement("th");
			$th.innerHTML = row.total[key];
			$row.appendChild($th);
		}

		for (const grade of row.total.redacao.comps) {
			const $th = document.createElement("th");
			$th.innerText = grade;
			$row.appendChild($th);
		}

		const $thRedacao = document.createElement("th");
		$thRedacao.innerText = row.total.redacao.total;
		$row.appendChild($thRedacao);

		const $thGeral = document.createElement("th");
		$thGeral.innerText = row.total.geral;
		$row.appendChild($thGeral);

		const $thPresenca1 = document.createElement("th");
		$thPresenca1.innerText = row.size[0] + "%";
		$row.appendChild($thPresenca1);

		const $thPresenca2 = document.createElement("th");
		$thPresenca2.innerText = row.size[1] + "%";
		$row.appendChild($thPresenca2);

		$table.appendChild($row);
	}

	$body.appendChild($table);
}
