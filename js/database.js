/**
* @typedef {Object} Notas
* @property {number} cn
* @property {number} ch
* @property {number} lc
* @property {number} mt
* @property {{comps: number[], total: number}} redacao
* @property {number} geral
* */

/**
* @typedef {Object} Data
* @property {string} municipio
* @property {Notas} notas
* @property {number[]} presenca
* */

export class Database {
	/**
		* @constructor
		* */
	constructor() {
		this.data = data
	}

	/**
	* @public
	* @returns {Data[]}
	* */
	findAll() {
		return this.data;
	}
}

const data = [
	{
		municipio: "Aracaju",
		notas: {
			cn: 440,
			ch: 440,
			lc: 440,
			mt: 440,
			redacao: {
				comps: [120,120,120,120,120],
				total: 600,
			},
			geral: 472,
		},
		presenca: [1, 1]
	},
	{
		municipio: "São Cristóvão",
		notas: {
			cn: 640,
			ch: 540,
			lc: 540,
			mt: 720,
			redacao: {
				comps: [160,160,160,160,200],
				total: 840,
			},
			geral: 656,
		},
		presenca: [1, 1]
	},
	{
		municipio: "São Cristóvão",
		notas: {
			cn: 640,
			ch: 640,
			lc: 640,
			mt: 640,
			redacao: {
				comps: [120,120,120,120,160],
				total: 640,
			},
			geral: 640,
		},
		presenca: [1, 1]
	},
	{
		municipio: "Lagarto",
		notas: {
			cn: 0,
			ch: 640,
			lc: 640,
			mt: 0,
			redacao: {
				comps: [120,120,120,120,160],
				total: 640,
			},
			geral: 384,
		},
		presenca: [1, 0]
	},
	{
		municipio: "Aracaju",
		notas: {
			cn: 660,
			ch: 0,
			lc: 0,
			mt: 760,
			redacao: {
				comps: [0, 0, 0, 0, 0],
				total: 0,
			},
			geral: 284,
		},
		presenca: [0, 1]
	},
	{
		municipio: "Aracaju",
		notas: {
			cn: 0,
			ch: 0,
			lc: 0,
			mt: 0,
			redacao: {
				comps: [0, 0, 0, 0, 0],
				total: 0,
			},
			geral: 0,
		},
		presenca: [2, 2]
	},
];
