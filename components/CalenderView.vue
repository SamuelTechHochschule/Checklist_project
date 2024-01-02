<template>
    <div>
        <FullCalendar
        :options="calendarOptions"
        />
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

export default {
    
    components: {
        FullCalendar,
    },

    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin],
                initialView: 'dayGridMonth',
            },
        };
    },

    props: {
        checklistItems: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        formattedEvents() {
            return this.checklistItems.map((item) => ({
                title: item.task,
                start: item.plannedDate,
                allDay: true,
            }));
        },
    },
};
</script>

<style scoped>

</style>