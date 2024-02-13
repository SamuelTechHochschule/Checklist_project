<template>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
            <h3>Fertigstellen der Version:</h3>
            <form @submit.prevent="saveChanges">

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
    },

    methods: {
        
        // Schließe das Modal
        closeModal() {
            this.$emit('close');
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
        width: 60%;
    }
</style>