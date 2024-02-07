import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        userToken: '',
        username: '',
        isAdmin: false,
    }),

    actions: {
        loginUser(token, username, isAdmin) {
            this.isLoggedIn = true;
            this.userToken = token;
            this.username = username;
            this.isAdmin = isAdmin;
        },

        logoutUser() {
            this.isLoggedIn = false;
            this.userToken = '';
            this.username = '';
        },
    },
});