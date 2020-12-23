<template>
	<div class="msg-wrapper">
		<div v-if="!showChat" class="msg-icon" @click="showChat = true">
			<font-awesome-icon icon="comment" size="sm" />
		</div>
		<transition name="slide">
			<div v-if="showChat" class="chat-wrapper">
				<div class="top-wrapper">
					<div class="channel">Current channel: {{ channel }}</div>
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
			showChat: true,
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
			this.$emit('sendMsg', this.msgInput, this.channel);
			this.msgInput = '';
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
		}
		/* msgs: {
			handler() {
				const e = this.$refs.chat;
				console.log(e.scrollTop, e.scrollHeight);
				e.scrollTop = e.scrollHeight - e.clientHeight;
			},
			deep: true
		} */
	}
};
</script>

<style scoped>
.msg-icon {
	right: 2.5em;
	bottom: 2.5em;
	width: 1.5em;
	height: 1.5em;
	display: flex;
	font-size: 2em;
	position: fixed;
	cursor: pointer;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	color: var(--sub-color);
	background-color: var(--bg-color);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.msg-icon:hover {
	color: var(--main-color);
}

.chat-wrapper {
	width: 100%;
	height: 100%;
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
}

.btn-close {
	width: 1em;
	height: 1em;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.chat {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
}

.msg {
	display: flex;
	flex-direction: column;
	padding: 0 0.5em 0 0.5em;
	/* margin-bottom: 1em; */
	padding: 0.5em;
}

.msg:hover {
	background-color: rgba(0, 0, 0, 0.1);
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
