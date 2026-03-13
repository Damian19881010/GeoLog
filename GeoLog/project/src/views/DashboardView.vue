<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-3">
      <div>
        <h1 class="text-h4 font-weight-bold">Dashboard</h1>
        <p class="text-medium-emphasis mb-0">這裡之後可以放圖表、統計卡、列表。</p>
      </div>

      <v-btn color="primary" prepend-icon="mdi-plus">
        新增資料
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="2">
          <p class="text-body-2 text-medium-emphasis mb-2">今日案件</p>
          <p class="text-h4 font-weight-bold mb-0">12</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="2">
          <p class="text-body-2 text-medium-emphasis mb-2">待處理</p>
          <p class="text-h4 font-weight-bold mb-0">5</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-5 rounded-xl" elevation="2">
          <p class="text-body-2 text-medium-emphasis mb-2">已完成</p>
          <p class="text-h4 font-weight-bold mb-0">27</p>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-5 rounded-xl" elevation="2">
          <h2 class="text-h6 font-weight-bold mb-3">最近紀錄</h2>

          <v-table>
            <thead>
              <tr>
                <th class="text-left">時間</th>
                <th class="text-left">項目</th>
                <th class="text-left">狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09:00</td>
                <td>系統初始化</td>
                <td>完成</td>
              </tr>
              <tr>
                <td>10:30</td>
                <td>建立首頁模組</td>
                <td>完成</td>
              </tr>
              <tr>
                <td>14:00</td>
                <td>串接 API</td>
                <td>進行中</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>