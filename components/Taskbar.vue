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
            <li @click="navigateToMitarbeiterliste">
                <NuxtLink to="/Mitarbeiterliste">
                    <div class="Mitarbeiterblock">
                        <img src="~/assets/Mitarbeiterliste.png" alt="Mitarbeiterliste" class="mitarbeiterliste">
                        <p>Mitarbeiterliste</p>
                    </div>
                </NuxtLink>
            </li>
            <li> 
                <div class="version-block" @click="openVersionModal">
                    <img src="~/assets/Version.png" alt="Version" class="version">
                    <p>Version</p>
                </div>
            </li>
            <li @mouseenter="showViewMenu" @mouseleave="hideViewMenu">
                <div class="view-block">
                    <img src="~/assets/View.png" alt="View" class="view">
                    <p>Ansicht</p>
                </div>
                <div v-if="isViewMenuVisible" class="view-menu">
                    <ul>
                        <li @click="toggleView('checklist')">Checklist</li>
                        <li @click="toggleView('calendar')">Kalender</li>
                    </ul>
                </div>
            </li>
            <li>
                <div class="filter-block" @click="openFilterModal">
                    <img src="~/assets/Filter.png" alt="Filter" class="filter">
                    <p>Filter</p>
                </div>
                <FilterModal :isVisible="isFilterModalVisible" @save="handleFilterChanges" @saveSort="handleSortChanges" @close="closeFilterModal"/>
            </li>
            <li @mouseenter="showUserMenu" @mouseleave="hideUserMenu">
                <div class="account-block">
                    <img src="~/assets/User.png" alt="User" class="user">
                    <p>User</p>
                </div>
                <div v-if="isUserMenuVisible" class="user-menu">
                    <ul>
                        <li @click="navigateToSettings">Einstellung</li>
                        <li @click="exportChecklist">Checkliste exportieren</li>
                        <li @click="importChecklist">Checkliste importieren</li>
                        <li @click="logout">Logout</li>
                    </ul>
                </div>
            </li>
        </ul>

        <SettingsModal :isVisible="isSettingsModalVisible" @close="closeSettingsModal" />

    </div>
</template>

<script>
import FilterModal from './Modals/FilterModal.vue';
import SettingsModal from './Modals/SettingsModal.vue';
import VersionModal from './Modals/VersionModal.vue';
import { useAuthStore } from '~/store/authentication';

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
        SettingsModal,
        FilterModal,
        VersionModal,
    },

    data() {
        return{
            isUserMenuVisible: false,
            isViewMenuVisible: false,
            isSettingsModalVisible: false,
            isFilterModalVisible: false,
        };
    },

    methods: {

        // Exportiere Checklist
        exportChecklist() {

        if (!this.checklistItems || this.checklistItems.length === 0) {
            console.error('Checklist is empty or undefined. Cannot export.');
            return;
        }

            const tasksToExport = this.checklistItems;

            // Überprüfung, ob es Aufgabe gibt
            if(tasksToExport.length === 0) {
                console.warn('Keine Aufgaben zum Exportieren vorhanden');
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

        // Zeigt Dropdownmenü von Ansicht
        showViewMenu() {
            this.isViewMenuVisible = true;
        },

        // Schließt Dropdownmenü von Ansicht
        hideViewMenu() {
            this.isViewMenuVisible = false;
        },

        // Zwischen Checklist und Kalender wechseln
        toggleView(view) {
            console.log('Selecting view:', view);
            this.$emit('toggleView', view);
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

/*     
        // Handler für das Sortieren der Aufgaben
        handleSortChanges() {

        },
*/

        // Navigiere zur SettingsModal.vue-Komponente
        navigateToSettings() {
            this.isSettingsModalVisible = true;
            console.log('Navigating to Settings');
        },

        // Schließe Modal
        closeSettingsModal() {
            this.isSettingsModalVisible = false;
        },

        // User abmelden
        logout() {
            fetch('/logout', {
                method: 'POST',
                credentials: 'include',
            })
            .then(response => {
                if(response.ok) {
                    console.log('Logout erfolgreich');

                    //User im Store abmelden
                    useAuthStore().logoutUser();

                    // Zurückschicken an Index-Page
                    this.$router.push({ path: '/' });
                } else {
                    console.log(response);
                    console.error('Logout fehlgeschlagen (Innerhalb)');
                }
            })
            .catch(error => {
                console.error('Logout fehlgeschlagen (Außerhalb):', error);
                console.error('Response status:', error && error.status);
            });

            console.log('Logging out');
        },

        // Link to Homepage
        navigateToHome() {
            this.$router.push({ name: 'Checklist'});
        },

        // Link to Mitarbeiterliste
        navigateToMitarbeiterliste() {
            this.$router.push({ name: 'Mitarbeiterliste'});
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
    .view-block{
        padding-right: 30px;
        padding-left: 30px;
    }
    .view-block:hover{
        background-color: #d2e1f0;
    }
    .view{
        max-width: 100%;
        max-height: 100%;
        width: 55px;
        height: 50px;
        margin-top: 15px;
    }
    .view-menu{
        position: absolute;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        z-index: 1;
        flex-direction: column;
    }
    .view-menu ul{
        list-style-type: none;
        padding: 0;
        margin: 0;  
    }
    .view-menu li {
        padding: 8px;
        cursor: pointer;
        border-bottom: 1px solid #ccc; 
    }
    .view-menu li:hover {
        background-color: #f0f0f0;
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
        right: 0;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        z-index: 1;
        flex-direction: column;
    }
    .user-menu ul{
        list-style-type: none;
        padding: 0;
        margin: 0;  
    }
    .user-menu li {
        padding: 8px;
        cursor: pointer;
        border-bottom: 1px solid #ccc; 
    }
    .user-menu li:hover {
        background-color: #f0f0f0;
    }
    .Mitarbeiterblock{
        padding-right: 30px;
        padding-left: 30px;
    }
    .Mitarbeiterblock:hover{
        background-color: #d2e1f0;
    }
    .mitarbeiterliste{
        max-width: 100%;
        max-height: 100%;
        width: 60px;
        height: 50px;  
        margin-top: 15px;
    }
</style>