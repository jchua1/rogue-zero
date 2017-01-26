var health = document.getElementById("a");
var speed = document.getElementById("b");
var attackSpeed = document.getElementById("c");
var shootDamage = document.getElementById("d");
var meleeDamage = document.getElementById("e");
var meleeSize = document.getElementById("f");

var exp = Number(document.getElementById("exp").innerHTML);
var healthCost= Number(document.getElementById("acost").innerHTML);
var speedCost= Number(document.getElementById("bcost").innerHTML);
var attackSpeedCost= Number(document.getElementById("ccost").innerHTML);
var shootDamageCost= Number(document.getElementById("dcost").innerHTML);
var meleeDamageCost= Number(document.getElementById("ecost").innerHTML);
var meleeSizeCost= Number(document.getElementById("fcost").innerHTML);

var upgradeSent = {
	toBeSent: list
};



///////////stuff that should be passed to python//////////////
var healthCount = "global";
var speedCount = "global";
var attackSpeedCount = "global";
var shootDamageCount = "global";
var meleeDamageCount= "global";
var meleeSizeCount = "global";
var totalCost= "global";
var list= [healthCount, speedCount, attackSpeedCount, shootDamageCount, meleeDamageCount, meleeDamageCount, meleeSizeCount, totalCost];
////////////////////////////////////////////////////////////

var socket=io.connect("127.0.0.1:5000");
$("#confirm").click(function(){
    socket.emit('upgradePlayer', upgradeSent)
});


///////////////////////////////////////////////////////////////
health.addEventListener("mouseover", function(e){
	if( exp > healthCost){
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
	if( exp > healthCost){
		healthCount += 1;
		totalCost += healthCost;
	}
});

speed.addEventListener("mouseover", function(e){
	if( exp > speedCost){
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
	if( exp > speedCost){
		speedCount += 1;
		totalCost += speedCost;
	}
});

attackSpeed.addEventListener("mouseover", function(e){
	if( exp > attackSpeedCost){
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
	if( exp > attackSpeedCost){
		attackSpeed += 1;
		totalCost += attackSpeedCost;
	}
});

shootDamage.addEventListener("mouseover", function(e){
	if( exp > shootDamageCost){
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
	if( exp > shootDamageCost){
		shootDamage += 1;
		totalCost += shootDamageCost;
	}
});

meleeDamage.addEventListener("mouseover", function(e){
	if( exp > meleeDamageCost){
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
	if( exp > meleeDamageCost){
		meleeDamage += 1;
		totalCost += meleeDamageCost;
	}
});

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
		meleeDamage += 1;
		totalCost += meleeSizeCost;
	}
});
