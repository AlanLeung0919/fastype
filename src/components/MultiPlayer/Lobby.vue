<template>
	<div class="lobby">
		<div class="player-size">
			<div class="blinking-dot"></div>
			{{ playerSize }} players online
		</div>
		<div class="section-wrapper">
			<div class="icon">
				<font-awesome-icon icon="network-wired" size="3x" />
			</div>
			<div class="btn btn-lg" @click="connect('public')">join public room</div>
		</div>
		<div class="section-wrapper">
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
					ref="inputId"
					class="input"
					v-model="roomId"
					placeholder="room id"
				/>
				<div class="btn-wrapper">
					<div class="btn btn-sml" @click="connect('private')">submit</div>
					<div
						class="btn btn-sml"
						@click="
							roomId = '';
							input = false;
						"
					>
						cancel
					</div>
				</div>
			</div>
		</div>
		<div class="section-wrapper">
			<div class="icon">
				<font-awesome-icon icon="door-closed" size="3x" />
			</div>
			<div class="btn btn-lg" @click="connect('create')">
				create private room
			</div>
		</div>
		<div class="banner">
			Race is still in development, records made here wouldn't be saved.
		</div>
	</div>
</template>

<script>
export default {
	props: {
		playerSize: Number
	},
	data() {
		return {
			roomId: '',
			input: false
		};
	},
	methods: {
		connect(val) {
			if (val === 'private') {
				if (this.roomId === '')
					return this.$store.commit('setAlert', 'invalid room id');
				this.$emit('connect', { type: 'private', roomId: this.roomId });
			} else this.$emit('connect', { type: val });
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
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
}

.player-size {
	margin-bottom: 4em;
	display: flex;
	align-items: center;
	justify-content: center;
}

.blinking-dot {
	width: 1em;
	height: 1em;
	margin-right: 1em;
	border-radius: 50%;
	position: relative;
	background-color: #4caf50;
}

.blinking-dot:after {
	top: 0;
	left: 0;
	width: 1em;
	height: 1em;
	content: '';
	position: absolute;
	border-radius: 50%;
	background-color: #81c784;
	animation: ripple 2.5s infinite;
}

@keyframes ripple {
	0% {
		width: 0;
		height: 0;
		opcity: 75;
		top: 0.5em;
		left: 0.5em;
	}
	100% {
		opacity: 0;
		width: 2em;
		height: 2em;
		top: -0.5em;
		left: -0.5em;
	}
}

.section-wrapper {
	gap: 2.5em;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 4em;
}

.icon {
	width: 5em;
	height: 5em;
	display: flex;
	align-items: center;
	justify-content: center;
}

.input-box {
	gap: 1em;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
}

.input {
	border: none;
	outline: none;
	padding: 0.5em;
	border-radius: 5px;
	color: var(--main-color);
	width: 12.5em;
	background-color: rgba(0, 0, 0, 0.1);
}

.btn-wrapper {
	gap: 1em;
	display: flex;
}

.btn {
	display: flex;
	cursor: pointer;
	transition: 0.1s;
	user-select: none;
	border-radius: 5px;
	white-space: nowrap;
	align-items: center;
	color: var(--bg-color);
	justify-content: center;
	background-color: var(--sub-color);
}

.btn-sml {
	padding: 0.25em 0.75em 0.25em 0.75em;
}

.btn-lg {
	padding: 0.5em 1.5em 0.5em 1.5em;
}

.btn:hover {
	background-color: var(--main-color);
}

.banner {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 2.5em;
	color: rgba(0, 0, 0, 0.7);
	background-color: hsl(48, 100%, 67%);
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
