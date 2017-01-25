##no actual values yet. all place holders

def health(level):
	100+ level * 10;
	
def speed(level):
	250 + level * 5;
	
def shootDamage(level):
	5 + level * 1;

def shootSpeed(level):
	1000 + level * 100;

def meleeDamage(level):
	20 + level * 3;
	
def meleeRange(level):
	75 + level * 2; 

def cost (level):
	500 * math.pow(2, level);