<template>
	<div class="admin">
		Enter admin key (press enter to download)
		<input v-model="input" class="key" @keydown.enter="submit" />
		<div>
			<input v-model="withIndividual" type="checkbox" />
			with individual record
		</div>
	</div>
</template>

<script>
import XLSX from 'xlsx';
import getDate from '@/helper/getDate.js';

export default {
	data() {
		return {
			input: '',
			withIndividual: false
		};
	},
	methods: {
		submit() {
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
					XLSX.writeFile(wb, 'users.xlsx');
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
};
</script>

<style>
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
	width: 20em;
	border-radius: 5px;
}
</style>
