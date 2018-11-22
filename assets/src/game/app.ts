/// <reference path="../phoenix.d.ts"/>
/// <reference path="../phaser.d.ts"/>

import "phaser"

import { Game } from "./game"
import { Socket } from "phoenix"

import { SceneMenu } from "./sceneMenu"
import { SceneGame } from "./sceneGame"

declare var window

class gameBootstrap {
  private config = {
    title: "Animalia",
    version: "1.0",
    width: 1200,
    height: 760,
    zoom: 3,
    type: Phaser.AUTO,
    parent: "game",
    scene: [SceneMenu, SceneGame],
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
      gamepad: true
    },
    backgroundColor: "#cdf7f6",
    pixelArt: true,
    antialias: false
  }
  private game: Game
  private socket: Socket

  constructor() {
    this.game = new Game(this.config)
    this.socket = new Socket("/socket", {params: {token: window.userToken}})
    this.game.init(this.socket)
  }
}

new gameBootstrap()


