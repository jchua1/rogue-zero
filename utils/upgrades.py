##no actual values yet. all place holders

def health(level):
	return 100+ level * 10;
	
def speed(level):
	return 250 + level * 5;
	
def shootDamage(level):
	return 5 + level * 1;

def shootSpeed(level):
	return 1000 + level * 100;

def meleeDamage(level):
	return 20 + level * 3;
	
def meleeRange(level):
	return 75 + level * 2; 

def cost(level):
	return 500 * math.pow(2, level);