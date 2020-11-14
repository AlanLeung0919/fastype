<template>
	<div class="game">
		<Players :players="this.players" />
		<div>
			{{ rawText }}
		</div>
	</div>
</template>

<script>
import Players from './Players'

export default {
	components: {
		Players
	},
	props: {
		players: Array,
		propRawText: Array
	},
	data() {
		return {
			rawText: this.propRawText
		}
	}
};
</script>

<style scoped>
.game {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 1fr auto 1fr;
}
</style>
