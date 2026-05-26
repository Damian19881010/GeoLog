<template>
  <v-layout class="public-layout">
    <v-main class="public-layout__main">
      <div class="public-layout__backdrop"></div>
      <v-container class="public-layout__container">
        <section class="public-layout__content">
          <router-view />
        </section>
      </v-container>
    </v-main>
  </v-layout>
</template>

<style lang="scss" scoped>
.public-layout {
  min-height: 100vh;
}

.public-layout__main {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.public-layout__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at top left, rgba(255, 140, 0, 0.22), transparent 40%),
    radial-gradient(ellipse at bottom right, rgba(0, 153, 255, 0.18), transparent 35%),
    radial-gradient(ellipse at center, rgba(80, 0, 120, 0.12), transparent 60%),
    linear-gradient(160deg, #050816 0%, #0a1530 55%, #091b2c 100%);
}

.public-layout__container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  z-index: 1;
  padding: 32px 24px;
}

.public-layout__content {
  width: min(100%, 520px);
}
</style>
