
'use strict';
function Menu() {}

var Particle = require('../prefabs/particle');
var emitter;
var pukeSprite;
var pukeLevel;
var pukeWaves;
var pukeTimer;
var waveBMD;
var pacmanBMD;
var pacman;
var waveSprite;
Menu.prototype = {
  preload: function() {

  },
  create: function() {
    pacmanBMD = this.game.add.bitmapData(100, 100);
    this.createPacman();
    pacman = this.game.add.sprite(100, 100, pacmanBMD);
    pacman.anchor.setTo(0.5, 0.5);
    pacman.angle = 22;

    emitter = this.game.add.emitter(110, 103, 100);
    emitter.particleClass = Particle;
    emitter.makeParticles('yellowBlock',0,1000, true, true);

    emitter.lifespan = 0;
    emitter.setAlpha(0.3, 1);
    emitter.setScale(1, 2, 1, 2, 6000, Phaser.Easing.Quintic.Out);
    emitter.setXSpeed(50,100);
    emitter.setYSpeed(0,20);
    emitter.enableBody = true;

    emitter.particleDrag = new Phaser.Point(25,0);
    emitter.physicsBodyType = Phaser.Physics.ARCADE;
    emitter.setAll('body.bounce.x', 1);
    emitter.setAll('body.bounce.y',1);
    emitter.start(false, 0,50);
    pukeSprite = this.game.add.sprite(0, this.game.height + 4, this.game.cache.getBitmapData('yellowBlock'));
    pukeSprite.anchor.setTo(0,1);

    pukeLevel = this.game.add.sprite(0, this.game.height, this.game.cache.getBitmapData('yellowBlock'));
    this.game.physics.arcade.enableBody(pukeLevel);
    pukeLevel.body.immovable = true;


    pukeSprite.width = this.game.width;
    pukeLevel.width = this.game.width;
    this.game.time.events.loop(Phaser.Timer.SECOND, this.updatepukeLevel, this);

    waveBMD = this.game.add.bitmapData(this.game.width * 2, 400);
    this.createWaves();
    waveSprite = this.game.add.tileSprite(0, this.game.height, this.game.width, 400, waveBMD);
    waveSprite.autoScroll(-100, 0);




  },
  updatepukeLevel: function() {
    var totalpukeLevel = 0;
    var totalpukes = 0;
    var avgpukeLevel = 0;

    emitter.forEachExists(function(particle) {
      if(particle.y >= pukeLevel.y) {
        particle.kill();
        particle.collided = false;
      }
    });

    emitter.forEach(function(particle) {
      if(particle.collided && particle.exists) { 
        totalpukeLevel += particle.world.y;
        totalpukes++;
      }
    });
    if(totalpukes >= 10 ) {
      avgpukeLevel = totalpukeLevel / totalpukes;
      
      this.game.add.tween(pukeSprite).to({height: pukeSprite.y - avgpukeLevel}, 500, Phaser.Easing.Linear.BounceInOut, true);
      this.game.add.tween(waveSprite).to({y: avgpukeLevel - 30}, 500, Phaser.Easing.Linear.BounceInOut, true);
      pukeLevel.y = avgpukeLevel + 5;
      
    }
  },
  pukeCollider: function(particle) {
    if(particle.y >= pukeLevel.y * 0.9) {
      particle.collided = true;
    }
  },
  update: function() {
    this.game.physics.arcade.collide(emitter, emitter, null,this.pukeCollider, this);
    this.game.physics.arcade.collide(emitter, pukeLevel);
  },

  createPacman: function() {
    var ctx = pacmanBMD.ctx;
    ctx.beginPath();
    ctx.arc(50, 50, 25, 0.25 * Math.PI, 1.25 * Math.PI, false);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 50, 25, 0.75 * Math.PI, 1.75 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 35, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
    pacmanBMD.render();
  },
  createWaves: function() {
    var ctx = waveBMD.ctx;
    var cw = this.game.width * 2, xh = 40;
    var ox = 0, oy = 20;
    var t_min = 0, t_max = 10*Math.PI;
    var scale = 10, step = 500, inc = t_max/step, x, y;
    ctx.strokeStyle = '#6a8a5b';
    ctx.fillStyle = '#6a8a5b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox+(t_min/t_max)*cw, oy-(scale*Math.cos(t_min)));
    for (var t = t_min; t <= t_max; t += inc){
      y = scale * Math.cos(t);
      x = (t / t_max) * cw;
      ctx.lineTo(ox+x, oy-y);
    }
    ctx.lineTo(cw, xh);
    ctx.lineTo(ox, xh);
    ctx.lineTo(ox, oy);
    ctx.fill();
    ctx.closePath();
  }
};

module.exports = Menu;
