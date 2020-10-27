<template>
	<div class="leaderboard">
		<ScrollToTop />
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
</template>

<script>
import LeaderboardSwitch from '@/components/Leaderboard/LeaderboardSwitch.vue';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable.vue';
import ScrollToTop from '@/components/Base/BaseScrollTop.vue';

export default {
	components: {
		LeaderboardSwitch,
		LeaderboardTable,
		ScrollToTop
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
			table: 'bestWpm'
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
				//console.log(res);
				this.bestWpm = res.data.bestWpm;
				this.bestDailyWpm = res.data.bestDailyWpm;
			})
			.catch((err) => {
				console.log(err);
			});
	}
};
</script>

<style scoped>
.leaderboard {
	display: flex;
	flex-flow: column;
	width: 80%;
	margin-left: auto;
	margin-right: auto;
	gap: 2em;
	padding-top: 2.5em;
	padding-bottom: 2.5em;
	overflow-anchor: none;
	align-items: center;
	/* text-align: center; */
}
</style>
