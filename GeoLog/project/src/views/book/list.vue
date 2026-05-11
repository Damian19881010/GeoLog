<template>
  <v-container class="pa-0 container" fluid>
    <section class="section">
      <v-card
        class="top add pa-5 border border-dashed border-orange21 border-opacity-100 d-flex justify-center align-center rounded-lg"
        color="transparent">
        <!-- 文字 -->
        <v-btn color="orange21" prepend-icon="mdi-plus-circle">新增旅程</v-btn>
      </v-card>
    </section>

    <section class="section">
      <v-list class="bg-transparent list px-2">
        <v-row class="row justify-space-between">
          <v-col cols="12" md="4" sm="6" v-for="(item, i) in trips" :key="i">
            <v-card class="info border w-100 h-100" @click="goToJourney(item.id)">
              <!-- 圖片 -->
              <v-img :src="item.image" max-width="600"></v-img>
              <!-- 文字 -->
              <v-card-item>
                <p class="title py-3">{{ item.name }}</p>
                <div class="d-flex justify-end mb-2">
                  <v-chip label color="orange" size="small">{{ item.startDate }}~{{ item.endDate }}</v-chip>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row> 
      </v-list>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import tripImg from '@/assets/images/trip.png'
import trip2 from '@/assets/images/trip2.png'
import trip3 from '@/assets/images/trip3.png'

const router = useRouter()

const trips = ref([
    {
        id: 1,
        name: '沖繩5天4夜自由行-範例',
        days: 5,
        startDate: '2022-01-01',
        endDate: '2022-01-03',
        image: tripImg
    },
    {
        id: 2,
        name: '沖繩3天2夜',
        days: 3,
        startDate: '2022-02-01',
        endDate: '2022-02-02',
        image: trip2
    },
    {
        id: 3,
        name: '大阪京都自由行',
        days: 2,
        startDate: '2022-02-01',
        endDate: '2022-02-02',
        image: trip3
    },

])

const goToJourney = (id: number) => {
  router.push({ name: 'book-detail', params: { id } })
}

</script>

<style scoped lang="scss">

.section {
    width: 80%;
    margin: 0 auto;

    .top {
        position: fixed;
        top: 140px;
        width: 80%;
        margin: 0 auto;
        left: 0;
        right: 0;
        z-index: 999;
        background-color: rgba(255, 127, 80, 0.151);

        &:hover {
            background-color: rgba(238, 63, 0, 0.233);
        }
    }


}

.section:nth-child(2) {

    position: fixed;
    top: 230px;
    width: 80%;
    height: calc(100vh - 230px);
    margin: 0 auto;
    left: 0;
    right: 0;
    z-index: 999;

    .list {
        height: 100% !important;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 5px !important;
        }
    }
}

.info {
    backdrop-filter: blur(3px);
    background-color: #000e24a2 !important;
    background: linear-gradient(135deg, #000E24 0%, rgba(0, 157, 230, 0.4) 100%);
    color: rgb(255, 153, 0);
    font-weight: bold;
    letter-spacing: 1px;
    box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.705);
    border-radius: 16px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        background: linear-gradient(135deg, #000E24 0%, rgba(0, 157, 230, 0.7) 100%) !important;
        transition: all 0.3s ease;
        transform: translateY(-5px);
    }

    .title {
        font-size: 1rem;
        color: aliceblue;
        letter-spacing: 2px;
    }
}
</style>
