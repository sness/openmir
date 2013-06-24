window.initVersion = 0.31;

window.initAchievementData = [

    {
        id: "0",
        name: "N01",
        callId : "N01_A04_0",
        currentNum : 0,
    },
    {
        id: "1",
        name: "N02",
        callId : "N02_A04_1",
        currentNum : 0,
    },
    {
        id: "2",
        name: "N03",
        callId : "N03_A04_2",
        currentNum : 0,
    },
    {
        id: "3",
        name: "N04",
        callId : "N04_A04_3",
        currentNum : 0,
    },
    {
        id: "4",
        name: "N05",
        callId : "N05_A08_31",
        currentNum : 0,
    },
    {
        id: "5",
        name: "N07",
        callId : "N07_A04_5",
        currentNum : 0,
    },
    {
        id: "10",
        name: "N12",
        callId : "N12_A05_21",
        currentNum : 0,
    },
    {
        id: "15",
        name: "N20",
        callId : "N20_C06_221",
        currentNum : 0,
    },
    {
        id: "16",
        name: "N23",
        callId : "N23_G03_270",
        currentNum : 0,
    },
    {
        id: "17",
        name: "N24",
        callId : "N24_G_253",
        currentNum : 0,
    },
    {
        id: "19",
        name: "N26",
        callId : "N26_G17_274",
        currentNum : 0,
    },
    {
        id: "20",
        name: "N28",
        callId : "N28_G17_276",
        currentNum : 0,
    },
    {
        id: "29",
        name: "N47",
        callId : "N47_A12_91",
        currentNum : 0,
    },
    {
        id: "36",
        name: "ping",
        callId : "ping_G_261",
        currentNum : 0,
    },
    {
        id: "37",
        name: "squawk",
        callId : "squawk_I15_312",
        currentNum : 0,
    },
    {
        id: "38",
        name: "trill",
        callId : "trill_A30_138",
        currentNum : 0,
    },
];


window.initLevelData = [
    { 
        id : "0",
        name : "N4",
        highScore : 0,
        match : ['name'],
        played: false,
        locked: false,
        turns : [
            {
                "queryId" : "N04_A12_69",
                "referenceIds" : [ "N04_A12_70", "N03_A12_68" ]
            }
        ],
    },
    { 
        id : "1",
        name : "N4",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N04_A12_69",
                "referenceIds" : [ "N04_A12_72", "N03_A12_68", "N08_A12_80" ]
            },
            {
                "queryId" : "N04_A12_70",
                "referenceIds" : [ "N04_A12_73", "N11_A12_89", "N05_A12_76" ]
            },
        ]
    },
    { 
        id : "2",
        name : "ooh/weeawu",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "Ooooh_G_259",
                "referenceIds" : [ "Ooooh_G_260", "trill_G_267", "trill_G_269", "ping_G_263" ]
            },
            {
                "queryId" : "Ooooh_G_260",
                "referenceIds" : [ "Ooooh_G_259", "trill_G_269", "ping_G_263", "ping_G_262" ]
            },
            {
                "queryId" : "weeawu_A04_11",
                "referenceIds" : [ "weeawu_A11_52", "N23_I33_334", "N01_A30_114", "N01_B07_189" ]
            },
        ]
    },
    { 
        id : "3",
        name : "N16",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N16_AI_188",
                "referenceIds" : [ "N16_B07_200", "N07_H_284", "N09_A08_37", "N09_A11_50" ]
            },
            {
                "queryId" : "N16_B07_200",
                "referenceIds" : [ "N16_B07_201", "N09_A08_37", "N09_A11_50", "N09_A36_172" ]
            },
            {
                "queryId" : "N16_B07_201",
                "referenceIds" : [ "N16_B07_200", "N09_A11_50", "N09_A36_172", "N09_A05_17" ]
            },
        ]
    },
    { 
        id : "4",
        name : "N3",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N03_A12_68",
                "referenceIds" : [ "N03_A30_116", "N02_A12_66", "N05_A12_75", "N47_A12_92" ]
            },
            {
                "queryId" : "N03_A30_116",
                "referenceIds" : [ "N03_A30_117", "N02_A12_67", "N05_A12_76", "N01_A12_64" ]
            },
            {
                "queryId" : "N03_A30_117",
                "referenceIds" : [ "N03_A36_161", "N12_A05_22", "N12_A05_21", "honk_A04_9" ]
            },
            {
                "queryId" : "N03_A36_161",
                "referenceIds" : [ "N03_A36_162", "N12_A12_90", "trill_A30_138", "N08_A12_80" ]
            },
            {
                "queryId" : "N03_A36_162",
                "referenceIds" : [ "N03_A12_68", "N02_A36_158", "N08_A12_79", "N12_A12_90" ]
            },
        ]
    },
    { 
        id : "5",
        name : "N1",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N01_A12_64",
                "referenceIds" : [ "N01_A12_65", "N02_A12_67", "N09_A30_123", "N10_A36_178" ]
            },
            {
                "queryId" : "N01_A12_65",
                "referenceIds" : [ "N01_A34_139", "N09_A12_85", "N08_A12_80", "N03_A30_116" ]
            },
            {
                "queryId" : "N01_A34_139",
                "referenceIds" : [ "N01_A34_140", "N09_A12_81", "N08_A30_122", "N09_A12_82" ]
            },
            {
                "queryId" : "N01_A34_140",
                "referenceIds" : [ "N01_A34_141", "N10_A36_177", "N08_A12_79", "N03_A36_161" ]
            },
            {
                "queryId" : "N01_A34_141",
                "referenceIds" : [ "N01_A34_142", "N03_A12_68", "N09_A12_84", "N02_A34_143" ]
            },

        ]
    },
    { 
        id : "6",
        name : "honk",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "honk_A04_9",
                "referenceIds" : [ "honk_A04_10", "trill_G_267", "trill_A30_138", "crunch_A12_97" ]
            },
            {
                "queryId" : "honk_A04_10",
                "referenceIds" : [ "honk_A04_9", "trill_A30_138", "crunch_A12_97", "squawk_I15_313" ]
            },
            {
                "queryId" : "honk_A11_51",
                "referenceIds" : [ "honk_A04_10", "crunch_A12_97", "squawk_I15_313", "squawk_I15_312" ]
            },
            {
                "queryId" : "honk_A24_106",
                "referenceIds" : [ "honk_A11_51", "squawk_I15_313", "squawk_I15_312", "trill_G_267" ]
            },
            {
                "queryId" : "honk_A04_9",
                "referenceIds" : [ "honk_A04_10", "trill_G_267", "trill_A30_138", "crunch_A12_97" ]
            },
        ]
    },
    { 
        id : "7",
        name : "trill",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "trill_A30_138",
                "referenceIds" : [ "trill_G_266", "honk_A11_51", "honk_A24_106", "squawk_I15_312" ]
            },
            {
                "queryId" : "trill_G_266",
                "referenceIds" : [ "trill_G_267", "honk_A24_106", "squawk_I15_312", "honk_A04_9" ]
            },
            {
                "queryId" : "trill_G_267",
                "referenceIds" : [ "trill_G_269", "squawk_I15_312", "honk_A04_9", "squawk_I15_313" ]
            },
            {
                "queryId" : "trill_G_268",
                "referenceIds" : [ "trill_G_266", "honk_A04_9", "squawk_I15_313", "squawk_I15_314" ]
            },
            {
                "queryId" : "trill_G_269",
                "referenceIds" : [ "trill_G_267", "squawk_I15_313", "squawk_I15_314", "honk_A04_10" ]
            },
        ]
    },

    { 
        id : "8",
        name : "squawk",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "squawk_I15_312",
                "referenceIds" : [ "squawk_I15_313", "trill_I15_315", "trill_A30_138", "honk_A11_51" ]
            },
            {
                "queryId" : "squawk_I15_313",
                "referenceIds" : [ "squawk_I15_312", "trill_A30_138", "honk_A11_51", "honk_A24_106" ]
            },
            {
                "queryId" : "squawk_I15_314",
                "referenceIds" : [ "squawk_I15_312", "honk_A11_51", "honk_A24_106", "crunch_A12_97" ]
            },
            {
                "queryId" : "squawk_I15_312",
                "referenceIds" : [ "squawk_I15_313", "trill_I15_315", "trill_A30_138", "honk_A11_51" ]
            },
            {
                "queryId" : "squawk_I15_314",
                "referenceIds" : [ "squawk_I15_312", "trill_A30_138", "honk_A11_51", "honk_A24_106" ]
            }
        ]
    },
    { 
        id : "9",
        name : "N7",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N07_A12_77",
                "referenceIds" : [ "N07_A36_171", "N04_A12_71", "un_A12_98", "N04_A12_69" ]
            },
            {
                "queryId" : "N07_A12_78",
                "referenceIds" : [ "N07_A36_170", "N04_A36_163", "trill_A30_138", "N47_A34_145" ]
            },
            {
                "queryId" : "N07_A30_121",
                "referenceIds" : [ "N07_A12_77", "N47_A36_181", "N04_A12_70", "N04_A30_119" ]
            },
            {
                "queryId" : "N07_A36_170",
                "referenceIds" : [ "N07_A12_78", "N04_A36_165", "N04_A36_164", "N04_A12_73" ]
            },
            {
                "queryId" : "N07_A36_171",
                "referenceIds" : [ "N07_A30_121", "N47_A12_92", "N04_A12_72", "N04_A34_144" ]
            },
        ]
    },
    { 
        id : "10",
        name : "N5",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N05_A12_74",
                "referenceIds" : [ "N05_A12_76", "N01_A36_154", "ds_A36_183", "N02_A30_115" ]
            },
            {
                "queryId" : "N05_A12_75",
                "referenceIds" : [ "N05_A36_166", "N04_A34_144", "N10_A36_177", "A12sp_A12_58" ]
            },
            {
                "queryId" : "N05_A12_76",
                "referenceIds" : [ "N05_A12_75", "N03_A12_68", "N09_A12_84", "N08_A12_80" ]
            },
            {
                "queryId" : "N05_A30_120",
                "referenceIds" : [ "N05_A36_167", "N9sh_A12_93", "N01_A36_157", "N02_A36_158" ]
            },
            {
                "queryId" : "N05_A36_166",
                "referenceIds" : [ "N05_A36_169", "N11_A30_129", "N11_A30_130", "N09_A30_126" ]
            },
        ]
    },
    { 
        id : "11",
        name : "N2",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N02_A12_66",
                "referenceIds" : [ "N02_A12_66", "N09_A30_123", "I15im_A12_63", "N03_A12_68" ]
            },
            {
                "queryId" : "N02_A12_67",
                "referenceIds" : [ "N02_A36_158", "N09sh_A36_175", "N47_A36_182", "N07_A12_78" ]
            },
            {
                "queryId" : "N02_A30_115",
                "referenceIds" : [ "N02_A36_160", "N11_A30_129", "N09sh_A36_174", "N04_A12_73" ]
            },
            {
                "queryId" : "N02_A34_143",
                "referenceIds" : [ "N02_A34_143", "N01_A34_142", "N04_A12_70", "N11_A12_88" ]
            },
            {
                "queryId" : "N02_A36_158",
                "referenceIds" : [ "N02_A36_159", "N05_A36_166", "ds_A36_184", "N47_A12_92" ]
            },
        ]
    },
    { 
        id : "12",
        name : "N12",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N12_A05_23",
                "referenceIds" : [ "N12_A08_39", "N47_A12_91", "N9sh_A12_94", "N03_A30_117" ]
            },
            {
                "queryId" : "N12_A05_22",
                "referenceIds" : [ "N12_A05_23", "N02_A36_158", "N04_A08_30", "N08_A12_80" ]
            },
            {
                "queryId" : "N12_A08_39",
                "referenceIds" : [ "N12_A05_21", "bark_A12_96", "N09_A12_83", "N01_A36_157" ]
            },
            {
                "queryId" : "N12_A05_21",
                "referenceIds" : [ "N12_A05_22", "N01_A36_156", "N47_A36_182", "N08_A12_79" ]
            },
            {
                "queryId" : "N12_A12_90",
                "referenceIds" : [ "N12_A30_131", "N08_A12_79", "A12sp_A12_59", "A12sp_A12_57" ]
            },
        ]
    },
    { 
        id : "13",
        name : "N47",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N47_A12_91",
                "referenceIds" : [ "N47_A12_92", "bark_A05_26", "I15im_A12_63", "N01_A12_64" ]
            },
            {
                "queryId" : "N47_A12_92",
                "referenceIds" : [ "N47_A12_91", "N10_A12_87", "A12sp_A12_56", "N09_A05_18" ]
            },
            {
                "queryId" : "N47_A30_134",
                "referenceIds" : [ "N47_A30_136", "I15im_A12_61", "N02_A36_159", "N04_A36_165" ]
            },
            {
                "queryId" : "N47_A30_135",
                "referenceIds" : [ "N47_A30_134", "A12sp_A12_58", "N11_A05_20", "N12_A30_133" ]
            },
            {
                "queryId" : "N47_A30_136",
                "referenceIds" : [ "N47_A30_135", "N09_A08_37", "N02_A08_27", "N01_A34_139" ]
            },
        ]
    },
    { 
        id : "14",
        name : "ping",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "ping_G_261",
                "referenceIds" : [ "ping_G_262", "N05_A30_120", "N24_G_253", "N05_I18_320" ]
            },
            {
                "queryId" : "ping_G_262",
                "referenceIds" : [ "ping_G_264", "N24_G_253", "N05_I18_320", "N24_I31_329" ]
            },
            {
                "queryId" : "ping_G_263",
                "referenceIds" : [ "ping_G_261", "N05_I18_320", "N24_I31_329", "N05_A08_31" ]
            },
            {
                "queryId" : "ping_G_264",
                "referenceIds" : [ "ping_G_262", "N24_I31_329", "N05_A08_31", "N05_A12_75" ]
            },
            {
                "queryId" : "ping_I15_310",
                "referenceIds" : [ "ping_I15_311", "N05_A12_75", "N24_I11_295", "N05_A36_167" ]
            },

        ]
    },
    { 
        id : "15",
        name : "N24",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N24_G_253",
                "referenceIds" : [ "N24_I11_295", "N05_A12_75", "N05_A35_148", "N05_A30_120" ]
            },
            {
                "queryId" : "N24_I11_295",
                "referenceIds" : [ "N24_I11_296", "N05_A35_148", "N05_A30_120", "pingAP_G_265" ]
            },
            {
                "queryId" : "N24_I11_296",
                "referenceIds" : [ "N24_I11_295", "N05_A30_120", "pingAP_G_265", "ping_I15_311" ]
            },
            {
                "queryId" : "N24_I15_305",
                "referenceIds" : [ "N24_I31_329", "pingAP_G_265", "ping_I15_311", "N05_A36_167" ]
            },
            {
                "queryId" : "N24_I31_329",
                "referenceIds" : [ "N24_I15_305", "ping_I15_311", "N05_A36_167", "N05_A36_169" ]
            },
        ]
    },
    { 
        id : "16",
        name : "N23",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N23_G_252",
                "referenceIds" : [ "N23_G03_270", "N01_AI_187", "N01_A34_142", "N01_A30_113" ]
            },
            {
                "queryId" : "N23_G03_270",
                "referenceIds" : [ "N23_G_252", "N01_A34_142", "N01_A30_113", "N01_C10_222" ]
            },
            {
                "queryId" : "N23_G17_271",
                "referenceIds" : [ "N23_G17_272", "N01_A30_113", "N01_C10_222", "N01_A12_64" ]
            },
            {
                "queryId" : "N23_G17_272",
                "referenceIds" : [ "N23_G17_271", "N01_C10_222", "N01_A12_64", "N01_A34_140" ]
            },
            {
                "queryId" : "N23_I11_291",
                "referenceIds" : [ "N23_I11_292", "N01_A12_64", "N01_A34_140", "N01_C_206" ]
            },
        ]
    },
    { 
        id : "17",
        name : "N20",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N20_C_215",
                "referenceIds" : [ "N20_C06_221", "N03_C10_224", "N08_B07_196", "N08_A04_8" ]
            },
            {
                "queryId" : "N20_C06_221",
                "referenceIds" : [ "N20_C10_233", "N08_B07_196", "N08_A04_8", "N08_D_243" ]
            },
            {
                "queryId" : "N20_C10_233",
                "referenceIds" : [ "N20_C06_221", "N08_A04_8", "N08_D_243", "N12_A08_39" ]
            },
            {
                "queryId" : "N20_C10_234",
                "referenceIds" : [ "N20_C10_233", "N08_D_243", "N12_A08_39", "N12_D_247" ]
            },
            {
                "queryId" : "N20_C10_235",
                "referenceIds" : [ "N20_C10_234", "N12_A08_39", "N12_D_247", "N03_A12_68" ]
            },
        ]
    },
    { 
        id : "18",
        name : "N17/N18",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N17_A08_40",
                "referenceIds" : [ "N17_A08_41", "N47_A36_181", "N08_A08_36", "N47_A34_145" ]
            },
            {
                "queryId" : "N17_A08_41",
                "referenceIds" : [ "N17_A08_40", "N08_A08_36", "N47_A34_145", "N47_A12_92" ]
            },
            {
                "queryId" : "N18_B07_204",
                "referenceIds" : [ "N18_B07_205", "N01_A30_112", "N01_A24_101", "N01_A34_140" ]
            },
            {
                "queryId" : "N18_B07_205",
                "referenceIds" : [ "N18_B07_205", "N01_A24_101", "N01_A34_140", "N01_B07_190" ]
            },
            {
                "queryId" : "N18_C10_232",
                "referenceIds" : [ "N18_B07_205", "N01_A34_140", "N01_B07_190", "N01_AI_187" ]
            },

        ]
    },
    { 
        id : "19",
        name : "N26",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N26_G17_274",
                "referenceIds" : [ "N26_G17_275", "N03_A30_116", "trill_I15_315", "N03_A36_161" ]
            },
            {
                "queryId" : "N26_G17_275",
                "referenceIds" : [ "N26_G17_274", "trill_I15_315", "N03_A36_161", "N03_C10_224" ]
            },
            {
                "queryId" : "N26_I11_297",
                "referenceIds" : [ "N26_I31_331", "N03_A36_161", "N03_C10_224", "N03_A12_68" ]
            },
            {
                "queryId" : "N26_I31_331",
                "referenceIds" : [ "N26_I11_297", "N03_C10_224", "N03_A12_68", "trill_G_268" ]
            },
            {
                "queryId" : "N26_G17_275",
                "referenceIds" : [ "N26_I31_331", "trill_I15_315", "N03_A36_161", "N03_C10_224" ]
            },
        ]
    },
    { 
        id : "20",
        name : "N28",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N28_G_254",
                "referenceIds" : [ "N28_G17_276", "N02_A36_159", "N29_G17_277", "N02_A05_12" ]
            },
            {
                "queryId" : "N28_G17_276",
                "referenceIds" : [ "N28_G_254", "N29_G17_277", "N02_A05_12", "N02_A36_160" ]
            },
            {
                "queryId" : "N28_I15_309",
                "referenceIds" : [ "N28_G17_276", "N02_A05_12", "N02_A36_160", "N02_A36_159" ]
            },
            {
                "queryId" : "N28_G17_276",
                "referenceIds" : [ "N28_G17_276", "N29_G17_277", "N02_A05_12", "N02_A36_160" ]
            },
            {
                "queryId" : "N28_I15_309",
                "referenceIds" : [ "N28_G_254", "N02_A05_12", "N02_A36_160", "N02_A36_159" ]
            },
        ]
    },
    { 
        id : "21",
        name : "N29-N33",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N29_G17_277",
                "referenceIds" : [ "N29_G17_277", "N17_A08_41", "N44_G17_279", "N45_G_258" ]
            },
            {
                "queryId" : "N30_I31_332",
                "referenceIds" : [ "N30_I31_332", "N44_G17_279", "N45_G_258", "N18_C10_232" ]
            },
            {
                "queryId" : "N32i_R_336",
                "referenceIds" : [ "N32i_R_336", "N45_G_258", "N18_C10_232", "N41_G_257" ]
            },
            {
                "queryId" : "N32ii_R_337",
                "referenceIds" : [ "N32ii_R_337", "N18_C10_232", "N41_G_257", "N41_G17_278" ]
            },
            {
                "queryId" : "N33_R_338",
                "referenceIds" : [ "N33_R_339", "N41_G_257", "N41_G17_278", "N17_A08_40" ]
            },
        ]
    },
    { 
        id : "22",
        name : "N34-N45",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N38_G_255",
                "referenceIds" : [ "N38_G_255", "N03_H_282", "trill_A30_138", "trill_G_267" ]
            },
            {
                "queryId" : "N41_G_256",
                "referenceIds" : [ "N41_G_257", "trill_A30_138", "trill_G_267", "N03_A30_116" ]
            },
            {
                "queryId" : "N41_G_257",
                "referenceIds" : [ "N41_G_256", "trill_G_267", "N03_A30_116", "N02_A30_115" ]
            },
            {
                "queryId" : "N45_G_258",
                "referenceIds" : [ "N45_G_258", "N03_A30_116", "N02_A30_115", "N03_A12_68" ]
            },
            {
                "queryId" : "N41_G17_278",
                "referenceIds" : [ "N41_G_257", "N02_A30_115", "N03_A12_68", "N03_C06_217" ]
            },
        ]
    },
    { 
        id : "23",
        name : "un",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "un_A12_98",
                "referenceIds" : [ "un_A12_99", "N07_A08_33", "N01_I18_316", "N01_C_207" ]
            },
            {
                "queryId" : "un_A12_99",
                "referenceIds" : [ "un_A12_98", "N01_I18_316", "N01_C_207", "N01_A36_154" ]
            },
            {
                "queryId" : "un_A25_109",
                "referenceIds" : [ "un_A25_110", "N01_C_207", "N01_A36_154", "N01_I18_317" ]
            },
            {
                "queryId" : "un_A25_110",
                "referenceIds" : [ "un_A25_109", "N01_A36_154", "N01_I18_317", "N07_A36_171" ]
            },
            {
                "queryId" : "un_C10_237",
                "referenceIds" : [ "un_C10_238", "N01_I18_317", "N07_A36_171", "N01_B07_189" ]
            },
        ]
    },
    { 
        id : "24",
        name : "A12sp",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "A12sp_A12_53",
                "referenceIds" : [ "A12sp_A12_54", "N09sh_A36_175", "N07_A04_5", "N07_A05_15" ]
            },
            {
                "queryId" : "A12sp_A12_54",
                "referenceIds" : [ "A12sp_A12_53", "N07_A04_5", "N07_A05_15", "N07_A08_33" ]
            },
            {
                "queryId" : "A12sp_A12_55",
                "referenceIds" : [ "A12sp_A12_57", "N07_A05_15", "N07_A08_33", "N09_A35_150" ]
            },
            {
                "queryId" : "A12sp_A12_56",
                "referenceIds" : [ "A12sp_A12_54", "N07_A08_33", "N09_A35_150", "N09_A30_126" ]
            },
            {
                "queryId" : "A12sp_A12_57",
                "referenceIds" : [ "A12sp_A12_56", "N09_A35_150", "N09_A30_126", "N09_A12_83" ]
            },
        ]
    },
    { 
        id : "25",
        name : "A30sp/I15im",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "A30sp_A12_60",
                "referenceIds" : [ "A30sp_A36_153", "N09_A11_49", "N07_C_208", "N09_A30_124" ]
            },
            {
                "queryId" : "A30sp_A36_153",
                "referenceIds" : [ "A30sp_A12_60", "N07_C_208", "N09_A30_124", "N07_A04_6" ]
            },
            {
                "queryId" : "I15im_A12_61",
                "referenceIds" : [ "I15im_A12_62", "N01_A34_140", "N01_B07_189", "N01_C_207" ]
            },
            {
                "queryId" : "I15im_A12_62",
                "referenceIds" : [ "I15im_A12_61", "N01_B07_189", "N01_C_207", "N01_A30_112" ]
            },
            {
                "queryId" : "I15im_A12_63",
                "referenceIds" : [ "I15im_A12_61", "N01_C_207", "N01_A30_112", "N01_A34_140" ]
            },
        ]
    },
    { 
        id : "26",
        name : "N04 A01/other",
        highScore : 0,
        match : ['name','matriline'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N04_A12_69",
                "referenceIds" : [ "N04_A12_70", "N04_A04_3", "N04_A04_4", "N04_A05_14" ]
            },
            {
                "queryId" : "N04_A12_70",
                "referenceIds" : [ "N04_A12_69", "N04_A04_4", "N04_A05_14", "N04_A08_28" ]
            },
            {
                "queryId" : "N04_A12_71",
                "referenceIds" : [ "N04_A12_73", "N04_A05_14", "N04_A08_28", "N04_A08_29" ]
            },
            {
                "queryId" : "N04_A12_72",
                "referenceIds" : [ "N04_A12_71", "N04_A08_28", "N04_A08_29", "N04_A08_30" ]
            },
            {
                "queryId" : "N04_A12_73",
                "referenceIds" : [ "N04_A12_70", "N04_A08_29", "N04_A08_30", "N04_A11_44" ]
            },
        ]
    },
    { 
        id : "27",
        name : "N02 A01",
        highScore : 0,
        match : ['name','matriline'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N02_A12_66",
                "referenceIds" : [ "N02_A12_67", "N02_A04_1", "N02_A05_12", "N02_A08_27" ]
            },
            {
                "queryId" : "N02_A12_67",
                "referenceIds" : [ "N02_A12_66", "N02_A05_12", "N02_A08_27", "N02_A34_143" ]
            },
            {
                "queryId" : "N02_A30_115",
                "referenceIds" : [ "N02_A30_115", "N02_A08_27", "N02_A34_143", "N02_A04_1" ]
            },
            {
                "queryId" : "N02_A36_158",
                "referenceIds" : [ "N02_A36_160", "N02_A34_143", "N02_A04_1", "N02_A05_12" ]
            },
            {
                "queryId" : "N02_A36_159",
                "referenceIds" : [ "N02_A36_158", "N02_A04_1", "N02_A05_12", "N02_A08_27" ]
            },
        ]
    },
    { 
        id : "28",
        name : "N03 A01",
        highScore : 0,
        match : ['name','matriline'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N03_A12_68",
                "referenceIds" : [ "N03_A12_68", "N03_A04_2", "N03_A05_13", "N03_A24_102" ]
            },
            {
                "queryId" : "N03_A30_116",
                "referenceIds" : [ "N03_A30_117", "N03_A05_13", "N03_A24_102", "N03_C06_217" ]
            },
            {
                "queryId" : "N03_A30_117",
                "referenceIds" : [ "N03_A30_116", "N03_A24_102", "N03_C06_217", "N03_C10_224" ]
            },
            {
                "queryId" : "N03_A36_161",
                "referenceIds" : [ "N03_A36_162", "N03_C06_217", "N03_C10_224", "N03_C10_225" ]
            },
            {
                "queryId" : "N03_A36_162",
                "referenceIds" : [ "N03_A36_161", "N03_C10_224", "N03_C10_225", "N03_A05_13" ]
            },
        ]
    },
    { 
        id : "29",
        name : "N01 A30/C",
        highScore : 0,
        match : ['name','matriline'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N01_A30_112",
                "referenceIds" : [ "N01_A30_114", "N01_C_206", "N01_C_207", "N01_C06_216" ]
            },
            {
                "queryId" : "N01_A30_113",
                "referenceIds" : [ "N01_A30_112", "N01_C_207", "N01_C06_216", "N01_C10_222" ]
            },
            {
                "queryId" : "N01_A30_114",
                "referenceIds" : [ "N01_A30_113", "N01_C06_216", "N01_C10_222", "N01_C10_223" ]
            },
            {
                "queryId" : "N01_A30_112",
                "referenceIds" : [ "N01_A30_113", "N01_C_206", "N01_C_207", "N01_C06_216" ]
            },
            {
                "queryId" : "N01_A30_113",
                "referenceIds" : [ "N01_A30_114", "N01_C_207", "N01_C06_216", "N01_C10_222" ]
            },
        ]
    },
    { 
        id : "30",
        name : "N01 A12/CD",
        highScore : 0,
        match : ['name','matriline'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N01_A34_140",
                "referenceIds" : [ "N01_A34_139", "N01_B07_191", "N01_C10_222", "N01_B07_190" ]
            },
            {
                "queryId" : "N01_A12_64",
                "referenceIds" : [ "N01_A12_65", "N01_B07_189", "N01_C06_216", "N01_C_207" ]
            },
            {
                "queryId" : "N01_A12_65",
                "referenceIds" : [ "N01_A12_64", "N01_C06_216", "N01_C_207", "N01_B07_191" ]
            },
            {
                "queryId" : "N01_A34_139",
                "referenceIds" : [ "N01_A34_142", "N01_C_207", "N01_B07_191", "N01_C10_222" ]
            },
            {
                "queryId" : "N01_A34_141",
                "referenceIds" : [ "N01_A34_140", "N01_C10_222", "N01_B07_190", "N01_C_206" ]
            },
        ]
    },
    { 
        id : "31",
        name : "N07 A01/BCHI",
        highScore : 0,
        match : ['name','matriline'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "N07_A12_77",
                "referenceIds" : [ "N07_A12_78", "N07_B07_193", "N07_B07_194", "N07_B07_195" ]
            },
            {
                "queryId" : "N07_A12_78",
                "referenceIds" : [ "N07_A12_77", "N07_B07_194", "N07_B07_195", "N07_C_208" ]
            },
            {
                "queryId" : "N07_A30_121",
                "referenceIds" : [ "N07_A30_121", "N07_B07_195", "N07_C_208", "N07_H_284" ]
            },
            {
                "queryId" : "N07_A36_170",
                "referenceIds" : [ "N07_A36_171", "N07_C_208", "N07_H_284", "N07_I18_321" ]
            },
            {
                "queryId" : "N07_A36_171",
                "referenceIds" : [ "N07_A36_170", "N07_H_284", "N07_I18_321", "N07_B07_193" ]
            },
        ]
    }
];