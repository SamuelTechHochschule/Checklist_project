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
                            <input type="text" v-model="editedTask.person" placeholder="Vornamenkürzel.Nachname"/>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-column">
                            <label for="plannedDate">Geplanter Termin: </label>
                            <input type="text" v-model="editedTask.plannedDate" placeholder="DD.MM.YYYY"/>
                        </div>

                        <div class="form-column">
                            <label for="completedDate">Erledigter Termin: </label>
                            <input type="text" v-model="editedTask.completedDate" placeholder="DD.MM.YYYY"/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-column">
                            <label>Aufgabenart: </label>
                            <select v-model="editedTask.category">
                                <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-column">
                            <label for="signature">Unterschrift: </label>
                            <input v-model="editedTask.signature" type="text" placeholder="Vornamenkürzel.Nachname"/>
                        </div>

                    </div>
                    <div class="form-row">
                        <button @click="closeModal">Abbrechen</button>
                        <button @submit.prevent="saveChanges">Bestätigen</button>
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
                category: "",
            },
            departmentOptions: ['AA', 'F&C', 'M&D', 'MPR&C', 'OP', 'P&P', 'PDM', 'QA', 'QM', 'R&D', 'SA', 'SC', 'SLS', 'TSC', 'WEB'],
            categoryOptions: ['1. Dokumentation', '2. Tätigkeiten', '3. Erweiterungspunkte zum Standard PEP', '4. Projektspezifische Aufgaben', '5. Aufgaben nach der Freigabe des Meilensteins'],
        };
    },
/*
    computed: {

        formattedPlannedDate: function() {

            return this.formatDate(this.editedTask.plannedDate);
        },

        formattedCompleteDate: function() {

            return this.formatDate(this.editedTask.completedDate);
        },
    },
*/
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

            this.editedTask.plannedDate = this.formatDateforBackend(this.editedTask.plannedDate);
            this.editedTask.completedDate = this.formatDateforBackend(this.editedTask.completedDate);

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
                category: "",
            };
        },

        // Datum wird in Format DD.MM.YYYY formatiert
        formatDate(dateString) {

            if(!dateString) {

                return '';
            }

            const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE', options);
        },

        // Formatierung von DD.MM.YYYY in YYYY-MM-DD für Datenbankspeicherung
        formatDateforBackend(dateString) {

            console.log(dateString);

            if(!dateString) {

                return null;
            }

            // Überprüfen, ob dateString ein string ist
            if(typeof dateString !== 'string') {

                console.error('Invalid dateString. Expected a string.');
                return '';
            }

            const dateParts = dateString.split('.');
            // Überprüfen, ob im richtigen Format
            if(!Array.isArray(dateParts) || dateParts.length !== 3) {

                console.error('Invalid date format. Expected DD.MM.YYYY');
                return '';
            }

            const [day, month, year] = dateParts;
            return `${year}-${month}-${day}`;
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
</style>