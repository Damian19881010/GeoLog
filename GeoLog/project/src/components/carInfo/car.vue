<template>
    <v-card class="addcar pa-4 d-flex W-100 flex-column ga-4" color="transparent" elevation="5">
        <div class="panel-glow glow-left"></div>
        <div class="panel-glow glow-right"></div>
        <div class="panel-grid"></div>
        <div class="title-wrap">
            <p class="text-h4 font-weight-bold panel-title mb-1">租車資訊</p>
            <p class="panel-subtitle mb-0">CAR RENTAL EDITOR</p>
        </div>
        <v-divider color="orange21" opacity="100"></v-divider>
        <p class="text-white2">在這裡添加您的租車資訊，讓您的行程更加完整！</p>
        <v-btn color="orange21" variant="tonal" class="border-orange21 border-opacity-100 border"
            prepend-icon="mdi-plus" append-icon="mdi-car" @click="isAddTicketDialogOpen = true">
            添加租車資訊
        </v-btn>
    </v-card>

    <AddTicket v-model="isAddTicketDialogOpen" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AddTicket from './addTicket.vue'

const isAddTicketDialogOpen = ref(false)
</script>

<style lang="scss" scoped>

</style>