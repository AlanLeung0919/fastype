<template>
	<div class="table">
		<a v-if="rank === 0" class="rank">rank: not qualified</a>
		<a v-else class="rank" @click="scrollToRank()">rank: {{ rank }}</a>
		<table v-if="list.length > 0">
			<thead>
				<td>#</td>
				<td>name</td>
				<td>wpm</td>
				<td>acc</td>
				<td>time</td>
				<td>mode</td>
				<td>date</td>
			</thead>
			<tr
				v-for="(record, idx) in list"
				ref="rank"
				:key="idx"
				:class="{ position: rank === record.rank }"
			>
				<td>{{ record.rank }}</td>
				<td>{{ record.name }}</td>
				<td>{{ record.wpm }}</td>
				<td>{{ record.acc }}%</td>
				<td>{{ record.time }}s</td>
				<td>{{ record.mode }}</td>
				<td>{{ getDate(record.date) }}</td>
			</tr>
		</table>
		<div v-else>No record found</div>
		<div class="reminder">&ast; daily leaderboard updates at 00:00(UTC)</div>
	</div>
</template>

<script>
import getDate from '@/helper/getDate';

export default {
	props: {
		list: Array,
		rank: Number
	},
	methods: {
		getDate: getDate,
		scrollToRank() {
			this.$refs.rank[this.rank - 1].scrollIntoView({
				block: 'center',
				behavior: 'smooth'
			});
		}
	}
};
</script>

<style scoped>
.table {
	gap: 1em;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
}

.rank {
	display: block;
	cursor: pointer;
	transition: 0.1s;
	font-size: 1.25em;
	user-select: none;
	text-decoration: none;
	color: var(--sub-color);
}

.rank:hover {
	color: var(--main-color);
}

.position {
	color: var(--bg-color) !important;
	background-color: var(--main-color) !important;
}

.reminder {
	font-size: 0.75em;
}

table {
	width: 100%;
	text-align: center;
	table-layout: fixed;
	border-collapse: collapse;
}

thead {
	color: var(--sub-color);
}

td {
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 0.5em 0 0.5em 0;
}

tr td:first-child {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}

tr td:last-child {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
}

tr:nth-child(even) {
	background-color: rgba(0, 0, 0, 0.1);
}

thead td:nth-child(1),
tr td:nth-child(1) {
	width: 10%;
}

thead td:nth-child(2),
tr td:nth-child(2) {
	width: 30%;
}

thead td:nth-child(3),
tr td:nth-child(3) {
	width: 10%;
}

thead td:nth-child(4),
tr td:nth-child(4) {
	width: 10%;
}

thead td:nth-child(5),
tr td:nth-child(5) {
	width: 10%;
}

thead td:nth-child(6),
tr td:nth-child(6) {
	width: 10%;
}

thead td:nth-child(7),
tr td:nth-child(7) {
	width: 20%;
}
</style>
