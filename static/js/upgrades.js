var health = document.getElementById("a");
var speed = document.getElementById("b");
var attackSpeed = document.getElementById("c");
var shootDamage = document.getElementById("d");
var meleeDamage = document.getElementById("e");
var meleeSize = document.getElementById("f");

console.log(exp)

var healthCount = "global";
var speedCount = "global";
var attackSpeedCount = "global";
var shootDamageCount = "global";
var meleeDamageCount= "global";
var meleeSizeCount = "global";


health.addEventListener("mouseover", function(e){
	health.style.border="thick solid green"
});
health.addEventListener("mouseout", function(e){
	health.style.border="none"
});
health.addEventListener("click", function(e){
	healthCount += 1;
});

speed.addEventListener("mouseover", function(e){
	speed.style.border="thick solid green"
});
speed.addEventListener("mouseout", function(e){
	speed.style.border="none"
});
speed.addEventListener("click", function(e){
	speedCount += 1;
});

attackSpeed.addEventListener("mouseover", function(e){
	attackSpeed.style.border="thick solid green"
});
attackSpeed.addEventListener("mouseout", function(e){
	attackSpeed.style.border="none"
});
attackSpeed.addEventListener("click", function(e){
	attackSpeedCount += 1;
});

shootDamage.addEventListener("mouseover", function(e){
	shootDamage.style.border="thick solid green"
});
shootDamage.addEventListener("mouseout", function(e){
	shootDamage.style.border="none"
});
shootDamage.addEventListener("click", function(e){
	shootDamageCount += 1;
});

meleeDamage.addEventListener("mouseover", function(e){
	meleeDamage.style.border="thick solid green"
});
meleeDamage.addEventListener("mouseout", function(e){
	meleeDamage.style.border="none"
});
meleeDamage.addEventListener("click", function(e){
	meleeDamageCount += 1;
});

meleeSize.addEventListener("mouseover", function(e){
	meleeSize.style.border="thick solid green"
});
meleeSize.addEventListener("mouseout", function(e){
	meleeSize.style.border="none"
});
meleeSize.addEventListener("click", function(e){
	meleeSizeCount += 1;
});

