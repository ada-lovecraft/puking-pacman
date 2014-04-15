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
