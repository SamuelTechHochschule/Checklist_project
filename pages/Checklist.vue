<template>

    <Taskbar />    

    <h2>Checkliste zum Meilenstein XX | Versionsfreigabe: XY</h2>

    <!-- Normalerweise Abteilung des Users -->
    <h2>Abteilung: Admin</h2>

    <button class="add-Task-Button" @click="openModal">Task hinzufügen</button>

    <AddTaskModal ref="addTaskModal" @taskAdded="fetchChecklistItems" />

    <ChecklistTable :checklistItems="checklistItems"
     :selectedTaskId="selectedTaskId" 
     @taskClicked="handleTaskClick" 
     @updateRowColors="updateRowColors" 
     @deleteItemFromChecklist="deleteItemFromChecklist"
     @sendReminder="sendReminder"/>
    
    <div v-if="showButtons" class="button-container">
        <button v-if="shouldshowReminderButton(selectedTask)" @click="sendReminder(selectedTask.id)">Reminder schicken</button>
        <button @click="deleteItemFromChecklist(selectedTask.id)">Task löschen</button>
        <button @click="editTask(selectedTask.id)">Task bearbeiten</button>
    </div>

    <EditTaskModal :isVisible="isEditModalVisible" :taskToEdit="selectedTask" @save="saveEditedTask" @close="closeEditModal" />
</template>

<script>
import AddTaskModal from '~/components/Modals/AddTaskModal.vue';
import EditTaskModal from '~/components/Modals/EditTaskModal.vue';
import ChecklistTable from '~/components/ChecklistTable.vue';
import Taskbar from '~/components/Taskbar.vue';

export default {

    components: {
        AddTaskModal,
        ChecklistTable,
        EditTaskModal,
        Taskbar,
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
        };
    },

    created() {
        this.fetchChecklistItems();
    },

    methods: {

        // Daten aus Datenbank bzw. Backend fetchen
        async fetchChecklistItems() {
            try {
                const response = await fetch('/checklist');
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
            } catch (error) {
                console.error('Error fetching checklist items:', error);
            }
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

        // Farben der Reihen beim Neuladen updaten
        updateRowColors ({ taskId, colorClass_pv, colorClass_rv }) {
            this.$set(this.preliminaryVersions, taskId, colorClass_pv);
            this.$set(this.releaseVersions, taskId, colorClass_rv);
        },

        // Aufgaben löschen
        async deleteItemFromChecklist(taskId) {
            try{
                const response = await fetch(`/deleteTask`, {
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
                const response = await fetch(`/editTask`, {
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
    h2{
        color:#00315E;
    }
    
    .add-Task-Button{
        position: absolute;
        top: 188px;
        right: 10px;
        height: 30px;
    }

    .button-container{
        position: absolute;
        margin-top: 20px;
        top: 169px;
        right: 125px;
    }
    .button-container button{
        margin-right: 20px;
        height: 30px;
    }

</style>