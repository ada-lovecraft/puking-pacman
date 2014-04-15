(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'peeing-pacman');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
'use strict';

var Particle = function(game, x, y, bitmapKey) {
  Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData(bitmapKey));
};

Particle.prototype = Object.create(Phaser.Particle.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Particle;

},{}],3:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],4:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],5:[function(require,module,exports){

'use strict';
function Menu() {}

var Particle = require('../prefabs/particle');
var emitter;
var peeSprite;
var peeLevel;
var peeWaves;
var peeTimer;
var waveBMD;
var pacmanBMD;
var pacman;
var waveSprite;
Menu.prototype = {
  preload: function() {

  },
  create: function() {
    emitter = this.game.add.emitter(100, 100, 100);
    emitter.particleClass = Particle;
    emitter.makeParticles('yellowBlock',0,1000, true, true);
    emitter.lifespan = 0;
    emitter.setAlpha(0.3, 1);
    emitter.setScale(1, 2, 1, 2, 6000, Phaser.Easing.Quintic.Out);
    emitter.setXSpeed(50,100);
    emitter.setYSpeed(0,0);
    emitter.enableBody = true;

    emitter.particleDrag = new Phaser.Point(25,0);
    emitter.physicsBodyType = Phaser.Physics.ARCADE;
    emitter.setAll('body.bounce.x', 1);
    emitter.setAll('body.bounce.y',1);
    emitter.start(false, 0,50);
    peeSprite = this.game.add.sprite(0, this.game.height + 4, this.game.cache.getBitmapData('yellowBlock'));
    peeSprite.anchor.setTo(0,1);

    peeLevel = this.game.add.sprite(0, this.game.height, this.game.cache.getBitmapData('yellowBlock'));
    this.game.physics.arcade.enableBody(peeLevel);
    peeLevel.body.immovable = true;


    peeSprite.width = this.game.width;
    peeLevel.width = this.game.width;
    this.game.time.events.loop(Phaser.Timer.SECOND, this.updatePeeLevel, this);

    waveBMD = this.game.add.bitmapData(this.game.width * 2, 400);
    this.createWaves();
    waveSprite = this.game.add.tileSprite(0, this.game.height, this.game.width, 400, waveBMD);
    waveSprite.autoScroll(-100, 0);

    pacmanBMD = this.game.add.bitmapData(100, 100);
    this.createPacman();
    pacman = this.game.add.sprite(100, 100, pacmanBMD);
    pacman.anchor.setTo(0.5, 0.5);
    pacman.angle = 22;


  },
  updatePeeLevel: function() {
    var totalPeeLevel = 0;
    var totalPees = 0;
    var avgPeeLevel = 0;

    emitter.forEachExists(function(particle) {
      if(particle.y >= peeLevel.y) {
        particle.kill();
        particle.collided = false;
      }
    });

    emitter.forEach(function(particle) {
      if(particle.collided && particle.exists) { 
        totalPeeLevel += particle.world.y;
        totalPees++;
      }
    });
    if(totalPees >= 10 ) {
      avgPeeLevel = totalPeeLevel / totalPees;
      
      this.game.add.tween(peeSprite).to({height: peeSprite.y - avgPeeLevel}, 500, Phaser.Easing.Linear.BounceInOut, true);
      this.game.add.tween(waveSprite).to({y: avgPeeLevel - 30}, 500, Phaser.Easing.Linear.BounceInOut, true);
      peeLevel.y = avgPeeLevel + 5;
      
    }
  },
  peeCollider: function(particle) {
    if(particle.y >= peeLevel.y * 0.9) {
      particle.collided = true;
    }
  },
  update: function() {
    this.game.physics.arcade.collide(emitter, emitter, null,this.peeCollider, this);
    this.game.physics.arcade.collide(emitter, peeLevel);
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
    ctx.strokeStyle = '#e4c915';
    ctx.fillStyle = '#e4c915';
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

},{"../prefabs/particle":2}],6:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;
},{}],7:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');

    var bmd = this.game.add.bitmapData(4,4);
    bmd.ctx.fillStyle = '#e4c915';
    bmd.ctx.beginPath();
    bmd.ctx.fillRect(0, 0, 4, 4);
    bmd.ctx.closePath();
    this.game.cache.addBitmapData('yellowBlock', bmd);

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])