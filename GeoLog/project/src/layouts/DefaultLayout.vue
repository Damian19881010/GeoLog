<template>
  <v-app class="bg-transparent">
    <AppHeader
      @toggle-search="searchOpen = !searchOpen"
      @toggle-menu="menuOpen = !menuOpen"
    />

    <v-layout class="default-layout">
      <Menu v-model="menuOpen" />

      <v-main class="layout-main">
        <router-view />
      </v-main>
    </v-layout>

    <footer class="site-bottom" aria-label="Site footer">
      <div class="site-bottom__inner">
        <div class="site-bottom__brand">
          <span class="site-bottom__badge" aria-hidden="true">
            <v-icon icon="mdi-shield-check" size="30" />
          </span>
          <span class="site-bottom__copyright">
            © 2026 GeoLog Travel Studio. All Rights Reserved.
          </span>
          <span class="site-bottom__divider" aria-hidden="true"></span>
          <span class="site-bottom__notice">
            本網站內容、介面設計與圖片素材均受著作權保護，未經授權請勿轉載或重製。
          </span>
        </div>

        <nav class="site-bottom__links" aria-label="Footer links">
          <a href="#privacy">隱私權政策</a>
          <span aria-hidden="true"></span>
          <a href="#terms">使用條款</a>
          <span aria-hidden="true"></span>
          <a href="#copyright">版權聲明</a>
        </nav>
      </div>
    </footer>

  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import Menu from '@/components/common/menu.vue'

const searchOpen = ref(false)
const menuOpen = ref(false)
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.default-layout {
  min-height: 100vh;
  // border-top: 1px solid rgba(255, 102, 0, 0.5) !important;
}

.site-bottom {
  width: 100%;
  padding: 0 0 16px;
}

.site-bottom__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  width: min(100% - 20px, 1368px);
  min-height: 72px;
  margin: 0 auto;
  padding: 12px 22px 12px 10px;
  border: 1px solid rgba(82, 144, 214, 0.32);
  border-radius: 15px;
  background:
    linear-gradient(180deg, rgba(5, 25, 50, 0.96) 0%, rgba(1, 19, 43, 0.98) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 24px rgba(0, 90, 180, 0.12);
  color: rgba(226, 235, 247, 0.7);
}

.site-bottom__brand,
.site-bottom__links {
  display: flex;
  align-items: center;
}

.site-bottom__brand {
  min-width: 0;
  gap: 24px;
}

.site-bottom__badge {
  display: inline-grid;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid rgba(247, 127, 0, 0.4);
  border-radius: 12px;
  background: rgba(247, 127, 0, 0.08);
  color: #f77f00;
  box-shadow:
    inset 0 0 0 1px rgba(255, 179, 71, 0.08),
    0 0 16px rgba(247, 127, 0, 0.34);
}

.site-bottom__copyright,
.site-bottom__notice,
.site-bottom__links a {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.4;
  white-space: nowrap;
}

.site-bottom__copyright {
  color: rgba(226, 235, 247, 0.72);
}

.site-bottom__notice {
  overflow: hidden;
  color: rgba(226, 235, 247, 0.64);
  text-overflow: ellipsis;
}

.site-bottom__divider,
.site-bottom__links span {
  display: inline-block;
  flex: 0 0 auto;
  width: 1px;
  height: 20px;
  background: rgba(226, 235, 247, 0.34);
}

.site-bottom__links {
  flex: 0 0 auto;
  gap: 24px;
}

.site-bottom__links a {
  color: rgba(226, 235, 247, 0.76);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #f77f00;
  }
}

@include breakpoint(1100px) {
  .site-bottom__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding: 14px 18px;
  }

  .site-bottom__brand {
    width: 100%;
  }

  .site-bottom__links {
    padding-left: 68px;
  }
}

@include breakpoint(720px) {
  .site-bottom {
    padding: 0 0 12px;
  }

  .site-bottom__inner {
    width: calc(100% - 24px);
  }

  .site-bottom__brand {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 10px 14px;
  }

  .site-bottom__badge {
    flex-basis: 40px;
    width: 40px;
    height: 40px;
  }

  .site-bottom__copyright,
  .site-bottom__notice {
    white-space: normal;
  }

  .site-bottom__copyright {
    width: calc(100% - 54px);
    align-self: center;
  }

  .site-bottom__notice {
    width: 100%;
  }

  .site-bottom__divider {
    display: none;
  }

  .site-bottom__links {
    flex-wrap: wrap;
    gap: 10px 14px;
    padding-left: 0;
  }

  .site-bottom__links a {
    font-size: 13px;
  }
}

</style>
