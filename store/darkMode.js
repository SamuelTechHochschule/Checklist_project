import { defineStore } from 'pinia';

export const useDarkModeStore = defineStore({
    id: 'darkMode',
    
    state: () => ({
        darkMode: false,
    }),

    actions: {
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            document.body.classList.toggle("dark-mode", this.darkMode);
            console.log('Darkmode umschalten');
        },
    },
});