import random
import math
import upgrades

ROOM_SIZE = 600
BORDER_SIZE = 50
CANVAS_SIZE = ROOM_SIZE + 2 * BORDER_SIZE

PLAYER_SIZE = 15
DOOR_SIZE = 15
MAX_PITS = 5
MIN_PIT_SIZE = 15
MAX_PIT_SIZE = 50
MAX_PATCHES = 15
MIN_PATCH_SIZE = 25
MAX_PATCH_SIZE = 75
MAX_ROCKS = 10
MIN_ROCK_SIZE = 25
MAX_ROCK_SIZE = 100

MIN_ENEMY_HEALTH = 5
MAX_ENEMY_HEALTH = 50
MIN_ENEMY_SPEED = 15
MAX_ENEMY_SPEED = 100
MIN_ENEMY_ATTACK = 5
MAX_ENEMY_ATTACK = 25

DOOR_POSITIONS = [[0.5 * CANVAS_SIZE, BORDER_SIZE],
                  [CANVAS_SIZE - BORDER_SIZE, 0.5 * CANVAS_SIZE],
                  [0.5 * CANVAS_SIZE, CANVAS_SIZE - BORDER_SIZE],
                  [BORDER_SIZE, 0.5 * CANVAS_SIZE]]

healthLevel= 0
speedLevel= 0
shootDmgLevel=0
shootSpeedLevel=0
meleeDmgLevel=0
meleeRangeLevel=0

class Room:
  def __init__(self, x = 75, y = 75, health = 100):
    # self.generatePlayer(10, 10,
                        # upgrades.health(healthLevel),
                        # upgrades.speed(speedLevel),
                        # 250, PLAYER_SIZE, 500,
                        # upgrades.shootDamage(shootDmgLevel),
                        # 800, 5, 1000,
                        # upgrades.shootSpeed(shootSpeedLevel),
                        # upgrades.meleeDamage(meleeDmgLevel),
                        # upgrades.meleeRange(meleeRangeLevel),
                        # math.pi / 16, math.pi / 2, 10, 1)
    self.generatePlayer(x, y, health, health, 250, PLAYER_SIZE, 0.5,
                        5, 800, 5, 1000, 0.5,
                        20, 75, math.pi / 16, math.pi / 2, 10, 1)
    self.generateEnemies()
    self.generateObstacles()
    self.generateDoors()

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

  def generateDoors(self):
    self.doors = []
    
    for i in range(len(DOOR_POSITIONS)):
      self.doors.append({
        'x': DOOR_POSITIONS[i][0],
        'y': DOOR_POSITIONS[i][1],
        'size': DOOR_SIZE,
        'side': i
      })
    
  def generateObstacles(self):
    self.rocks = []
    self.quicksand = []
    self.pits = []
    
    rocks = random.randrange(MAX_ROCKS)
    quicksand = random.randrange(MAX_PATCHES)
    pits = random.randrange(MAX_PITS)

    for i in range(rocks):
      while True:
        size = random.randrange(MIN_ROCK_SIZE, MAX_ROCK_SIZE)
        x = random.randrange(2 * size + BORDER_SIZE, ROOM_SIZE + BORDER_SIZE - 2 * size)
        y = random.randrange(2 * size + BORDER_SIZE, ROOM_SIZE + BORDER_SIZE - 2 * size)

        test = True

        for rock in self.rocks:
          if (rock['x'] - x) ** 2 + (rock['y'] - y) ** 2 <= (rock['size'] + size + 2 * PLAYER_SIZE) ** 2: 
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
        'x': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE),
        'y': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE),
        'size': random.randrange(MIN_PATCH_SIZE, MAX_PATCH_SIZE),
        'type': 'quicksand'
      })

    for i in range(pits):
      self.pits.append({
        'x': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE),
        'y': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE),
        'size': random.randrange(MIN_PIT_SIZE, MAX_PIT_SIZE),
        'type': 'pit'
      })

  def asDict(self):
    return {
      'player': self.player.asDict(),
      'room': {
        'enemies': [enemy.asDict() for enemy in self.enemies],
        'rocks': self.rocks,
        'quicksand': self.quicksand,
        'pits': self.pits,
        'doors': self.doors
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
    health = random.randrange(MIN_ENEMY_HEALTH, MAX_ENEMY_HEALTH)
    attack = random.randrange(MIN_ENEMY_ATTACK, MAX_ENEMY_ATTACK)
    speed = random.randrange(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED)
    size = health
    
    super(Enemy, self).__init__(random.randrange(BORDER_SIZE + size,
                                                 CANVAS_SIZE - BORDER_SIZE - size),
                                random.randrange(BORDER_SIZE + size,
                                                 CANVAS_SIZE - BORDER_SIZE - size),
                                health, health, speed, size)
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
