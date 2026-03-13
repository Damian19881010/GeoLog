<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6 rounded-xl" elevation="3">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">首頁</h1>
              <p class="text-medium-emphasis mb-0">
                這是一份 Vue 3 + Vite + Vuetify 的專案起手式。
              </p>
            </div>

            <v-btn color="primary" size="large" to="/dashboard">
              前往儀表板
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="2">
          <h3 class="text-h6 font-weight-bold mb-2">模組化</h3>
          <p class="text-medium-emphasis mb-0">已拆分 router、layout、plugin，後續擴充比較乾淨。</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="2">
          <h3 class="text-h6 font-weight-bold mb-2">可維護</h3>
          <p class="text-medium-emphasis mb-0">適合後續接 API、做表單、做圖台、做 dashboard。</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="2">
          <h3 class="text-h6 font-weight-bold mb-2">可延伸</h3>
          <p class="text-medium-emphasis mb-0">之後可再加 Pinia、Axios、權限控管、主題切換。</p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>