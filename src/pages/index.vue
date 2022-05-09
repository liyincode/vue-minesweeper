<script lang="ts" setup>
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(10, 10)
const state = play.state
</script>

<template>
  <div>
    Minesweeper

    <div p5>
      <div
        v-for="raw ,y in state"
        :key="y"
        flex items-center justify-center
      >
        <MineBlock
          v-for="block, x in raw"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.rightClick(block)"
        />
      </div>
    </div>
    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev ? 'DEV' : 'NORMAL' }}
      </button>
      <button btn @click="play.reset()">
        RESET
      </button>
    </div>
  </div>
</template>
