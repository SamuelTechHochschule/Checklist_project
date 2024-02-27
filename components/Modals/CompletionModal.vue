<template>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
            <h3>Freigabe der Version:</h3>
            <form @submit.prevent="saveChanges">

                <div v-if="selectedVersion.released" class="message-container">
                    Diese Version ist bereits freigegeben.
                </div>

                <div class="form-row">
                    <div class="form-column">
                        <label>Erledigter Termin: </label>
                        <el-date-picker v-model="finishedDate" type="date" placeholder="YYYY-MM-DD" :disabled="selectedVersion.released"></el-date-picker>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-column">
                        <label>Unterschrift: </label>
                        <input v-model="signature" type="text" placeholder="Vornamenkürzel.Nachname" :disabled="selectedVersion.released"/>
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
import { useAuthStore } from '~/store/authentication';
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

    watch: {
        isVisible(newVal) {
            if(newVal) {
                this.setInitialValues();
            }
        },

        finishedDate(newValue) {
            this.updateSelectedVersion();
        },

        signature(newValue) {
            this.updateSelectedVersion();
        }
    },
    
    data() {
        return {
            finishedDate: '',
            signature: '',
        }
    },

    methods: {

        // Werte der selektierten Version darstellen
        setInitialValues() {
            this.finishedDate = this.selectedVersion.finishedDate ? new Date(this.selectedVersion.finishedDate) : null;
            this.signature = this.selectedVersion.signature || '';
        },
 
        // Schließe das Modal
        closeModal() {
            this.$emit('close');
        },

        // Freigabe speichern
        async saveChanges() {

            const authStore = useAuthStore();
            await authStore.checkAdminStatus();

            if(authStore.isAdmin) {
                const toast = useToast();

                // Parsen des Datums
                let updatedDate = new Date(this.finishedDate);

                // Hinzufügen eines Tags
                updatedDate.setDate(updatedDate.getDate() + 1);

                // Vorbereitung der Daten für die Anfrage
                const requestData = {
                    finishedDate: updatedDate,
                    signature: this.formatUsername(this.signature),
                    released: true,
                };

                const confirm = window.confirm('Sind Sie sich sicher, die Version freizugeben?\nDie Freigabe kann nicht zurückgenommen werden!');
                if(confirm) {
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
                    
                        window.location.reload();
                    })
                    .catch(error => {
                        toast.error('Fehler beim Freigeben der Version\n Für mehr Informationen öffnen Sie die Konsole');
                        console.error('Fehler beim Freigeben der Version', error);
                    });
                }
            } else {
                toast.error('Sie haben keine Berechtigung dazu!');
        }

            

        },

        updateSelectedVersion() {
            this.selectedVersion.finishedDate = this.finishedDate;
            this.selectedVersion.signature = this.signature;
        },

        // Richtiges Formatieren der zuständigen Person
        formatUsername(username) {
            return username.toLowerCase().replace(/\b\w/g, function(char, index, str) {
                if(index > 0 && str[index - 1].match(/[äöüÄÖÜß]/)) {
                    return char.toLowerCase();
                } else {
                    return char.toUpperCase();
                }
            });
        },
    }
    
}
</script>

<style scoped>
    .message-container{
        text-align: center;
        background-color: lightgreen;
        height: 19px;
        font-weight: bold;
    }
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
        width: 50%;
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