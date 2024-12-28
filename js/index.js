document.title = "Home";

const $body = document.getElementsByTagName("body")[0];

const $projectDescriptionTitle = document.createElement("h1");
$projectDescriptionTitle.textContent = "Descrição do projeto";
$body.appendChild($projectDescriptionTitle);

const $projectDescription = document.createElement("p");
$projectDescription.textContent = `
	Este projeto tem como objetivo facilitara acesso aos dados do ENEM. 
	Exibindo as notas dos alunos, detalhando as notas, presenças e município 
	dos alunos. O foco é facilitar a visualização do desempenho dos alunos
	por município.
`;
$body.appendChild($projectDescription);

const $pageList = document.createElement("ul");
$body.appendChild($pageList);

const $studentListItem = document.createElement("li");
const $studentLink = document.createElement("a");
$studentLink.href = "/alunos";
$studentLink.textContent = "Dados por aluno"
$studentListItem.appendChild($studentLink)

$pageList.appendChild($studentListItem);

const $cityListItem = document.createElement("li");
const $cityLink = document.createElement("a");
$cityLink.href = "/cidades";
$cityLink.textContent = "Dados por cidade"
$cityListItem.appendChild($cityLink)

$pageList.appendChild($cityListItem);
