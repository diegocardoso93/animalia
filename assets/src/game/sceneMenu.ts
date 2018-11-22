
export class SceneMenu extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

  constructor() {
    super({
      key: "SceneMenu"
    })
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    )
  }

  preload(): void {
    this.load.bitmapFont(
      "gameFont",
      "fonts/gameFont.png",
      "fonts/gameFont.fnt"
    )
    this.load.image("leaf", "images/leaf.png")
    this.load.image("insect", "images/insect.png")
    this.load.image("insect2", "images/insect2.png")
    this.load.image("frog", "images/frog.png")
    this.load.image("snake", "images/snake.png")
    this.load.image("awk", "images/awk.png")
  }

  create(): void {
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 58,
        this.sys.canvas.height / 2 - 10,
        "gameFont",
        "Press S to PLAY",
        8
      )
    )

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 120,
        this.sys.canvas.height / 2 - 60,
        "gameFont",
        "A N I M A L I A",
        16
      )
    )
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start("SceneGame")
    }
  }
}
