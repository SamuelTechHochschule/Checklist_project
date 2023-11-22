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
            <button @click="closeAddTaskModal">Abbrechen</button>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>

</style>