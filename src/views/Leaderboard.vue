<template>
<div>

	<div class="leaderboard" v-if="!loading">
		<BaseScrollToTop />
		<LeaderboardSwitch :table="table" @update="updateTable" />
		<LeaderboardTable
			v-if="table === 'bestWpm'"
			:list="bestWpm.list"
			:rank="bestWpm.rank"
			:table="table"
		/>
		<LeaderboardTable
			v-if="table === 'bestDailyWpm'"
			:list="bestDailyWpm.list"
			:rank="bestDailyWpm.rank"
			:table="table"
		/>
	</div>
	<div v-else class="loading">
			<font-awesome-icon class="fa-spin" icon="circle-notch" size="2x" />
		</div>
</div>
</template>

<script>
import BaseScrollToTop from '@/components/Base/BaseScrollTop';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import LeaderboardSwitch from '@/components/Leaderboard/LeaderboardSwitch';

export default {
	components: {
		BaseScrollToTop,
		LeaderboardTable,
		LeaderboardSwitch
	},
	data() {
		return {
			bestWpm: {
				list: [],
				rank: null
			},
			bestDailyWpm: {
				list: [],
				rank: null
			},
			table: 'bestWpm',
			loading: true
		};
	},
	methods: {
		updateTable(val) {
			this.table = val;
		}
	},
	created() {
		this.$http
			.get('leaderboard')
			.then((res) => {
				this.bestWpm = res.data.bestWpm;
				this.bestDailyWpm = res.data.bestDailyWpm;
				this.loading = false;
			})
			.catch((err) => {
				console.log(err);
			});
	}
};
</script>

<style scoped>
.leaderboard {
	gap: 2em;
	width: 80%;
	display: flex;
	flex-flow: column;
	align-items: center;
	margin: 1.5em auto 1.5em auto;
}

.loading {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
