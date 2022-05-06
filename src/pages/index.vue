<script lang="ts" setup>
</script>

<template>
  <div>
    Minesweeper

    <div v-for="y in 10" :key="y">
      <button
        v-for="x in 10"
        :key="x"
        w-10 h-10 border
      >
        {{ (y - 1) * 10 + x }}
      </button>
    </div>
  </div>
</template>
