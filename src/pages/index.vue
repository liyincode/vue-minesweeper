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

function getBlockClass(block: BlockState) {
  return block.mine ? 'text-red' : 'text-gray'
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
    <div v-for="raw ,y in state" :key="y">
      <button
        v-for="item, x in raw"
        :key="x"
        w-10 h-10 border
        hover:bg-gray
        :class="getBlockClass(item)"
        @click="onClick(x, y )"
      >
        <!-- {{ item.x }},{{ item.y }} -->
        {{ item.mine ? "x" : item.adjacentMines }}
      </button>
    </div>
  </div>
</template>
