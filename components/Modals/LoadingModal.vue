<template>
    <div v-if="isLoading" class="modal">
        <svg class="loading-indicator"></svg>
    </div>
</template>

<script>
export default {
    props: {
        isLoading: {
            type: Boolean,
            required: true,
        },
    },
};
</script>

<style scoped>
    .modal{
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(131, 131, 131, 0.4);
    }

    .loading-indicator{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 5px solid #3498db;
        border-top: 5px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin{
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>