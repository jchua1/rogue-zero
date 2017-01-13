import random

ROOM_SIZE = 800

class Level:
  def __init__(self, seed):
    random.seed(seed)
    self.generateEnemies()
    self.generatePlayer(10, 10, 10, 0.25, 1, 0.5)

  def generateEnemies(self):
    self.enemies = []

    for i in range(random.randint(0, 10)):
      self.enemies.append(Enemy())

  def generatePlayer(self, x, y, health, speed, projectileSpeed, projectileDelay):
    self.player = Player(x, y, health, speed, projectileSpeed, projectileDelay)

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
  def __init__(self, x, y, health, speed, projectileSpeed, projectileDelay):
    super(Player, self).__init__(x, y, health, speed)
    self.projectileSpeed = projectileSpeed
    self.projectileDelay = projectileDelay
    

    
