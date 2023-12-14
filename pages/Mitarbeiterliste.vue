<template>
    <Taskbar /> 
        
    <h2>Mitarbeiterliste</h2>
</template>

<script>
import Taskbar from '~/components/Taskbar.vue';
import { useAuthStore } from '~/store/authentication';

export default {

    beforeRouteEnter(to, from, next) {
        const authStore = useAuthStore();

        // Überprüfen, ob der Benutzer authenifiziert ist
        if(!authStore.isLoggedIn) {
            // User ist nicht angemeldet, zurück in Login-Seite leiten
            next({ path: '/' });

        } else {
            // Benutzer ist angemeldet, Zugriff erlauben
            next();
        }
    },

    components: {
        Taskbar,
    }
    
}
</script>

<style scoped>

</style>