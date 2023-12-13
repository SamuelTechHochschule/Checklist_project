<template>
    <div class="modal" v-if="isOpen">
        <div class="modal-content">
<!--            <span class="close" @click="closeModal">x</span> -->
            <h3>Task hinzufügen</h3>
            <label>Aufgabenbeschreibung:</label>
            <input v-model="newTask.task" type="text"/>
            
            <div class="form-row">
                <div class="form-column">
                    <label>Verantwortliche Abteilung:</label>
                    <select v-model="newTask.department">
                        <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }}</option>
                    </select>
                </div>

                <div class="form-column">
                    <label>Verantwortliche Person:</label>
                    <input v-model="newTask.person" type="text" placeholder="Vornamenkürzel.Nachname"/>
                </div>
            </div>
            <div class="form-row">
                <div class="form-column">
                    <label>Geplanter Termin:</label>
                    <el-date-picker v-model="newTask.plannedDate" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
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
                <div class="form-column">
                    <label>Aufgabenart: </label>
                    <select v-model="newTask.category">
                        <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
                    </select>
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
                category: '',
            },
            departmentOptions: ['AA', 'F&C', 'M&D', 'MPR&C', 'OP', 'P&P', 'PDM', 'QA', 'QM', 'R&D', 'SA', 'SC', 'SLS', 'TSC', 'WEB'],
            categoryOptions: ['1. Dokumentation', '2. Tätigkeiten', '3. Erweiterungspunkte zum Standard PEP', '4. Projektspezifische Aufgaben', '5. Aufgaben nach der Freigabe des Meilensteins'],
        };
    },

    methods: {

        // Öffnet Modal 
        openModal() {
            this.isOpen = true;
        },

        // Schließt Modal und resetted Input
        closeModal() {
            this.isOpen = false;
            this.resetNewTask();
        },
        
        // Fügt Aufgabe hinzu
        addTask() {
            // Konfigurierung für Reihenfärbung
            const colorClass_pv = this.newTask.isPreliminary ? 'Preliminary-row' : '';
            const colorClass_rv = this.newTask.isRelease ? 'Release-row' : '';

            // Prüfen ob alle Felder ausgefüllt sind
            if (!this.newTask.task || !this.newTask.department || !this.newTask.person || !this.newTask.plannedDate) {
                alert('Bitte füllen Sie alle Felder aus!');
                return;
            }

            // Prüfen, ob nur eins der Checkboxen gewählt ist
            if (this.newTask.isPreliminary && this.newTask.isRelease) {
                alert('Bitte wählen sie nur eine Checkbox aus.');
                return;
            }

            // Änderung der Aufgabenbeschreibung am Ende
            if (this.newTask.isPreliminary) {
                this.newTask.task += ' - Preliminary Version';
            }

            if (this.newTask.isRelease) {
                this.newTask.task += ' - Release Version';
            }

            fetch('/addTask', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: this.newTask.task,
                    department: this.newTask.department,
                    person: this.newTask.person,
                    plannedDate: this.newTask.plannedDate,
                    completedDate: '',
                    signature: '',
                    category: this.newTask.category,
                    colorClass_pv,
                    colorClass_rv,
                }),
            })
            .then(response => {
                console.log('Server response:', response);
                if(!response.ok){
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Task added successfully:', data);
                if (!data || !data.id) {   
                    console.error('Invalid data received from server:', data);
                    return;
                }

                this.$emit('taskAdded');
                this.closeModal();
            })
            .catch(error => {
                console.error('Error adding task:', error);
            })

        },

        // Cleared Eingabe im Modal
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