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
                number: 1.0,
                task: '',
                department: '',
                person: '',
                plannedDate: '',
                isPreliminary: false,
                isRelease: false,
            },
            currentTaskNumber: 1.1,
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

            // Überprüfung, ob Datumsformat korrekt ist
            const dataRegex = /^\d{2}\.\d{2}\.\d{4}$/;
            if (!dataRegex.test(this.newTask.plannedDate)) {
                alert('Das Datumsformat sollte DD.MM.YYYY sein!');
                return;
            }

            // Datumsformatkonvertierung zu YYYY-MM-DD
            const [day, month, year] = this.newTask.plannedDate.split('.');
            this.newTask.plannedDate = `${year}-${month}-${day}`;
            const formattedPlannedDate = `${year}-${month}-${day}`;

            //Automatische Berechnung von completedDate (6 Wochen)
            const plannedDateObject = new Date(formattedPlannedDate);
            const sixWeeksLater = new Date(plannedDateObject.getTime() + 6 * 7 * 24 * 60 * 60* 1000);
            const formattedCompletedDate = `${sixWeeksLater.getFullYear()}-${(sixWeeksLater.getMonth() + 1).toString().padStart(2, '0')}-${sixWeeksLater.getDate().toString().padStart(2, '0')}`;

            //Aufgabennummer um 0.1 erhöhen
            this.newTask.number = this.currentTaskNumber;
            this.currentTaskNumber += 0.1;

            fetch('http://localhost:5500/api/checklist/addTask', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: this.newTask.number,
                    task: this.newTask.task,
                    department: this.newTask.department,
                    person: this.newTask.person,
                    plannedDate: formattedPlannedDate,
                    completedDate: formattedCompletedDate,
                    signature: '',
//                    isPreliminary,
//                    isRelease,
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
                this.$emit('taskAdded');
                this.closeModal();
            })
            .catch(error => {
                console.error('Error adding task:', error);
            })
        },
        resetNewTask() {
            this.newTask = {
                number: this.currentTaskNumber,
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