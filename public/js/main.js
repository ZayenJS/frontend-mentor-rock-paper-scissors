const app = {
	// DOM elems
	backdrop: document.querySelector(".backdrop"),
	rulesBtnElem: document.querySelector(".rules"),
	rulesModal: document.querySelector(".modal"),
	closeModalBtnElem: document.querySelector(".close-modal"),
	board: document.querySelector("#board"),
	scoreElem: document.querySelector("#score"),

	// DOM elems representing game icons
	rock: document.querySelector(".rock"),
	scissors: document.querySelector(".scissors"),
	paper: document.querySelector(".paper"),

	game: {
		//entities
		ROCK: "ROCK",
		SCISSORS: "SCISSORS",
		PAPER: "PAPER",
		// stores the player choice
		PLAYER: "PLAYER",
		playerChoice: null,
		// stores the house choice
		HOUSE: "HOUSE",
		houseChoice: null,
		// stores the score
		score: 0,
	},

	// Method fired on dom load
	init() {
		this.addListeners();
		this.newGame();
	},

	// adds listeners to some dom elems to get the game going
	addListeners() {
		this.backdrop.addEventListener("click", this.hideModal.bind(this));
		this.rulesBtnElem.addEventListener("click", this.showModal.bind(this));
		this.closeModalBtnElem.addEventListener("click", this.hideModal.bind(this));
	},

	// shows a modal to display the rules
	showModal(e) {
		this.rulesModal.classList.add("show--modal");
		this.backdrop.classList.add("show");
	},

	// hides the modal
	hideModal(e) {
		this.rulesModal.classList.remove("show--modal");
		this.backdrop.classList.remove("show");
	},

	// method triggered when the player clicks on an entity
	playHandler(e) {
		// gets the player and house choices
		const playerChoice = this.playerChoice(e);
		const houseChoice = this.houseChoice();
		// compares to check the winner
		const winner = this.compare(playerChoice, houseChoice);
		// displays the result
		this.showResults(winner, playerChoice, houseChoice);
	},

	// checks who is the winner
	compare(player, house) {
		let winner;
		switch (true) {
			case player === this.game.PAPER && house === this.game.SCISSORS:
			case player === this.game.ROCK && house === this.game.PAPER:
			case player === this.game.SCISSORS && house === this.game.ROCK:
				winner = this.game.HOUSE;
				this.updateScore(false);
				break;
			case player === this.game.PAPER && house === this.game.ROCK:
			case player === this.game.ROCK && house === this.game.SCISSORS:
			case player === this.game.SCISSORS && house === this.game.PAPER:
				winner = this.game.PLAYER;
				this.updateScore(true);
				break;
			default:
				winner = null;
				break;
		}

		return winner;
	},

	updateScore(result) {
		if (result) {
			this.game.score++;
		} else if (!result) {
			if (this.game.score > 0) {
				this.game.score--;
			}
		}
	},

	updateUIScore() {
		this.scoreElem.textContent = this.game.score;
	},

	// stores the player choice in the property game.playerChoice
	playerChoice(e) {
		return (this.game.playerChoice = e.target.getAttribute("choice"));
	},

	// stores the house choice in the property game.houseChoice
	houseChoice() {
		const number = Math.floor(Math.random() * 9 + 1);
		if (number <= 3) {
			return (this.game.houseChoice = this.game.PAPER);
		} else if (number <= 6) {
			return (this.game.houseChoice = this.game.SCISSORS);
		} else if (number <= 9) {
			return (this.game.houseChoice = this.game.ROCK);
		}
	},
	// creates a new game
	newGame() {
		// empties the board
		this.board.textContent = "";
		// creates the triangle background image
		const bgImage = this.createElement("img", { className: "main__bg-image" }, [
			{ name: "src", value: "public/images/bg-triangle.svg" },
		]);
		// creates the entities
		const paper = this.createEntity(this.game.PAPER.toLowerCase());
		this.addClickListener(paper, this.playHandler.bind(this));

		const scissors = this.createEntity(this.game.SCISSORS.toLowerCase());
		this.addClickListener(scissors, this.playHandler.bind(this));

		const rock = this.createEntity(this.game.ROCK.toLowerCase());
		this.addClickListener(rock, this.playHandler.bind(this));

		// appends everything to the board
		this.board.append(bgImage, paper, scissors, rock);
	},

	// displays the result on the screen
	showResults(winner, playerChoice, houseChoice) {
		this.board.textContent = "";

		const playerChoiceElem = this.createResultElement({
			name: this.game.PLAYER,
			isWinner: winner !== this.game.PLAYER ? false : true,
			value: playerChoice,
		});

		const winnerElem = this.createResultElement({
			name: "RESULT",
			value: winner,
		});

		const houseChoiceElem = this.createResultElement({
			name: this.game.HOUSE,
			isWinner: winner !== this.game.HOUSE ? false : true,
			value: houseChoice,
		});

		const result = this.createElement("div", { className: "result" });

		result.append(playerChoiceElem, winnerElem, houseChoiceElem);

		const elemsToShow = [
			houseChoiceElem.querySelector(".main__entity"),
			winnerElem,
		];

		for (let i = 0; i < elemsToShow.length; i++) {
			setTimeout(() => {
				elemsToShow[i].classList.add("show");
			}, 1000 * i + 1000);
			if (i === elemsToShow.length - 1) {
				setTimeout(() => {
					this.updateUIScore();
				}, 1000 * i + 1000);
			}
		}
		this.board.append(result);
	},

	/**
	 *
	 * @param {String} name is the name of the HTML element
	 * @param {Object} config is an object wich contains the attributes for the element such as id, className, placeholder...
	 * @param {[{name:string, value:string}]} attributes is an array of objects to set custom attributes or attributes we can't set with the dot notation
	 *
	 */
	createElement(name, config, attributes) {
		const element = document.createElement(name);
		let optionElem;
		if (name === "select") {
			optionElem = document.createElement("option");
		}

		for (const prop in config) {
			if (name === "select" && prop === "textContent") {
				optionElem[prop] = config[prop];
				continue;
			}
			prop ? (element[prop] = config[prop]) : "";
		}

		name === "select" ? element.appendChild(optionElem) : "";

		if (attributes) {
			for (const attribute of attributes) {
				element.setAttribute(attribute.name, attribute.value);
			}
		}

		return element;
	},

	/**
	 * @param {String} name is the name of the entity e.g. paper, rock, scissors
	 */
	createEntity(name) {
		const container = this.createElement(
			"div",
			{ className: `main__entity ${name}` },
			[
				{
					name: "choice",
					value: name.toUpperCase(),
				},
			],
		);
		const image = this.createElement("img", {}, [
			{
				name: "src",
				value: `public/images/icon-${name}.svg`,
			},
		]);
		container.appendChild(image);
		return container;
	},

	addClickListener(element, listener) {
		element.addEventListener("click", listener);
		return element;
	},

	/**
	 * @param {{name: string, isWinner: boolean, value: string}} name is the player name or "result"
	 * 																												   isWinner is a boolean to know if winner
	 * 																													 value is the value of the result
	 */
	createResultElement(resultObject) {
		const { name, isWinner, value } = resultObject;
		let container, text, resultText;
		switch (name) {
			case this.game.PLAYER:
				container = this.createElement("div", {
					className: "result--player",
				});
				text = this.createElement("p", { textContent: "You picked" });
				const player = this.createEntity(value.toLowerCase());
				container.append(text, player);
				return container;
			case this.game.HOUSE:
				container = this.createElement("div", {
					className: "result--house",
				});
				text = this.createElement("p", { textContent: "The house picked" });
				const house = this.createEntity(value.toLowerCase());
				container.append(text, house);
				return container;
			case "RESULT":
				container = this.createElement("div", {
					className: "result--text__container",
				});

				const replayBtn = this.createElement("button", {
					type: "button",
					textContent: "Play again",
					className: "replay--btn",
				});

				replayBtn.addEventListener("click", this.newGame.bind(this));

				resultText = this.createElement("p", {
					textContent: value === this.game.PLAYER ? "You win" : "You lose",
					className: "result--text",
				});

				if (!value) {
					resultText = this.createElement("p", {
						textContent: "DRAW",
						className: "result--text",
					});
				}

				container.append(resultText, replayBtn);
				return container;
			default:
				console.error("An error occured somewhere...");
				return;
		}
	},
};

app.init();
