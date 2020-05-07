const app = {
	backdrop: document.querySelector(".backdrop"),
	rulesBtnElem: document.querySelector(".rules"),
	rulesModal: document.querySelector(".modal"),
	closeModalBtnElem: document.querySelector(".close-modal"),
	init() {
		this.addListeners();
	},

	showModal(e) {
		this.rulesModal.classList.add("show--modal");
		this.backdrop.classList.add("show");
	},

	hideModal(e) {
		this.rulesModal.classList.remove("show--modal");
		this.backdrop.classList.remove("show");
	},

	addListeners() {
		this.backdrop.addEventListener("click", this.hideModal.bind(this));
		this.rulesBtnElem.addEventListener("click", this.showModal.bind(this));
		this.closeModalBtnElem.addEventListener("click", this.hideModal.bind(this));
	},
};

app.init();
