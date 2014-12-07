var WordList = require("./models/WordList");

module.exports = function(level){
	var words;

	words = [ "deep", "center", "agree", "branch", "bench", "arrive", "beach", "greedy",
		"bright", "dive", "alarm", "chew", "board", "cheer", "enemy", "bare", "clear", "curious",
		"brave", "calm", "bridge", "ocean", "collect", "seashell", "pack", "field", "hour",
		"float", "eager", "gentle", "hero", "prove", "pass", "fresh", "fair", "fear", "plant", "safe", "midnight", "inn",
		"idea", "finally", "famous", "cross", "enormous", "feast", "dash", "frighten",
		"dangerous", "insect", "forest", "crowd", "herd", "flour", "entire", "damp",
		"trail", "travel", "doubt", "wave", "dawn", "wonder", "evening", "exactly",
		"search", "weak", "steady", "squeeze", "weekend", "tremble", "pale", "soar",
		"team", "wise", "worry", "warn", "tool", "village", "whisper", "shiver",
		"frown", "tiny", "notice", "stack", "present", "rainbow", "seal", "leader",
		"leap", "smooth", "island", "pain", "soil", "nibble", "scatter", "signal",
		"harm", "author", "screech", "chapter", "snowstorm", "blends", "driving", "capitalization",
		"create", "moment", "direction", "character", "complete", "describe", "fantasy", "consonants",
		"final", "locate", "order", "language", "punctuation", "magazine", "predict", "initial"];

	if(level == 2){
		words = ["million", "desert", "seldom", "drawer", "dessert", "northern", "accelerate", "scanner", "cavern", "massage",
		"stood", "chase", "shook", "separate", "geography", "awhile", "pants", "sour", "promise", "control",
		"cheap", "reason", "season", "pleasure", "although", "companies", "bathe", "merry", "remainder", "lean",
		"nickel", "pour", "unable", "object", "whom", "known", "perhaps", "couple", "interesting", "arithmetic",
		"declare", "glisten", "exhaust", "glance", "capture", "wit", "active", "kindle", "cling", "valid",
		"brilliant", "amateur", "atmosphere", "gloomy", "swift", "arch", "plunge", "admirable", "precious", "convince",
		"harsh", "shallow", "coward", "bargain", "yearn", "struggle", "restless", "grant", "exclaim", "sensitive",
		"disturb", "fierce", "amazing", "observe", "shatter", "batteries", "superb", "unite", "clasp", "insist",
		"border", "pierce", "treasure", "clever", "rare", "journey", "accuse", "dragged", "imitate", "depart",
		"ancient", "delicate", "triumph", "remote", "pretend", "wisdom", "perform", "prompt", "expose", "dragging",
		"honor", "pattern", "brief", "delightful", "compete", "timid", "reflex", "conquer", "decay", "intimidated",
		"ability", "actual", "remark", "eloquent", "approach", "brink", "fury", "sufficient", "consider", "invest",
		"avoid", "watchful", "glory", "sergeant", "distant", "magnificent", "fortunate", "intend", "revive", "previously",
		"glide", "chill", "dreary", "wreckage", "grave", "origin", "audible", "meek", "vibrant", "punctuate",
		"flock", "opponent", "stout", "prevent", "automatic", "authentic", "modest", "scorn", "clarify", "woe"]
	}
	else if(level == 3){
		words = ["factor", "peer", "predicament", "pressure", "placid", "loom", "appropriate", "vanish", "neglect", "retreat", "differ", "ignorance", "immune", "admiration", "liter", "arthritis",
		"vat", "conclusion", "peninsula", "sustain", "outline", "occasional", "rigid", "stationary", "permission", "understandable", "fare", "approximate", "instrument", "commissioner", "condominium",
		"glare", "council", "appreciate", "function", "captive", "overhead", "aisle", "cooperate", "category", "exist", "cologne", "fascinating", "shaggy", "cuckoo clock", "restrict",
		"orphan", "solar", "accompany", "quest", "misery", "isle", "soothe", "embarrass", "sift", "strive", "relative", "daze", "deadly", "implore", "overwhelm",
		"trace", "territory", "arguing", "sniff", "tidy", "dwell", "focus", "quake", "humble", "counsel", "occurring", "headphones", "celebrity", "phonetic", "antennas",
		"recall", "shed", "huddle", "install", "accumulate", "stern", "contract", "sincere", "arena", "dismiss", "sagebrush", "sponsor", "adorn", "prime meridian", "cannibal",
		"thaw", "burden", "attain", "manipulate", "motion", "consent", "qualify", "vacant", "dependable", "poncho", "invasion", "attractive", "response", "bonanza", "shabby",
		"pioneer", "fiesta", "pursuit", "essential", "leeway", "originate", "quench", "disobedience", "indicate", "eternal", "inconvenient", "persevere", "scour", "consciousness", "guacamole", "homelessness", "fajita",
		"equator", "grudge", "garment", "rash", "hammock", "establish", "sensible", "cargo", "misfortune", "baggage", "humid", "antique", "suitable", "oppose", "corrode", "inept", "parallels",
		"collide", "haste", "diligent", "hectic", "horde", "blossom", "quiver", "foul", "worthy", "constant", "annual", "content", "policy", "noble", "obtain", "baffle", "brawl"]
	}

	return new WordList(words)
;}