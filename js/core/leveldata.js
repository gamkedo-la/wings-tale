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

var islandSpawnSeq = [{"groundData":[{"groundKind":1,"x":78,"y":2461},{"groundKind":1,"x":38,"y":2203},{"groundKind":1,"x":216,"y":1892},{"groundKind":4,"x":235,"y":2297},{"groundKind":4,"x":147,"y":1439},{"groundKind":4,"x":184,"y":1429},{"groundKind":4,"x":221,"y":1441},{"groundKind":4,"x":184,"y":868},{"groundKind":6,"x":74,"y":1981},{"groundKind":6,"x":123,"y":1020},{"groundKind":6,"x":21,"y":523},{"groundKind":5,"x":23,"y":602},{"groundKind":5,"x":236,"y":599},{"groundKind":1,"x":77,"y":274},{"groundKind":1,"x":179,"y":155},{"groundKind":1,"x":83,"y":47},{"groundKind":1,"x":186,"y":404},{"groundKind":4,"x":133,"y":2672}]},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.10599999999999996,"percXMax":0.3228000000000007,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.05876,"kind":0,"driftX":0.010799999999999997,"percXMin":0.6748000000000001,"percXMax":0.8676000000000004,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.5413500000000007,"percXMin":0.12100000000000113,"percXMax":0.3220000000000032,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.11109999999999967,"percXMax":0.11609999999999976,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.8726000000000006,"percXMax":0.8738000000000005,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.045179999999999776,"kind":0,"driftX":-0.5245000000000017,"percXMin":0.6793000000000031,"percXMax":0.8629000000000007,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":-0.12150000000000008,"percXMin":0.16300000000000034,"percXMax":0.33539999999999875,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":0.09539999999999826,"percXMin":0.6716000000000013,"percXMax":0.860800000000003,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":0.26594999999999946,"percXMin":0.1665999999999995,"percXMax":0.336600000000001,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0.04084000000000002,"kind":0,"driftX":-0.25379999999999936,"percXMin":0.6859,"percXMax":0.8612999999999987,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":-0.27944999999999987,"percXMin":0.7506999999999996,"percXMax":0.9716999999999986,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.30239999999999995,"percXMin":0.030700000000000074,"percXMax":0.2541000000000007,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.42040000000000033,"percXMax":0.651600000000001,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.006750000000000001,"percXMin":0.09609999999999984,"percXMax":0.29910000000000075,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.0027,"percXMin":0.6487000000000008,"percXMax":0.8552999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.07402000000000004,"kind":0,"driftX":0.004249999999999244,"percXMin":0.3964000000000018,"percXMax":0.6420000000000005,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":0.00405,"percXMin":0.5308000000000009,"percXMax":0.5308000000000009,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.07052000000000024,"kind":0,"driftX":0.005399999999999995,"percXMin":0.5038000000000038,"percXMax":0.5595999999999981,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":-0.2388999999999999,"percXMin":0.437199999999999,"percXMax":0.44800000000000106,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.20250000000000015,"percXMax":0.20730000000000007,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0,"kind":1,"driftX":0.01705000000000097,"percXMin":0.8074000000000009,"percXMax":0.8104000000000006,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0.029640000000000173,"kind":1,"driftX":0.17505000000000098,"percXMin":0.6358,"percXMax":0.6441999999999991,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0,"kind":1,"driftX":0.12625000000000286,"percXMin":0.5515000000000028,"percXMax":0.5587000000000022,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.04510000000000035,"percXMax":0.4004999999999991,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0,"kind":0,"driftX":-0.013500000000000005,"percXMin":0.587299999999999,"percXMax":0.9769000000000004,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0,"kind":0,"driftX":-0.7697500000000006,"percXMin":0.7846000000000004,"percXMax":0.9714000000000005,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":0.7620999999999994,"percXMin":0.042100000000000457,"percXMax":0.23790000000000056,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0.03762000000000015,"kind":1,"driftX":-0.14714999999999984,"percXMin":0.4684000000000005,"percXMax":0.47160000000000024,"speed":1,"wave":5,"ticksBetween":2},{"percDuration":0.044620000000000055,"kind":0,"driftX":-0.010800000000000198,"percXMin":0.2125000000000003,"percXMax":0.7899000000000003,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.6018999999999988,"percXMax":0.6036999999999986,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4159000000000023,"percXMax":0.41650000000000237,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.2196999999999999,"percXMax":0.8282999999999994,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4972000000000014,"percXMax":0.5316000000000002,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":1,"driftX":0.14880000000000204,"percXMin":0.6849999999999996,"percXMax":0.6957999999999986,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.03860000000000004,"kind":1,"driftX":-0.1718499999999997,"percXMin":0.32199999999999895,"percXMax":0.34199999999999964,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04798000000000007,"kind":1,"driftX":0.00405,"percXMin":0.056199999999999556,"percXMax":0.955799999999998,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.7390000000000011,"percXMax":0.9593999999999993,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":0.0053999999999999986,"percXMin":0.060100000000000015,"percXMax":0.3111000000000004,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0.04434000000000014,"kind":1,"driftX":0.011749999999999653,"percXMin":0.3795999999999971,"percXMax":0.6635999999999979,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.0027,"percXMin":0.49150000000000166,"percXMax":0.495700000000002,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.14649999999999944,"percXMax":0.14649999999999944,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.3097000000000004,"percXMax":0.31150000000000055,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.8445999999999997,"percXMax":0.8445999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04980000000000024,"kind":0,"driftX":0.00404999999999999,"percXMin":0.6519999999999976,"percXMax":0.6519999999999976,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.2568999999999995,"percXMin":0.40299999999999997,"percXMax":0.5994,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":1,"driftX":0.015800000000000036,"percXMin":0.06910000000000019,"percXMax":0.30450000000000127,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":1,"driftX":0.024650000000001202,"percXMin":0.6756000000000032,"percXMax":0.9619999999999963,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0.11504000000000042,"kind":0,"driftX":-0.24570000000000014,"percXMin":0.3959999999999987,"percXMax":0.6193999999999983,"speed":1,"wave":5,"ticksBetween":5},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.12729999999999972,"percXMax":0.13149999999999964,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.9263000000000009,"percXMax":0.9269000000000008,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.46119999999999967,"percXMax":0.6611999999999992,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4993000000000005,"percXMax":0.7046999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4086999999999998,"percXMax":0.6104999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.012799999999999997,"kind":1,"driftX":0.006899999999999955,"percXMin":0.28980000000000133,"percXMax":0.7618000000000021,"speed":2.5,"wave":25,"ticksBetween":10}];

// original version without fuel depots, factories, and office buildings:
// [{"groundData":[{"groundKind":1,"x":28,"y":2400},{"groundKind":1,"x":80,"y":2245},{"groundKind":1,"x":232,"y":2130},{"groundKind":1,"x":67,"y":1926},{"groundKind":1,"x":240,"y":1854}]},{"percDuration":0.035659999999999824,"kind":0,"driftX":0.004349999999998867,"percXMin":0.697300000000001,"percXMax":0.697300000000001,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04027999999999988,"kind":0,"driftX":0.012449999999999926,"percXMin":0.3078000000000013,"percXMax":0.3102000000000015,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.06828,"kind":0,"driftX":0.005400000000000002,"percXMin":0.36970000000000086,"percXMax":0.6807000000000011,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.5308000000000009,"percXMax":0.5308000000000009,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0.000800000000001124,"percXMin":0.08829999999999817,"percXMax":0.3151000000000013,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.05596000000000003,"kind":0,"driftX":0.011399999999998318,"percXMin":0.735700000000001,"percXMax":0.9523,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.5281000000000002,"percXMax":0.5305000000000002,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.038180000000000165,"kind":1,"driftX":0.17910000000000093,"percXMin":0.6453999999999995,"percXMax":0.6453999999999995,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04378000000000009,"kind":1,"driftX":-0.12555,"percXMin":0.46480000000000066,"percXMax":0.46560000000000024,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.03790000000000003,"kind":0,"driftX":0.008099999999999864,"percXMin":0.2125000000000003,"percXMax":0.7899000000000003,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.6018999999999988,"percXMax":0.6036999999999986,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4159000000000023,"percXMax":0.41650000000000237,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.2196999999999999,"percXMax":0.8282999999999994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4972000000000014,"percXMax":0.5316000000000002,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":1,"driftX":0.14880000000000204,"percXMin":0.6849999999999996,"percXMax":0.6957999999999986,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.03860000000000004,"kind":1,"driftX":-0.1718499999999997,"percXMin":0.32199999999999895,"percXMax":0.34199999999999964,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04,"kind":1,"driftX":0,"percXMin":0.061299999999999605,"percXMax":0.9602999999999979,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.7390000000000011,"percXMax":0.9593999999999993,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.0053999999999999986,"percXMin":0.060100000000000015,"percXMax":0.3111000000000004,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04210000000000012,"kind":1,"driftX":0.009049999999999652,"percXMin":0.3801999999999971,"percXMax":0.6629999999999978,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.49150000000000166,"percXMax":0.495700000000002,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.14649999999999944,"percXMax":0.14649999999999944,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.3097000000000004,"percXMax":0.31150000000000055,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.8445999999999997,"percXMax":0.8445999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04042000000000016,"kind":0,"driftX":0.00404999999999999,"percXMin":0.6519999999999976,"percXMax":0.6519999999999976,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.2568999999999995,"percXMin":0.40299999999999997,"percXMax":0.5994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.015800000000000036,"percXMin":0.06910000000000019,"percXMax":0.30450000000000127,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.024650000000001202,"percXMin":0.6756000000000032,"percXMax":0.9619999999999963,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.11504000000000042,"kind":0,"driftX":-0.24570000000000014,"percXMin":0.3959999999999987,"percXMax":0.6193999999999983,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.12729999999999972,"percXMax":0.13149999999999964,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.9263000000000009,"percXMax":0.9269000000000008,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.46119999999999967,"percXMax":0.6611999999999992,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4993000000000005,"percXMax":0.7046999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4086999999999998,"percXMax":0.6104999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.012799999999999997,"kind":1,"driftX":0.006899999999999955,"percXMin":0.28980000000000133,"percXMax":0.7618000000000021,"speed":2.5,"wave":25,"ticksBetween":35}];

// Version with fuel depots, factories, and office buildings:
//  [{"groundData":[{"groundKind":1,"x":28,"y":2400},{"groundKind":1,"x":80,"y":2245},{"groundKind":1,"x":232,"y":2130},{"groundKind":1,"x":67,"y":1926},{"groundKind":1,"x":240,"y":1854},{"groundKind":4,"x":196,"y":2736},{"groundKind":4,"x":196,"y":2673},{"groundKind":4,"x":235,"y":2297},{"groundKind":4,"x":148,"y":1381},{"groundKind":4,"x":186,"y":1381},{"groundKind":4,"x":223,"y":1381},{"groundKind":4,"x":184,"y":868},{"groundKind":6,"x":27,"y":2477},{"groundKind":6,"x":135,"y":1780},{"groundKind":6,"x":89,"y":1046},{"groundKind":6,"x":164,"y":1090},{"groundKind":6,"x":19,"y":496},{"groundKind":5,"x":27,"y":2501},{"groundKind":5,"x":225,"y":2317},{"groundKind":5,"x":107,"y":1781},{"groundKind":5,"x":28,"y":521},{"groundKind":5,"x":22,"y":542},{"groundKind":5,"x":19,"y":611}]},{"percDuration":0.035659999999999824,"kind":0,"driftX":0.004349999999998867,"percXMin":0.697300000000001,"percXMax":0.697300000000001,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04027999999999988,"kind":0,"driftX":0.012449999999999926,"percXMin":0.3078000000000013,"percXMax":0.3102000000000015,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.06828,"kind":0,"driftX":0.005400000000000002,"percXMin":0.36970000000000086,"percXMax":0.6807000000000011,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.5308000000000009,"percXMax":0.5308000000000009,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0.000800000000001124,"percXMin":0.08829999999999817,"percXMax":0.3151000000000013,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.05596000000000003,"kind":0,"driftX":0.011399999999998318,"percXMin":0.735700000000001,"percXMax":0.9523,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.5281000000000002,"percXMax":0.5305000000000002,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.038180000000000165,"kind":1,"driftX":0.17910000000000093,"percXMin":0.6453999999999995,"percXMax":0.6453999999999995,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04378000000000009,"kind":1,"driftX":-0.12555,"percXMin":0.46480000000000066,"percXMax":0.46560000000000024,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.03790000000000003,"kind":0,"driftX":0.008099999999999864,"percXMin":0.2125000000000003,"percXMax":0.7899000000000003,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.6018999999999988,"percXMax":0.6036999999999986,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4159000000000023,"percXMax":0.41650000000000237,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.2196999999999999,"percXMax":0.8282999999999994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4972000000000014,"percXMax":0.5316000000000002,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":1,"driftX":0.14880000000000204,"percXMin":0.6849999999999996,"percXMax":0.6957999999999986,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.03860000000000004,"kind":1,"driftX":-0.1718499999999997,"percXMin":0.32199999999999895,"percXMax":0.34199999999999964,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0.04,"kind":1,"driftX":0,"percXMin":0.061299999999999605,"percXMax":0.9602999999999979,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.7390000000000011,"percXMax":0.9593999999999993,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.0053999999999999986,"percXMin":0.060100000000000015,"percXMax":0.3111000000000004,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04210000000000012,"kind":1,"driftX":0.009049999999999652,"percXMin":0.3801999999999971,"percXMax":0.6629999999999978,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.49150000000000166,"percXMax":0.495700000000002,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.14649999999999944,"percXMax":0.14649999999999944,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.3097000000000004,"percXMax":0.31150000000000055,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.8445999999999997,"percXMax":0.8445999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.04042000000000016,"kind":0,"driftX":0.00404999999999999,"percXMin":0.6519999999999976,"percXMax":0.6519999999999976,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.2568999999999995,"percXMin":0.40299999999999997,"percXMax":0.5994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.015800000000000036,"percXMin":0.06910000000000019,"percXMax":0.30450000000000127,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.024650000000001202,"percXMin":0.6756000000000032,"percXMax":0.9619999999999963,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.11504000000000042,"kind":0,"driftX":-0.24570000000000014,"percXMin":0.3959999999999987,"percXMax":0.6193999999999983,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.12729999999999972,"percXMax":0.13149999999999964,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.9263000000000009,"percXMax":0.9269000000000008,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.46119999999999967,"percXMax":0.6611999999999992,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4993000000000005,"percXMax":0.7046999999999995,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.4086999999999998,"percXMax":0.6104999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.012799999999999997,"kind":1,"driftX":0.006899999999999955,"percXMin":0.28980000000000133,"percXMax":0.7618000000000021,"speed":2.5,"wave":25,"ticksBetween":35}];

var spaceSpawnSeq =
  // [{"groundData":[{"groundKind":3,"x":50,"y":2900},{"groundKind":3,"x":43,"y":2579}]},{"percDuration":0.04383999999999995,"kind":5,"driftX":0.5377999999999995,"percXMin":0.049499999999999954,"percXMax":0.3441,"speed":1,"wave":5,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0.34155,"percXMin":0.4,"percXMax":0.6,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.05045999999999981,"kind":0,"driftX":-0.5921000000000034,"percXMin":0.85,"percXMax":0.9,"speed":1,"wave":5,"ticksBetween":35}]
  [{"groundData":[{"groundKind":3,"x":50,"y":2900},{"groundKind":3,"x":43,"y":2579}]},{"percDuration":0.05,"kind":4,"driftX":0.5,"percXMin":0,"percXMax":0.3,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.05,"kind":0,"driftX":-0.8,"percXMin":0.85,"percXMax":0.9,"speed":1,"wave":5,"ticksBetween":10}]
	;

var moonSpawnSeq = 
  [{"groundData":[{"groundKind":0,"x":120,"y":3650,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]},{"groundKind":0,"x":182,"y":3536,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]},{"groundKind":0,"x":166,"y":3336,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]}]},{"percDuration":0.5,"kind":1,"driftX":0.8,"percXMin":0.1,"percXMax":0.15,"speed":1,"wave":5,"ticksBetween":2000},{"percDuration":0.5,"kind":0,"driftX":-0.8,"percXMin":0.85,"percXMax":0.9,"speed":1,"wave":5,"ticksBetween":2000},{percDuration:0.5,kind:ENEMY_SWOOP,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:2000},{percDuration:0.5,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:2000},]
	// [
	// {"groundData":[
	// 	{"groundKind":0,"x":120,"y":3650,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]}
	// ]},{percDuration:0.5,kind:ENEMY_SWOOP,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:2000},{percDuration:0.5,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:2000},]
;
var lavaSpawnSeq = 
	[{"groundData":[{"groundKind":2,"x":63,"y":3688}]},{"percDuration":0.05,"kind":7,"driftX":0.9,"percXMin":0,"percXMax":0.4,"speed":1,"wave":5,"ticksBetween":15},{"percDuration":0.05,"kind":0,"driftX":-0.8,"percXMin":0.85,"percXMax":0.9,"speed":1,"wave":5,"ticksBetween":10}]
;

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
	surfaceList = [];

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
