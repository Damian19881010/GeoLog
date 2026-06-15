<template>
  <Transition name="toast-slide">
    <aside
      v-if="modelValue"
      class="achievement-toast"
      role="status"
      aria-live="polite"
    >
      <span class="toast-spark toast-spark-one"></span>
      <span class="toast-spark toast-spark-two"></span>
      <span class="toast-spark toast-spark-three"></span>
      <span class="toast-spark toast-spark-four"></span>

      <div class="toast-mark">
        <v-icon size="18">{{ icon }}</v-icon>
      </div>

      <div class="toast-copy">
        <strong>{{ title }}</strong>
        <span>{{ message }}</span>
      </div>

      <button
        class="toast-close"
        type="button"
        :aria-label="closeLabel"
        @click="closeToast"
      >
        <v-icon size="16">mdi-close</v-icon>
      </button>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    message: string
    title?: string
    icon?: string
    closeLabel?: string
  }>(),
  {
    title: 'LEVEL UP!',
    icon: 'mdi-star-four-points',
    closeLabel: 'Close notification',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const closeToast = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.achievement-toast {
  position: fixed;
  top: 22px;
  right: 22px;
  z-index: 80;
  width: min(390px, calc(100vw - 32px));
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 122, 26, 0.45);
  border-radius: 8px;
  padding: 14px;
  background: rgba(7, 20, 38, 0.9);
  color: #f5fbff;
  box-shadow:
    0 22px 54px rgba(0, 0, 0, 0.34),
    0 0 34px rgba(255, 122, 26, 0.2);
  backdrop-filter: blur(16px);
}

.toast-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 122, 26, 0.16);
  color: #ff7a1a;
}

.toast-copy {
  min-width: 0;

  strong,
  span {
    display: block;
  }

  strong {
    color: #ff7a1a;
    font-size: 13px;
    letter-spacing: 1.4px;
  }

  span {
    margin-top: 3px;
    color: rgba(245, 251, 255, 0.78);
    font-size: 13px;
  }
}

.toast-close {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.1);
  color: #f5fbff;
  cursor: pointer;
}

.toast-spark {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #ff7a1a;
  box-shadow: 0 0 14px rgba(255, 122, 26, 0.82);
  animation: toastSpark 1.8s ease-in-out infinite;
}

.toast-spark-one {
  top: 12px;
  left: 16px;
}

.toast-spark-two {
  top: 18px;
  right: 44px;
  animation-delay: 0.25s;
}

.toast-spark-three {
  right: 78px;
  bottom: 16px;
  animation-delay: 0.45s;
}

.toast-spark-four {
  left: 58px;
  bottom: 12px;
  animation-delay: 0.7s;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@keyframes toastSpark {
  0%,
  100% {
    opacity: 0.24;
    transform: translateY(0) scale(0.7);
  }

  50% {
    opacity: 1;
    transform: translateY(-5px) scale(1);
  }
}

@media screen and (max-width: 600px) {
  .achievement-toast {
    top: 14px;
    right: 14px;
  }
}
</style>
