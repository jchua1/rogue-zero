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
MIN_ENEMIES = 0
MAX_ENEMIES = 10

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
  def __init__(self, x = 75, y = 75, health = 100, maxHealth = 100):
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
    self.generatePlayer(x, y, health, maxHealth, 250, PLAYER_SIZE, 0.5,
                        5, 800, 5, 1000, 0.5,
                        20, 75, math.pi / 16, math.pi / 2, 10, 1)
    self.generateEnemies()
    self.generateDoors()
    self.generateObstacles()

  def generateEnemies(self):
    self.enemies = []


    for i in range(random.randrange(MIN_ENEMIES, MAX_ENEMIES + 1)):
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
        'side': i,
        'link': -1
      })
    
  def generateObstacles(self):
    self.rocks = []
    self.quicksand = []
    self.pits = []
    
    rocks = random.randrange(MAX_ROCKS + 1)
    quicksand = random.randrange(MAX_PATCHES + 1)
    pits = random.randrange(MAX_PITS + 1)

    for i in range(rocks):
      while True:
        rock_size = random.randrange(MIN_ROCK_SIZE, MAX_ROCK_SIZE + 1)
        rock_x = random.randrange(2 * rock_size + BORDER_SIZE, ROOM_SIZE + BORDER_SIZE - 2 * rock_size + 1)
        rock_y = random.randrange(2 * rock_size + BORDER_SIZE, ROOM_SIZE + BORDER_SIZE - 2 * rock_size + 1)

        test = True

        for rock in self.rocks:
          if (rock['x'] - rock_x) ** 2 + (rock['y'] - rock_y) ** 2 <= (rock['size'] + rock_size + PLAYER_SIZE) ** 2:
            test = False
            break

        if (rock_x - self.player.x) ** 2 + (rock_y - self.player.y) ** 2 <= (rock_size + self.player.size) ** 2:
          test = False

        for door in DOOR_POSITIONS:
          if (rock_x - door[0]) ** 2 + (rock_y - door[1]) ** 2 <= (rock_size + DOOR_SIZE) ** 2:
            test = False
            break

        if test:
          self.rocks.append({
            'x': rock_x,
            'y': rock_y,
            'size': rock_size,
            'type': 'rock'
          })

          break

    for i in range(quicksand):
      while True:
        patch_size = random.randrange(MIN_PATCH_SIZE, MAX_PATCH_SIZE + 1)
        patch_x = random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1)
        patch_y = random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1)

        test = True

        if (patch_x - self.player.x) ** 2 + (patch_y - self.player.y) ** 2 <= (patch_size +  self.player.size) ** 2:
          test = False

        for door in DOOR_POSITIONS:
          if (patch_x - door[0]) ** 2 + (patch_y - door[1]) ** 2 <= (patch_size + 2 * DOOR_SIZE) ** 2:
            test = False
            break
            
        if test:
          self.quicksand.append({
            'x': patch_x,
            'y': patch_y,
            'size': patch_size,
            'type': 'quicksand'
          })

          break

    for i in range(pits):
      while True:
        pit_size = random.randrange(MIN_PIT_SIZE, MAX_PIT_SIZE + 1)
        pit_x = random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1)
        pit_y = random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1)

        test = True

        if (pit_x - self.player.x) ** 2 + (pit_y - self.player.y) ** 2 <= (pit_size + self.player.size) ** 2:
          test = False

        for door in DOOR_POSITIONS:
          if (pit_x - door[0]) ** 2 + (pit_y - door[1]) ** 2 <= (pit_size + DOOR_SIZE) ** 2:
            test = False
            break
            
        if test:
          self.pits.append({
            'x': pit_x,
            'y': pit_y,
            'size': pit_size,
            'type': 'pit'
          })

          break

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
    health = random.randrange(MIN_ENEMY_HEALTH, MAX_ENEMY_HEALTH + 1)
    attack = random.randrange(MIN_ENEMY_ATTACK, MAX_ENEMY_ATTACK + 1)
    speed = random.randrange(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED + 1)
    size = health
    
    super(Enemy, self).__init__(random.randrange(BORDER_SIZE + size,
                                                 CANVAS_SIZE - BORDER_SIZE - size + 1),
                                random.randrange(BORDER_SIZE + size,
                                                 CANVAS_SIZE - BORDER_SIZE - size + 1),
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
