
export class Leaf extends Phaser.GameObjects.Graphics {
  constructor(scene, params) {
    super(scene, params);
    this.x = params.x;
    this.y = params.y;
    this.body = scene.add.sprite(this.x, this.y, 'leaf');
    scene.add.existing(this.body);
  }

  public newLeafPosition(_rndX, _rndY): void {
    this.x = _rndX;
    this.y = _rndY;
    this.body.x = _rndX;
    this.body.y = _rndY;
  }
}
