/**
* @param {HTMLElement} $main 
* */
export function addExportBtn($main) {
	const $exportDiv = document.createElement("div");

	const $exportCSVBtn = document.createElement("button");
	$exportCSVBtn.innerText = "Exportar para csv";
	const $generatePDFBtn = document.createElement("button");
	$generatePDFBtn.innerText = "Gerar relatório (PDF)";
	$exportDiv.appendChild($exportCSVBtn);
	$exportDiv.appendChild($generatePDFBtn);

	$main.appendChild($exportDiv);
}
