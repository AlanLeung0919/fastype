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
	gap: 2em;
	display: flex;
	align-items: center;
	flex-direction: column;
}

.rank {
	display: block;
	cursor: pointer;
	font-size: 1.25em;
	user-select: none;
	text-decoration: none;
	color: var(--sub-color);
}

.position {
	background-color: var(--main-color) !important;
	color: var(--bg-color) !important;
}

.rank:hover {
	color: var(--main-color);
}

.sort {
	color: var(--main-color);
}

table {
	width: 100%;
	text-align: center;
	table-layout: fixed;
	border-collapse: collapse;
	word-wrap: break-word;
}

thead {
	color: var(--sub-color);
}

td {
	padding-top: 0.1em;
	padding-bottom: 0.1em;
}

td:last-child {
	white-space: pre;
}

tr:nth-child(even) {
	background-color: rgba(0, 0, 0, 0.1);
}
</style>
