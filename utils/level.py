import random

ROOM_SIZE = 640


class Level:
  def __init__(self, seed):
    random.seed(seed)
    self.generateEnemies()
    self.generatePlayer()

  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randint(0, 10)):
      self.enemies.append(Enemy())

  def generatePlayer(self):
    self.player = Player()

  def asDict(self):
    level = {
      'player': self.player.asDict(),
      'room': {
        'enemies': [enemy.asDict() for enemy in self.enemies]
      }
    }
      
    return level

class Entity(object):
  def __init__(self, x, y, health, attack, speed):
    self.x = x
    self.y = y
    self.health = health
    self.attack = attack
    self.speed = speed

  def asDict(self):
    return self.__dict__

class Enemy(Entity):
  def __init__(self):
    super(Enemy, self).__init__(random.randint(0, ROOM_SIZE),
                                random.randint(0, ROOM_SIZE),
                                random.randint(10, 50),
                                random.randint(0, 10),
                                random.randint(0, 20))

class Player(Entity):
  def __init__(self):
    super(Player, self).__init__(10, 10, 10, 10, 0.25)
    self.projectileSpeed = 1
    self.shotDelay = 0.5
    

    
