<template>
	<div class="msg-wrapper">
		<div v-if="!showChat" class="msg-icon" @click.stop="showChat = true">
			<font-awesome-icon icon="comment" size="sm" />
		</div>
		<transition name="slide">
			<div v-if="showChat" class="chat-wrapper" v-click-outside="closeChat">
				<div class="top-wrapper">
					<div class="channel">Channel:</div>
					<div
						class="btn"
						@click="channel = 'lobby'"
						:class="{ 'btn-active': channel === 'lobby' }"
					>
						lobby
					</div>
					<div
						v-if="inRoom"
						class="btn"
						@click="channel = 'room'"
						:class="{ 'btn-active': channel === 'room' }"
					>
						room
					</div>
					<font-awesome-icon
						size="lg"
						icon="times"
						class="btn-close"
						@click="showChat = false"
					/>
				</div>
				<div class="chat" ref="chat">
					<div v-for="(msg, idx) in msgs" :key="idx" class="msg">
						<div class="msg-top">
							<div class="msg-name">
								{{ msg.name }}
							</div>
							<div class="msg-time">{{ getTime(msg.time) }}</div>
						</div>
						<div class="msg-content">{{ msg.msg }}</div>
					</div>
				</div>
				<input
					v-model="msgInput"
					placeholder="message..."
					@keydown.enter="sendMsg()"
				/>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	props: {
		inRoom: Boolean,
		roomMsg: Array,
		lobbyMsg: Array
	},
	data() {
		return {
			msgInput: '',
			showChat: false,
			channel: 'lobby'
		};
	},
	methods: {
		getTime(time) {
			const sec = Math.floor((Date.now() - time) / 1000);
			let delta = sec / (60 * 60 * 24);
			const date = new Date(time);
			return delta < 1
				? `Today at ${date
						.getHours()
						.toString()
						.padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
				: `${date.getFullYear()}/${(date.getMonth() + 1)
						.toString()
						.padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
		},
		sendMsg() {
			const msg = this.msgInput.trim();
			if (msg === '')
				return this.$store.commit('setAlert', 'please type something');
			this.$emit('sendMsg', msg, this.channel);
			this.msgInput = '';
		},
		closeChat() {
			if (this.showChat) this.showChat = false;
		}
	},
	computed: {
		msgs() {
			return this.channel === 'lobby' ? this.lobbyMsg : this.roomMsg;
		}
	},
	watch: {
		inRoom(val) {
			if (val) this.channel = 'room';
			else this.channel = 'lobby';
		},
		msgs: {
			handler() {
				if (!this.showChat) return;
				this.$nextTick(() => {
					const e = this.$refs.chat;
					e.scrollTop = e.scrollHeight;
				});
			},
			deep: true
		},
		showChat(val) {
			if (!val) return;
			this.$nextTick(() => {
				const e = this.$refs.chat;
				e.scrollTop = e.scrollHeight;
			});
		}
	}
};
</script>

<style scoped>
.msg-icon {
	width: 1.5em;
	right: 2.5em;
	height: 1.5em;
	bottom: 2.5em;
	display: flex;
	font-size: 2em;
	position: fixed;
	cursor: pointer;
	transition: 0.1s;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	color: var(--sub-color);
	background-color: var(--bg-color);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}

.msg-icon:hover {
	color: var(--main-color);
}

.btn {
	height: 1.75em;
	width: 7.5em;
	display: flex;
	cursor: pointer;
	transition: 0.1s;
	user-select: none;
	border-radius: 5px;
	margin-right: auto;
	align-items: center;
	color: var(--bg-color);
	justify-content: center;
	background-color: var(--sub-color);
}

.btn:hover {
	background-color: var(--main-color);
}

.btn-active {
	background-color: var(--main-color);
}

.chat-wrapper {
	width: 100%;
	display: flex;
	flex-direction: column;
	position: fixed;
	width: 25em;
	height: 100%;
	bottom: 0;
	right: 0;
	background-color: var(--bg-color);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	transition: 0.5s;
	z-index: 9999;
}

.top-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 1.5em;
	padding: 1em;
}

.channel {
	font-weight: bold;
	margin-right: 0.5em;
}

.btn-close {
	width: 1em;
	height: 1em;
	display: flex;
	align-items: center;
	transition: 0.1s;
	justify-content: center;
	cursor: pointer;
	color: var(--sub-color);
}

.btn-close:hover {
	color: var(--main-color);
}

.chat {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
}

.msg {
	display: flex;
	flex-direction: column;
	padding: 0.5em 1em 0.5em 1em;
}

.msg:hover {
	background-color: rgba(0, 0, 0, 0.1);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.msg-top {
	display: flex;
	align-items: center;
	margin-bottom: 0.25em;
}

.msg-name {
	color: var(--main-color);
	font-size: 0.9em;
}

.msg-time {
	color: var(--sub-color);
	margin-left: 0.5em;
	font-size: 0.75em;
	height: 100%;
	display: flex;
	align-items: flex-end;
}

.msg-content {
	word-break: break-all;
}

input {
	margin: 1em;
	padding: 0.75em;
	border: none;
	outline: none;
	border-radius: 5px;
	color: var(--main-color);
	background-color: rgba(128, 128, 128, 0.25);
}

.slide-enter-active,
.slide-leave-active {
	transition: 0.25s;
}
.slide-enter,
.slide-leave-to {
	transform: translateX(100%);
}
</style>
