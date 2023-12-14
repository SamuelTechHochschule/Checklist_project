import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        userToken: '',
    }),

    actions: {
        loginUser(token) {
            this.isLoggedIn = true;
            this.userToken = token;
        },

        logoutUser() {
            this.isLoggedIn = false;
            this.userToken = '';
        },
    },
});