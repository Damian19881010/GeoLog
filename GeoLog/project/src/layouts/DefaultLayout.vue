<template>
  <v-layout class="default-layout">
    <v-main class="layout-main">
      <v-container class="layout-container py-6 ">
        <section class="page-content">
          <router-view />
        </section>
      </v-container>
    </v-main>
  </v-layout>
</template>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
}

.layout-main {
  padding: 0;
}

.layout-container {
  max-width: 1200px;
  height: 100vh;
}

.page-content {
  margin-top: 85px;
}
</style>