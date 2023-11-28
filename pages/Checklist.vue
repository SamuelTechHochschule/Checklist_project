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

        <ChecklistTable :checklistItems="checklistItems" :selectedTaskId="selectedTaskId" @taskClicked="handleTaskClick" @updateRowColors="updateRowColors"/>
        
        <div v-if="showButtons" class="button-container">
            <button @click="deleteTask(selectedTask.id)">Task löschen</button>
            <button @click="editTask(selectedTask.id)">Task bearbeiten</button>
        </div>
</template>

<script>
import AddTaskModal from '~/components/AddTaskModal.vue';
import ChecklistTable from '~/components/ChecklistTable.vue';

export default {

    components: {
        AddTaskModal,
        ChecklistTable,
    },

    data() {
        return {
            checklistItems: [],
            showButtons: false,
            selectedTask: null,
            selectedTaskId: -1,
            preliminaryVersions: {},
            releaseVersions: {},
        };
    },

    created() {
        this.fetchChecklistItems();
    },
    methods: {
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

        openModal() {
            this.$refs.addTaskModal.openModal();
        },

        handleTaskClick(taskId) {

            if (this.selectedTaskId === taskId) {

                this.showButtons = !this.showButtons;
            } else {

                this.showButtons = true;
                this.selectedTask = this.checklistItems.find(item => item.id === taskId);
                this.selectedTaskId = taskId;
            }

        },

        updateRowColors ({ taskId, colorClass_pv, colorClass_rv }) {

            this.$set(this.preliminaryVersions, taskId, colorClass_pv);
            this.$set(this.releaseVersions, taskId, colorClass_rv);
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