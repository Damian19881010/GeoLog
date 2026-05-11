<template>
  <v-dialog v-model="dialog" class="mx-auto" max-width="400" persistent>
    <v-card prepend-icon="mdi-map-marker" title="Use Google's location service?">
      <v-card-item>
          <p>item1</p>
          <v-text-field density="compact" hide-details="auto"></v-text-field>
      </v-card-item>
      <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false">
            Disagree
          </v-btn>

          <v-btn @click="dialog = false">
            Agree
          </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const dialog = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })
</script>