<template>
    <v-dialog
        v-model="dialog"
        max-width="760"
        content-class="schedule-dialog"
        transition="dialog-bottom-transition"
        persistent>
        <v-card class="dialog-panel rounded-xl overflow-hidden w-100" elevation="0">
            <div class="panel-glow glow-left"></div>
            <div class="panel-glow glow-right"></div>
            <div class="panel-grid"></div>

            <div class="header-wrap px-6 px-sm-8 pt-6 pt-sm-8">
                <div class="title-wrap">
                    <p class="text-h4 font-weight-bold panel-title mb-1">租車資訊</p>
                    <p class="panel-subtitle mb-0">CAR RENTAL EDITOR</p>
                </div>
                <div class="glow-line mt-4"></div>
            </div>

            <v-list class="bg-transparent">
                <v-card-text class="px-6 px-sm-8 pb-4 pt-5">
                    <div
                        v-for="(section, index) in sections"
                        :key="section.key"
                        class="section-block"
                        :class="{ 'mt-6': index > 0 }">
                        <div class="section-label mb-3">{{ section.title }}</div>

                        <div class="option-card pa-4 pa-sm-5">
                            <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 mb-4">
                                <div>
                                    <div class="option-title">{{ section.label }}</div>
                                    <div class="option-subtitle">{{ section.subtitle }}</div>
                                </div>

                                <v-chip label color="orange21">{{ section.badge }}</v-chip>
                            </div>

                            <v-row dense>
                                <v-col cols="12" sm="4">
                                    <v-text-field
                                        v-model="form[section.key].date"
                                        label="日期"
                                        type="date"
                                        variant="outlined"
                                        density="comfortable"
                                        color="orange"
                                        base-color="orange"
                                        prepend-inner-icon="mdi-calendar"
                                        hide-details="auto"
                                    />
                                </v-col>

                                <v-col cols="12" :sm="section.hasPickupFields ? 4 : 8">
                                    <v-text-field
                                        v-model="form[section.key].carModel"
                                        label="車款"
                                        variant="outlined"
                                        density="comfortable"
                                        color="orange"
                                        base-color="orange"
                                        prepend-inner-icon="mdi-car"
                                        hide-details="auto"
                                    />
                                </v-col>

                                <v-col v-if="section.hasPickupFields" cols="12" sm="4">
                                    <v-text-field
                                        v-model="form[section.key].checkInCode"
                                        label="報到碼"
                                        variant="outlined"
                                        density="comfortable"
                                        color="orange"
                                        base-color="orange"
                                        prepend-inner-icon="mdi-ticket-confirmation-outline"
                                        hide-details="auto"
                                    />
                                </v-col>

                                <v-col v-if="section.hasPickupFields" cols="12" sm="6">
                                    <v-file-input
                                        v-model="form[section.key].ticketImage"
                                        label="取車QrCode"
                                        variant="outlined"
                                        density="comfortable"
                                        color="orange"
                                        base-color="orange"
                                        prepend-inner-icon="mdi-camera-outline"
                                        prepend-icon=""
                                        hide-details="auto"
                                    />
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea
                                        v-model="form[section.key].note"
                                        label="備註"
                                        variant="outlined"
                                        density="comfortable"
                                        color="orange"
                                        base-color="orange"
                                        prepend-inner-icon="mdi-text-box-outline"
                                        hide-details="auto"
                                        auto-grow
                                        rows="2"
                                    />
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-card-text>
            </v-list>

            <div class="px-6 px-sm-8 pb-6 pb-sm-8">
                <div class="footer-line mb-4"></div>

                <v-card-actions class="pa-0 d-flex justify-end ga-3">
                    <v-btn class="btn-cancel" variant="flat" min-width="92" @click="closeDialog">
                        返回
                    </v-btn>

                    <v-btn class="btn-save" variant="flat" min-width="110" @click="handleSave">
                        儲存
                    </v-btn>
                </v-card-actions>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

type CarSectionKey = 'departure' | 'return'

interface CarSectionMeta {
    key: CarSectionKey
    title: string
    label: string
    subtitle: string
    badge: string
    hasPickupFields: boolean
}

interface CarFormSection {
    date: string
    carModel: string
    checkInCode: string
    ticketImage: File | File[] | null
    note: string
}

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const sections: CarSectionMeta[] = [
    {
        key: 'departure',
        title: 'OUTBOUND',
        label: '去程取車',
        subtitle: 'Fill in the outbound car rental information for this trip.',
        badge: 'Departure',
        hasPickupFields: true,
    },
    {
        key: 'return',
        title: 'INBOUND',
        label: '回程前還車',
        subtitle: 'Fill in the return car rental information for this trip.',
        badge: 'Return',
        hasPickupFields: false,
    },
]

const form = reactive<Record<CarSectionKey, CarFormSection>>({
    departure: {
        date: '',
        carModel: '',
        checkInCode: '',
        ticketImage: null,
        note: '',
    },
    return: {
        date: '',
        carModel: '',
        checkInCode: '',
        ticketImage: null,
        note: '',
    },
})

function closeDialog() {
    dialog.value = false
}

function handleSave() {
    emit('save', {
        departure: {
            ...form.departure,
        },
        return: {
            ...form.return,
        },
    })

    closeDialog()
}
</script>