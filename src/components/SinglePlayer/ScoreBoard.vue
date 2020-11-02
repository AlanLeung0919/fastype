<template>
	<div class="scoreboard">
		<BaseChart v-if="loaded" :height="350" :chartData="chartData" />
		<div class="stat">
			<BaseStat title="wpm" :val="result.wpm" />
			<BaseStat title="acc" :val="result.acc">%</BaseStat>
			<BaseStat title="time" :val="result.time">s</BaseStat>
			<BaseStat title="mode" :val="result.mode" />
		</div>
		<div class="redo-wrapper">
			<div
				class="btn redo"
				ref="redo"
				tabindex="0"
				@click="
					$emit('reset');
					$event.target.blur();
				"
				@keydown.enter="
					$emit('reset');
					$event.target.blur();
				"
				content="restart"
				v-tippy="{ placement: 'bottom' }"
			>
				<font-awesome-icon
					icon="redo-alt"
					style="pointer-events: none"
				></font-awesome-icon>
			</div>
		</div>
	</div>
</template>

<script>
import BaseChart from '@/components/Base/BaseChart.vue';
import BaseStat from '@/components/Base/BaseStat.vue';

export default {
	components: {
		BaseChart,
		BaseStat
	},
	props: {
		result: Object
	},
	data() {
		return {
			loaded: false,
			chartData: {}
		};
	},
	methods: {
		loadChart() {
			const labels = this.result.wpmPerSec.map((e, i) => i + 1);
			this.chartData = {
				labels: labels,
				datasets: [
					{
						label: 'wpm',
						data: this.result.wpmPerSec,
						borderColor: this.$store.state.theme.mainColor,
						pointBackgroundColor: this.$store.state.theme.mainColor,
						fill: true
					},
					{
						label: 'raw wpm',
						data: this.result.rawWpmPerSec,
						borderColor: this.$store.state.theme.subColor,
						pointBackgroundColor: this.$store.state.theme.subColor,
						borderDash: [5],
						fill: false
					}
				]
			};
			this.loaded = true;
		}
	},
	mounted() {
		this.$refs.redo.focus();
		this.loadChart();
		if (!this.$store.state.authState)
			return this.$store.commit('setAlert', 'Sign in to save record');
		this.$http
			.post('record', { record: this.result })
			.then((res) => {
				if (this.result.wpm >= res.data.bestWpm)
					this.$store.commit('setAlert', 'New Best record!');
			})
			.catch((err) => {
				console.log(err);
			});
	}
};
</script>

<style scoped>
.scoreboard {
	display: flex;
	justify-content: space-evenly;
	flex-direction: column;
	background-color: var(--bg-color);
	color: var(--sub-color);
	height: 100%;
	width: 100%;
}

.stat {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-items: center;
	justify-content: space-around;
	gap: 2em;
}

.item {
	padding: 1em;
}

.title {
	font-size: 1em;
	color: var(--sub-color);
	white-space: nowrap;
}

.val {
	font-size: 2.5em;
	color: var(--main-color);
}

.btn {
	cursor: pointer;
	transition: 0.25s;
	outline: none;
	border: none;
}

.btn-sml {
	font-size: 0.9em;
}

.btn:hover {
	color: var(--main-color);
}

.btn:focus {
	color: var(--main-color);
	background-color: var(--sub-color);
}

.redo-wrapper {
	display: flex;
	font-size: 1.25em;
	align-self: center;
	justify-content: center;
}

.redo {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
	width: 2.5em;
	height: 2.5em;
}
</style>
