<template>
	<div class="multiplayer">
		<Lobby v-if="!inRoom" @connect="connect" />
		<Game v-else :propRawText="rawText" :players="players" />
	</div>
</template>

<script>
import io from 'socket.io-client';
import Game from './Game';
import Lobby from './Lobby';

export default {
	components: {
		Game,
		Lobby
	},
	data() {
		return {
			inRoom: false,
			players: [],
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
		this.socket.on('connect_error', (err) => {
			this.$store.commit('setAlert', err);
			this.$router.push('/');
		});
		this.socket.on('joinRoom', (text) => {
			this.inRoom = true;
			this.rawText = text;
		});
		this.socket.on('playerUpdate', (players) => {
			const selfIdx = players.findIndex(
				(e) => e.email === this.$store.state.user.email
			);
			const obj = players[selfIdx];
			players.splice(selfIdx, 1);
			players.unshift(obj);
			this.players = players;
		});
	},
	beforeDestroy() {
		this.socket.disconnect();
	}
};
</script>

<style scoped>
.multiplayer {
	width: 80%;
	height: 100%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
