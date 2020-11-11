<template>
	<div class="profile-table">
		<table v-if="record.length > 0">
			<thead>
				<td
					v-for="item in ['id', 'wpm', 'acc', 'time', 'mode', 'date']"
					:key="item"
					:class="{ sort: currentSort === item }"
					@click="sort(item)"
				>
					{{ item }}
				</td>
			</thead>
			<tr v-for="(item, idx) in record" :key="idx">
				<td>{{ item.id }}</td>
				<td>{{ item.wpm }}</td>
				<td>{{ item.acc }}%</td>
				<td>{{ item.time }}s</td>
				<td>{{ item.mode }}</td>
				<td>{{ getDate(item.date) }}</td>
			</tr>
		</table>
		<div v-else>No record found</div>
		<div v-if="avaliable" class="load" @click="$emit('load')">load more</div>
		<div v-if="avaliable" class="load" @click="$emit('load', true)">
			load all
		</div>
	</div>
</template>

<script>
import getDate from '@/helper/getDate';

export default {
	props: {
		record: Array,
		avaliable: Boolean
	},
	data() {
		return {
			currentSort: 'id',
			currentSortDir: 1
		};
	},
	methods: {
		getDate: getDate,
		sort(val) {
			if (this.currentSort === val)
				this.currentSortDir = this.currentSortDir === 1 ? -1 : 1;
			this.currentSort = val;
			this.record.sort((a, b) => {
				if (a[this.currentSort] > b[this.currentSort])
					return this.currentSortDir * -1;
				if (a[this.currentSort] < b[this.currentSort])
					return this.currentSortDir * 1;
				return 0;
			});
		}
	}
};
</script>

<style scoped>
.profile-table {
	text-align: center;
}

.sort {
	color: var(--main-color);
}

.load {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	user-select: none;
	transition: 0.1s;
	margin-bottom: 0.75em;
	color: var(--bg-color);
	background-color: var(--sub-color);
}

.load:hover {
	background-color: var(--main-color);
}

table {
	width: 100%;
	text-align: center;
	table-layout: fixed;
	border-collapse: collapse;
}

thead td {
	cursor: pointer;
	user-select: none;
	color: var(--sub-color);
}

thead td:hover {
	color: var(--main-color);
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

thead td:nth-child(-n + 5),
tr td:nth-child(-n + 5) {
	width: 15%;
}

thead td:nth-child(7),
tr td:nth-child(7) {
	width: 25%;
}
</style>
