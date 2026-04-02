<template>
    <v-card class="addflight pa-4 d-flex W-100 flex-column ga-4" color="transparent" elevation="5">
        <div class="panel-glow glow-left"></div>
        <div class="panel-glow glow-right"></div>
        <div class="panel-grid"></div>
        <div class="title-wrap">
            <p class="text-h4 font-weight-bold panel-title mb-1">機票資訊</p>
            <p class="panel-subtitle mb-0">FLIGHT TICKET EDITOR</p>
        </div>
        <v-divider color="orange21" opacity="100"></v-divider>
        <p class="text-white2">在這裡添加您的機票資訊，讓您的行程更加完整！</p>
        <v-btn color="orange21" variant="tonal" class="border-orange21 border-opacity-100 border"
            prepend-icon="mdi-plus" append-icon="mdi-airplane" @click="isAddTicketDialogOpen = true">
            添加機票資訊
        </v-btn>
    </v-card>

    <AddTicket v-model="isAddTicketDialogOpen" />
</template>

<script setup>
import { ref } from 'vue'
import AddTicket from './addTicket.vue'

const isAddTicketDialogOpen = ref(false)
</script>

<style lang="scss" scoped>
.addflight {
    width: 300px;
    position: fixed;
    z-index: 999;
    top: 150px !important;
    right: 50px !important;
    background-color: rgba(250, 235, 215, 0.13);
    border: 1px solid rgba(250, 235, 215, 0.3);
    border-radius: 16px;
}
</style>