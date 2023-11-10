<template>
    <div class="navbar">
        <img src="~/assets/Logo.png" alt="Logo" class="image">
    </div>
    <div class="title">
        <p>ASC PEP-Checkliste</p>
    </div>
    <div class="login-box">
        <div class="email">
            <form @submit.prevent="onSubmit">
                <label for="email">Email:</label>
                <input v-model="email" type="text" id="email" required>

                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" required>

                <button type="submit">Weiter</button>
            </form>
        </div>
    </div>
</template>

<script>
    import { useAuthStore } from '~/store/auth';

    export default{
        data(){
            return{
                email: '',
                password: '',
            };
        },
        methods: {
            async onSubmit(){
                try{
                    await useAuthStore.login(this.email, this.password);
                }catch(error){
                    console.error('Login error:', error.message);
                }
            }
        }
    }
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
</style>