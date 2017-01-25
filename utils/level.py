import random
import math

ROOM_SIZE = 800
GRID_SIZE = 25
TILE_SIZE = ROOM_SIZE / GRID_SIZE

class Level:
  def __init__(self, seed):
    random.seed(seed)
    self.generateEnemies()
    self.generatePlayer(10, 10, 100, 100, 250, 16,
                        5, 800, 5, 1000, 0.5,
                        20, 75, math.pi / 16, math.pi / 2, 10, 1)
    self.generateTiles()
    
  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randint(1, 10)):
      self.enemies.append(Enemy())

  def generatePlayer(self, x, y, health, maxHealth, speed, size,
                     shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
                     meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay):
    self.player = Player(x, y, health, maxHealth, speed, size,
                         shootDamage, shootRange, shootSize, shootSpeed, shootDelay,
                         meleeDamage, meleeRange, meleeWidth, meleeArc, meleeSpeed, meleeDelay)

  def generateTiles(self):
    self.tiles = []

    TILE_SIZE = ROOM_SIZE / GRID_SIZE
    
    for i in range(0, GRID_SIZE):
      row = []
      
      for j in range(0, GRID_SIZE): 
        row.append(Tile(TILE_SIZE * i, TILE_SIZE * j))

      self.tiles.append(row)
      
  def asDict(self):
    return {
      'player': self.player.asDict(),
      'room': {
        'enemies': [enemy.asDict() for enemy in self.enemies],
        'tiles': [[tile.asDict() for tile in row] for row in self.tiles]
      }
    }

class Tile:
  def __init__(self, x, y):
    self.x = x
    self.y = y
    self.generateItem()
    self.generateTerrain()

  def generateTerrain(self):
    rand = random.randint(0, 100)
    
    if rand < 3:
      self.terrainSize = random.randint(TILE_SIZE / 5, TILE_SIZE / 2)
      self.terrain = 'quicksand'
    elif rand < 5:
      self.terrainSize = random.randint(TILE_SIZE * 2 / 5, TILE_SIZE / 2)
      self.terrain = 'pit'
    elif rand < 10:
      self.terrainSize = random.randint(TILE_SIZE / 5, TILE_SIZE / 2)
      self.terrain = 'rock'
    else:
      self.terrainSize = 0
      self.terrain = 'ground'
      
  def generateItem(self):
    names = ['sword', 'gun', 'lasersabre', 'bow', 'save']
    if random.randint(1, 100) < 2: 
      self.item = random.choice(names)
    else:
      self.item = 'empty'

  def asDict(self):
    return self.__dict__
    
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
    
    super(Enemy, self).__init__(random.randint(0, ROOM_SIZE),
                                random.randint(0, ROOM_SIZE),
                                health,
                                health,
                                random.randint(0, 300),
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
    


