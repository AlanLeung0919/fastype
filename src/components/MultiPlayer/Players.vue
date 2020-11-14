<template>
	<div class="players">
		<div v-for="(player, idx) in players" :key="idx" class="track">
			<div class="info">
				<div>{{ player.name }}</div>
				<div>{{ player.wpm }} wpm</div>
			</div>
			<div class="progress">
				<div
					class="indicator"
					:class="{ self: idx === 0 }"
					:style="`left: ${player.progress}%`"
				></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		players: Array
	}
};
</script>

<style scoped>
.players {
	gap: 1em;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.track {
	border-bottom: 1px dashed var(--main-color);
}

.info {
	display: flex;
	justify-content: space-between;
	padding: 0.25em;
}

.progress {
	position: relative;
	height: 0.5em;
}

.indicator {
	width: 1em;
	height: 1em;
	transition: 0.1s;
	border-radius: 50%;
	position: absolute;
	background-color: var(--sub-color);
}

.self {
	background-color: var(--main-color);
}
</style>
