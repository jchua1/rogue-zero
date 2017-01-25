import random
import math
import upgrades

ROOM_SIZE = 800
GRID_SIZE = 25
TILE_SIZE = ROOM_SIZE / GRID_SIZE

healthLevel= 0
speedLevel= 0
shootDmgLevel=0
shootSpeedLevel=0
meleeDmgLevel=0
meleeRangeLevel=0

class Level:
  def __init__(self, seed):
    random.seed(seed)
    self.generateEnemies()
    self.generatePlayer(10, 10, upgrade.health(healthLevel), upgrade.speed(speedLevel), 250, 16,
                        upgrade.shootDamage(shootDmgLevel), 800, 5, 1000, uppgrade.shootSpeed(shootSpeedLevel),
                        upgrade.meleeDamage(meleeDmgLevel), upgrade.meleeRange(meleeRangeLevel), math.pi / 16, math.pi / 2, 10, 1)
    self.generateObstacles()

    
  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randrange(10)):
      self.enemies.append(Enemy())

  def generatePlayer(self, x, y, health, maxHealth, speed, size,
                     shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
                     meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    self.player = Player(x, y, health, maxHealth, speed, size,
                         shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
                         meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay)

  def generateObstacles(self):
    self.rocks = []
    self.quicksand = []
    self.pits = []
    
    rocks = random.randrange(10)
    quicksand = random.randrange(15)
    pits = random.randrange(5)

    for i in range(rocks):
      self.rocks.append({
        'x': random.random() * ROOM_SIZE,
        'y': random.random() * ROOM_SIZE,
        'size': random.random() * 75 + 25,
        'type': 'rock'
      })

    for i in range(quicksand):
      self.quicksand.append({
        'x': random.random() * ROOM_SIZE,
        'y': random.random() * ROOM_SIZE,
        'size': random.random() * 50 + 25,
        'type': 'quicksand'
      })

    for i in range(pits):
      self.pits.append({
        'x': random.random() * ROOM_SIZE,
        'y': random.random() * ROOM_SIZE,
        'size': random.random() * 15 + 5,
        'type': 'pit'
      })

  def asDict(self):
    return {
      'player': self.player.asDict(),
      'room': {
        'enemies': [enemy.asDict() for enemy in self.enemies],
        'rocks': self.rocks,
        'quicksand': self.quicksand,
        'pits': self.pits
      }
    }

class Entity(object):
  def __init__(self, x, y, health, maxHealth, speed, size):
    self.x = x
    self.y = y
    self.health = health
    self.maxHealth = maxHealth
    self.speed = speed
    self.size = size

  def asDict(self):
    return self.__dict__

class Enemy(Entity):
  def __init__(self):
    health = random.randint(10, 50)
    attack = random.randint(4, 32)
    
    super(Enemy, self).__init__(random.random() * ROOM_SIZE,
                                random.random() * ROOM_SIZE,
                                health,
                                health,
                                random.randrange(300),
                                attack)
    self.attack = attack

class Player(Entity):
  def __init__(self, x, y, health, maxHealth, speed, size,
               shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
               meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    super(Player, self).__init__(x, y, health, maxHealth, speed, size)
    self.shootDamage = shootDamage
    self.shootRange = shootRange
    self.shootSize = shootSize
    self.shootSpeed = shootSpeed
    self.shootDelay = shootDelay
    self.meleeDamage = meleeDamage
    self.meleeRange = meleeRange
    self.meleeWidth = meleeWidth
    self.meleeArc = meleeArc
    self.meleeSpeed = meleeSpeed
    self.meleeDelay = meleeDelay
    


