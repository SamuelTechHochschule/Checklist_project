<template>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
            <h3>Filter Einstellungen</h3>
                <label>
                    <input type="checkbox" v-model="isSortByCategoryChecked">
                    Nach Aufgabenbereich sortieren
                </label>
                <div class="form-row">
                        <button @click="closeModal">Abbrechen</button>
                        <button @submit.prevent="saveChanges">Bestätigen</button>
                </div>
        </div>
    </div>
</template>

<script>
export default {
    
    props: {
        isVisible: Boolean,
    },
            
    methods: {
        saveSettings() {
            console.log("Gespeichert")
            this.closeModal();
        },  

        closeModal() {
            this.$emit('close');
        },
    },  
    
}
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
</style>