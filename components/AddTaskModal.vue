<template>
    <div class="modal" v-if="isOpen">
        <div class="modal-content">
            <span class="close" @click="closeModal">$times;</span> 
            <h3>Task hinzufügen</h3>
            <label>Aufgabenbeschreibung:</label>
            <input v-model="newTask.task" type="text" />
            <label>Abteilung:</label>
            <input v-model="newTask.department" type="text" />
            <label>Person:</label>
            <input v-model="newTask.person" type="text" />
            <label>Termin geplant:</label>
            <input v-model="newTask.plannedDate" type="text" />
            <label>
                Preliminary Version
                <input v-model="newTask.isPreliminary" type="checkbox" />
            </label>
            <label>
                Release Version
                <input v-model="newTask.isRelease" type="checkbox" />
            </label>
            <button @click="addTask">Bestätigen</button>
            <button @click="closeModal">Abbrechen</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            isOpen: false,
            newTask: {
                task: '',
                department: '',
                person: '',
                plannedDate: '',
                isPreliminary: false,
                isRelease: false,
            },
        };
    },
    methods: {

        openModal() {
            this.isOpen = true;
        },

        closeModal() {
            this.isOpen = false;
            this.resetNewTask();
        },
        
        addTask() {

            const colorClass_pv = this.newTask.isPreliminary ? 'blue-row' : '';
            const colorClass_rv = this.newTask.isRelease ? 'cyan-row' : '';

            if (!this.newTask.task || !this.newTask.department || !this.newTask.person || !this.newTask.plannedDate) {
                alert('Bitte füllen Sie alle Felder aus!');
                return;
            }

            if (this.newTask.isPreliminary && this.newTask.isRelease) {
                alert('Bitte wählen sie nur eine Checkbox aus.');
                return;
            }

            this.$emit('taskAdded', {
                number: this.checklistItems.length + 1,
                task: this.newTask.task,
                department: this.newTask.department,
                person: this.newTask.person,
                plannedDate: this.newTask.plannedDate,
                completedDate: '',
                signature: '',
                colorClass_pv,
                colorClass_rv,
            });

            this.closeModal();
        },
        resetNewTask() {
            this.newTask = {
                task: '',
                department: '',
                person: '',
                plannedDate: '',
                isPreliminary: false,
                isRelease: false,
            };
        },        
    },    
};
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
        width: 60%;
    }
    .close{
        color: #add;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }
    .close:hover, .close:focus{
        color: black;
        text-decoration: none;
        cursor: pointer; 
    }

</style>