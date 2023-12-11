<template>
    <body>
        <div class="modal" v-if="isVisible">
            <div class="modal-content" :class="{ 'dark-mode-modal': darkMode }">
                <h3>Einstellungen</h3>
                <div class="form-row">
                    <div class="form-columm">
                        <label for="darkMode">Darkmode:</label>
                        <button @click="toggleDarkMode">{{ darkMode ? 'Lightmode' : 'Darkmode' }}</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-column">
                        <button @click="saveSettings">Bestätigen</button>
                        <button @click="closeModal">Abbrechen</button>
                    </div>
                </div>
            </div>
        </div>
    </body>

</template>

<script>
import { useDarkModeStore } from '~/store/darkMode';

export default {

    props: {
        isVisible: Boolean,
    },

    setup() {
        const darkModeStore = useDarkModeStore();
        return{
            darkMode: darkModeStore.darkMode,
            toggleDarkMode: darkModeStore.toggleDarkMode,
        };
    },
    
    methods: {
        saveSettings() {
            console.log("Gespeichert")
            this.closeModal();
        },  

        closeModal() {
            this.$emit('close');
        },
    }
    
}
</script>

<style scoped>
    .modal{
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content{
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 20%;
    }
    .form-row{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .form-column{
        flex: 1;
        margin-right: 10px;
    }
    .form-column:last-child{
        margin-right: 0;
    }

</style>