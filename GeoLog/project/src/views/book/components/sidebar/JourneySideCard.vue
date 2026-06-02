<template>
  <v-card class="pa-4 info-bord-side" color="transparent" elevation="4">
    <slot />
  </v-card>
</template>

<style lang="scss" scoped>
.info-bord-side {
  background-color: rgba(240, 255, 255, 0.096);
  border-radius: 16px;
  border: 1px solid rgba(238, 182, 0, 0.3);
}
</style>
