import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userToken: localStorage.getItem('userToken') || '',
        username: localStorage.getItem('username') || '',
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        displayUsername: localStorage.getItem('displayUsername') || '',
    }),

    actions: {
        loginUser(token, username) {
            this.isLoggedIn = true;
            this.userToken = token;
            this.username = username;
            this.isAdmin = this.checkAdmin(username);

            const usernameWithoutDomain = username.split('@')[0];
            this.displayUsername = this.formatUsername(usernameWithoutDomain);

            // Anmeldeinformationen im lokalen Speicher speichern
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', token);
            localStorage.setItem('username', username);
            localStorage.setItem('isAdmin', this.isAdmin ? 'true' : 'false');
            localStorage.setItem('displayUsername', this.displayUsername);
        },

        logoutUser() {
            this.isLoggedIn = false;
            this.userToken = '';
            this.username = '';
            this.displayUsername = '';
            this.isAdmin = false;

            // Anmeldeinformationen aus dem lokalen Speicher entfernen
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userToken');
            localStorage.removeItem('username');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('displayUsername');
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
        },

        checkAdmin(username) {
            const adminEmails = ['s.savasta@asc.de'];
            return adminEmails.includes(username);
        }
    },
});