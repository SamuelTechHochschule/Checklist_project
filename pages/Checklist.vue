<template>
        <ul>
            <li>
                <div class="logo-block" href="/">
                    <img src="~/assets/Logo.png" alt="Logo" class="logo">
                </div>
            </li>
            <li>
                <div class="version-block" href="#">
                    <img src="~/assets/Version.png" alt="Version" class="version">
                    <p>Version</p>
                </div>
            </li>
            <li>
                <div class="view-block">
                    <img src="~/assets/View.png" alt="View" class="view">
                    <p>Ansicht</p>
                </div>
            </li>
            <li>
                <div class="filter-block">
                    <img src="~/assets/Filter.png" alt="Filter" class="filter">
                    <p>Filter</p>
                </div>
            </li>
            <li>
                <div class="account-block">
                    <img src="~/assets/User.png" alt="User" class="user">
                    <p>User</p>
                </div>
            </li>
        </ul>

        <h2>Checkliste zum Meilenstein XX | Versionsfreigabe: XY</h2>

        <h2>Abteilung: R&D</h2>

        <button class="add-Task-Button" @click="openModal">Task hinzufügen</button>

        <AddTaskModal ref="addTaskModal" @taskAdded="fetchChecklistItems" />

        <ChecklistTable :checklistItems="checklistItems" :selectedTaskId="selectedTaskId" @taskClicked="handleTaskClick" @updateRowColors="updateRowColors" @deleteItemFromChecklist="deleteItemFromChecklist"/>
        
        <div v-if="showButtons" class="button-container">
            <button @click="deleteItemFromChecklist(selectedTask.id)">Task löschen</button>
            <button @click="editTask(selectedTask.id)">Task bearbeiten</button>
        </div>

        <EditTaskModal v-if="showEditModal" :taskToEdit="selectedTask" @saveChanges="saveEditedTask" @closeModal="closeEditModal" />
</template>

<script>
import AddTaskModal from '~/components/AddTaskModal.vue';
import EditTaskModal from '~/components/EditTaskModal.vue';
import ChecklistTable from '~/components/ChecklistTable.vue';

export default {

    components: {
        AddTaskModal,
        ChecklistTable,
        EditTaskModal,
    },

    data() {
        return {
            checklistItems: [],
            showButtons: false,
            selectedTask: null,
            selectedTaskId: -1,
            preliminaryVersions: {},
            releaseVersions: {},
            showEditModal: false,
        };
    },

    created() {
        this.fetchChecklistItems();
    },
    methods: {

        // Daten aus Datenbank bzw. Backend fetchen
        async fetchChecklistItems() {
            try {
                const response = await fetch('http://localhost:5500/api/checklist');
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                const data = await response.json();
                if (!data || !Array.isArray(data)) {
                    throw new Error('Invalid response format');
                }
                this.checklistItems = data.map(item => ({

                    ...item,
                    isPreliminary: item.colorClass_pv === 'blue-row',
                    isRelease: item.colorClass_rv === 'cyan-row',
                }));
            } catch (error) {
                console.error('Error fetching checklist items:', error);
            }
        },

        // Modal öffnen
        openModal() {
            this.$refs.addTaskModal.openModal();
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
            }
        },

        editTask(taskId) {

            this.showEditModal = true;
            this.selectedTaskId = taskId;
        },

        saveEditedTask(editedTask) {

            console.log('Saving changes for edited task:', editedTask);
            this.showEditModal = false;

            const taskId = this.selectedTaskId;
            const url = `http://localhost:5500/api/checklist/edit/${taskId}`;

            fetch(url, {

                method: 'PUT',
                headers: {

                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(editedTask)
            })
            .then(response => {

                if(!response.ok) {

                    throw new Error(`Failed to save changes. Server responded with status ${response.status}`);
                }

                console.log('Changes saved successfully');
                this.showEditModal = false;
                this.fetchChecklistItems();
            })
            .catch(error => {

                console.error('Error saving changes:', error);
            });
        },  

        closeEditModal() {

            this.showEditModal = false;
        }
    },
};
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
    }
    li{
        margin-left: 100px;
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
    .version{
        max-width: 100%;
        max-height: 100%;
        width: 30px;
        height: 50px;
        margin-top: 15px;
    }
    .view{
        max-width: 100%;
        max-height: 100%;
        width: 55px;
        height: 50px;
        margin-top: 15px;
    }
    .filter{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 45px; 
        margin-top: 20px;
    }
    .user{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 50px;  
        margin-top: 15px;
    }
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