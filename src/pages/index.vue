<script lang="ts" setup>
interface BlockState {
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}

const WIDTH = 10
const HEIGHT = 10

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

const state = reactive(
  Array.from({ length: HEIGHT },
    (_, y) => Array.from(
      { length: WIDTH },
      (_, x): BlockState => ({ x, y, adjacentMines: 0 }),
    ),
  ),
)

function generateMines() {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.3
  }
}

// 计算旁边有多少炸弹💣
function updateNumbers() {
  state.forEach((raw, y) => {
    raw.forEach((block, x) => {
      if (block.mine)
        return
      directions.forEach(([dx, dy]) => {
        const x2 = x + dx
        const y2 = y + dy
        // 判断是否出界了
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
          return

        if (state[y2][x2].mine)
          block.adjacentMines += 1
      })
    })
  })
}

const numberColors = [
  'text-gray',
  'text-blue',
  'text-green',
  'text-yellow',
  'text-orange',
  'text-red',
  'text-purple',
  'text-pink',
]

function getBlockClass(block: BlockState) {
  return block.mine
    ? 'bg-red'
    : numberColors[block.adjacentMines]
}

generateMines()
updateNumbers()

function onClick(x, y) {
  alert('Hello World!')
}
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
        <button
          v-for="item, x in raw"
          :key="x"
          w-10 h-10 m="0.5"
          flex items-center justify-center
          hover="bg-gray/10"
          border="1 gray-400/10"
          :class="getBlockClass(item)"
          @click="onClick(x, y )"
        >
          <div v-if="item.mine" i-mdi-mine />
          <div v-else>
            {{ item.adjacentMines }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
