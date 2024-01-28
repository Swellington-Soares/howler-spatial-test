<template>
  <div class="pos__conatiner">
    <span>{{ pos }}</span>
    <span>{{ direction.toFixed(2) }}</span>
    <span>{{ distance.toFixed(2) }}</span>
  </div>
  <div ref="containerRef" @mousemove="handleMouseMove" class="container">
    <button @click.stop="handlerPlay">Botão</button>
    <input type="range" name="audio" :min="0.01" :max="1.0" :step="0.01" v-model="volume" @update:model-value="changevolume" >
  </div>

</template>

<script lang="ts" setup>
import { ref } from "vue";
import { SoundManager } from "./api/audio-manager";
import { Vector3 } from "./api/types/vector";
const containerRef = ref<HTMLElement>();

const pos = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const direction = ref<number>(0.0);
const distance = ref<number>(0.0)

const volume = ref(1.0)
const changevolume = () => {
  SoundManager.setVolume( volume.value )
}
const handleMouseMove = (event: MouseEvent) => {
  const container = containerRef.value as HTMLElement;
  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const x = event.clientX - rect.left - centerX;
  const y = event.clientY - rect.top - centerY;
  pos.value = {
    x,
    y,
  };
  distance.value = new Vector3(0.0, 0.0, 0.0).distanceTo(new Vector3(x, y, 0.0))
  direction.value = parseFloat((Math.atan2(pos.value.y, pos.value.x) * (180 / Math.PI)).toFixed(2));
  let dx = Math.cos(direction.value) * distance.value;
  let dy = Math.sin(direction.value) * distance.value;
  SoundManager.updateGlobalPosition(dx, dy, -0.5)
};


const handlerPlay = () => {
  SoundManager.setAudio(
    new URL('./assets/bibi.mp3', import.meta.url).href,
    new Vector3(0, 0, 0),
    1.0,
    false,
    100,
    1
  );
};
</script>

<style scoped>
.container {
  width: 90vw;
  height: 90vh;
  position: relative;
  border: 1px solid #ff0000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: black;
  align-self: center;
}

div {
  display: flex;
  justify-content: center;
  color: black;
}

span {
  margin: 4px;
}
</style>
