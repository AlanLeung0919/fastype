<template>
	<div class="nav">
		<div class="logo">
			<router-link
				class="logo-link"
				tabindex="1"
				@click.native="$event.target.blur()"
				to="/"
			>
				<font-awesome-icon class="logo-icon" icon="keyboard" />
			</router-link>
		</div>
		<div v-if="this.$store.state.authState" class="info">
			<img :src="this.$store.state.imageUrl" class="avatar" />
			<div class="name">{{ this.$store.state.username }}</div>
		</div>
		<div class="menu">
			<router-link
				class="link"
				tabindex="1"
				@click.native="$event.target.blur()"
				to="/race"
			>
				<font-awesome-icon class="icon" icon="flag-checkered" />
			</router-link>
			<router-link
				class="link"
				tabindex="1"
				@click.native="$event.target.blur()"
				to="/leaderboard"
			>
				<font-awesome-icon class="icon" icon="crown" />
			</router-link>
			<router-link
				class="link"
				tabindex="1"
				@click.native="$event.target.blur()"
				to="/profile"
			>
				<font-awesome-icon class="icon" icon="user" />
			</router-link>
			<router-link
				class="link"
				tabindex="1"
				@click.native="$event.target.blur()"
				to="/setting"
			>
				<font-awesome-icon class="icon" icon="cog" />
			</router-link>
			<div
				v-show="this.$store.state.authState"
				class="link"
				tabindex="1"
				@click="
					$event.target.blur();
					signOut();
				"
			>
				<font-awesome-icon class="icon" icon="sign-out-alt" />
			</div>
			<div
				v-show="!this.$store.state.authState"
				ref="signIn"
				class="link"
				tabindex="1"
				@click="$event.target.blur()"
			>
				<font-awesome-icon class="icon" icon="sign-in-alt" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		onSuccess() {
			this.$store.dispatch('checkAuth');
		},
		signOut() {
			const googleAuth = gapi.auth2.getAuthInstance();
			googleAuth.signOut();
			this.$store.commit('setAlert', 'Signed out');
			if (this.$route.path !== '/') this.$router.push('/');
		},
		signInState(state) {
			if (!state) this.$store.commit('signOut');
		}
	},
	mounted() {
		gapi.load('auth2', () => {
			gapi.auth2
				.init({
					client_id: process.env.VUE_APP_CLIENTID,
					ux_mode: 'redirect',
					prompt: 'select_account'
				})
				.then((googleAuth) => {
					const e = this.$refs.signIn;
					googleAuth.isSignedIn.listen(this.signInState);
					googleAuth.attachClickHandler(e, {
						onsuccess: this.onSuccess()
					});
				});
		});
	}
};
</script>

<style scoped>
.nav {
	display: grid;
	grid-template-columns: auto 1fr auto;
	margin: 1em;
	gap: 1em;
	height: 4em;
	align-items: center;
}

.logo-icon {
	pointer-events: none;
	font-size: 3.5em;
}

.icon {
	pointer-events: none;
	height: 100%;
	font-size: 1.5em;
}

.info {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.75em;
	margin-left: auto;
	color: var(--sub-color);
	cursor: default;
}

.avatar {
	border-radius: 100%;
	height: 2em;
	width: 2em;
}

.name {
	white-space: nowrap;
}

.menu {
	display: grid;
	grid-column-start: 3;
	grid-auto-flow: column;
	justify-items: center;
	align-items: center;
	text-align: center;
	gap: 0.5em;
}

.logo-link {
	display: inline-block;
	border-radius: 5px;
	padding-left: 7.5px;
	padding-right: 7.5px;
	color: var(--sub-color);
	transition: 0.1s;
}

.link {
	display: inline-block;
	border-radius: 5px;
	height: 3em;
	width: 3em;
	color: var(--sub-color);
	transition: 0.1s;
	cursor: pointer;
}

.link:hover,
.logo-link:hover,
.name:hover {
	color: var(--main-color);
}

.link:focus,
.logo-link:focus {
	color: var(--main-color);
	background-color: var(--sub-color);
	outline: none;
}

@media (max-width: 750px) {
	.menu {
		grid-column-start: 1;
		grid-column-end: 3;
	}
	.avatar {
		width: 1em;
		height: 1em;
	}
	.name {
		font-size: 0.75em;
	}
	.logo-icon {
		font-size: 2em;
	}
	.icon {
		font-size: 1em;
	}
	.link {
		width: 2em;
		height: 2em;
	}
}
</style>
