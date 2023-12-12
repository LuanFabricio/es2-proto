/**
* @typedef {import("./database.js").Data} Data
* @typedef {import("./database.js").Notas} Notas
* */

/**
* @param {Data[]} data 
* @param {HTMLBodyElement} $body 
* */
export function createDataTable(data, $body) {
	const $table = document.createElement("table");
	$table.id = "main-table";

	createTableHeader($table);
	
	const columnGradesKeys = ["cn", "ch", "lc", "mt"];

	for (const row of data) {
		const $row = document.createElement("tr");

		const $thMunicipio = document.createElement("th");
		$thMunicipio.innerText = row.municipio;
		$row.appendChild($thMunicipio);

		for (const key of columnGradesKeys) {
			const $th = document.createElement("th");
			$th.innerHTML = row.notas[key];
			$row.appendChild($th);
		}

		for (const grade of row.notas.redacao.comps) {
			const $th = document.createElement("th");
			$th.innerText = grade;
			$row.appendChild($th);
		}

		const $thRedacao = document.createElement("th");
		$thRedacao.innerText = row.notas.redacao.total;
		$row.appendChild($thRedacao);

		const $thGeral = document.createElement("th");
		$thGeral.innerText = row.notas.geral;
		$row.appendChild($thGeral);

		const presenca = ["Ausente", "Presente", "Eliminado"];

		const $thPresenca1 = document.createElement("th");
		$thPresenca1.innerText = presenca[row.presenca[0]];
		$row.appendChild($thPresenca1);

		const $thPresenca2 = document.createElement("th");
		$thPresenca2.innerText = presenca[row.presenca[1]];
		$row.appendChild($thPresenca2);

		$table.appendChild($row);
	}

	$body.appendChild($table);
}

/**
* @param {HTMLTableElement} $table 
* */
export function createTableHeader($table) {
	for (let i = 0; i < 3; i++) {
		$table.appendChild(document.createElement("col"));
	}
	const $colGroup = document.createElement("colgroup");
	$colGroup.span = 4;
	$table.appendChild($colGroup);
	$table.appendChild(document.createElement("col"));

	const $header = document.createElement("tr");

	const columns = ["Municipio", "Nota CN", "Nota CH", "Nota LC", "Nota MT", "Nota redação", "Nota geral", "Dia 1", "Dia 2"];
	const compColumns = ["Competência 1", "Competência 2", "Competência 3", "Competência 4", "Competência 5", "Total"];

	for (const item of columns) {
		const $col = document.createElement("th");
		$col.innerText = item;

		if (item == columns[5]) {
			$col.colSpan = compColumns.length;
		} else {
			$col.rowSpan = 2;
		}

		$header.appendChild($col);
	}
	$table.appendChild($header);

	const $subHeader = document.createElement("tr");

	for (const item of compColumns) {
		const $col = document.createElement("th");
		$col.scope = "col";
		$col.innerText = item;
			
		$subHeader.appendChild($col);
	}

	$table.appendChild($subHeader);
}

/**
* @param {HTMLBodyElement} $body 
* @param {string} id 
* @param {Function} tableBuilder 
* */
export function resetTable($body, id, tableBuilder) {
	const $table = document.getElementById(id);

	if ($table) {
		$body.removeChild($table);
	}
	tableBuilder();
	// createDataTable(currentData);
}
