import { createPinia } from 'pinia';
import { pinia } from './index';
import db from '~/server/db.cjs';

export const useAuthStore = pinia.defineStore({
    id: 'auth',
    state: () => ({
        isAuthenticated: false,
        user: null,
    }),
    actions:{
        async login(email, password){
            try{
                const user = await db.oneOrNone('SELECT * FROM coworker WHERE email = $1 AND password = $2', [email, password]);

                if(user){
                    this.isAuthenticated = true;
                    this.user = user;
                }else{
                    throw new Error('Invalid credentials');
                }
            }catch(error){
                console.error('Login error', error.message);
                throw new Error('Login failed');
            }
        },

        logout(){
            this.isAuthenticated = false;
            this.user = null;
        },
    },
});

