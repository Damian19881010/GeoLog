<template>
<v-navigation-drawer class="nav" v-model="drawer" temporary :width="250">
    <v-list-item
        class="user text-white2"
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
        title="John Leider">
    </v-list-item>
    <v-divider color="white" opacity=".5"></v-divider>
    <v-list class="text-white2" density="compact" nav>
        <v-list-item 
            prepend-icon="mdi-notebook-plus-outline"
            title="Home"
            to="/"
            @click="drawer = false">
        </v-list-item>
        <v-list-item 
            prepend-icon="mdi-notebook-plus-outline"
            title="Book"
            to="/book"
            @click="drawer = false">
        </v-list-item>
        

    </v-list>

    
</v-navigation-drawer>

</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
})

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const drawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>


