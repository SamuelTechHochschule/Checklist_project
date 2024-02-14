<template>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
            <h3>Freigabe der Version:</h3>
            <form @submit.prevent="saveChanges">
                <label>Erledigter Termin: </label>
                <el-date-picker v-model="finishedDate" type="date" placeholder="YYYY-MM-DD"></el-date-picker>

                <div class="form-row">
                    <div class="form-column">
                        <label>Unterschrift: </label>
                        <input v-model="signature" type="text" placeholder="Vornamenkürzel.Nachname"/>
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
import { useToast } from 'vue-toastification';
export default {

    props: {
        isVisible: {
            type: Boolean,
            required: true,
        },
        selectedVersion: {
            type: Object,
            required: true,
        }
    },

    data() {
        return {
            finishedDate: '',
            signature: '',
        }
    },

    methods: {

        // Schließe das Modal
        closeModal() {
            this.$emit('close');
        },

        // Freigabe speichern
        saveChanges() {
            const toast = useToast();
            // Vorbereitung der Daten für die Anfrage
            const requestData = {
                finishedDate: this.finishedDate,
                signature: this.signature,
                released: true,
            };

            fetch(`http://localhost:5500/api/version/completeVersion/${this.selectedVersion.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                if(!response.ok) {
                    throw new Error('Fehler beim Freigeben der Versions')
                }
                toast.success('Version wurde freigegeben');
                this.closeModal();
            })
            .catch(error => {
                toast.error('Fehler beim Freigeben der Version\n Für mehr Informationen öffnen Sie die Konsole');
                console.error('Fehler beim Freigeben der Version', error);
            });
        },
    }
    
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
        width: 40%;
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