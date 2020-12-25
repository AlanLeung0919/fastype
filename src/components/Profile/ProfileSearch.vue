<template>
	<div class="search-wrapper">
		<div class="search">
			<input
				v-model="input"
				autocomplete="off"
				@keydown.enter="search()"
				placeholder="search other players by email or name"
			/>
			<div class="icon" @click="search()">
				<font-awesome-icon icon="search" />
			</div>
		</div>
		<div v-if="showStat" class="stat-wrapper">
			<div class="info">
				<BaseStat title="name" :val="name" />
				<BaseStat title="level" :val="stat.level" />
				<img :src="getBadge(stat.level)" class="badge" />
			</div>
			<div class="stat">
				<BaseStat title="avg wpm (last 10)" :val="stat.lastTenAvgWpm" />
				<BaseStat title="avg wpm" :val="stat.avgWpm" />
				<BaseStat title="avg acc" :val="stat.avgAcc">%</BaseStat>
				<BaseStat title="best wpm" :val="stat.bestWpm.wpm" />
				<BaseStat title="total race" :val="stat.totalRace" />
				<BaseStat title="total time" :val="stat.totalTime">m</BaseStat>
			</div>
			<font-awesome-icon
				size="lg"
				icon="times"
				class="btn-close"
				@click="showStat = false"
			></font-awesome-icon>
		</div>
	</div>
</template>

<script>
import BaseStat from '@/components/Base/BaseStat';

export default {
	components: {
		BaseStat
	},
	data() {
		return {
			input: '',
			name: '',
			stat: {},
			showStat: false
		};
	},
	methods: {
		search() {
			if (this.input === '') return;
			if (this.input.includes('@')) {
				this.$http.get(`record?email=${this.input.trim()}`).then((res) => {
					if (res.data.error)
						return this.$store.commit('setAlert', 'player not found');
					this.name = res.data.name;
					this.stat = res.data.stat;
					this.showStat = true;
				});
			} else {
				this.$http.get(`record?name=${this.input.trim()}`).then((res) => {
					if (res.data.error)
						return this.$store.commit('setAlert', 'player not found');
					this.name = res.data.name;
					this.stat = res.data.stat;
					this.showStat = true;
				});
			}
		},
		getBadge(level) {
			if (level > 0 && level < 13)
				return require(`@/assets/badges/${level}.svg`);
		}
	}
};
</script>

<style scoped>
.search-wrapper {
	width: 90%;
	display: flex;
	align-self: center;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 1em;
}

.search {
	width: 100%;
	height: 2em;
	display: flex;
	border-radius: 5px;
	align-items: center;
	justify-content: space-between;
	background-color: rgba(0, 0, 0, 0.1);
}

.stat-wrapper {
	background-color: var(--bg-color);
	padding: 2.5em;
	width: 100%;
	border-radius: 5px;
	color: var(--main-color);
	box-sizing: border-box;
	box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-wrap: wrap;
	gap: 2.5em;
	position: relative;
}

.info {
	display: flex;
	gap: 2.5em;
	flex-wrap: wrap;
}

.stat {
	display: flex;
	flex-wrap: wrap;
	gap: 2em;
}

.badge {
	width: 4em;
}

.btn-close {
	position: absolute;
	right: 0.5em;
	top: 0.5em;
	cursor: pointer;
	width: 1em;
	height: 1em;
	transition: 0.1s;
	color: var(--sub-color);
}

.btn-close:hover {
	color: var(--main-color);
}

.icon {
	height: 2em;
	display: flex;
	min-width: 2em;
	cursor: pointer;
	border-radius: 5px;
	align-items: center;
	justify-content: center;
	transition: 0.1s;
	color: var(--bg-color);
	background-color: var(--sub-color);
}

.icon:hover {
	background-color: var(--main-color);
}

input {
	width: 100%;
	border: none;
	outline: none;
	padding: 0.75em;
	color: var(--main-color);
	background-color: transparent;
}
</style>
