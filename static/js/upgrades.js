var health = document.getElementById("a");
var speed = document.getElementById("b");
var attackSpeed = document.getElementById("c");
var shootDamage = document.getElementById("d");
var meleeDamage = document.getElementById("e");
var meleeSize = document.getElementById("f");

var oldHealth = document.getElementById("z").innerHTML;
var oldSpeed = document.getElementById("y").innerHTML;
var oldAttackSpeed = document.getElementById("x").innerHTML;
var oldShootDamage = document.getElementById("w").innerHTML;
var oldMeleeDamage = document.getElementById("v").innerHTML;
var oldMeleeSize = document.getElementById("u").innerHTML;

var exp = document.getElementById("exp").innerHTML;
var healthCost= document.getElementById("acost").innerHTML;
var speedCost= document.getElementById("bcost").innerHTML;
var attackSpeedCost= document.getElementById("ccost").innerHTML;
var shootDamageCost= document.getElementById("dcost").innerHTML;
var meleeDamageCost= document.getElementById("ecost").innerHTML;
var meleeSizeCost= document.getElementById("fcost").innerHTML;

////////////algorithms////////////////
function healthAlg(level):
return 100+ level * 10;

function speedAlg(level):
return 250 + level * 5;

function shootDamageAlg(level):
return 5 + level * 1;

function shootSpeedAlg(level):
return 1000 + level * 100;

function meleeDamageAlg(level):
return 20 + level * 3;

function meleeRangeAlg(level):
return 75 + level * 2; 

function costAlg(level):
return 500 * math.pow(2, level);
////////////////////////////////////////////

///////////stuff that should be passed to python//////////////
var healthCount = 0;
var speedCount = 0;
var attackSpeedCount = 0;
var shootDamageCount = 0;
var meleeDamageCount= 0;
var meleeSizeCount = 0;
var totalCost= 0;
///////////////////////////////////////////////////////////////

//////////////event listeners///////////////////////////////
health.addEventListener("mouseover", function(e){
    if( exp > Number(healthCost)){
	health.style.border="thick solid green"
    }
    else{
	health.style.border="thick solid red"
    }
});
health.addEventListener("mouseout", function(e){
    health.style.border="none"
});
health.addEventListener("click", function(e){
    if( exp > Number(healthCost)){
	oldHealth = healthAlg(healthCount)
	healthCount += 1;
	healthCost = costAlg(healthCount)
	health.innerHTML = healthAlg(healthCount) 
    }
});

/////

speed.addEventListener("mouseover", function(e){
    if( exp > Number(speedCost)){
	speed.style.border="thick solid green"
    }
    else{
	speed.style.border="thick solid red"
    }
});
speed.addEventListener("mouseout", function(e){
    speed.style.border="none"
});
speed.addEventListener("click", function(e){
    if( exp > Number(speedCost)){
	oldSpeed = speedAlg(speedCount)
	speedCount += 1;
	speedCost = costAlg(speedCount)
	speed.innerHTML = speedAlg(speedCount) 
    }
});


//////

attackSpeed.addEventListener("mouseover", function(e){
    if( exp > Number(attackSpeedCost)){
	attackSpeed.style.border="thick solid green"
    }
    else{
	attackSpeed.style.border="thick solid red"
    }
});
attackSpeed.addEventListener("mouseout", function(e){
    attackSpeed.style.border="none"
});
attackSpeed.addEventListener("click", function(e){
    if( exp > Number(attackSpeedCost)){
	oldattackspeed = shootSpeedAlg(attackSpeedCount)
	attackSpeedCount += 1;
	attackSpeedCost = costAlg(attackSpeedCount)
	attackSpeed.innerHTML = shootSpeedAlg(attackSpeedCount) 
    }
});

/////
shootDamage.addEventListener("mouseover", function(e){
    if( exp > Number(shootDamageCost)){
	shootDamage.style.border="thick solid green"
    }
    else{
	shootDamage.style.border="thick solid red"
    }
});
shootDamage.addEventListener("mouseout", function(e){
    shootDamage.style.border="none"
});
shootDamage.addEventListener("click", function(e){
    if( exp > Number(shootDamageCost)){
	oldShootDamage = shootDamageAlg(shootDamageCount)
	shootDamageCount += 1;
	shootDamageCost = costAlg(shootDamageCount)
	shootDamage.innerHTML = shootDamagehAlg(shootDamageCount) 
    }
});

/////

meleeDamage.addEventListener("mouseover", function(e){
    if( exp > Number(meleeDamageCost)){
	meleeDamage.style.border="thick solid green"
    }
    else{
	meleeDamage.style.border="thick solid red"
    }
});
meleeDamage.addEventListener("mouseout", function(e){
    meleeDamage.style.border="none"
});
meleeDamage.addEventListener("click", function(e){
    if( exp > Number(meleeDamageCost)){
	oldMeleeDamage = meleeDamageAlg(meleeDamageCount)
	meleeDamageCount += 1;
	meleeDamageCost = costAlg(meleeDamageCount)
	meleeDamage.innerHTML = meleeDamageAlg(meleeDamageCount) 
    }
});

///////

meleeSize.addEventListener("mouseover", function(e){
    if( exp > meleeDamageCost){
	meleeSize.style.border="thick solid green"
    }
    else{
	meleeSize.style.border="thick solid red"
    }
});
meleeSize.addEventListener("mouseout", function(e){
    meleeSize.style.border="none"
});
meleeSize.addEventListener("click", function(e){
    if( exp > meleeDamageCost){
	oldMeleeSize = meleeSizeAlg(meleeSizeCount)
	meleeSizeCount += 1;
	meleeSizeCost = costAlg(meleeSizeCount)
	meleeSize.innerHTML = meleeSizeAlg(meleeSizeCount) 
    }
});
/////////////////////////////////////////////////////////////////////
