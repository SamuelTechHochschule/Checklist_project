<template>
    <div class="modal" v-if="isVersionModalVisible">
        <div class="modal-content">
            <h3>Wählen/Erstellen/Bearbeiten Sie eine Versionsfreigabe:</h3>
            <ul>
                <li v-for="version in versions" :key="version.id" @click="selectVersion(version)" :class="{ selected: selectedVersion === version }">
                    {{ version.name }}
                </li>
            </ul>

            <div v-if="creatingNewVersion" class="form-column">
                <h3>Daten für neue Version angeben:</h3>
                <div class="form-row">
                    <label for="newVersionName">Name der Versionsfreigabe:</label>
                    <input v-model="newVersionName" type="text" id="newVersionName" required>
                </div>

                <div class="form-row">
                    <label for="preliminaryrelease">Datum für das Preliminary Release angeben:</label>
                    <el-date-picker v-model="preliminaryrelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>

                <div class="form-row">
                    <label for="finalrelease">Datum für das Final Release angeben:</label>
                    <el-date-picker v-model="finalrelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>

                <button @click="confirmNewVersion">Neue Version bestätigen</button>
                <button @click="cancelNewVersion">Abbrechen</button>
            </div>

            <div v-if="editingVersion">
                <h3>Version {{ selectedVersion.name }} bearbeiten</h3>
                <div class="form-row">
                    <label for="editedVersionName">Name der Versionsfreigabe:</label>
                    <input v-model="editedVersionName" type="text" id="editedVersionName">
                </div>

                <div class="form-row">
                    <label for="editedPreliminaryRelease">Datum für das Preliminary Release:</label>
                    <el-date-picker v-model="editedPreliminaryRelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>

                <div class="form-row">
                    <label for="editedFinalRelease">Datum für das Final Release:</label>
                    <el-date-picker v-model="editedFinalRelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>
                <button @click="saveEditedVersion">Bearbeitung bestätigen</button>
                <button @click="cancelEditVersion">Abbrechen</button>
            </div>

            <button @click="createNewVersion" v-if="showCreateButton && isAdmin">Neue Version erstellen</button>
            <button @click="confirmSelection" v-if="showConfirmButton" >Bestätigen</button>
            <button @click="deleteVersion" v-if="selectedVersion && showDeleteButton && isAdmin">Version löschen</button>
            <button v-if="selectedVersion && showEditButton && isAdmin" @click="editSelectedVersion">Version bearbeiten</button>
        </div>

    </div>
</template>

<script>
import { useAuthStore } from '~/store/authentication';
import { useToast } from 'vue-toastification';
export default {

    props: {
        isVersionModalVisible: Boolean,
    },

    created() {
        this.isAdmin = useAuthStore().isAdmin;
    },

    data() {
        return {
            versions: [],
            selectedVersion: null,
            creatingNewVersion: false,
            newVersionName: '',
            preliminaryrelease: '',
            finalrelease: '',
            editingVersion: false,
            editedVersionName: '',
            editedPreliminaryRelease: new Date(),
            editedFinalRelease: new Date(),
            daystoAdd: 1,
            showCreateButton: true, // Variable für das Erscheinen des Knopfes
            showConfirmButton: true, // Variable für das Erscheinen des Knopfes
            showEditButton: true, // Variable für das Erscheinen des Knopfes
            showDeleteButton: true, // Variable für das Erscheinen des Knopfes
            isAdmin: false,
        };
    },

    watch: {
        // Überprüfen, ob preliminaryrelease und finalrelease bereits Date-Objekte sind -> Wenn nicht, werden diese in Date-Objekte umgewandelt
        preliminaryrelease: {
            handler(newValue) {
                if(this.preliminaryrelease && !(this.preliminaryrelease instanceof Date)) {
                    this.preliminaryrelease = new Date(newValue);
                }
            },
            immediate: true,
        },

        finalrelease: {
            handler(newValue) {
                if(this.finalrelease && !(this.finalrelease instanceof Date)) {
                    this.finalrelease = new Date(newValue);
                }
            },
            immediate: true,
        },

        editedPreliminaryRelease: {
            handler(newValue) {
                if (this.editedPreliminaryRelease && !(this.editedPreliminaryRelease instanceof Date)) {
                    this.editedPreliminaryRelease = new Date(newValue);
                }
            },
            immediate: true,
        },
        
        editedFinalRelease: {
            handler(newValue) {
                if (this.editedFinalRelease && !(this.editedFinalRelease instanceof Date)) {
                    this.editedFinalRelease = new Date(newValue);
                }
            },
            immediate: true,
        },

        selectedVersion(newSelectedVersion) {
            if(this.editingVersion) {
                this.loadSelectedVersionData(newSelectedVersion);
            }
        },
    },


    
    methods: {

        // Bearbeitung abbrechen
        cancelEditVersion() {
            this.editingVersion = false;
            this.showCreateButton = true;
            this.showConfirmButton = true;
            this.showEditButton = true;
            this.showDeleteButton = true;
            this.editedVersionName = '';
            this.editedPreliminaryRelease = '';
            this.editedFinalRelease =  '';
        },

        // Version bearbeiten
        editSelectedVersion() {
            const toast = useToast();
            if(this.selectedVersion) {
                this.loadSelectedVersionData(this.selectedVersion);

                if(this.editingVersion) {
                    this.editingVersion = false;
                    this.showCreateButton = true;
                    this.showConfirmButton = true;
                    this.showEditButton = true;
                    this.showDeleteButton = true;
                } else {
                    this.editingVersion = true;
                    this.showCreateButton = false;
                    this.showConfirmButton = false;
                    this.showEditButton = false;
                    this.showDeleteButton = false;
                }

            } else {
                toast.error('Keine Version ausgewählt')
            }
        },
        
        loadSelectedVersionData(version) {
            this.editedVersionName = version.name;
            this.editedPreliminaryRelease = version.preliminaryrelease;
            this.editedFinalRelease = version.finalrelease;
        },

        // Bearbeitete Version speichern
        async saveEditedVersion() {
            const toast = useToast();
            if(this.selectedVersion && this.editedVersionName) {
                const editedVersion = {
                    id: this.selectedVersion.id,
                    name: this.editedVersionName,
                    preliminaryrelease: this.editedPreliminaryRelease,
                    finalrelease: this.editedFinalRelease,
                };

                // Tag hinzufügen zu Datum
                editedVersion.preliminaryrelease.setDate(editedVersion.preliminaryrelease.getDate() + this.daystoAdd);
                editedVersion.finalrelease.setDate(editedVersion.finalrelease.getDate() + this.daystoAdd);

                try {
                    const response = await fetch(`http://localhost:5500/api/version/editVersion/${this.selectedVersion.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type' : 'application/json',
                        },
                        body: JSON.stringify(editedVersion),
                    });

                    if(!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`)
                    }

                    // Aktualisieren der lokalen Version mit bearbeiteten Daten
                    Object.assign(this.selectedVersion, editedVersion);

                    // Bearbeitungs-Formular schließen
                    this.editingVersion = false;
                    this.showCreateButton = true;
                    this.showConfirmButton = true;
                    this.showEditButton = true;
                    this.showDeleteButton = true;
                
                    toast.success('Version wurde erfolgreich bearbeitet');
                } catch(error) {
                    toast.error('Fehler beim Bearbeiten der Version!\n Für mehr Informationen öffnen Sie die Konsole!');
                    console.error('Fehler beim Bearbeiten der Version:', error);
                } 
            } else {
                toast.error('Ungültige Daten für die Bearbeitung');
            }
        },

        async fetchVersions() {
            const toast = useToast();
            try {
                const response = await fetch('http://localhost:5500/api/versions');
                if(!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                this.versions = data.sort((a, b) => a.name.localeCompare(b.name));
            } catch(error) {
                toast.error('Fehler beim fetchen der Versionen!\n Für mehr Informationen öffnen Sie die Konsole!');
                console.error('Error fetching versions:', error);
            }
        },

        selectVersion(version) {
            if(this.selectedVersion === version) {
                this.selectedVersion = null;
            } else {
                this.selectedVersion = version;
                this.creatingNewVersion = false;
            }

        },

        async deleteVersion() {
            const toast = useToast();
            if(this.selectedVersion) {
                const confirmed = window.confirm(`Sind Sie sicher, dass Sie die Version '${this.selectedVersion.name}' löschen möchten? Alle Daten zu dieser Version werden mit gelöscht.`)

                if(confirmed) {
                    try {
                        const response = await fetch(`http://localhost:5500/api/version/deleteVersion/${this.selectedVersion.name}`, {
                            method: 'DELETE',
                        });

                        if(!response.ok) {
                            throw new Error(`Server responded with status: ${response.status}`);
                        }

                        // Version wird aus der Liste gelöscht
                        const index = this.versions.findIndex(version => version.name === this.selectedVersion.name);
                        if(index !== -1) {
                            this.versions.splice(index, 1);
                        }

                        // Auswahl zurücksetzen
                        this.selectedVersion = null;

                        toast.success('Version und ihre zugehörigen Aufgaben wurden erfolgreich gelöscht');
                    } catch(error) {
                        toast.error('Fehler beim Löschen der Version!\n Für mehr Informationen öffnen Sie die Konsole!');
                        console.error('Fehler beim Löschen der Version:', error);
                    }
                }
            } else {
                toast.error('Keine Version ausgewählt!');
            }
        },

        // Neue Version erstellen
        createNewVersion() {
            if(this.creatingNewVersion) {
                this.creatingNewVersion = false;
                this.showCreateButton = true;
                this.showConfirmButton = true;
                this.showEditButton = true;
                this.showDeleteButton = true;
            } else {
                this.creatingNewVersion = true;
                this.showCreateButton = false;
                this.showConfirmButton = false;
                this.showEditButton = false;
                this.showDeleteButton = false;
            }
            
            // Entfernen der Selektion, falls Aufgabe selektiert wurde
            this.selectedVersion = null;
        },

        // Bestätigung für eine neue Version
        async confirmNewVersion() {
            const toast = useToast();
            if(this.newVersionName && this.preliminaryrelease && this.finalrelease) {
                // 1 Tage hinzuzufügen für Datenbank
                this.preliminaryrelease.setDate(this.preliminaryrelease.getDate() + this.daystoAdd);
                this.finalrelease.setDate(this.finalrelease.getDate() + this.daystoAdd);

                const newVersion = {
                    name: this.newVersionName,
                    preliminaryrelease: this.preliminaryrelease,
                    finalrelease: this.finalrelease,
                };

                // Logik zum Hinzufügen der neuen Version in die Datenbank
                try {
                    const response = await fetch('http://localhost:5500/api/version/addVersion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newVersion),
                    });

                    if(!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`);
                    }

                    const createdVersion = await response.json();
                    toast.success(`Version wurde erfolgreich hinzugefügt`)

                    // Fügt erstellte Version der Liste hinzu
                    this.versions.push(newVersion);

                    // Bearbeitungs-Formular schließen
                    this.creatingNewVersion = false;
                    this.showCreateButton = true;
                    this.showConfirmButton = true;
                    this.showEditButton = true;
                    this.showDeleteButton = true;

                    // Eingabefelder zurücksetzen
                    this.newVersionName = '';
                    this.preliminaryrelease = '';
                    this.finalrelease = '';

                } catch(error) {
                    toast.error('Fehler beim Erstellen einer neuen Version!\n Für mehr Informationen öffnen Sie die Konsole');
                    console.error('Error creating new version:', error);
                }                
            } else {
                toast.error('Ungültige oder fehlende Daten für die Erstellung einer neuen Version!');
            }
        },

        // Abbrechen der Erstellung einer neuen Version
        cancelNewVersion() {
            this.creatingNewVersion = false;
            this.showCreateButton = true;
            this.showConfirmButton = true;
            this.showEditButton = true;
            this.showDeleteButton = true;
            this.newVersionName = '';
            this.preliminaryrelease = '';
            this.finalrelease = '';
        },

        async confirmSelection() {
            const toast = useToast();
            if(this.selectedVersion) {
                this.$emit('versionSelected', this.selectedVersion);
                this.closeModal();
            } else {
                toast.error('Eine Version muss ausgewählt werden');
            }

        },
        
        closeModal() {
            this.$emit('close');
        },
    },

    async mounted() {
        if(this.isVersionModalVisible) {
            await this.fetchVersions();
        }
    },
};
</script>

<style scoped>

    .dashed-line{
        width: 970px;
        height: 1px;
        border-bottom: 1px dashed #000000;
        position: absolute;
        top: 56%;
        transform: translateY(-0.5px);
    }

    ul{
        list-style-type: none;
        padding: 0;
        margin: 0;  
    }
    li {
        padding: 8px;
        cursor: pointer;
        border-bottom: 1px solid #ccc; 
    }
    li:hover {
        background-color: #f0f0f0;
    }
    .selected {
        background-color: lightblue;
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
        width: 60%;
        color: #00315E;
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