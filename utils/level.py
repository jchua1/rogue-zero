import random
import math

ROOM_SIZE = 800
GRID_SIZE = 50

class Level:
  def __init__(self, seed):
    random.seed(seed)
    self.generateEnemies()
    self.generatePlayer(10, 10, 10, 0.25,
                        800, 5, 1, 0.5,
                        15, 2.5, math.pi / 2, 1, 2)

  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randint(0, 10)):
      self.enemies.append(Enemy())

  def generatePlayer(self, x, y, health, speed,
                     shootRange, shootSize, shootSpeed, shootDelay,
                     meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    self.player = Player(x, y, health, speed,
                         shootRange, shootSize, shootSpeed, shootDelay,
                         meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay)

  def asDict(self):
    return {
      'player': self.player.asDict(),
      'room': {
        'enemies': [enemy.asDict() for enemy in self.enemies]
      }
    }
    
class Entity(object):
  def __init__(self, x, y, health, speed):
    self.x = x
    self.y = y
    self.health = health
    self.speed = speed

  def asDict(self):
    return self.__dict__

class Enemy(Entity):
  def __init__(self):
    super(Enemy, self).__init__(random.randint(0, ROOM_SIZE),
                                random.randint(0, ROOM_SIZE),
                                random.randint(10, 50),
                                random.randint(0, 20))

class Player(Entity):
  def __init__(self, x, y, health, speed,
               shootRange, shootSize, shootSpeed, shootDelay,
               meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    super(Player, self).__init__(x, y, health, speed)
    self.shootRange = shootRange
    self.shootSize = shootSize
    self.shootSpeed = shootSpeed
    self.shootDelay = shootDelay
    self.meleeRange = meleeRange
    self.meleeWidth = meleeWidth
    self.meleeArc = meleeArc
    self.meleeSpeed = meleeSpeed
    self.meleeDelay = meleeDelay
    

    
