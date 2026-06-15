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
            exact
            @click="drawer = false">
        </v-list-item>
        <v-list-item 
            prepend-icon="mdi-view-dashboard-outline"
            title="Dashboard"
            to="/dashboard"
            @click="drawer = false">
        </v-list-item>
        <v-list-item
            prepend-icon="mdi-trophy-award"
            title="Achievements"
            to="/achievements"
            @click="drawer = false">
        </v-list-item>
        <v-list-item 
            prepend-icon="mdi-notebook-plus-outline"
            title="Book"
            to="/book"
            @click="drawer = false">
        </v-list-item>
        <v-divider class="my-2" opacity="0.5"></v-divider>
        <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="handleLogout">
        </v-list-item>
        

    </v-list>

    
</v-navigation-drawer>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuthSession } from '@/utils/auth'

const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
})

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
const router = useRouter()

const drawer = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const handleLogout = async () => {
    clearAuthSession()
    drawer.value = false
    await router.push({ name: 'login' })
}
</script>


