import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        userToken: '',
        username: '',
        isAdmin: false,
        displayUsername: '',
    }),

    actions: {
        loginUser(token, username, isAdmin) {
            this.isLoggedIn = true;
            this.userToken = token;
            this.username = username;
            this.isAdmin = isAdmin;

            const usernameWithoutDomain = username.split('@')[0];
            this.displayUsername = this.formatUsername(usernameWithoutDomain);
        },

        logoutUser() {
            this.isLoggedIn = false;
            this.userToken = '';
            this.username = '';
            this.displayUsername = '';
        },

        formatUsername(username) {
            username = username 
                .replace(/ae/g, 'ä')
                .replace(/oe/g, 'ö')
                .replace(/ue/g, 'ü')
                .replace(/Ae/g, 'Ä')
                .replace(/Oe/g, 'Ö')
                .replace(/Ue/g, 'Ü');

            return username.toLowerCase().replace(/\b\w/g, function(char, index, str) {
                if(index > 0 && str[index - 1].match(/[äöüÄÖÜß]/)) {
                    return char.toLowerCase();
                } else {
                    return char.toUpperCase();
                }
            });
        }
    },
});