
export class Player {
  private id: number
  private dotSize: number
  private direction: string
  private cursors: any
  private dead: boolean
  private playerBody: Phaser.GameObjects.Sprite
  private score = 0
  private scene

  public speedFactor = 20

  public isDead(): boolean {
    return this.dead
  }
  public setDead(_dead): void {
    this.dead = _dead
  }
  public getBody(): Phaser.GameObjects.Sprite {
    return this.playerBody
  }
  public destroy(): void {
    this.playerBody.destroy()
  }

  constructor(scene, currentPlayer = null) {
    this.dotSize = scene.fieldSize
    this.direction = "right"
    this.dead = false
    this.playerBody
    this.scene = scene

    this.cursors = scene.input.keyboard.createCursorKeys()

    this.buildPlayer(scene, currentPlayer)
    this.syncPosition(scene.game.channel)
  }

  private buildPlayer(scene, currentPlayer): void {
    if (currentPlayer)
      this.playerBody = scene.add.sprite(60, 60, "insect")
    else
      this.playerBody = scene.add.sprite(60, 60, "insect2")
  }

  public move(): void {
    if (((this.playerBody.x < 0 && this.direction == "left")
      || (this.playerBody.x > 1200) && this.direction === "right")
      || (this.playerBody.y < 0 && this.direction === "up")
      || (this.playerBody.y > 760 && this.direction === "down"))
      return
    this.updatePosition()
    this.playerBody.emit('position')
  }

  public updatePosition(): void {
    this.playerBody.flipY = false
    if (this.direction === "left") {
      this.playerBody.angle = 180
      this.playerBody.x -= this.dotSize
      this.playerBody.flipY = true
    } else if (this.direction === "right") {
      this.playerBody.angle = 0
      this.playerBody.x += this.dotSize
    } else if (this.direction === "up") {
      this.playerBody.angle = -90
      this.playerBody.y -= this.dotSize
    } else if (this.direction === "down") {
      this.playerBody.angle = 90
      this.playerBody.y += this.dotSize
    }
  }

  public handleInput(): void {
    if (this.cursors.up.isDown) {
      this.direction = "up"
    } else if (this.cursors.down.isDown) {
      this.direction = "down"
    } else if (this.cursors.right.isDown) {
      this.direction = "right"
    } else if (this.cursors.left.isDown) {
      this.direction = "left"
    }
  }

  public updateFromObject(obj): void {
    this.playerBody.x = obj.x
    this.playerBody.y = obj.y
    this.direction = obj.direction
    this.score = obj.score
    this.updatePosition()
    this.verifyPolymorph()
  }

  public updateScore(score) {
    this.score = score
    this.scene.scoreText.setText(score)
    this.verifyPolymorph()
  }

  public verifyPolymorph() {
    if (this.score > 6) {
      this.playerBody.setTexture('awk')
      this.speedFactor = 12
    } else if (this.score > 4) {
      this.playerBody.setTexture('snake')
      this.speedFactor = 14
    } else if (this.score > 2) {
      this.playerBody.setTexture('frog')
      this.speedFactor = 16
    }
  }

  private syncPosition(channel) {
    this.playerBody.on("position", () => {
      const message = {
        x: this.playerBody.x,
        y: this.playerBody.y,
        direction: this.direction,
        score: this.score
      }
      channel.push("player:move", message)
    })
  }
}
