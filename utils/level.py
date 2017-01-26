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
  def __init__(self, player = None):
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
    if player:
      self.player = Player(player)
    else:
      self.generatePlayer(75, 75, 100, 100, 250, PLAYER_SIZE, 0.5,
                          5, 800, 5, 1000, 0.5,
                          20, 75, math.pi / 16, math.pi / 2, 10, 1)
    self.generateEnemies()
    self.generateObstacles()
    self.generateDoors()

  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randrange(MIN_ENEMIES, MAX_ENEMIES + 1)):
      self.enemies.append(Enemy())

  def generatePlayer(self, x, y, health, maxHealth, speed, size, switchDelay,
                     shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
                     meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    self.player = Player({
      'x': x,
      'y': y,
      'health': health,
      'maxHealth': maxHealth,
      'speed': speed,
      'size': size,
      'switchDelay': switchDelay,
      'shootDamage': shootDamage,
      'shootRange': shootRange,
      'shootSize': shootSize,
      'shootSpeed': shootSpeed,
      'shootDelay': shootDelay,
      'meleeDamage': meleeDamage,
      'meleeRange': meleeRange,
      'meleeWidth': meleeWidth,
      'meleeArc': meleeArc,
      'meleeSpeed': meleeSpeed,
      'meleeDelay': meleeDelay
    })

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
        size = random.randrange(MIN_ROCK_SIZE, MAX_ROCK_SIZE + 1)
        x = random.randrange(2 * size + BORDER_SIZE, ROOM_SIZE + BORDER_SIZE - 2 * size + 1)
        y = random.randrange(2 * size + BORDER_SIZE, ROOM_SIZE + BORDER_SIZE - 2 * size + 1)

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
        'x': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1),
        'y': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1),
        'size': random.randrange(MIN_PATCH_SIZE, MAX_PATCH_SIZE + 1),
        'type': 'quicksand'
      })

    for i in range(pits):
      self.pits.append({
        'x': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1),
        'y': random.randrange(BORDER_SIZE, CANVAS_SIZE - BORDER_SIZE + 1),
        'size': random.randrange(MIN_PIT_SIZE, MAX_PIT_SIZE + 1),
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
  def __init__(self, player):
    super(Player, self).__init__(player['x'], player['y'],
                                 player['health'], player['maxHealth'],
                                 player['speed'], player['size'])
    self.switchDelay = player['switchDelay']
    self.shootDamage = player['shootDamage']
    self.shootRange = player['shootRange']
    self.shootSize = player['shootSize']
    self.shootSpeed = player['shootSpeed']
    self.shootDelay = player['shootDelay']
    self.meleeDamage = player['meleeDamage']
    self.meleeRange = player['meleeRange']
    self.meleeWidth = player['meleeWidth']
    self.meleeArc = player['meleeArc']
    self.meleeSpeed = player['meleeSpeed']
    self.meleeDelay = player['meleeDelay']
    self.weapons = ['gun', 'sword']
    self.currentWeapon = 0

