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
				<BaseStat title="avg acc" :val="stat.avgAcc" />
				<BaseStat title="best wpm" :val="stat.bestWpm.wpm" />
				<BaseStat title="total race" :val="stat.totalRace" />
				<BaseStat title="total time" :val="stat.totalTime" />
			</div>
      <div class="btn-close" @click="showStat = false">&times;</div>
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
			if (this.input === '' || this.showStat) return;
			if (this.input.includes('@')) {
				this.$http.get(`record?email=${this.input}`).then((res) => {
					if (res.data.error)
						return this.$store.commit('setAlert', 'user not found');
					console.log(res.data);
					this.name = res.data.name;
					this.stat = res.data.stat;
					this.showStat = true;
				});
			} else {
				this.$http.get(`record?name=${this.input}`).then((res) => {
					if (res.data.error)
						return this.$store.commit('setAlert', 'user not found');
					console.log(res.data);
					this.name = res.data.name;
					this.stat = res.data.stat;
					this.showStat = true;
				});
			}
    },
    getBadge(level) {
			if (level > 0 && level < 13)
				return require(`@/assets/badges/${level}.svg`);
		},
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
	/* height: 15em; */
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
  gap: 2.5em;
  flex-wrap: wrap;
}

.badge {
  width: 4em;
}

.btn-close {
  position: absolute;
  right: 0.25em;
  top: 0.25em;
  cursor: pointer;
  font-size: 1.5em;
  width: 1em;
  height: 1em;
}

.icon {
	height: 2em;
	display: flex;
	min-width: 2em;
	cursor: pointer;
	border-radius: 5px;
	align-items: center;
	justify-content: center;
	color: var(--main-color);
	background-color: var(--sub-color);
}

.icon:hover {
	color: var(--bg-color);
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
