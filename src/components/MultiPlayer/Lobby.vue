<template>
	<div class="lobby">
		<div class="wrapper">
			<div class="icon">
				<font-awesome-icon icon="network-wired" size="3x" />
			</div>
			<div class="btn btn-lg" @click="connect('public')">join public room</div>
		</div>
		<div class="wrapper">
			<div class="icon">
				<font-awesome-icon icon="key" size="3x" />
			</div>
			<div
				v-show="!input"
				class="btn btn-lg"
				@click="
					input = true;
					focusInput();
				"
			>
				join private room
			</div>
			<div v-show="input" class="input-box">
				<input
					v-model="roomId"
					ref="inputId"
					type="text"
					class="input"
					placeholder="room id"
				/>
				<div class="btn-wrapper">
					<div class="btn btn-sml" @click="connect('private')">submit</div>
					<div
						class="btn btn-sml"
						@click="
							input = false;
							roomId = '';
						"
					>
						cancel
					</div>
				</div>
			</div>
		</div>
		<div class="wrapper">
			<div class="icon">
				<font-awesome-icon icon="door-closed" size="3x" />
			</div>
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
			if (val === 'private') {
				if (this.roomId === '')
					return this.$store.commit('setAlert', 'invalid room id');
				this.$emit('connect', this.roomId.trim());
			} else this.$emit('connect', val);
		},
		focusInput() {
			this.$nextTick(() => {
				this.$refs.inputId.focus();
			});
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
	gap: 1em;
}

.wrapper {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2.5em 0 2.5em 0;
	gap: 2.5em;
}

.icon {
	width: 5em;
	height: 5em;
	display: flex;
	align-items: center;
	justify-content: center;
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
	padding: 0.5em;
	border-radius: 5px;
	background-color: rgba(0, 0, 0, 0.05);
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
	user-select: none;
}

.btn:hover {
	background-color: var(--main-color);
}
</style>
