<template>
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
                <input v-model="username" type="text" id="username" required>

                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" required>

                <button type="submit">Weiter</button>
            </form>
        </div>
    </div>
</template>

<script>

    export default{
        data(){
            return {
                username: '',
                password: '',
                loginToken: '',
            };
        },
        methods: {
            async loginUser() {
                try {
                    const response = await fetch('http://localhost:3000/login', {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: this.username,
                            password: this.password,
                        }),
                    });

                    if (response.ok){
                        const user = await response.json();
                        this.loginToken = user.loginToken;

                        console.log('Login successful:', user);
                    } else {
                        console.error('Login error:', response.statusText);
                    }
                } catch (error) {
                    console.error('Network error:', error);
                }
            },
        },
    };

/*
    import { useAuthStore } from '~/store/auth';

    export default{
        setup() {
            const authStore = useAuthStore();

            const username = ref('');
            const password = ref('');

            const login = async () => {
                try{
                    await authStore.loginUser(username.value, password.value);
                    console.log('Anmeldung erfolgreich');
                    this.$route.push('/Checklist');
                } catch (error) {
                    console.error('Login error:', error);
                }
            };
            return {
                authStore,
                username, 
                password,
                login,
            };
        },
    };
*/   
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
        margin-top: 15px
    }
    input{
        display: block;
        margin-bottom: 30px;
    }
    label{
        display: block;
        margin-bottom: 5px;
    }
    button{
        text-align: right;
    }
    .Meldung{
        display: block;
        margin-bottom: 30px;
    }
</style>