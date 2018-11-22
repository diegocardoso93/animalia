
export class Game extends Phaser.Game {

  public channel: any;
  public playerId: any;

  constructor(config: GameConfig) {
    super(config);
  }

  init(socket) {
    this.playerId = new Date().getTime()
    socket.connect({user_id: this.playerId})

    this.channel = socket.channel("games:lobby", {})
  }
}
