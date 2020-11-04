<template>
	<div class="table">
		<a v-if="rank === 0" class="rank">rank: not qualified</a>
		<a v-else class="rank" @click="scrollToRank()">rank: {{ rank }}</a>
		<table v-if="list.length > 0">
			<thead>
				<td>#</td>
				<td>name</td>
				<td>wpm</td>
				<td>mode</td>
				<td>date</td>
			</thead>
			<tr
				v-for="(record, idx) in list"
				:key="idx"
				:class="{ position: rank === record.rank }"
				ref="rank"
			>
				<td>{{ record.rank }}</td>
				<td>{{ record.name }}</td>
				<td>{{ record.wpm }}</td>
				<td>{{ record.mode }}</td>
				<td>{{ getDate(record.date) }}</td>
			</tr>
		</table>
		<div v-else>No record found</div>
	</div>
</template>

<script>
import getDate from '@/helper/getDate.js';

export default {
	props: {
		list: Array,
		rank: Number
	},
	methods: {
		getDate: getDate,
		scrollToRank() {
			this.$refs.rank[this.rank - 1].scrollIntoView({ block: 'center' });
		}
	}
};
</script>

<style scoped>
.table {
	gap: 1em;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.rank {
	display: block;
	cursor: pointer;
	font-size: 1.25em;
	user-select: none;
	text-decoration: none;
	transition: 0.1s;
	color: var(--sub-color);
}

.position {
	background-color: var(--main-color) !important;
	color: var(--bg-color) !important;
}

.rank:hover {
	color: var(--main-color);
}

table {
	width: 100%;
	text-align: center;
	table-layout: fixed;
	border-collapse: collapse;
	white-space: nowrap;
}

thead {
	color: var(--sub-color);
}

td {
	padding-top: 0.5em;
	padding-bottom: 0.5em;
}

td {
	overflow: hidden;
	text-overflow: ellipsis;
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
	width: 40%;
}

thead td:nth-child(3),
tr td:nth-child(3) {
	width: 15%;
}

thead td:nth-child(4),
tr td:nth-child(4) {
	width: 15%;
}

thead td:nth-child(5),
tr td:nth-child(5) {
	width: 20%;
}
</style>
