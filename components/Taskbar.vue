<template>
    <div>
        <ul>
            <li @click="navigateToHome">
                <NuxtLink to="/Checklist">
                    <div class="logo-block">
                        <img src="~/assets/Logo.png" alt="Logo" class="logo">
                    </div>
                </NuxtLink>
            </li>
            <li> 
                <div class="version-block" @click="openVersionModal">
                    <img src="~/assets/Version.png" alt="Version" class="version">
                    <p>Version</p>
                </div>
            </li>
            <li>
                <div class="filter-block" @click="openFilterModal">
                    <img src="~/assets/Filter.png" alt="Filter" class="filter">
                    <p>Filter</p>
                </div>
                <FilterModal :isVisible="isFilterModalVisible" @save="handleFilterChanges" @close="closeFilterModal"/> <!-- @saveSort="handleSortChanges" -->
            </li>
            <li @mouseenter="showUserMenu" @mouseleave="hideUserMenu" class="dropdown">
                <div class="account-block">
                    <img src="~/assets/User.png" alt="User" class="user">
                    <p>{{ this.username }}</p>
                </div>
                <div v-if="isUserMenuVisible" class="user-menu">
                    <a @click="exportChecklist">Checkliste exportieren</a>
                    <a v-if="isAdmin" @click="importChecklist">Checkliste importieren</a>
                    <a @click="logout">Logout</a>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import FilterModal from './Modals/FilterModal.vue';
import VersionModal from './Modals/VersionModal.vue';
import { useAuthStore } from '~/store/authentication';
import { useToast } from 'vue-toastification';

export default {

    props: {
        checklistItems: {
            type: Array,
            required: true,
        },
        selectedVersion: {
            type: Object,
            required: true,
        },
    },

    components: {
        FilterModal,
        VersionModal,
    },

    computed: {
        username() {
            return useAuthStore().displayUsername;
        },
        isAdmin() {
            return useAuthStore().isAdmin;
        },
    },

    data() {
        return{
            isUserMenuVisible: false,
            isFilterModalVisible: false,
        };
    },

    methods: {

        // Exportiere Checklist
        exportChecklist() {
        const toast = useToast()
        if (!this.checklistItems || this.checklistItems.length === 0) {
            toast.error('Eine leere Checkliste kann nicht exportiert werden!')
            return;
        }

            const tasksToExport = this.checklistItems;

            // Überprüfung, ob es Aufgabe gibt
            if(tasksToExport.length === 0) {
                const toast = useToast();
                toast.warning('Keine Aufgaben zum Exportieren vorhanden');
                return;
            }

            // Aufgaben in JSON konvertieren
            const tasksJson = JSON.stringify(tasksToExport, null, 2);

            // Blob mit Json-Inhalt erstellen
            const blob = new Blob([tasksJson], { type: 'application/json' });

            // Dateinamen für Exportdatei erstellen
            const filename = `Checkliste_${this.selectedVersion.name}.json`;

            // Download-Link erstellen
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Aufräumen
            document.body.removeChild(link);
        },

        importChecklist() {
            this.$emit('importChecklist');
        },

        // Öffnet VersionModal
        openVersionModal() {
            this.$emit('open-version-modal');
        },

        // Zeigt Dropdownmenü
        showUserMenu() {
            this.isUserMenuVisible = true;
        },

        // Schließt Dropdownmenü
        hideUserMenu() {
            this.isUserMenuVisible = false;
        },

        openFilterModal() {
            this.isFilterModalVisible = true;
        },

        closeFilterModal() {
            this.isFilterModalVisible = false;
        },
        
        handleFilterChanges(filterOptions) {
            this.$emit('filterChanged', filterOptions);
        },

        // User abmelden
        logout() {
            const toast = useToast();
            const authStore = useAuthStore();

            try {
                // Benutzer ausloggen
                authStore.logoutUser();
                toast.success('Erfolgreich ausgeloggt');
                this.$router.push('/');
            } catch(error) {
                console.error('Fehler beim Ausloggen:', error);
                toast.error('Fehler beim Ausloggen\n Für mehr Informationen öffnen Sie die Konsole!');
            }
        },

        // Link to Homepage
        navigateToHome() {
            this.$router.push({ name: 'Checklist'});
        },

    },
    
}
</script>

<style scoped>
    .logo{
        max-width: 100%;
        max-height: 100%;
        width: 125px;
        height: 125px;
        position: absolute;
        left: 0;
    }
    ul{
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: flex-end;
        border-bottom: 1px solid #00315E;
    }

    li:first-child{
        margin-left: auto;
    }
    li div{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #00315E;
        text-decoration: none;
    }
    .version-block{
        padding-right: 30px;
        padding-left: 30px;
        cursor: pointer;
    }
    .version-block:hover{
        background-color: #d2e1f0;
    }
    .version{
        max-width: 100%;
        max-height: 100%;
        width: 30px;
        height: 50px;
        margin-top: 15px;
    }
    .filter-block{
        padding-right: 30px;
        padding-left: 30px;
        cursor: pointer;
    }
    .filter-block:hover{
        background-color: #d2e1f0;
    }
    .filter{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 45px; 
        margin-top: 20px;
    }
    .account-block{
        padding-right: 30px;
        padding-left: 30px;
    }
    .account-block:hover{
        background-color: #d2e1f0;
    }
    .user{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 50px;  
        margin-top: 15px;
    }
    .user-menu{
        position: absolute;
        right: 8px;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        z-index: 1;
        flex-direction: column;
        list-style-type: none;
        padding: 0;
        margin: 0;  
    }
    .user-menu a {
        padding: 8px;
        cursor: pointer;
        border-bottom: 1px solid #ccc; 
    }
    .user-menu a:hover {
        background-color: #f0f0f0;
    }
</style>