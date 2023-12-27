/**
* @typedef {{ name: string, onAdd: Function }} Filter
* */

export default class FilterHandler {
	/**
	* @constructor
	* @param {Filter[]} filters 
	* @param {HTMLElement} $target
	* */
	constructor(filters, $target) {
		/**
		* @private
		* */
		this.$target = $target;

		/**
		* @private
		* */
		this.$filterSelector = document.createElement("select");
		this.$filterSelector.value = filters[0].name;
		this.$target.appendChild(this.$filterSelector);

		this.$target.appendChild(document.createElement("br"));

		const $submitBtn = document.createElement("button");
		$submitBtn.innerText = "Adicionar";
		$submitBtn.onclick = () => { 
			this.handleSelect(); 
			this.$target.open = false;
		}
		this.$target.appendChild($submitBtn);

		const $cancelBtn = document.createElement("button");
		$cancelBtn.innerText = "Cancelar";
		$cancelBtn.onclick = () => { 
			this.$target.open = false;
		}
		this.$target.appendChild($cancelBtn);

		/**
		* @private
		* @type {Map<string, {active: boolean, onActive: Function}>}
		* */
		this.filters = new Map();

		for (const { name, onAdd } of filters) {
			this.filters.set(name, {
				active: false,
				onActive: onAdd 
			});
		}
	}

	/**
	* @param {string} filterName 
	* */
	addFilter(filterName) {
		const filter = this.filters.get(filterName);

		if (filter) {
			filter.active = true;
			this.filters.set(filterName, filter);

			filter.onActive();
			this.render();
		}
	}

	render() {
		const freeFilters = this.findFreeFilters();
		this.renderOptions(freeFilters);
	}

	/**
	* @private
	* @param {string[]} freeFilters 
	* */
	renderOptions(freeFilters) {
		const $options = freeFilters.map(filter => {
			const $option = document.createElement("option");
			$option.innerText = filter;
			$option.value = filter;

			return $option;
		})

		this.$filterSelector.replaceChildren(...$options);
	}

	/**
	* @private
	* @returns {string[]}
	* */
	findFreeFilters() {
		const freeFilters = [];
		this.filters.forEach((value, key, _) => {
			if (!value.active) {
				freeFilters.push(key);
			}
		});

		return freeFilters;
	}

	/**
	* @private
	* */
	handleSelect() {
		console.log(this.$filterSelector);
		const filter = this.$filterSelector.value;

		console.log(filter);

		this.addFilter(filter);
	}
}
