<template>
    <VueDatePicker v-model="date" range />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const date = ref();

// For demo purposes assign range from the current date
onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
})
</script>