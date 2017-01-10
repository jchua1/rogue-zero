import random

ROOM_SIZE = 64

class Level:
  def __init__(self, seed):
    random.seed(seed)
    self.generateEnemies()

  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randint(0, 10)):
      self.enemies.append(Enemy())

  def asDict(self):
    ret = {}
    ret['enemies'] = []

    for enemy in self.enemies:
      ret['enemies'].append(enemy.__dict__)
      
    return ret

class Enemy:
  def __init__(self):
    self.x = random.randint(0, ROOM_SIZE)
    self.y = random.randint(0, ROOM_SIZE)
    self.health = random.randint(10, 50)
    self.attack = random.randint(0, 10)
    self.speed = random.randint(0, 20)

  

    
