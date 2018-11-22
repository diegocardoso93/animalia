
import { Leaf } from "./leaf"
import { Player } from "./player"
import { Channels } from "./channels"

export class GameScene extends Phaser.Scene {
  private fieldSize: number
  private gameHeight: number
  private gameWidth: number
  private tick: number

  private player: Player
  private leaf: Leaf
  private gameBorder: Phaser.GameObjects.Graphics[]
  private players: Player[] = []

  constructor() {
    super({
      key: "GameScene"
    })
  }

  init(): void {
    this.fieldSize = 8
    this.gameHeight = 760
    this.gameWidth = 1200
    this.tick = 0
  }

  create(): void {
    this.gameBorder = []
    let i = 0
    for (let x = 0; x < this.gameWidth / this.fieldSize; x++) {
      for (let y = 0; y < this.gameHeight / this.fieldSize; y++) {
        if (
          y === 0 ||
          y === this.gameHeight / this.fieldSize - 1 ||
          x === 0 ||
          x === this.gameWidth / this.fieldSize - 1
        ) {
          this.gameBorder[i] = this.add
            .graphics({
              x: -this.fieldSize + x * this.fieldSize,
              y: -this.fieldSize + y * this.fieldSize,
              fillStyle: { color: 0x61e85b, alpha: 0.3 }
            })
            .fillRect(
              this.fieldSize,
              this.fieldSize,
              this.fieldSize,
              this.fieldSize
            )
          i++
        }
      }
    }

    this.player = new Player(this, true)

    Channels.joinChannel(this.game.channel, (response) => {
      console.log("Joined successfully")
      for (let [id, player] of Object.entries(response.players)) {
        this.players[id] = new Player(this)
        this.players[id].updateFromObject(player)
      }
      this.leaf = new Leaf(this, {
        x: response.leaf.x,
        y: response.leaf.y
      })
    })

    this.game.channel.on("player:joined", (player) => {
      this.players[player.id] = new Player(this)
      this.players[player.id].updateFromObject(player)
    })
    this.game.channel.on("player:position", (player) => {
      // console.log(player)
      if (player.id == this.game.playerId) {
        this.player.updateScore(player.score)
      } else {
        this.players[player.id].updateFromObject(player)
      }
    })
    this.game.channel.on("player:disconnect", (player) => {
      this.players[player.id].destroy()
    })
    this.game.channel.on("player:remove", (player) => {
      if (player.id == this.game.playerId) {
        this.player.destroy()
      } else {
        this.players[player.id].destroy()
      }
    })
    this.game.channel.on("leaf:position", (leaf) => {
      this.leaf.newLeafPosition(leaf.x, leaf.y)
    })
  }

  update(time): void {
    if (this.tick === 0) {
      this.tick = time
    }
    if (!this.player.isDead()) {
      if (time - this.tick > this.player.speedFactor) {
        this.player.move()
        this.tick = time
      }
      this.player.handleInput()
    } else {
      this.scene.start("MainMenuScene")
    }
  }
}
