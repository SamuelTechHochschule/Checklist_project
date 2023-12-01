<template>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
<!--            <span class="close" @click="closeModal">x</span> -->
            <h3>Task bearbeiten</h3>
                <form @submit.prevent="saveChanges">
                    <label for="task">Aufgabenbeschreibung: </label>
                    <input type="text" v-model="editedTask.task" />

                    <div class="form-row">
                        <div class="form-column">
                            <label for="department">Verantwortliche Abteilung: </label>
                            <select v-model="editedTask.department">
                                <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }} </option>
                            </select>
                        </div>

                        <div class="form-column">
                            <label for="person">Verantwortliche Person: </label>
                            <input type="text" v-model="editedTask.person" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-column">
                            <label for="plannedDate">Geplanter Termin: </label>
                            <input type="text" v-model="editedTask.plannedDate"/>
                            
                        </div>

                        <div class="form-column">
                            <label for="completedDate">Erledigter Termin: </label>
                            <input type="text" v-model="editedTask.completedDate" placeholder="Erledigtes Datum"/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-column">
                            <label for="signature">Unterschrift: </label>
                            <input v-model="editedTask.signature" type="text" placeholder="Unterschrift"/>
                        </div>

                    </div>
                    <div class="form-row">
                        <button @click="closeModal">Abbrechen</button>
                        <button @click="saveChanges">Bestätigen</button>
                    </div>
                </form>

        </div>
    </div>
</template>

<script>
export default {

    props: {

        isVisible: {
            
            type: Boolean,
            required: true,

        },

        taskToEdit: {

            type: Object,
            default: null,

        }
    },

    data() {

        return {

            editedTask: { 
                
                id: null,
                task: "",
                department: "",
                person: "",
                plannedDate: "",
                completedDate: "",
                signature: "",
            },
            departmentOptions: ['AA', 'F&C', 'M&D', 'MPR&C', 'OP', 'P&P', 'PDM', 'QA', 'QM', 'R&D', 'SA', 'SC', 'SLS', 'TSC', 'WEB'],
        };
    },

    watch: {

        taskToEdit: {

            handler(newTask) {

                if(newTask) {

                    this.editedTask = { ...newTask};
                }else{

                    this.resetEditedTask();
                }
            },

            //Watch wird beim ersten Rendern sofort ausgeführt
            immediate: true,
        },
    },

    methods: {

        // Änderungen speichern
        saveChanges() {

            this.$emit("save", this.editedTask);
            this.closeModal();
        },

        // Schließe das Modal
        closeModal() {

            this.$emit('close');
        },

        //EditedTask nach Speichern clearen
        resetEditedTask() {

            this.editedTask = {

                id: null,
                task: "",
                department: "",
                person: "",
                plannedDate: "",
                completedDate: "",
                signature: "",
            };
        },



/*
        //Daten werden einmalig im Modal geladen
        loadData() {

            if(!this.dataLoaded) {

                console.log('Daten laden');
                this.dataLoaded = true;
            }
        },
*/
/*
        // Bearbeite Aufgabe
        editTask() {

            console.log("Open Modal in EditTaskModal.vue");
            this.editedTask.plannedDate = this.formatDateforDatabase(this.editedTask.plannedDate);
            this.editedTask.completedDate = this.formatDateforDatabase(this.editedTask.completedDate);

            this.$emit('saveChanges', this.editedTask);
            this.closeModal();
        },

        formatDateforDatabase(dateString) {

            if(!dateString || typeof dateString !== 'string') return '';
            const dateParts = dateString.split('.');
            if(dateParts.length !== 3) return '';
            const [day, month, year] = dateParts;
            return `${year}-${month}-${day}`;
        },

        // Speichere Änderung der Aufgabe
        saveEditedTask() {

            console.log("Changes in Modal");

            // Deep Copy, um zu prüfen, ob Objekt alle erforderlichen Informationen enthält
            const originalTask = { ...this.taskToEdit };

            const editedTask = {

                task: this.editedTask.task,
                department: this.editedTask.department,
                person: this.editedTask.person,
                plannedDate: this.editedTask.plannedDate,
                completedDate: this.editedTask.completedDate,
                signature: this.editedTask.signature,
            };

            if(!editedTask.plannedDate) {

                editedTask.plannedDate = originalTask.plannedDate;
            }

            if(!editedTask.completedDate) {

                editedTask.completedDate = originalTask.completedDate;
            }
            
            const taskId = this.taskToEdit.id;;
            const url = `http://localhost:5500/api/checklist/edit/${taskId}`;

            console.log('Edited Task before fetch:', this.editedTask);

            fetch(url, {

                method: 'PUT',
                headers: {

                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(this.editedTask),
            })
            .then(response => {

                console.log('Server response:', response);
                if(!response.ok) {

                    throw new Error(`Failed to save changes. Server responded with status ${response.status}`);
                }
                console.log('Changes saved successfully');
                this.$emit('closeModal');
            })
            .catch(error => {

                console.error('Error saving changes:', error);
            })
        },
*/

/*
    watch: {

        taskToEdit: {

            immediate: true,
            handler(newTask) {

                this.editedTask = { 
                    
                    ...newTask,
                    plannedDate: this.formatDate(newTask.plannedDate),
                    completedDate: this.formatDate(newTask.completedDate),
                };

                this.loadData();
            },
        },
*/  
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
</style>