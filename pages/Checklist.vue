<template>

    <LoadingModal :is-loading="isLoading" />

    <div class="fixed_column">

        <VersionModal :isVersionModalVisible="isVersionModalVisible" @versionSelected="handleVersionSelected" @close="closeVersionModal"/> 

        <AddTaskModal ref="addTaskModal" @taskAdded="fetchChecklistItems" :selectedVersion="selectedVersion"/>

        <EditTaskModal :isVisible="isEditModalVisible" :taskToEdit="selectedTask" @save="saveEditedTask" @close="closeEditModal" />

        <Taskbar @filterChanged="handleFilterChanges" 
                 @toggleView="toggleView" 
                 @versionSelected="handleVersionSelected" 
                 @open-version-modal="openVersionModal" 
                 @importChecklist="importChecklist"
                 :selectedVersion="selectedVersion"
                 :checklistItems="checklistItems"/>    

        <h2>{{ generateTitle() }}</h2>

        <!-- Datum der Versionsfreigabe -->
        <h2 v-if="selectedVersion">Preliminary Release: {{ formatDate(selectedVersion.preliminaryrelease) }} | Final Release: {{ formatDate(selectedVersion.finalrelease) }}</h2>

        <button class="multiselektor" @click="toggleMultiselector">{{ multiselectorActivated ? 'Multiselektor deaktivieren' : 'Multiselektor aktivieren' }}</button>

        <button class="add-Task-Button" @click="openModal">Task hinzufügen</button>

        <div v-if="showButtons" class="button-container">
            <button v-if="shouldshowReminderButton(selectedTask)" @click="sendReminder(selectedTask.id)">Reminder schicken</button>
            <button @click="deleteItemFromChecklist(selectedTask.id)">Task löschen</button>
            <button @click="editTask(selectedTask.id)">Task bearbeiten</button>
        </div>
        
    </div>

    <div class="table" v-if="selectedView === 'checklist'">
            <ChecklistTable :checklistItems="checklistItems"
             :selectedTaskId="selectedTaskId" 
             :multiselectorActivated="multiselectorActivated"
             @taskClicked="handleTaskClick"  
             @deleteItemFromChecklist="deleteItemFromChecklist"
             @sendReminder="sendReminder"/>        
    </div>
    <div v-else class="calendar-container">
        <CalenderView :checklistItems="checklistItems" />
    </div>    

</template>

<script>
import AddTaskModal from '~/components/Modals/AddTaskModal.vue';
import EditTaskModal from '~/components/Modals/EditTaskModal.vue';
import VersionModal from '~/components/Modals/VersionModal.vue';
import LoadingModal from '~/components/Modals/LoadingModal.vue';
import ChecklistTable from '~/components/ChecklistTable.vue';
import Taskbar from '~/components/Taskbar.vue';
import CalenderView from '~/components/CalenderView.vue';
import { useAuthStore } from '~/store/authentication';

export default {
/*
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
*/
    components: {
        AddTaskModal,
        ChecklistTable,
        CalenderView,
        EditTaskModal,
        Taskbar,
        VersionModal,
        LoadingModal,
    },

    data() {
        return {
            checklistItems: [],
            showButtons: false,
            selectedTask: null,
            isEditModalVisible: false,
            selectedTaskId: -1,
            preliminaryVersions: {},
            releaseVersions: {},
            filterOptions: {
                selectedDepartment: '',
                showIncompleteTasks: false,
            },
            selectedView: 'checklist',
            selectedVersion: null,
            isVersionModalVisible: false,
            isChecklistLoaded: false,
            isLoading: false, // Variable für Loading Indicator
            multiselectorActivated: false, // Variable um Multiselektor zu aktivieren
        };
    },

    created() {
        this.openVersionModal();
    },

    watch: {
        selectedVersion: {
            handler: 'handleSelectedVersionChange',
            immediate: true,
        },
    },

    methods: {

        // Multiselektor aktivieren
        toggleMultiselector() {
            this.multiselectorActivated = !this.multiselectorActivated;
        },

        // Fetchen wenn Version gewechselt wird
        async handleSelectedVersionChange(newSelectedVersion) {
            console.log('Version ausgewählt:', newSelectedVersion);
            await this.fetchChecklistItems();
        },

        // Importiere Checklist
        importChecklist() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.addEventListener('change', this.handleFileSelect);
            input.click();
        },

        // Handler für Dateiauswahl
        handleFileSelect(event) {
            const file = event.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    console.log(e.target.result);
                    const content = e.target.result.replace(/^\uFEFF/, '');
                    try {
                        const importedData = JSON.parse(e.target.result);
                        console.log('Parsed importierte Daten:', importedData);
                        this.importChecklistItems(importedData);
                    } catch (error) {
                        console.error('Error parsing imported JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        },

        // Importierte Daten an Backend senden
        importChecklistItems(importedData) {
            console.log('Importierten Daten:', importedData);
            fetch('http://localhost:5500/api/checklist/import', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    version: this.selectedVersion.name,
                    checklistItems: importedData,
                }),
            })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Importierte Checklist-Aufgaben:', data);
                this.fetchChecklistItems();
            })
            .catch(error => {
                console.error('Error importing checklist items:', error);
            });
        },

        // Version-Modal wird geöffnet
        openVersionModal() {
            this.isVersionModalVisible = true;
        },

        // Schließt Version-Modal
        closeVersionModal() {
            console.log("Weiß Bescheid");
            this.isVersionModalVisible = false;
        },

        // Handler für Auswahl der Version
        handleVersionSelected(version) {
            this.selectedVersion = version;
            this.updateTitle();
            this.fetchChecklistItems();
        },

        // Formatiert Datum für die Anzeige
        formatDate(date) {
            if(!date) return '';
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(date).toLocaleDateString('de-DE', options);
        },

        // Generiert Überschrift auf ausgewählte Version 
        generateTitle() {
            const versionName = this.selectedVersion ? this.selectedVersion.name : 'XX';
            return `Checkliste zur Versionsfreigabe: ${versionName}`;
        },

        // Aktualisiert Überschrift
        updateTitle() {
          const newTitle = this.generateTitle();
          console.log("Updating title:", newTitle);  
        },

        // Zwischen Checklist und Kalender wechseln
        toggleView(view) {
            console.log("Receive view:", view);
            this.selectedView = view;
        },

        // Lädt die Checklist, wenn eine Version ausgewählt wurde
        async loadChecklist() {
            if (this.selectedVersion) {
                await this.fetchChecklistItems();
                this.isChecklistLoaded = true;
            }
        },

        // Daten aus Datenbank bzw. Backend fetchen
        async fetchChecklistItems() {
            try {
                // Daten werden geladen
                this.isLoading = true;

                if(!this.isChecklistLoaded) {
                    const departmentParam = this.filterOptions.selectedDepartment ? `&department=${encodeURIComponent(this.filterOptions.selectedDepartment)}` : '';
                    const incompleteTaskParam = this.filterOptions.showIncompleteTasks ? '&showIncompleteTasks=true' : '';
                    const versionParam = `&version=${encodeURIComponent(this.selectedVersion.name)}`;

                    const response = await fetch(`http://localhost:5500/api/checklist?${departmentParam}${incompleteTaskParam}${versionParam}`);
                    if (!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`);
                    }
                    const data = await response.json();
                    if (!data || !Array.isArray(data)) {
                        throw new Error('Invalid response format');
                    }
                    this.checklistItems = data.map(item => ({
                        ...item,
                        isPreliminary: item.colorClass_pv === 'Preliminary-row',
                        isRelease: item.colorClass_rv === 'Release-row',
                    }));
                }
            } catch (error) {
                console.error('Error fetching checklist items:', error);
            } finally {
                // Daten werden nicht mehr geladen
                this.isLoading = false;
            }
        },

        // Handler für Änderung im FilterModal
        handleFilterChanges(filterOptions) {
            console.log('Filter options changed:', filterOptions);
            this.filterOptions = { ...this.filterOptions, ...filterOptions };
            this.fetchChecklistItems();
        },

        // Modal öffnen
        openModal() {
            this.$refs.addTaskModal.openModal();
        },

        //Reminder-Button wird nur angzeigt, wenn completedDate oder signature null sind
        shouldshowReminderButton(item) {
            return !item.completedDate || !item.signature;
        },

        // Handler für Betätigen einer Tabellenreihe
        handleTaskClick(taskId) {
            if (this.selectedTaskId === taskId) {
                this.showButtons = false;
                this.selectedTask = null;
                this.selectedTaskId = -1;
            } else {
                this.showButtons = true;
                this.selectedTask = this.checklistItems.find(item => item.id === taskId);
                this.selectedTaskId = taskId;
             }
        },

        // Aufgaben löschen
        async deleteItemFromChecklist(taskId) {
            try{
                // Proxy nicht funktionsfähig bei DELETE-Methode
                const response = await fetch(`http://localhost:5500/api/checklist/delete/${taskId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete task. Server responded with status ${response.status}`);
                }

                // Aufgabe aus Array manuell löschen
                const index = this.checklistItems.findIndex(item => item.id === taskId);
                if (index !== -1) {
                    this.checklistItems.splice(index, 1);
                }

                // Selected task resetten
                this.showButtons = false;
                this.selectedTask = null;
                this.selectedTaskId = -1;

                console.log('Task deleted successfully');
            } catch (error) {
                console.error('Error deleting task:', error);

                if(error.response) {
                    console.error('Server responded with status:', error.response.status);
                    console.error('Response data:', error.response.data);
                } else if(error.request) {
                    console.error('No response received from the server');
                } else {
                    console.error('Error setting up the request', error.message);
                }
            }
        },

        // Aufruf des Modals für die Bearbeitung
        editTask(taskId) {
            console.log("editTask-Aufruf");
            
            this.selectedTask = this.checklistItems.find((item) => item.id === taskId);
            this.editedTask = { ...this.selectedTask };
            this.isEditModalVisible = true;
        },

        // Änderungen werden gespeichert
        async saveEditedTask(editedTask) {
            try{
                const response = await fetch(`/editTask/${editedTask}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editedTask),
                });

                if(!response.ok) {
                    throw new Error(`Failed to save edited task. Server responded with status ${response.status}`);
                }

                // checklistItems-Array wird mit der bearbeiteten Aufgabe aktualisiert
                const index = this.checklistItems.findIndex((item) => item.id === editedTask.id);
                if(index !== -1) {
                    this.checklistItems.splice(index, 1, editedTask);
                }

                //Modal wird geschlossen
                this.isEditModalVisible = false;
                console.log('Task edited and saved successfully');
            } catch(error) {
                console.error('Error saving edited task:', error);
            }

            console.log('Saving changes for edited task:', editedTask);
        },  

        // Modal wird geschlossen
        closeEditModal() {
            this.isEditModalVisible = false;
        },

        // Reminder-Email-Funktion
        sendReminder(taskId) {
            console.log('Sending reminder for task ID:', taskId);
        }
    },
};
</script>

<style scoped>

    .calendar-container{
        flex-grow: 1;
        padding: 0 250px;
    }
    .fixed_column{
        position: fixed;
        width: 100%;
        z-index: 1000;
        top: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: #f8f8f8;
    }
    .table{
        padding-top: 250px; 
    }
    h2{
        color:#00315E;
    }
    .add-Task-Button{
        position: absolute;
        top: 188px;
        right: 180px;
        height: 30px;
    }
    .multiselektor{
        position: absolute;
        top: 188px;
        right: 10px;
        height: 30px;
    }
    .button-container{
        position: absolute;
        margin-top: 20px;
        top: 169px;
        right: 290px;
    }
    .button-container button{
        margin-right: 20px;
        height: 30px;
    }

</style>