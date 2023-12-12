/**
* @param {Map<string, { total: Notas[], size: number[] }>} map 
	* @returns {{ city: string, total: Notas[], size: number[] }[]}
* */
export default function mapToArray(map) {
	return Array.from(map, ([key, val]) => ({ city: key, total: val.total, size: val.size }));
}
