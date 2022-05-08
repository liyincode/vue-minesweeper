<script lang="ts" setup>
interface BlockState {
  x: number
  y: number
  revealed: boolean
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
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
    ),
  ),
)

function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue

      block.mine = Math.random() < 0.3
    }
  }

  updateNumbers()
}

// 计算旁边有多少炸弹💣
function updateNumbers() {
  state.forEach((raw, y) => {
    raw.forEach((block, x) => {
      if (block.mine)
        return
      getSiblings(block).forEach((sibling: BlockState) => {
        if (sibling.mine)
          block.adjacentMines++
      })
    })
  })
}

// 获得某个元素相邻的点
function getSiblings(block: BlockState): BlockState[] {
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      // 判断是否出界了
      if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
        return undefined

      return state[y2][x2]
    })
    .filter(Boolean) as BlockState[]
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
  if (!block.revealed)
    return 'bg-gray-500/10'

  return block.mine
    ? 'bg-red-500/50'
    : numberColors[block.adjacentMines]
}

let mineGenerated = false
const dev = true
function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }

  block.revealed = true
  expandZero(block)
}

function expandZero(block: BlockState) {
  if (block.adjacentMines > 0)
    return

  getSiblings(block)
    .forEach((sibling) => {
      if (!sibling.revealed) {
        sibling.revealed = true
        expandZero(sibling)
      }
    })
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
          v-for="block, x in raw"
          :key="x"
          w-10 h-10 m="0.5"
          flex items-center justify-center
          hover="bg-gray/10"
          border="1 gray-400/10"
          :class="getBlockClass(block)"
          @click="onClick(block)"
        >
          <template v-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine />
            <div v-else>
              {{ block.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
