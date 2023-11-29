<template>
    <div class="modal" v-if="taskToEdit">
        <div class="modal-content">
<!--            <span class="close" @click="closeModal">x</span> -->
            <h3>Task bearbeiten</h3>
                <form @submit.prevent="editTask">
                    <label for="task">Aufgabenbeschreibung:</label>
                    <input v-model="editedTask.task" />

                    <div class="form-row">
                        <div class="form-column">
                            <label for="department">Verantwortliche Abteilung:</label>
                            <select v-model="editedTask.department">
                                <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }} </option>
                            </select>
                        </div>

                        <div class="form-column">
                            <label for="person">Verantwortliche Person:</label>
                            <input v-model="editedTask.person" type="text" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-column">
                            <label for="plannedDate">Geplanter Termin:</label>
                            <input v-model="editedTask.plannedDate" type="text" />
                        </div>

                        <div class="form-column">
                            <label for="completedDate">Erledigter Termin:</label>
                            <input v-model="editedTask.completedDate" type="text" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-column">
                            <label for="signature">Unterschrift</label>
                            <input v-model="editedTask.signature" type="text" />
                        </div>

                    </div>
                    <div class="form-row">
                        <button type="button" @click="closeModal">Abbrechen</button>
                        <button type="submit">Bestätigen</button>
                    </div>
                </form>

        </div>
    </div>
</template>

<script>
export default {

    props: {

        taskToEdit: Object,
    },

    data() {

        return {

            editedTask: {

                task: '',
                department: '',
                person: '',
                plannedDate: '',
                completedDate: '',
                signature: '',
            },
            departmentOptions: ['AA', 'F&C', 'M&D', 'MPR&C', 'OP', 'P&P', 'PDM', 'QA', 'QM', 'R&D', 'SA', 'SC', 'SLS', 'TSC', 'WEB'],
        };
    },

    methods: {

        editTask() {

            this.$emit('saveChanges', this.editedTask);
            this.closeModal();
        },

        closeModal() {

            this.$emit('closeModal');
        },
    },

    watch: {

        taskToEdit: {

            immediate: true,
            handler(newTask) {

                this.editedTask = { ...newTask };
            },
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