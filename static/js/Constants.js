function Constants() {
	throw new Error('Constants should not be instantiated!');
}

Constants.ROOM_SIZE = 600;
Constants.BORDER_SIZE = 50;
Constants.CANVAS_SIZE = Constants.ROOM_SIZE + 2 * Constants.BORDER_SIZE;

Constants.BACKGROUND_BORDER = 'black';
Constants.BACKGROUND_COLOR = 'white';

Constants.PLAYER_COLOR = '#00AA00';
Constants.PLAYER_INVINCIBLE = '#ffe991';

Constants.ENEMY_COLOR = 'red';

Constants.PROJECTILE_COLOR = 'black';

Constants.MELEE_COLOR = '#e6f7ff';

Constants.HEALTH_HEIGHT = 8;

Constants.GROUND_COLOR = '#d9c8bf';
Constants.ROCK_COLOR = 'grey';
Constants.PIT_COLOR = 'black';
Constants.QUICKSAND_COLOR = '#ffbf80';

Constants.PLAYER_QUICKSAND_MODIFIER = 0.2;
Constants.ENEMY_QUICKSAND_MODIFIER = 0.5;
