<template>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
<!--            <span class="close" @click="closeModal">x</span> -->
            <h3>Task bearbeiten</h3>
                <form @submit.prevent="saveChanges">
                    <label for="task"  v-if="isAdmin">Aufgabenbeschreibung: </label>
                    <input type="text" v-model="editedTask.task"  v-if="isAdmin"/>

                    <div class="form-row" v-if="isAdmin">
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

                    <div class="form-row" v-if="isAdmin">
                        <div class="form-column">
                            <label for="plannedDate">Geplanter Termin: </label>
                            <el-date-picker v-model="editedTask.plannedDate" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-column">
                            <label for="completedDate">Erledigter Termin: </label>
                            <el-date-picker v-model="editedTask.completedDate" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                        </div>
                    </div>
                    <div class="form-row" v-if="isAdmin">
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
import { useAuthStore } from '~/store/authentication';
import { useToast } from 'vue-toastification';
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

    computed: {
        isAdmin() {
            return useAuthStore().isAdmin;
        },
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
            departmentOptions: ['AA', 'CS' ,'F&C', 'M&D', 'MPR&C', 'OP', 'P&P', 'PDM', 'QA', 'QM', 'R&D', 'SA', 'SC', 'SLS', 'TSC', 'WEB'],
            categoryOptions: ['1. Dokumentation', '2. Tätigkeiten', '3. Erweiterungspunkte zum Standard PEP', '4. Projektspezifische Aufgaben', '5. Aufgaben nach der Freigabe des Meilensteins'],
        };
    },

    watch: {
        taskToEdit: {
            handler(newTask) {
                if(newTask) {
                    // Überprüfen, ob plannedDate und completedDate bereits Date-Objekte sind -> Wenn nicht, werden diese in Date-Objekte umgewandelt
                    if (newTask.plannedDate && !(newTask.plannedDate instanceof Date)) {
                        newTask.plannedDate = new Date(newTask.plannedDate);
                    }
                    if (newTask.completedDate && !(newTask.completedDate instanceof Date)) {
                        newTask.completedDate = new Date(newTask.completedDate);
                    }                    
                    this.editedTask = { ...newTask};
                } else {
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
            if(this.editedTask.person !== this.taskToEdit.person) {
                this.sendEmailToNewResponsiblePerson(this.editedTask.person);
            }

            this.editedTask.person = this.formatUsername(this.editedTask.person);
            this.editedTask.signature = this.formatUsername(this.editedTask.signature);
            this.$emit("save", this.editedTask);
            this.closeModal();
        },

        // Senden der E-Mail für neue zuständige Person
        async sendEmailToNewResponsiblePerson(newResponsiblePerson) {
            const toast = useToast();

            try {
                const response = await fetch('http://localhost:5500/api/checklist/sendReminderEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: newResponsiblePerson + '@asc.de',
                        subject: 'Änderung der Zuständigkeit',
                        body: `Sie sind nun für die Aufgabe "${this.editedTask.task}" zuständig`,
                    }),
                });

                if(!response.ok) {
                    toast.error('Fehler beim Senden der E-Mail!\n Für mehr Informationen öffnen Sie die Konsole!');
                    console.error('Fehler beim Senden der E-Mail:', response.statusText);
                } else {
                    toast.info(`Die Reminder-E-Mail wurde für die Aufgabe: "${this.editedTask.task}" an die Mail ${newResponsiblePerson} gesendet`)
                }        
            } catch(error) {
                toast.error('Fehler beim Senden der E-Mail!\n Für mehr Informationen öffnen Sie die Konsole!');
                console.error('Fehler beim Senden der E-Mail:', error);
            }
        },

        // Richtiges Formatieren der zuständigen Person
        formatUsername(username) {
            if(username !== null) {
                return username.toLowerCase().replace(/\b\w/g, function(char, index, str) {
                    if(index > 0 && str[index - 1].match(/[äöüÄÖÜß]/)) {
                        return char.toLowerCase();
                    } else {
                        return char.toUpperCase();
                    }
                });
            } else {
                return '';
            }

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

            const date = new Date(dateString);

            // Überprüfen, ob date ein gültiges Datum ist
            if (isNaN(date.getTime())) {
               console.error('Ungültiges Datum:', dateString);
               return '';
            }           

            const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
            return date.toLocaleDateString('de-DE', options);
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