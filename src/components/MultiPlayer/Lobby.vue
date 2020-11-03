<template>
	<div class="lobby">
		<div class="wrapper">
			<font-awesome-icon icon="network-wired" size="3x" />
			<div class="btn btn-lg" @click="connect('random')">join public room</div>
		</div>
		<div class="wrapper">
			<font-awesome-icon icon="key" size="3x" />
			<div v-if="!input" class="btn btn-lg" @click="input = true">
				join private room
			</div>
			<div v-else class="input-box">
				<input v-model="roomId" class="input" />
				<div class="btn-wrapper">
					<div class="btn btn-sml" @click="connect('private')">submit</div>
					<div class="btn btn-sml" @click="input = false">cancel</div>
				</div>
			</div>
		</div>
		<div class="wrapper">
			<font-awesome-icon icon="door-closed" size="3x" />
			<div class="btn btn-lg" @click="connect('create')">
				create private room
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			input: false,
			roomId: ''
		};
	},
	methods: {
		connect(val) {
			if (val === 'private') this.$emit('connect', this.roomId);
			else this.$emit('connect', val);
		}
	}
};
</script>

<style scoped>
.lobby {
	width: 75%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 2.5em;
}

.wrapper {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2.5em 0 2.5em 0;
	gap: 2.5em;
}

.input-box {
	display: flex;
	flex-direction: column;
	gap: 1em;
	align-items: center;
	justify-content: center;
}

.input {
  border: none;
  outline: none;
  padding: .5em;
}

.btn-wrapper {
	display: flex;
	gap: 1em;
}

.btn-sml {
	padding: 0.25em 0.75em 0.25em 0.75em;
}

.btn-lg {
	padding: 0.5em 1.5em 0.5em 1.5em;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--bg-color);
	background-color: var(--sub-color);
	cursor: pointer;
	border-radius: 5px;
	transition: 0.1s;
	white-space: nowrap;
}

.btn:hover {
	background-color: var(--main-color);
}
</style>
