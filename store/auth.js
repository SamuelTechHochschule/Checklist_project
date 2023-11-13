import { defineStore } from "pinia";
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({}),

    actions: {
        async loginUser(username, password) {
            try{
                const response = await axios.post('http://localhost:8080/auth/login', {
                    username: username,
                    password: password,
                });

                console.log(response.data);
            } catch (error) {
                console.error('Authentication error', error);
            }
        },

        
    },
});