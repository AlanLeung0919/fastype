<template>
	<div class="game">
		<Players :players="this.players" />
		<div class="text-wrapper" ref="textWrapper" @click="$refs.input.focus()">
			<div class="overlay" v-if="!started">
				<div v-if="waiting">
					waiting for players
					<font-awesome-icon class="fa-spin" icon="circle-notch" />
				</div>
				<div v-if="countdown">starting in {{ countdownTime }}s</div>
			</div>
			<div class="text">
				<div
					v-for="(word, i) in text"
					ref="word"
					class="word"
					:key="'word' + i"
				>
					<span
						v-for="(char, j) in word"
						:key="'char' + j"
						:class="{
							correct: correct[i][j],
							incorrect: incorrect[i][j]
						}"
						>{{ char }}</span
					>
					<span
						v-for="(ovchar, k) in overflow[i]"
						class="overflow"
						:key="'ovchar' + k"
						>{{ ovchar }}</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Players from './Players';

export default {
	components: {
		Players
	},
	props: {
		players: Array,
		propRawText: Array,
		waiting: Boolean,
		countdown: Boolean,
		startTime: Number
	},
	data() {
		return {
			rawText: this.propRawText,
			started: false,
			countdownTime: 10,
			text: [],
			correct: [],
			incorrect: [],
			overflow: []
		};
	},
	methods: {
		initText() {
			//this.text = this.rawText.slice(0, 75);
			this.text = this.rawText;
			this.textLen = this.rawText.length;
			for (let i = 0; i < this.text.length; i++) {
				this.correct[i] = [];
				this.incorrect[i] = [];
				for (let j = 0; j < this.text[i].length; j++) {
					this.correct[i][j] = false;
					this.incorrect[i][j] = false;
				}
			}
			//this.rawText = this.rawText.slice(lazyloadLen);
			setTimeout(() => {
				const word = this.$refs.word;
				//if (word.length === 0) return;
				const style = getComputedStyle(word[0]);
				const height =
					(word[0].clientHeight +
						parseInt(style.marginTop) +
						parseInt(style.marginBottom)) *
					3;
				this.$refs.textWrapper.style.height = height + 'px';
				//this.updateCaret();
				setTimeout(() => {
					//TODO:this.$refs.input.focus();
					//this.blink = true;
				}, 100);
			}, 0);
		}
	},
	mounted() {
		this.initText();
	},
	watch: {
		countdown(val) {
			if (val)
				this.interval = setInterval(() => {
					this.countdownTime = Math.round((this.startTime - Date.now()) / 1000);
					if (this.countdownTime === 0) {
						clearInterval(this.interval);
						this.started = true;
						this.$emit('start')
					}
				}, 1000);
		}
	}
};
</script>

<style scoped>
.game {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 1fr auto 1fr;
}

.correct {
	color: var(--main-color);
}

.incorrect {
	color: #e10000;
	border-bottom: 2.5px solid #e10000;
}

.overflow {
	white-space: pre;
	color: #960000;
	border-bottom: 2.5px solid #960000;
}

.overlay {
	width: 100%;
	height: 100%;
	z-index: 999;
	background-color: rgba(0, 0, 0, 0.75);
	position: absolute;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
}

.text-wrapper {
	cursor: default;
	/* overflow: hidden; */
	user-select: none;
	color: var(--sub-color);
	position: relative;
}

.text {
	display: flex;
	flex-wrap: wrap;
	font-size: 1.1em;
}

.word {
	margin: 0.25em;
}
</style>
