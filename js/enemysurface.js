var surfaceList=[];
const SURFACE_ENEMY_DIM = 10;
const SURFACE_ENEMY_FRAMES = 2;

function spawnSurfaceEnemies() {
	surfaceList.push({x:201,y:259,frame:Math.floor(Math.random()*SURFACE_ENEMY_FRAMES)});
	surfaceList.push({x:110,y:592,frame:Math.floor(Math.random()*SURFACE_ENEMY_FRAMES)});
	surfaceList.push({x:58,y:744,frame:Math.floor(Math.random()*SURFACE_ENEMY_FRAMES)});
	surfaceList.push({x:201,y:831,frame:Math.floor(Math.random()*SURFACE_ENEMY_FRAMES)});
}

function drawSurfaceEnemies() {
	for(var e=0;e<surfaceList.length;e++) {
		drawAnimFrame("turret",surfaceList[e].x,surfaceList[e].y+bgDrawY, surfaceList[e].frame, SURFACE_ENEMY_DIM,SURFACE_ENEMY_DIM);
	}
}

function moveSurfaceEnemies() {
	for(var e=0;e<surfaceList.length;e++) {
		if(surfaceList[e].y>GAME_H) {
			surfaceList[e].readyToRemove = true;
		}
	}
}


function animateSurfaceEnemies() {
	for(var e=0;e<surfaceList.length;e++) {
		if(++surfaceList[e].frame>=SURFACE_ENEMY_FRAMES) {
			surfaceList[e].frame = 0;
		}
	}
}