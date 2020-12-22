<template>
	<div class="admin">
		Enter admin key
		<input v-model="input" class="key" />
		<div>
			<input v-model="withIndividual" type="checkbox" />
			with individual records
		</div>
		<div class="btn" @click="submit" v-if="!loading">download</div>
		<div v-else>loading...</div>
	</div>
</template>

<script>
import XLSX from 'xlsx';
import getDate from '@/helper/getDate.js';

export default {
	data() {
		return {
			input: '',
			loading: false,
			withIndividual: false
		};
	},
	methods: {
		submit() {
			if (this.loading) return;
			this.loading = true;
			this.$http
				.post('admin', { key: this.input })
				.then((res) => {
					this.$store.commit('setAlert', 'Downloading spreadsheet');
					const wb = XLSX.utils.book_new();
					const users = res.data.users;
					users.sort((a, b) => {
						return a.emailPrefix > b.emailPrefix ? 1 : -1;
					});
					const statArr = users.map((e) => {
						return {
							emailPrefix: e.emailPrefix,
							email: e.email,
							class: e.class,
							classNo: e.classNo,
							name: e.name,
							avgWpm: e.stat.avgWpm,
							avgAcc: e.stat.avgAcc,
							lastTenAvgWpm: e.stat.lastTenAvgWpm,
							bestWpm: e.stat.bestWpm.wpm,
							totalTrials: e.stat.totalRace,
							totalTimeUsed: e.stat.totalTime
						};
					});
					const statWs = XLSX.utils.json_to_sheet(statArr);
					XLSX.utils.book_append_sheet(wb, statWs, 'stats');
					if (this.withIndividual) {
						users.forEach((e) => {
							const recordArr = [];
							e.record.forEach((e) => {
								recordArr.push({
									date: getDate(e.date),
									wpm: e.wpm,
									acc: e.acc,
									time: e.time,
									mode: e.mode
								});
							});
							const recordWs = XLSX.utils.json_to_sheet(recordArr);
							XLSX.utils.book_append_sheet(wb, recordWs, e.emailPrefix);
						});
					}
					XLSX.writeFile(
						wb,
						`fastype-admin-${getDate(Date.now()).replace(/ |:/g, '-')}.xlsx`
					);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					this.loading = false;
				});
		}
	}
};
</script>

<style scoped>
.admin {
	width: 80%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 0.5em;
	margin: 1.5em auto 1.5em auto;
}

.key {
	outline: none;
	border: none;
	color: var(--main-color);
	background-color: rgba(0, 0, 0, 0.1);
	padding: 0.5em;
	width: 15em;
	border-radius: 5px;
	border: 1px solid var(--main-color);
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 15em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	user-select: none;
	transition: 0.1s;
	color: var(--bg-color);
	background-color: var(--sub-color);
}

.btn:hover {
	background-color: var(--main-color);
}
</style>
