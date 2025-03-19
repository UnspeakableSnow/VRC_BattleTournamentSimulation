<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{ availableCasts: string[] }>()
const emits = defineEmits<{ (e: 'close'): void; (e: 'selectedCast', cast: string): void }>()

const closeModal = () => {
  emits('close')
}

const selectCast = (castId: string) => {
  emits('selectedCast', castId)
}
</script>

<style scoped>
.modal-content {
  background: white;
  padding: 5px;
  border-radius: 10px;
  text-align: center;
}
.cast-options {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.cast {
  width: 50px;
  margin: 0 10px;
  padding: 5px;
  border: 1px solid black;
  cursor: pointer;
}
h2 {
  margin: 0;
}
</style>

<template>
  <div class="modal-content">
    <h2>カードを選択</h2>
    <div class="cast-options">
      <div v-for="(cast, i) in availableCasts" :key="i" @click="selectCast(cast)">
        <img :src="`./castImages/${cast}.webp`" :alt="cast" class="cast" />
      </div>
    </div>
    <button @click="closeModal">キャンセル</button>
  </div>
</template>
