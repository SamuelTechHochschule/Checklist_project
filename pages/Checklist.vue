<template>

    <LoadingModal :is-loading="isLoading" />

    <div class="fixed_column">

        <VersionModal :isVersionModalVisible="isVersionModalVisible" @versionSelected="handleVersionSelected" @close="closeVersionModal"/> 

        <AddTaskModal ref="addTaskModal" @taskAdded="fetchChecklistItems" :selectedVersion="selectedVersion"/>

        <EditTaskModal :isVisible="isEditModalVisible" :taskToEdit="selectedTask" @save="saveEditedTask" @close="closeEditModal" />

        <Taskbar @filterChanged="handleFilterChanges" 
                 @versionSelected="handleVersionSelected" 
                 @open-version-modal="openVersionModal" 
                 @importChecklist="importChecklist"
                 :selectedVersion="selectedVersion"
                 :checklistItems="checklistItems"/>    <!-- @sortChanged="handleSortChanges" --> 

        <h2>{{ generateTitle() }}</h2>

        <!-- Datum der Versionsfreigabe -->
        <h2 v-if="selectedVersion">Preliminary Release: {{ formatDate(selectedVersion.preliminaryrelease) }} | Final Release: {{ formatDate(selectedVersion.finalrelease) }}</h2>

        <button class="multiselektor" @click="toggleMultiselector">{{ multiselectorActivated ? 'Multiselektor deaktivieren' : 'Multiselektor aktivieren' }}</button>

        <button class="add-Task-Button" @click="openModal">Task hinzufügen</button>

        <div v-if="showButtons && !multiselectorActivated" class="button-container">
            <button v-if="showReminderButton" @click="sendReminderEmail">Reminder schicken</button>
            <button @click="deleteItemFromChecklist(selectedTask.id)">Task löschen</button>
            <button @click="editTask(selectedTask.id)">Task bearbeiten</button>
        </div>

        <div v-if="showButtons && multiselectorActivated" class="button-container">
            <button v-if="showReminderButton" @click="sendReminderEmail">Reminder schicken</button>
            <button @click="deleteSelectedTasks">Task löschen</button>
        </div>
        
    </div>

    <div class="table">
            <ChecklistTable :checklistItems="checklistItems"
             :selectedTaskId="selectedTaskId" 
             :multiselectorActivated="multiselectorActivated"
             :clearSelectedTasks="multiselectorActivated"
             @taskClicked="handleTaskClick"  
             @deleteItemFromChecklist="deleteItemFromChecklist"/>        
   </div>  

</template>

<script>
import AddTaskModal from '~/components/Modals/AddTaskModal.vue';
import EditTaskModal from '~/components/Modals/EditTaskModal.vue';
import VersionModal from '~/components/Modals/VersionModal.vue';
import LoadingModal from '~/components/Modals/LoadingModal.vue';
import ChecklistTable from '~/components/ChecklistTable.vue';
import Taskbar from '~/components/Taskbar.vue';
import { useAuthStore } from '~/store/authentication';

import { useToast } from 'vue-toastification';

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
        EditTaskModal,
        Taskbar,
        VersionModal,
        LoadingModal,
    },

    data() {
        return {
            checklistItems: [],
            selectedTasks: [], // Array, um Aufgaben zur Selektierung zu speichern
            showButtons: false,
            selectedTask: null, // Variable für einzelne Selektierung der Aufgaben
            isEditModalVisible: false,
            selectedTaskId: -1,
            preliminaryVersions: {},
            releaseVersions: {},
            filterOptions: {
                selectedDepartment: '',
                showIncompleteTasks: false,
            },
            selectedVersion: null,
            isVersionModalVisible: false,
            isChecklistLoaded: false,
            isLoading: false, // Variable für Loading Indicator
            multiselectorActivated: false, // Variable um Multiselektor zu aktivieren
            reminderEmailRecipient: 's.savasta@asc.de',
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

    computed: {
        showReminderButton() {
            if(this.multiselectorActivated) {
                return this.selectedTasks.every(taskId => {
                    const task = this.checklistItems.find(item => item.id === taskId);
                    return this.isTaskNearDue(task) || this.isTaskOverdue(task) && !task.completedDate && !task.signature;
                });
            } else {
                return this.selectedTask ? (this.isTaskNearDue(this.selectedTask) || this.isTaskOverdue(this.selectedTask) && !this.selectedTask.completedDate && !this.selectedTask.signature) : false;
            }
        },
    },

    methods: {

        // Markiert Aufgabe als gesendet
        markTaskAsNotified(taskId) {
            if (!this.isTaskAlreadyNotified(taskId)) {
                localStorage.setItem(`emailNotified_${taskId}`, 'true');
            }
        },

        // Prüfen, ob E-Mail zu Aufgaben schon gesendet wurde
        isTaskAlreadyNotified(taskId) {
            return localStorage.getItem(`emailNotified_${taskId}`) === 'true';
        },

        // Bedingungsprüfen für Senden der Reminder-E-Mails
        async sendReminderEmail() {
            const toast = useToast();
            try {
                if(!this.reminderEmailRecipient) {
                    toast.error('Unbekannter Empfänger!\n Für mehr Informationen öffnen Sie die Konsole!');
                    return;
                }

                if(this.multiselectorActivated && this.selectedTasks.length > 0) {
                    for(const taskId of this.selectedTasks) {
                        const task = this.checklistItems.find(item => item.id === taskId);
                        if(task) {
                            if(!this.isTaskAlreadyNotified(taskId)) {
                                await this.sendEmailForTask(task);
                            } else {
                                const confirm = window.confirm(`Zur Aufgabe: "${task.task}" wurde schon eine E-Mail gesendet. Sind Sie sicher, dass Sie eine weitere E-Mail senden wollen?`);
                                if(confirm) {
                                    await this.sendEmailForTask(task);
                                }
                            }
                        }
                    }
                    this.multiselectorActivated = false;
                } else if(!this.multiselectorActivated && this.selectedTask) {
                    if(!this.isTaskAlreadyNotified(this.selectedTask.id)) {
                        await this.sendEmailForTask(this.selectedTask);
                    } else {
                        const confirm = window.confirm(`Zur Aufgabe: "${this.selectedTask.task}" wurde schon eine E-Mail gesendet. Sind Sie sicher, dass Sie eine weitere E-Mail senden wollen?`);
                        if(confirm) {
                            await this.sendEmailForTask(this.selectedTask);
                        }
                    } 

                    this.selectedTask = null;
                    this.selectedTaskId = -1;
                    this.showButtons = false;
                } else {
                    toast.error('Keine Aufgabe zum Versenden der E-Mail ausgewählt!');
                }
            } catch(error) {
                toast.error('Fehler beim Senden der Erinnerungs-E-Mails!\n Für mehr Informationen öffnen Sie die Konsole!')
                console.error('Fehler beim Senden der Erinnerungs-E-Mails:', error);
            }
            //window.open(`mailto:k.huebner@asc.de?subject=Test&body=Test`);
        },

        // Senden der Reminder-E-Mails
        async sendEmailForTask(task) {
            const toast = useToast();
            if(task) {
                const response = await fetch('http://localhost:5500/api/checklist/sendReminderEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: this.reminderEmailRecipient,
                        subject: 'Erinnerung',
                        body: `Die folgende Aufgabe: "${task.task}" muss noch in der Checkliste erledigt werden. Bitte bearbeiten Sie die Aufgabe in den nächsten Tagen`,
                    }),
                });

                if(!response.ok) {
                    toast.error('Fehler beim Senden der E-Mail!\n Für mehr Informationen öffnen Sie die Konsole!');
                    throw new Error(`Fehler beim Senden der E-Mail für Aufgabe ${task.task}`);
                }

                toast.info(`Die Reminder-E-Mail wurde für die Aufgabe: "${task.task}" an die Mail ${this.reminderEmailRecipient} gesendet`)
                this.markTaskAsNotified(task.id);
            } else {
                toast.error('Ungültige Aufgabe zum Versenden der E-Mail!');
            }
        },

        // Reminder nur bei orange markierten Aufgaben
        isTaskNearDue(item) {
            const plannedDate = new Date(item.plannedDate);
            const currentDate = new Date();
            const timeDifference = plannedDate - currentDate;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

            return daysDifference >= 0 && daysDifference <= 7;
        },

        isTaskOverdue(item) {
            const plannedDate = new Date(item.plannedDate);
            const currentDate = new Date();

            return plannedDate < currentDate && !item.completedDate && !item.signature; 
        },

        // Multiselektor aktivieren
        toggleMultiselector() {
            if(this.multiselectorActivated) {
                this.multiselectorActivated = false;
                this.clearSelectedTasks();
            } else {
                this.multiselectorActivated = true;
            }

            // Einzelauswahl resetten, wenn Multiselector aktiviert wird
            if(this.multiselectorActivated) {
                this.showButtons = false;
                this.selectedTask = null;
                this.selectedTaskId = -1;
            }
        },

        // Array selectedTasks leeren
        clearSelectedTasks() {
            this.selectedTasks = [];
            this.showButtons = false;
        },

        // Fetchen wenn Version gewechselt wird
        async handleSelectedVersionChange(newSelectedVersion) {
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
                    const content = e.target.result.replace(/^\uFEFF/, '');
                    try {
                        const importedData = JSON.parse(e.target.result);
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
            const toast = useToast();
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
                this.fetchChecklistItems();
            })
            .catch(error => {
                toast.error("Fehler beim Importieren der Checklist-Items!\n Für mehr Informationen öffnen Sie die Konsole!");
                console.error('Error importing checklist items:', error);
            });
        },

        // Version-Modal wird geöffnet
        openVersionModal() {
            this.isVersionModalVisible = true;
        },

        // Schließt Version-Modal
        closeVersionModal() {
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
            const toast = useToast();
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
                    })).sort((a, b) => a.id - b.id);
                }
            } catch (error) {
                toast.error('Fehler beim fetchen der Checkliste!\n Für mehr Informationen öffnen Sie die Konsole!');
                console.error('Error fetching checklist items:', error);
            } finally {
                // Daten werden nicht mehr geladen
                this.isLoading = false;
            }
        },

        // Handler für Änderung im FilterModal
        handleFilterChanges(filterOptions) {
            this.filterOptions = { ...this.filterOptions, ...filterOptions };
            this.fetchChecklistItems();
        },

/*
        handleSortChanges() {

        },
*/

        // Modal öffnen
        openModal() {
            this.$refs.addTaskModal.openModal();
        },

        // Handler für Betätigen einer Tabellenreihe
        handleTaskClick(taskId) {
            if(!this.multiselectorActivated) {
                if (this.selectedTaskId === taskId) {
                    this.showButtons = false;
                    this.selectedTask = null;
                    this.selectedTaskId = -1;
                } else {
                    this.showButtons = true;
                    this.selectedTask = this.checklistItems.find(item => item.id === taskId);
                    this.selectedTaskId = taskId;
                }
            } else {
                const taskIndex = this.selectedTasks.findIndex((id) => id === taskId);
                if(taskIndex !== -1) {
                    this.selectedTasks.splice(taskIndex, 1);
                } else {
                    this.selectedTasks.push(taskId);
                }

                this.showButtons = this.selectedTasks.length > 0;
            }    
        },

        deleteSelectedTasks() {
            for(const taskId of this.selectedTasks) {
                this.deleteItemFromChecklist(taskId);
            }

            this.selectedTasks = [];
        },

        // Aufgaben löschen
        async deleteItemFromChecklist(taskId) {
            const toast = useToast();
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

                toast.success('Aufgabe wurde erfolgreich gelöscht');
            } catch (error) {
                toast.error('Fehler beim Löschen der Aufgabe\n Für mehr Informationen öffnen Sie die Konsole!');
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
            this.selectedTask = this.checklistItems.find((item) => item.id === taskId);
            this.editedTask = { ...this.selectedTask };
            this.isEditModalVisible = true;
        },

        // Änderungen werden gespeichert
        async saveEditedTask(editedTask) {
            const toast = useToast();
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
                toast.success('Aufgabe wurde erfolgreich bearbeitet');
            } catch(error) {
                toast.error('Fehler beim Bearbeiten der Aufgabe!\n Für mehr Informationen öffnen Sie die Konsole!');
                console.error('Error saving edited task:', error);
            }
        },  

        // Modal wird geschlossen
        closeEditModal() {
            this.isEditModalVisible = false;
        },
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