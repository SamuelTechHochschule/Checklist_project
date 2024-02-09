<template>

    <LoadingModal :is-loading="isLoading" />

    <div class="navbar">
        <img src="~/assets/Logo.png" alt="Logo" class="image">
    </div>
    <div class="title">
        <p>ASC PEP-Checkliste</p>
    </div>
    <div class="login-box">
        <div class="email">
            <form @submit.prevent="loginUser">
                <label for="username">Email:</label>
                <input v-model="username" type="text" id="username" placeholder="Your Email" required>

                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" placeholder="Your password" required>

                <p v-if="loginError" class="error-message">Der Benutzername oder das Passwort ist falsch!</p>

                <button class="weiter-button" type="submit">Weiter</button>
            </form>
        </div>
    </div>
</template>

<script>
import LoadingModal from '~/components/Modals/LoadingModal.vue';
import { useAuthStore } from '~/store/authentication'
import { useToast } from 'vue-toastification';

    export default{

        components: {
            LoadingModal,
        },

        data(){
            return {
                username: '',
                password: '',
                loginToken: '',
                loginError: false,
                isLoading: false, // Variable für Loading Indicator
            };
        },

        mounted() {
            const token = localStorage.getItem('userToken');
            if(token) {
                useAuthStore().loginUser(token, this.username);
            }
        },

        methods: {
            async loginUser() { 
                const toast = useToast();
                let isAdmin = false;
                try {
                    // Daten werden geladen
                    this.isLoading = true;
                      // LDAP Authentifizierung
                      const response = await fetch('http://localhost:3001/api/authenticate', {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: this.username, password: this.password }),
                      });

                      if(response.ok) {
                        const { isAuthenticated, token } = await response.json();

                        if(isAuthenticated) {
                            this.loginToken = token;

                            useAuthStore().loginUser(this.loginToken, this.username);

                            toast.success('Login erfolgreich');
                            this.$router.push('/checklist');
                        } else {
                            this.loginError = true;
                            toast.error('Die Anmeldedaten sind inkorrekt!');
                        }
                      } else {
                        console.error('API request failed:', response.statusText);
                        toast.error('Netzwerkfehler\n Für mehr Informationen öffnen Sie die Konsole!');
                      }
                } catch (error) {
                    toast.error('Netzwerk-Fehler!\n Für mehr Informationen öffnen Sie die Konsole!')
                    console.error('Network error:', error);
                } finally {
                    // Daten werden nicht mehr geladen
                    this.isLoading = false;
                }
            },
        },
    };
 
</script>

<style scoped>

    .navbar{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: -20px;
    }

    .image{
        max-width: 100%;
        max-height: 100%;
        width: 150px;
        height: 150px;
    }

    .title{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: -30px;
        color: #00315E;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 40px;
    }

    .login-box{
        display: flex;
        justify-content: center;
        background-color: #D6D6D6;
        width: 300px;
        height: 250px;
        padding: 25px;
        margin: 40px auto;
    }

    .email{
        margin-top: 15px;
        width: 300px;
    }
    input{
        display: block;
        margin: 0 auto;
        margin-bottom: 20px;
        width: 300px;
        height: 25px;
        border: none;
        border-bottom: 3px solid #71A2D2;
        background-color: #D6D6D6;
        font-size: small;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
    label{
        text-align: left;
        display: block;
        margin-bottom: 13px;
        color: #7C97AE;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
    .weiter-button{
        background-color: #71A2D2;
        border: none;
        color: white;
        padding: 8px 30px;
        text-decoration: none;
        display: flex;
        font-size: 14px;
        cursor: pointer;
        margin-top: 30px;
        margin-left: 200px;
        border-radius: 4px;
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
    .weiter-button:hover{
        background-color: #447bb3;

    }
    .error-message{
        text-align: right;
        color: red;
        font-size: x-small;
        margin-bottom: 10px;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
</style>