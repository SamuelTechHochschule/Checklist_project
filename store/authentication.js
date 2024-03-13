import { defineStore } from "pinia";
import { useToast } from "vue-toastification"; 

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userToken: localStorage.getItem('userToken') || '',
        username: localStorage.getItem('username') || '',
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        displayUsername: localStorage.getItem('displayUsername') || '',
        adminImpersonatingCounter: 0,
    }),

    actions: {
        loginUser(token, username, isAdmin) {
            this.isLoggedIn = true;
            this.userToken = token;
            this.username = username;
            this.isAdmin = isAdmin;

            const usernameWithoutDomain = username.split('@')[0];
            this.displayUsername = this.formatUsername(usernameWithoutDomain);

            // Anmeldeinformationen im lokalen Speicher speichern
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', token);
            localStorage.setItem('username', username);
            localStorage.setItem('isAdmin', this.isAdmin ? 'true' : 'false');
            localStorage.setItem('displayUsername', this.displayUsername);

            this.checkAdminStatus();
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

            const router = useRouter();
            router.push('/');
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

        async checkAdminStatus() {
            const toast = useToast();

            try {
                const response = await fetch('http://localhost:3004/api/checkadminstatus', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.userToken}`,
                    },
                });
                const data = await response.json();
                this.isAdmin = data.isAdmin;
            } catch(error) {
                console.error('Fehler beim Überprüfen des isAdmin-Status:', error);
                toast.error('Fehler beim Überprüfen des Admin-Status.');
            }
        },       
    },
});