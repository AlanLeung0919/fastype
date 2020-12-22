<template>
	<div class="nav">
		<div class="top-wrapper">
			<div>
				<router-link
					to="/"
					class="link-logo"
					@click.native="$event.target.blur()"
				>
					<font-awesome-icon class="icon-logo" icon="keyboard" />
				</router-link>
			</div>
			<div v-if="this.$store.state.authState" class="info">
				<img :src="this.$store.state.user.imageUrl" class="avatar" />
				{{ this.$store.state.user.username }}
			</div>
		</div>
		<div class="menu">
			<router-link
				v-for="item in [
					{ path: 'race', icon: 'flag-checkered' },
					{ path: 'leaderboard', icon: 'crown' },
					{ path: 'profile', icon: 'user' },
					{ path: 'setting', icon: 'cog' },
					{ path: 'about', icon: 'info' }
				]"
				v-tippy
				class="link"
				:key="item.path"
				:content="item.path"
				:to="'/' + item.path"
				@click.native="$event.target.blur()"
			>
				<font-awesome-icon class="icon" :icon="item.icon" />
			</router-link>
			<div
				v-show="this.$store.state.authState"
				v-tippy
				class="link"
				content="sign out"
				@click="
					$event.target.blur();
					signOut();
				"
			>
				<font-awesome-icon class="icon" icon="sign-out-alt" />
			</div>
			<div
				v-show="!this.$store.state.authState"
				v-tippy
				ref="signIn"
				class="link"
				content="sign in"
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
			this.$store.commit('setAlert', 'Signed out');
			const googleAuth = gapi.auth2.getAuthInstance();
			googleAuth.signOut();
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
					ux_mode: 'redirect',
					prompt: 'select_account',
					client_id: process.env.VUE_APP_CLIENTID
				})
				.then((googleAuth) => {
					googleAuth.isSignedIn.listen(this.signInState);
					googleAuth.attachClickHandler(this.$refs.signIn, {
						onsuccess: this.onSuccess()
					});
				})
				.catch((err) => {
					this.$store.commit('setAlert', `${err.error}: ${err.details}`);
				});
		});
	}
};
</script>

<style scoped>
.nav {
	gap: 1em;
	margin: 1em;
	height: 4em;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}

.icon-logo {
	font-size: 3.5em;
	pointer-events: none;
}

.icon {
	height: 100%;
	font-size: 1.5em;
	pointer-events: none;
}

.top-wrapper {
	flex: 1;
	gap: 0.5em;
	display: flex;
	align-items: center;
	white-space: nowrap;
	justify-content: space-between;
}

.info {
	gap: 0.75em;
	display: flex;
	cursor: default;
	align-items: center;
	color: var(--sub-color);
}

.avatar {
	width: 1.75em;
	height: 1.75em;
	border-radius: 100%;
}

.menu {
	gap: 0.5em;
	display: flex;
	margin-left: auto;
	text-align: center;
}

.link-logo {
	transition: 0.1s;
	border-radius: 5px;
	padding: 0 7.5px 0 7.5px;
	display: inline-block;
	color: var(--sub-color) !important;
}

.link {
	width: 3em;
	height: 3em;
	cursor: pointer;
	transition: 0.1s;
	border-radius: 5px;
	display: inline-block;
	color: var(--sub-color);
}

.router-link-exact-active {
	color: var(--main-color);
}

.link:hover,
.link-logo:hover {
	color: var(--main-color) !important;
}

.link:focus,
.link-logo:focus {
	outline: none;
	color: var(--main-color) !important;
	background-color: var(--sub-color) !important;
}

@media (max-width: 1024px) {
	.nav {
		gap: 0.25em;
	}
	.menu {
		width: 100%;
		justify-content: space-between;
	}
	.avatar {
		width: 1.5em;
		height: 1.5em;
	}
	.icon-logo {
		font-size: 2.5em;
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
