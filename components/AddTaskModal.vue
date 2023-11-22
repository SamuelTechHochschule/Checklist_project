<template>
    <div class="modal" v-if="isOpen">
        <div class="modal-content">
<!--            <span class="close" @click="closeModal">x</span> -->
            <h3>Task hinzufügen</h3>
            <label>Aufgabenbeschreibung:</label>
            <input v-model="newTask.task" type="text" />
            
            <div class="form-row">
                <div class="form-column">
                    <label>Verantwortliche Abteilung:</label>
                    <input v-model="newTask.department" type="text" />
                </div>

                <div class="form-column">
                    <label>Verantwortliche Person:</label>
                    <input v-model="newTask.person" type="text" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-column">
                    <label>Geplanter Termin:</label>
                    <input v-model="newTask.plannedDate" type="text" />
                </div>

                <div class="form-column">
                    <label>Preliminary Version:</label>
                    <input v-model="newTask.isPreliminary" type="checkbox" />
                </div>

                <div class="form-column">
                    <label>Release Version:</label>
                    <input v-model="newTask.isRelease" type="checkbox" />
                </div>
            </div>
            <div class="form-row">
                <button @click="closeModal">Abbrechen</button>
                <button @click="addTask">Bestätigen</button>
            </div>
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

            fetch('http://localhost:5500/api/checklist/addTask', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: 1.2,
                    task: this.newTask.task,
                    department: this.newTask.department,
                    person: this.newTask.person,
                    plannedDate: this.newTask.plannedDate,
                    completedDate: '',
                    signature: '',
//                    isPreliminary,
//                    isRelease,
                }),
            })
            .then(response => {
                if(!response.ok){
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Task added successfully:', data);
                this.$emit('taskAdded');
                this.closeModal();
            })
            .catch(error => {
                console.error('Error adding task:', error);
            })
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