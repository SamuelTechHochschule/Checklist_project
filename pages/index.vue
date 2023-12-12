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
                <input v-model="username" type="text" id="username" placeholder="Your Email" required>

                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" placeholder="Your password" required>

                <p class="forgotpw">Forgot your password?</p>

                <button class="weiter-button" type="submit">Weiter</button>
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
                    if(this.username === "dummyUser" && this.password === "dummyPassword") {
                        this.loginToken = "dummyToken";
                        console.log("Login successful (Dummy):", this.loginToken);

                        this.$router.push("/checklist");
                        return;
                    }
                    const response = await fetch('http://localhost:5500/login', {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: this.username,
                            password: this.password,
                        }),
                        //credentials: 'include', Erstmals ohne credentials
                    });

                    if (response.ok){
                        try {
                            const user = await response.json();
                            this.loginToken = user.loginToken;

                            console.log('Login successful:', user);
                            this.$router.push("/checklist");
                        } catch (jsonError) {
                            console.error('Error parsing json:', jsonError);
                        }
                    } else {
                        console.error('Login error:', response.statusText);
                    }
                } catch (error) {
                    console.error('Network error:', error);
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
    .forgotpw{
        text-align: right;
        color: #7C97AE;
        font-size: x-small;
        margin-bottom: 10px;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
</style>