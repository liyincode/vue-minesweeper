import type { BlockState } from '~/types'
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

export class GamePlay {
  state = ref<BlockState[][]>([])
  mineGenerated = false

  constructor(public width: number, public height: number) {
    this.reset()
  }

  reset() {
    this.mineGenerated = false

    this.state.value = Array.from(
      { length: this.height },
      (_, y) => Array.from(
        { length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
        }),
      ),
    ),
  }

  generateMines(initial: BlockState) {
    for (const row of this.state.value) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1)
          continue
        if (Math.abs(initial.y - block.y) <= 1)
          continue

        block.mine = Math.random() < 0.3
      }
    }

    this.updateNumbers()
  }

  // 计算旁边有多少炸弹💣
  updateNumbers() {
    this.state.value.forEach((raw) => {
      raw.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block).forEach((sibling: BlockState) => {
          if (sibling.mine)
            block.adjacentMines++
        })
      })
    })
  }

  // 获得某个元素相邻的点
  getSiblings(block: BlockState): BlockState[] {
    return directions
      .map(([dx, dy]) => {
        const x2 = block.x + dx
        const y2 = block.y + dy
        // 判断是否出界了
        if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
          return undefined

        return this.state.value[y2][x2]
      })
      .filter(Boolean) as BlockState[]
  }

  onClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.generateMines(block)
      this.mineGenerated = true
    }

    if (block.mine)
      alert('You Cheat!')

    block.revealed = true
    this.expandZero(block)
  }

  expandZero(block: BlockState) {
    if (block.adjacentMines > 0)
      return

    this.getSiblings(block)
      .forEach((sibling) => {
        if (!sibling.revealed) {
          sibling.revealed = true
          this.expandZero(sibling)
        }
      })
  }

  rightClick(block: BlockState) {
    if (block.revealed)
      return

    block.flagged = !block.flagged
  }

  checkGameState() {
    const blocks = this.state.value.flat()

    // 确保每个都被翻开或被标记了
    if (blocks.every(block => block.flagged || block.revealed)) {
      // 如果有一个标记错了就输了
      if (blocks.some(block => block.flagged && !block.mine))
        alert('You cheat!')
      else
        alert('You win!')
    }
  }
}
