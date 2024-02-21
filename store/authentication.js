import { defineStore } from "pinia";
import { useToast } from "vue-toastification"; 

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userToken: localStorage.getItem('userToken') || '',
        username: localStorage.getItem('username') || '',
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        displayUsername: localStorage.getItem('displayUsername') || '',
        isAdminStatusCheckRunning: false,
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

            this.startAdminStatusCheck();
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

            this.stopAdminStatusCheck();
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
            console.log("Wird ausgeführt");
            try {
                const response = await fetch('http://localhost:3001/api/checkadminstatus', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.userToken}`,
                    },
                });
                const data = await response.json();

                if (this.isAdmin !== data.isAdmin) {
                    // Admin-Status stimmt nicht überein, Benutzer ausloggen
                    toast.warning('Ändern Sie nicht die Berechtigung ohne eines Administrators!')
                    this.logoutUser();
                }
            } catch(error) {
                console.error('Fehler beim Überprüfen des isAdmin-Status:', error);
            }
        },

        startAdminStatusCheck() {
            if (!this.isAdminStatusCheckRunning) {
                // Überprüfung nur starten, wenn sie nicht bereits läuft
                this.isAdminStatusCheckRunning = true;
                this.intervalId = setInterval(() => this.checkAdminStatus(), 5000);
            }
        },
        
        stopAdminStatusCheck() {
            // Nur stoppen, wenn die Überprüfung läuft
            if (this.isAdminStatusCheckRunning) {
                clearInterval(this.intervalId);
                this.isAdminStatusCheckRunning = false;
            }
        }
        
    },
});