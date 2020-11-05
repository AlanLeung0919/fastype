<template>
	<div class="multiplayer">
		<Lobby v-if="!inRoom" @connect="connect" />
		<Game v-else :propRawText="rawText" />
	</div>
</template>

<script>
import io from 'socket.io-client';
import Lobby from './Lobby.vue';
import Game from './Game.vue';

export default {
	components: {
		Lobby,
		Game
	},
	data() {
		return {
			inRoom: false,
			rawText: []
		};
	},
	methods: {
		connect(obj) {
			if (obj.type === 'private') {
				this.socket.emit('joinPrivate', { roomId: obj.roomId });
			} else if (obj.type === 'public') {
				this.socket.emit('joinPublic');
			} else {
				this.socket.emit('createRoom');
			}
		},
		getToken() {
			const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
			const token = googleUser.getAuthResponse().id_token;
			return token;
		},
		initSocket() {
			const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
			const token = googleUser.getAuthResponse().id_token;
			this.socket = io(process.env.VUE_APP_BASEURL, {
				query: { token: token }
			});
		}
	},
	created() {
		this.initSocket();
		this.socket.on('error', (err) => {
			this.$store.commit('setAlert', err);
			this.$router.push('/');
		});
		this.socket.on('joinRoom', (text) => {
			this.inRoom = true;
			this.rawText = text;
		});
	},
	beforeDestroy() {
		this.socket.disconnect();
	}
};
</script>

<style scoped>
.multiplayer {
	width: 75%;
	height: 100%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
