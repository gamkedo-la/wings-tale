const ENEMY_BUG = 0;
const ENEMY_SWOOP = 1;
const ENEMY_STALL_CHASE = 2;
const ENEMY_SHOCK = 3;
const ENEMY_AZMO = 4;
const ENEMY_DIMO = 5;
const ENEMY_SMALLALIEN = 6;
const ENEMY_FIRESNAKE = 7;
const ENEMY_FIREBIRD = 8;
const ENEMY_KINDS = 9;
var enemySpawnDebugColor = ["lime","yellow","cyan","pink", "orange", "white", "black", "red"];
var enemyEditorToPattern = [ // string used by level editor to show the graphic in spawn volumes
		"bug", // ENEMY_BUG
		"swoop", // ENEMY_SWOOP 
		"stallchase", // ENEMY_STALL_CHASE
		"shockball", // ENEMY_SHOCK
		"azmo",	//ENEMY_AZMO
		"dimo",	//ENEMY_DIM
		"smallalien",	//ENEMY_SMALLALIEN
		"fire snake",	//ENEMY_FIRESNAKE
		"fire bird",	//ENEMY_FIREBIRD
		// note: none needed for ENEMY_KINDS, that const is aENEMY_KINDS clue for editor to wrap cycling type
	];
// replaces strings in the array with usable pattern data for spawn boxes, only call once at start
function createEditorSpawnKindPatterns() {
	for(var i=0;i<ENEMY_KINDS;i++) {
		enemyEditorToPattern[i] = scaledCtx.createPattern(images[enemyEditorToPattern[i]], 'repeat');
	}	
}

const GROUND_KIND_TANK = 0;
const GROUND_KIND_TENTACLE = 1;
const GROUND_KIND_VOLCANO = 2;
const GROUND_KIND_SPACEFROG = 3;
const GROUND_KIND_DEPOT = 4;
const GROUND_KIND_OFFICE = 5;
const GROUND_KIND_FACTORY = 6;
const GROUND_KINDS = 7;

const SPAWN_WITH_NEXT = 0.0;
const NO_DEPTH_LOOKUP_DEFAULT_HEIGHT = 128;
const DEPTH_FOR_UNDERWATER = 3;
const DEPTH_FOR_GROUND = 60;

function depthAt(atX,atY) {
	let w = images[curDepthMap].width;
	let index = (atY>>0) * w + (atX>>0);
	return depthSpawnData?depthSpawnData.data[index*4+1]:NO_DEPTH_LOOKUP_DEFAULT_HEIGHT;
}


var islandSpawnSeq = [{"groundData":[{"groundKind":1,"x":78,"y":2461},{"groundKind":1,"x":38,"y":2203},{"groundKind":1,"x":216,"y":1892},{"groundKind":4,"x":235,"y":2297},{"groundKind":4,"x":147,"y":1439},{"groundKind":4,"x":184,"y":1429},{"groundKind":4,"x":221,"y":1441},{"groundKind":4,"x":184,"y":868},{"groundKind":6,"x":74,"y":1981},{"groundKind":6,"x":123,"y":1020},{"groundKind":6,"x":21,"y":523},{"groundKind":5,"x":23,"y":602},{"groundKind":5,"x":236,"y":599},{"groundKind":1,"x":77,"y":322},{"groundKind":1,"x":179,"y":131},{"groundKind":1,"x":83,"y":47},{"groundKind":1,"x":186,"y":404},{"groundKind":4,"x":133,"y":2672},{"groundKind":6,"x":125,"y":1839}]},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.10599999999999996,"percXMax":0.3228000000000007,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.05876,"kind":0,"driftX":0.010799999999999997,"percXMin":0.6748000000000001,"percXMax":0.8676000000000004,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.5413500000000007,"percXMin":0.12100000000000113,"percXMax":0.3220000000000032,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.10989999999999966,"percXMax":0.11489999999999975,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.8726000000000006,"percXMax":0.8738000000000005,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.045179999999999776,"kind":0,"driftX":-0.5245000000000017,"percXMin":0.6793000000000031,"percXMax":0.8629000000000007,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":-0.12150000000000008,"percXMin":0.16300000000000034,"percXMax":0.33539999999999875,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0.09539999999999826,"percXMin":0.6716000000000013,"percXMax":0.860800000000003,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0.26594999999999946,"percXMin":0.1665999999999995,"percXMax":0.336600000000001,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04084000000000002,"kind":0,"driftX":-0.25379999999999936,"percXMin":0.6859,"percXMax":0.8612999999999987,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04770000000000007,"kind":0,"driftX":0,"percXMin":0.5104000000000002,"percXMax":0.5279999999999994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":1,"driftX":0,"percXMin":0.44650000000000145,"percXMax":0.5967000000000019,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":1,"driftX":-0.2388999999999999,"percXMin":0.437199999999999,"percXMax":0.44800000000000106,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.20250000000000015,"percXMax":0.20730000000000007,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0.01705000000000097,"percXMin":0.8074000000000009,"percXMax":0.8104000000000006,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.029640000000000173,"kind":1,"driftX":0.17505000000000098,"percXMin":0.6001000000000006,"percXMax":0.6078999999999998,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":-0.33210000000000023,"percXMin":0.3784000000000017,"percXMax":0.3784000000000017,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04028,"kind":0,"driftX":0.3334500000000002,"percXMin":0.6333999999999999,"percXMax":0.6333999999999999,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.12625000000000286,"percXMin":0.5515000000000028,"percXMax":0.5587000000000022,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.04510000000000035,"percXMax":0.4004999999999991,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":-0.013500000000000005,"percXMin":0.587299999999999,"percXMax":0.9769000000000004,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":-0.7697500000000006,"percXMin":0.7846000000000004,"percXMax":0.9714000000000005,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0.7620999999999994,"percXMin":0.042100000000000457,"percXMax":0.23790000000000056,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.03748000000000015,"kind":1,"driftX":-0.14714999999999984,"percXMin":0.4684000000000005,"percXMax":0.47160000000000024,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.044620000000000055,"kind":0,"driftX":-0.010800000000000198,"percXMin":0.2125000000000003,"percXMax":0.7899000000000003,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.6018999999999988,"percXMax":0.6036999999999986,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4159000000000023,"percXMax":0.41650000000000237,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.2196999999999999,"percXMax":0.8282999999999994,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4972000000000014,"percXMax":0.5316000000000002,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":1,"driftX":0.13260000000000216,"percXMin":0.6849999999999996,"percXMax":0.6957999999999986,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.03776000000000003,"kind":1,"driftX":-0.10029999999999974,"percXMin":0.32199999999999895,"percXMax":0.34199999999999964,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.49840000000000007,"percXMax":0.5375999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":-0.11610000000000005,"percXMin":0.35050000000000114,"percXMax":0.3673000000000009,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.15794999999999948,"percXMin":0.672400000000001,"percXMax":0.6754000000000013,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.045320000000000055,"kind":1,"driftX":0.0026999999999999997,"percXMin":0.22710000000000102,"percXMax":0.8296999999999984,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.7390000000000011,"percXMax":0.9593999999999993,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0.0027000000000000014,"percXMin":0.060100000000000015,"percXMax":0.3111000000000004,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04420000000000014,"kind":1,"driftX":0.011749999999999653,"percXMin":0.3795999999999971,"percXMax":0.6635999999999979,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0.0027,"percXMin":0.49150000000000166,"percXMax":0.495700000000002,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.14649999999999944,"percXMax":0.14649999999999944,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.3097000000000004,"percXMax":0.31150000000000055,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.8445999999999997,"percXMax":0.8445999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04980000000000024,"kind":0,"driftX":0.00404999999999999,"percXMin":0.6519999999999976,"percXMax":0.6519999999999976,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.2568999999999995,"percXMin":0.40299999999999997,"percXMax":0.5994,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0.015800000000000036,"percXMin":0.06910000000000019,"percXMax":0.30450000000000127,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0.024650000000001202,"percXMin":0.6756000000000032,"percXMax":0.9619999999999963,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.11504000000000042,"kind":0,"driftX":-0.24570000000000014,"percXMin":0.3959999999999987,"percXMax":0.6193999999999983,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.46119999999999967,"percXMax":0.6611999999999992,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4993000000000005,"percXMax":0.7046999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4086999999999998,"percXMax":0.6104999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.012799999999999997,"kind":1,"driftX":0.006899999999999955,"percXMin":0.28980000000000133,"percXMax":0.7618000000000021,"speed":2.5,"wave":25,"ticksBetween":35}];

var spaceSpawnSeq = [{"groundData":[{"groundKind":0,"x":134,"y":2086,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":212,"y":1674,"track":[{"x":0,"y":0},{"x":-34,"y":-2},{"x":12,"y":-53}]},{"groundKind":0,"x":35,"y":1689,"track":[{"x":0,"y":0},{"x":-9,"y":-59},{"x":40,"y":-6}]},{"groundKind":0,"x":184,"y":596,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":131,"y":655,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":49,"y":-50}]},{"groundKind":0,"x":81,"y":595,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":135,"y":529,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":189,"y":471,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":82,"y":470,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":51,"y":-50}]},{"groundKind":0,"x":137,"y":405,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":192,"y":345,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":84,"y":345,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":141,"y":134,"track":[{"x":0,"y":0},{"x":-50,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":195,"y":74,"track":[{"x":0,"y":0},{"x":-50,"y":-49},{"x":50,"y":-49}]},{"groundKind":0,"x":89,"y":74,"track":[{"x":0,"y":0},{"x":-49,"y":-50},{"x":50,"y":-50}]},{"groundKind":0,"x":139,"y":1242,"track":[{"x":0,"y":0},{"x":9,"y":48},{"x":12,"y":-53}]},{"groundKind":0,"x":119,"y":1242,"track":[{"x":0,"y":0},{"x":-11,"y":44},{"x":-11,"y":-53}]}]},{"percDuration":0.05092000000000001,"kind":2,"driftX":0,"percXMin":0.040299999999999954,"percXMax":0.9597000000000001,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":2,"driftX":-0.7941499999999996,"percXMin":0.9214999999999979,"percXMax":0.9552999999999984,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.06414000000000009,"kind":2,"driftX":0.8309499999999994,"percXMin":0.05099999999999987,"percXMax":0.06599999999999964,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.6796000000000005,"percXMax":0.8291999999999998,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.05106000000000006,"kind":0,"driftX":0.0013500000000000005,"percXMin":0.20319999999999974,"percXMax":0.3576000000000021,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.24370000000000022,"percXMax":0.7515,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04150000000000008,"kind":2,"driftX":-0.0013500000000000014,"percXMin":0.06309999999999957,"percXMax":0.9536999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.16570000000000007,"percXMax":0.1675000000000001,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.8533000000000006,"percXMax":0.8533000000000006,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":2,"driftX":0.0026999999999999928,"percXMin":0.6463000000000005,"percXMax":0.6487000000000003,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.0664600000000002,"kind":2,"driftX":-0.0054,"percXMin":0.3753999999999999,"percXMax":0.3778000000000001,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04518000000000004,"kind":5,"driftX":-0.0027000000000000006,"percXMin":0.3732999999999994,"percXMax":0.6602999999999988,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":5,"driftX":0.09279999999999987,"percXMin":0.6951999999999999,"percXMax":0.8880000000000007,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.03859999999999998,"kind":5,"driftX":-0.10935000000000002,"percXMin":0.13749999999999976,"percXMax":0.33209999999999956,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.049520000000000036,"kind":0,"driftX":0.00405,"percXMin":0.40719999999999995,"percXMax":0.6071999999999999,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":5,"driftX":0,"percXMin":0.07239999999999978,"percXMax":0.9276000000000004,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":2,"driftX":-0.48735000000000017,"percXMin":0.5958999999999981,"percXMax":0.5958999999999981,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0.5642999999999999,"percXMin":0.06339999999999962,"percXMax":0.06339999999999962,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":-0.553500000000001,"percXMin":0.9246999999999991,"percXMax":0.938499999999998,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04742000000000008,"kind":2,"driftX":0.46124999999999955,"percXMin":0.4168000000000013,"percXMax":0.4168000000000013,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":-0.008100000000000003,"percXMin":0.11139999999999949,"percXMax":0.11379999999999944,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.046160000000000034,"kind":0,"driftX":-4.336808689942018e-19,"percXMin":0.8748999999999995,"percXMax":0.8748999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":5,"driftX":0,"percXMin":0.6426999999999988,"percXMax":0.8468999999999988,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":5,"driftX":0,"percXMin":0.14979999999999966,"percXMax":0.3678000000000007,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.05246000000000011,"kind":2,"driftX":4.336808689942018e-19,"percXMin":0.5007999999999992,"percXMax":0.5013999999999993,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":2,"driftX":0,"percXMin":0.07809999999999956,"percXMax":0.9363000000000009,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0,"kind":5,"driftX":1.5178830414797062e-17,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.7261000000000011,"percXMax":0.9387000000000012,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.08900000000000009,"kind":0,"driftX":-0.0027,"percXMin":0.08020000000000023,"percXMax":0.26459999999999945,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":5,"driftX":0,"percXMin":0.7287999999999997,"percXMax":0.9479999999999995,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04,"kind":5,"driftX":0,"percXMin":0.0781000000000009,"percXMax":0.2739,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04,"kind":2,"driftX":0,"percXMin":0.04720000000000017,"percXMax":0.9527999999999978,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.09609999999999887,"percXMax":0.11649999999999862,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.050780000000000096,"kind":2,"driftX":0,"percXMin":0.9123999999999974,"percXMax":0.9203999999999991,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.9133000000000003,"percXMax":0.9151000000000001,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.09909999999999981,"percXMax":0.11609999999999981,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.028159999999999928,"kind":5,"driftX":-0.002150000000000621,"percXMin":0.421700000000006,"percXMax":0.647500000000001,"speed":1,"wave":5,"ticksBetween":35}];

var moonSpawnSeq = [{"groundData":[{"groundKind":3,"x":50,"y":2882},{"groundKind":3,"x":210,"y":2883},{"groundKind":3,"x":139,"y":1999},{"groundKind":3,"x":137,"y":1949},{"groundKind":3,"x":110,"y":1275},{"groundKind":3,"x":176,"y":1276},{"groundKind":3,"x":142,"y":1206},{"groundKind":3,"x":62,"y":407},{"groundKind":3,"x":217,"y":403},{"groundKind":3,"x":129,"y":43}]},{"percDuration":0.03585999999999984,"kind":4,"driftX":-0.00030000000000035207,"percXMin":0.5132999999999994,"percXMax":0.5150999999999994,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":4,"driftX":0,"percXMin":0.7094000000000003,"percXMax":0.7100000000000002,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":4,"driftX":0,"percXMin":0.34460000000000185,"percXMax":0.34760000000000196,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.17979999999999993,"percXMax":0.18759999999999996,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04196000000000002,"kind":2,"driftX":0,"percXMin":0.8181999999999989,"percXMax":0.8223999999999985,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.1842999999999999,"percXMax":0.18789999999999984,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.8166999999999993,"percXMax":0.824099999999999,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04924000000000006,"kind":4,"driftX":-0.009449999999999997,"percXMin":0.26470000000000066,"percXMax":0.7591000000000006,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.05036000000000006,"kind":0,"driftX":-0.00135,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":3,"driftX":0,"percXMin":0.3159999999999996,"percXMax":0.7080000000000002,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":3,"driftX":0,"percXMin":0.1473999999999994,"percXMax":0.30300000000000116,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.044620000000000035,"kind":3,"driftX":-0.0054,"percXMin":0.7369999999999973,"percXMax":0.898599999999999,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":2,"driftX":0.2389499999999999,"percXMin":0.6061000000000016,"percXMax":0.6073000000000015,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.532900000000001,"percXMax":0.532900000000001,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.037059999999999975,"kind":2,"driftX":-0.2618999999999999,"percXMin":0.45430000000000087,"percXMax":0.45430000000000087,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.8548,"percXMax":0.8571999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.19869999999999963,"percXMax":0.19869999999999963,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.03524000000000008,"kind":3,"driftX":0.0013499999999999996,"percXMin":0.19430000000000036,"percXMax":0.846700000000001,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.19440000000000018,"percXMin":0.6196000000000002,"percXMax":0.6540000000000009,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.09208000000000037,"kind":0,"driftX":-0.23084999999999994,"percXMin":0.427900000000001,"percXMax":0.46930000000000105,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":4,"driftX":4.336808689942018e-19,"percXMin":0.5437000000000028,"percXMax":0.5437000000000028,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":3,"driftX":0,"percXMin":0.8365,"percXMax":0.8365,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.040560000000000006,"kind":3,"driftX":0,"percXMin":0.25359999999999916,"percXMax":0.2553999999999993,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":3,"driftX":0.00405,"percXMin":0.45670000000000016,"percXMax":0.6345,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":4,"driftX":-0.009449999999999594,"percXMin":0.18010000000000154,"percXMax":0.18010000000000154,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.036739999999999974,"kind":4,"driftX":0.005399999999999065,"percXMin":0.9111999999999981,"percXMax":0.9111999999999981,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":-0.08370000000000004,"percXMin":0.907599999999999,"percXMax":0.9135999999999985,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04084000000000001,"kind":2,"driftX":0.08639999999999988,"percXMin":0.17440000000000008,"percXMax":0.17440000000000008,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":-4.336808689942018e-19,"percXMin":0.27010000000000106,"percXMax":0.27010000000000106,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.804399999999999,"percXMax":0.8387999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":-0.0013499999999999996,"percXMin":0.8238999999999992,"percXMax":0.8238999999999992,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.06198000000000018,"kind":0,"driftX":-0.0027,"percXMin":0.2488000000000008,"percXMax":0.29999999999999943,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":4,"driftX":0,"percXMin":0.5422000000000003,"percXMax":0.5422000000000003,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.7123000000000003,"percXMax":0.8420999999999981,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.24729999999999994,"percXMax":0.3447000000000008,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":4,"driftX":0,"percXMin":0.5407000000000005,"percXMax":0.5407000000000005,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.7120000000000006,"percXMax":0.8400000000000003,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":3,"driftX":0,"percXMin":0.6331000000000009,"percXMax":0.6331000000000009,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":3,"driftX":0,"percXMin":0.4483000000000017,"percXMax":0.4483000000000017,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.2491000000000019,"percXMax":0.3501000000000001,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.07178000000000015,"kind":4,"driftX":-0.0026999999999999997,"percXMin":0.5401000000000011,"percXMax":0.5443000000000007,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.056519999999999994,"kind":0,"driftX":0.0013500000000000022,"percXMin":0.5394999999999996,"percXMax":0.5406999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":4,"driftX":0,"percXMin":0.7930000000000025,"percXMax":0.7930000000000025,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.03215999999999993,"kind":4,"driftX":-0.0054,"percXMin":0.2161000000000002,"percXMax":0.2161000000000002,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":3,"driftX":0,"percXMin":0.2923000000000006,"percXMax":0.2935000000000007,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":3,"driftX":0.0013500000000000265,"percXMin":0.712300000000001,"percXMax":0.7195,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.8626000000000007,"percXMax":0.8644000000000005,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":4,"driftX":-1.0842021724855044e-17,"percXMin":0.6481000000000002,"percXMax":0.6481000000000002,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":2,"driftX":0,"percXMin":0.13450000000000026,"percXMax":0.13450000000000026,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.024739999999999908,"kind":4,"driftX":0.0013500000000000014,"percXMin":0.3639999999999997,"percXMax":0.3639999999999997,"speed":1,"wave":5,"ticksBetween":35}];

var lavaSpawnSeq = [{"groundData":[{"groundKind":2,"x":129,"y":3403},{"groundKind":2,"x":38,"y":3193},{"groundKind":2,"x":215,"y":3196},{"groundKind":2,"x":218,"y":2490},{"groundKind":2,"x":47,"y":2488},{"groundKind":2,"x":131,"y":2425},{"groundKind":2,"x":135,"y":1951},{"groundKind":2,"x":164,"y":1411},{"groundKind":2,"x":94,"y":1492},{"groundKind":2,"x":233,"y":1260},{"groundKind":2,"x":23,"y":1252},{"groundKind":2,"x":131,"y":687},{"groundKind":2,"x":180,"y":688},{"groundKind":2,"x":81,"y":687},{"groundKind":2,"x":176,"y":432},{"groundKind":2,"x":77,"y":284},{"groundKind":2,"x":177,"y":100}]},{"percDuration":0.04,"kind":7,"driftX":0,"percXMin":0.3985,"percXMax":0.5991,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0.12745000000000115,"percXMin":0.6508,"percXMax":0.8603999999999988,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.036779999999999986,"kind":7,"driftX":-0.08505,"percXMin":0.12759999999999994,"percXMax":0.3300000000000002,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.039999999999999994,"kind":6,"driftX":0.002699999999999999,"percXMin":0.13689999999999983,"percXMax":0.8654999999999998,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":7,"driftX":0.09130000000000064,"percXMin":0.6718000000000001,"percXMax":0.8681999999999994,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":6,"driftX":0.0054,"percXMin":0.2002000000000005,"percXMax":0.8285999999999997,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04448000000000006,"kind":7,"driftX":-0.12324999999999892,"percXMin":0.14349999999999882,"percXMax":0.3885000000000023,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.625,"percXMax":0.8382000000000003,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.20560000000000003,"percXMax":0.4176000000000001,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04,"kind":8,"driftX":0,"percXMin":0.3723999999999997,"percXMax":0.6468,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":8,"driftX":-0.4239,"percXMin":0.5716000000000009,"percXMax":0.6467999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.028799999999999965,"kind":8,"driftX":0.4443999999999999,"percXMin":0.38379999999999814,"percXMax":0.4578,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":6,"driftX":0.00405,"percXMin":0.8301999999999997,"percXMax":0.8367999999999992,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04588000000000005,"kind":6,"driftX":0,"percXMin":0.22330000000000116,"percXMax":0.22330000000000116,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":8,"driftX":0,"percXMin":0.30159999999999904,"percXMax":0.7655999999999993,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":6,"driftX":0.18090000000000006,"percXMin":0.8352999999999989,"percXMax":0.8454999999999978,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.040279999999999885,"kind":6,"driftX":-0.1475500000000002,"percXMin":0.22450000000000236,"percXMax":0.2299000000000029,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":-0.24299999999999997,"percXMin":0.31210000000000027,"percXMax":0.3639000000000008,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":-0.2457,"percXMin":0.33220000000000294,"percXMax":0.34480000000000344,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":0.16200000000000012,"percXMin":0.7039000000000005,"percXMax":0.7640999999999999,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.053860000000000074,"kind":0,"driftX":0.1687499999999998,"percXMin":0.7401999999999995,"percXMax":0.7401999999999995,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.24159999999999987,"percXMax":0.7632,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":6,"driftX":0,"percXMin":0.7595000000000005,"percXMax":0.7607000000000004,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":6,"driftX":0,"percXMin":0.4848999999999997,"percXMax":0.5295000000000002,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04,"kind":6,"driftX":0,"percXMin":0.24520000000000097,"percXMax":0.24520000000000097,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":6,"driftX":0,"percXMin":0.24639999999999943,"percXMax":0.7608000000000003,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.48430000000000023,"percXMax":0.5287000000000007,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.7627,"percXMax":0.7627000000000003,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":7,"driftX":0,"percXMin":0.24490000000000064,"percXMax":0.24490000000000064,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.757899999999999,"percXMax":0.757899999999999,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.05288000000000007,"kind":0,"driftX":0.00135,"percXMin":0.24640000000000126,"percXMax":0.24640000000000126,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":8,"driftX":-0.00809999999999957,"percXMin":0.24760000000000043,"percXMax":0.24760000000000043,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":8,"driftX":0.00405,"percXMin":0.7582000000000005,"percXMax":0.7582000000000005,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.06562000000000028,"kind":8,"driftX":0.002699999999999056,"percXMin":0.4977000000000011,"percXMax":0.4977000000000011,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0.0026999999999999997,"percXMin":0.5578000000000004,"percXMax":0.6941999999999997,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.02529999999999989,"kind":7,"driftX":0,"percXMin":0.32440000000000024,"percXMax":0.42840000000000183,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.3280000000000004,"percXMax":0.42960000000000115,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.5649999999999992,"percXMax":0.6941999999999994,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":6,"driftX":0,"percXMin":0.7522,"percXMax":0.7522,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.03019999999999993,"kind":6,"driftX":-0.0027,"percXMin":0.25540000000000057,"percXMax":0.26080000000000053,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":6,"driftX":0,"percXMin":0.2569000000000009,"percXMax":0.2569000000000009,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":6,"driftX":0,"percXMin":0.7515999999999995,"percXMax":0.7533999999999993,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":8,"driftX":0,"percXMin":0.16630000000000025,"percXMax":0.8433,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0.0027,"percXMin":0.5673999999999993,"percXMax":0.686999999999999,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.031179999999999937,"kind":7,"driftX":0,"percXMin":0.33130000000000004,"percXMax":0.42630000000000084,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":-0.00135,"percXMin":0.8361999999999996,"percXMax":0.8367999999999995,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.043780000000000034,"kind":0,"driftX":0,"percXMin":0.17170000000000069,"percXMax":0.17170000000000069,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.08109999999999931,"percXMax":0.08109999999999931,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.9292000000000005,"percXMax":0.9292000000000005,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":8,"driftX":0,"percXMin":0.6271000000000007,"percXMax":0.718500000000001,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.9295,"percXMax":0.9295,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.07900000000000036,"percXMax":0.07960000000000035,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":8,"driftX":0,"percXMin":0.2410000000000003,"percXMax":0.34860000000000024,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.08409999999999988,"percXMax":0.08469999999999987,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.9294999999999992,"percXMax":0.9294999999999992,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":8,"driftX":0,"percXMin":0.6396999999999993,"percXMax":0.7251000000000004,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.08860000000000026,"percXMax":0.08860000000000026,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":7,"driftX":0,"percXMin":0.9270999999999993,"percXMax":0.9270999999999993,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04425999999999997,"kind":8,"driftX":-0.003500000000000576,"percXMin":0.26860000000000117,"percXMax":0.32800000000000196,"speed":1,"wave":5,"ticksBetween":35}];

var levSeq = [islandSpawnSeq,
            spaceSpawnSeq,
            moonSpawnSeq,
            lavaSpawnSeq];

var levelProgressInPixels = 0;
var levelProgressPerc = 0; // gets updated based on levelProgressInPixels
var levelProgressRate = 0.6;
var bgDrawY = 0; // also used for drawing and collision of surface enemies

const LEVEL_ISLAND = 0;
const LEVEL_SPACE = 1;
const LEVEL_MOON = 2;
const LEVEL_LAVA = 3;
var levNow = 0;
var levNames = ['level island','level space','level moon','level lava'];
var currentLevelImageName = levNames[levNow];

var levData = [];
var spawnSeqStep = 0; // which step of the spawner have we progressed to
var sameTimeSpawnSteps = [];
var sameTimeSpawnTicks = [];
var spawnRanges = [];
var enemyList=[];

function spawnSpecificEnemyAtRandomPosition(enemy){
  var usingStep = {percDuration:randRange(0.01,0.10),kind:enemy,driftX:randRange(-1.0,1.0),percXMin:randRange(0.1,1.0),percXMax:randRange(0.1,1.0),speed:randRange(1.0,2.0),wave:randRange(1,10),ticksBetween:randRange(10,2000)};
  
  spawnKind(usingStep);
}

function JSONSurfaceSpawnData() {
	var groundJSON = {groundData:[]};
	for(var i=0;i<surfaceList.length;i++) {
		var nextGround = {groundKind:surfaceList[i].myKind,
			x: Math.floor(surfaceList[i].x),
			y: Math.floor(surfaceList[i].origY)};
		if(surfaceList[i].patrolWaypoints) {
			nextGround.track = [];
			for(var ii=0;ii<surfaceList[i].patrolWaypoints.length;ii++) {
				// console.log(surfaceList[i].patrolWaypoints[ii].y, nextGround.y);
				nextGround.track[ii] = 
					{x:Math.floor(surfaceList[i].patrolWaypoints[ii].x - nextGround.x),
						y:Math.floor(surfaceList[i].patrolWaypoints[ii].y - nextGround.y)};
			}
		}

		groundJSON.groundData.push( nextGround );
	}
	return groundJSON;
}

function groundTypeToObject(kind,atX,atY) {
	var returnObj = null;
	switch(kind) {
		case GROUND_KIND_TANK:
			returnObj = new surfaceEnemyClass(atX,atY);
			break;
		case GROUND_KIND_TENTACLE:
			returnObj = new tentacleClass(atX,atY);
			break;
		case GROUND_KIND_VOLCANO:
			returnObj = new volcanoEnemyClass(atX,atY);
			break;
		case GROUND_KIND_SPACEFROG:
			returnObj = new spaceFrogClass(atX,atY);
			break;
        case GROUND_KIND_DEPOT:
            returnObj = new buildingsClass(atX,atY,GROUND_KIND_DEPOT);
            break;
        case GROUND_KIND_OFFICE:
            returnObj = new buildingsClass(atX,atY,GROUND_KIND_OFFICE);
            break;
        case GROUND_KIND_FACTORY:
            returnObj = new buildingsClass(atX,atY,GROUND_KIND_FACTORY);
            break;
        default:
			console.log("unrecognized ground type for value: "+kind);
			break;
	}
	return returnObj;
}

// note: should only be called right after making a fresh copy to levData, modifies it
function processAndRemoveGroundLevelData() {
	var levelSpawnData = levData[0].groundData;
	surfaceList.length = 0; // can't set to [] or it breaks moveDrawList connection

	let w = images[curDepthMap].width;
	let h = images[curDepthMap].height;

	var nextSpawn;

	for(var i=0;i<levelSpawnData.length;i++) {
		nextSpawn = groundTypeToObject(levelSpawnData[i].groundKind,
										levelSpawnData[i].x,levelSpawnData[i].y);

		if(levelSpawnData[i].groundKind==GROUND_KIND_TANK) {
			nextSpawn.loadWaypoints(levelSpawnData[i].track);
		}
		surfaceList.push(nextSpawn);
	}

	levData.splice(0,1); // cut out the ground spawn data, it's different format, leaves just sky spawn behind for level/editor code
}

function startLevel(whichLevel) {
	createDepthSpawnReference();

	spawnSeqStep = 0;

	levData = JSON.parse(JSON.stringify(whichLevel)); // deep/clean copy since we'll modify it during loading
	processAndRemoveGroundLevelData();

	updateSpawnPercRanges();	
}

function updateSpawnPercRanges() {
	var accumPerc = 0; // for recalculating percDuration per section into total up to that point
	spawnRanges = [];
	for(var i=0; i<levData.length;i++) {
		if(levData[i].percDuration != SPAWN_WITH_NEXT) {
			accumPerc+=levData[i].percDuration;
			spawnRanges[i] = accumPerc;
		} else {
			spawnRanges[i] = SPAWN_WITH_NEXT;
		}
	}
}

var enemySpawnTickCount = 0;
var stepPerc = 0;
function spawnEnemyUpdate() {
	if (gameState != GAME_STATE_PLAY || levelProgressPerc >= 0.99)
	{
		return;
	}
	if(levelProgressPerc>spawnRanges[spawnSeqStep] && 
		spawnSeqStep<levData.length-1 ) { // so last one will go until end of stage
		sameTimeSpawnSteps.length = 0;
		sameTimeSpawnTicks.length = 0;
		while(levData[spawnSeqStep].percDuration == SPAWN_WITH_NEXT &&
				spawnSeqStep < levData.length) {
			sameTimeSpawnSteps.push(levData[spawnSeqStep]);
			sameTimeSpawnTicks.push(0);
			spawnSeqStep++;
			if(spawnSeqStep == levData.length-1){
				console.log("LEVEL FORMAT ISSUE: shouldn't end on a SPAWN_WITH_NEXT percDuration");
			}
			// console.log("extra spawn track starting");
		}
		if(sameTimeSpawnSteps.length == 0){ // none being stacked? advance anyway
			spawnSeqStep++;
		}
		// console.log("===="+spawnSeqStep + " at perc " +levelProgressPerc);
	}
	if(spawnSeqStep==0) {
		stepPerc = levelProgressPerc/levData[spawnSeqStep].percDuration;
	} else if(spawnSeqStep < levData.length) {
		stepPerc = 1.0+(levelProgressPerc-spawnRanges[spawnSeqStep])/
					(levData[spawnSeqStep].percDuration); 
	} else { // ex. ran out of level description, so freeze it after drift
		stepPerc = 1;
	}
	// console.log("stepPerc is "+stepPerc);

	if(enemySpawnTickCount-- < 0) {
		if(levData[spawnSeqStep] == undefined) {
			console.log("spawn error? crash avoided");
			return;
		}
		enemySpawnTickCount=levData[spawnSeqStep].ticksBetween;
		spawnKind(levData[spawnSeqStep]);
	}
	// code below could probably be merged with code above, but separate at first for overlapping spawn sets
	for(var i=0;i<sameTimeSpawnSteps.length;i++) {
		if(sameTimeSpawnTicks[i]-- < 0) {
			sameTimeSpawnTicks[i]=sameTimeSpawnSteps[i].ticksBetween;
			spawnKind(sameTimeSpawnSteps[i]);
		}
	}
} // end of spawnEnemyUpdate function

function spawnKind(usingStep) {
	switch(usingStep.kind) {
		case ENEMY_BUG:
			enemyList.push(new enemyWaveBugClass(usingStep));
			break;
		case ENEMY_SWOOP:
			enemyList.push(new enemySwoopAtClass(usingStep));
			break;
		case ENEMY_STALL_CHASE:
			enemyList.push(new enemyStallChaseClass(usingStep));
			break;
		case ENEMY_SHOCK:
			enemyList.push(new enemyShockBallClass(usingStep));
			break;
		case ENEMY_AZMO:
		enemyList.push(new enemyAzmoClass(usingStep));
		break;
		case ENEMY_DIMO:
			enemyList.push(new enemyDimoClass(usingStep));
			break;
		case ENEMY_SMALLALIEN:
			enemyList.push(new enemySmallAlienClass(usingStep));
			break;
		case ENEMY_FIRESNAKE:
			enemyList.push(new enemyFireSnakeClass(usingStep));
			break;
		case ENEMY_FIREBIRD:
			enemyList.push(new enemyFireBirdClass(usingStep));
			break;
	}
}
