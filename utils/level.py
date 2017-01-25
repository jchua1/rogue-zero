import random
import math

ROOM_SIZE = 800
GRID_SIZE = 25
TILE_SIZE = ROOM_SIZE / GRID_SIZE

class Level:
  def __init__(self, seed):
    random.seed(seed)
    self.generateEnemies()
    self.generatePlayer(10, 10, 100, 100, 250, 16, 1,
                        5, 800, 5, 1000, 0.5,
                        20, 75, math.pi / 16, math.pi / 2, 10, 1)
    self.generateObstacles()

    
  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randrange(10)):
      self.enemies.append(Enemy())

  def generatePlayer(self, x, y, health, maxHealth, speed, size, switchDelay,
                     shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
                     meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    self.player = Player(x, y, health, maxHealth, speed, size, switchDelay,
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
      while True:
        size = random.randrange(25, 100)
        x = random.randrange(2 * size, ROOM_SIZE - 2 * size)
        y = random.randrange(2 * size, ROOM_SIZE - 2 * size)

        test = True

        for rock in self.rocks:
          if (rock['x'] - x) ** 2 + (rock['y'] - y) ** 2 <= (rock['size'] + size + 32) ** 2: 
            print 'Collided with rock'
            test = False
            break

        if test:
          self.rocks.append({
            'x': x,
            'y': y,
            'size': size,
            'type': 'rock'
          })

          break

    for i in range(quicksand):
      self.quicksand.append({
        'x': random.randrange(ROOM_SIZE),
        'y': random.randrange(ROOM_SIZE),
        'size': random.randrange(25, 75),
        'type': 'quicksand'
      })

    for i in range(pits):
      self.pits.append({
        'x': random.randrange(ROOM_SIZE),
        'y': random.randrange(ROOM_SIZE),
        'size': random.randrange(5, 25),
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
  def __init__(self, x, y, health, maxHealth, speed, size, switchDelay,
               shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
               meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    super(Player, self).__init__(x, y, health, maxHealth, speed, size)
    self.switchDelay = switchDelay
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

