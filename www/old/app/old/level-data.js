window.initVersion = 0.40;

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
        name : "orca",
        highScore : 0,
        match : ['name'],
        played: false,
        locked: false,
        turns : [
            {
                "queryId" : "calls-A-001",
                "referenceIds" : [ "calls-A-002", "quiet-001" ]
            }
        ],
    },
    { 
        id : "1",
        name : "boat",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "boat-001",
                "referenceIds" : [ "boat-002", "calls-A-004", "calls-G-004" ]
            },
            {
                "queryId" : "boat-003",
                "referenceIds" : [ "boat-004", "calls-A-005", "calls-G-005" ]
            },
            {
                "queryId" : "boat-005",
                "referenceIds" : [ "boat-001", "calls-A-003", "calls-G-003" ]
            },
        ]
    },
    { 
        id : "2",
        name : "voice",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "voice-001",
                "referenceIds" : [ "voice-002", "quiet-001", "calls-R-001" ]
            },
            {
                "queryId" : "voice-003",
                "referenceIds" : [ "voice-004", "boat-001", "calls-R-002" ]
            },
            {
                "queryId" : "voice-005",
                "referenceIds" : [ "voice-001", "radiointerference-001", "calls-R-003" ]
            },
        ]
    },
    { 
        id : "3",
        name : "radio",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "radiointerference-001",
                "referenceIds" : [ "radiointerference-002", "calls-A-001", "calls-G-001" ]
            },
            {
                "queryId" : "radiointerference-003",
                "referenceIds" : [ "radiointerference-004", "calls-A-002", "calls-G-002" ]
            },
            {
                "queryId" : "radiointerference-005",
                "referenceIds" : [ "radiointerference-001", "quiet-005", "calls-G-003" ]
            },
        ]
    },
    { 
        id : "4",
        name : "dolphins",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "dolphins-001",
                "referenceIds" : [ "dolphins-002", "humpback-001", "offshores-001", "californiasealion-001" ]
            },
            {
                "queryId" : "dolphins-003",
                "referenceIds" : [ "dolphins-004", "offshores-002", "calls-A-002", "calls-A-003" ]
            },
            {
                "queryId" : "dolphins-005",
                "referenceIds" : [ "dolphins-001", "californiasealion-002", "calls-G-001", "calls-R-001" ]
            },
        ]
    },
    { 
        id : "5",
        name : "sealion",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "californiasealion-001",
                "referenceIds" : [ "californiasealion-002", "humpback-001", "offshores-001", "dolphins-001" ]
            },
            {
                "queryId" : "californiasealion-003",
                "referenceIds" : [ "californiasealion-004", "calls-G-005", "humpback-002", "calls-R-001" ]
            },            
            {
                "queryId" : "californiasealion-005",
                "referenceIds" : [ "californiasealion-001", "dolphins-004", "dolphins-002", "calls-R-005" ]
            },

        ]
    },
    { 
        id : "6",
        name : "humpback",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "humpback-001",
                "referenceIds" : [ "humpback-002", "offshores-001", "offshores-001", "dolphins-001" ]
            },
            {
                "queryId" : "humpback-003",
                "referenceIds" : [ "humpback-004", "calls-G-005", "offshores-002", "calls-R-001" ]
            },            
            {
                "queryId" : "humpback-005",
                "referenceIds" : [ "humpback-001", "dolphins-004", "dolphins-002", "calls-R-005" ]
            },
        ]
    },
    { 
        id : "7",
        name : "SR",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "southernresidents-001",
                "referenceIds" : [ "southernresidents-002", "dolphins-001", "humpback-001", "calls-R-005" ]
            },
            {
                "queryId" : "southernresidents-003",
                "referenceIds" : [ "southernresidents-004", "calls-A-001", "calls-G-001", "calls-R-001" ]
            },            
            {
                "queryId" : "southernresidents-005",
                "referenceIds" : [ "southernresidents-001", "calls-A-002", "calls-A-003", "calls-R-002" ]
            },
        ]
    },
    { 
        id : "8",
        name : "Offshores",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "offshores-001",
                "referenceIds" : [ "offshores-002", "dolphins-001", "humpback-001", "calls-R-005" ]
            },
            {
                "queryId" : "offshores-003",
                "referenceIds" : [ "offshores-004", "calls-A-001", "calls-G-001", "calls-R-001" ]
            },            
            {
                "queryId" : "offshores-005",
                "referenceIds" : [ "offshores-001", "calls-A-002", "calls-A-003", "calls-R-002" ]
            },
        ]
    },
    { 
        id : "9",
        name : "Transients",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "transient-001",
                "referenceIds" : [ "transient-002", "dolphins-001", "humpback-001", "calls-R-005" ]
            },
            {
                "queryId" : "transient-003",
                "referenceIds" : [ "transient-004", "calls-A-001", "calls-G-001", "calls-R-001" ]
            },            
            {
                "queryId" : "transient-005",
                "referenceIds" : [ "transient-001", "calls-A-002", "calls-A-003", "calls-R-002" ]
            },
        ]
    },
    { 
        id : "10",
        name : "NR",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "calls-A-001",
                "referenceIds" : [ "calls-A-002", "southernresidents-001", "transient-001", "offshores-001" ]
            },
            {
                "queryId" : "calls-G-003",
                "referenceIds" : [ "calls-G-004", "southernresidents-002", "transient-002", "offshores-002" ]
            },            
            {
                "queryId" : "calls-R-005",
                "referenceIds" : [ "calls-R-001", "southernresidents-003", "transient-003", "offshores-004" ]
            },

        ]
    },
    { 
        id : "11",
        name : "A clan",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "calls-A-001",
                "referenceIds" : [ "calls-A-002", "calls-G-001", "calls-R-001", "calls-R-004" ]
            },
            {
                "queryId" : "calls-A-003",
                "referenceIds" : [ "calls-A-004", "calls-G-002", "calls-R-002", "calls-R-005" ]
            },            
            {
                "queryId" : "calls-A-005",
                "referenceIds" : [ "calls-A-001", "calls-G-003", "calls-G-004", "calls-R-001" ]
            },
            {
                "queryId" : "calls-A-002",
                "referenceIds" : [ "calls-A-004", "calls-G-001", "calls-G-005", "calls-R-005" ]
            },
            {
                "queryId" : "calls-A-005",
                "referenceIds" : [ "calls-A-002", "calls-G-001", "calls-G-002", "calls-R-002" ]
            },

        ]
    },
    { 
        id : "12",
        name : "G clan",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "calls-G-001",
                "referenceIds" : [ "calls-G-002", "calls-A-001", "calls-R-001", "calls-R-004" ]
            },
            {
                "queryId" : "calls-G-003",
                "referenceIds" : [ "calls-G-004", "calls-A-002", "calls-R-002", "calls-R-005" ]
            },            
            {
                "queryId" : "calls-G-005",
                "referenceIds" : [ "calls-G-001", "calls-A-003", "calls-A-004", "calls-R-001" ]
            },
            {
                "queryId" : "calls-G-002",
                "referenceIds" : [ "calls-G-004", "calls-A-001", "calls-A-005", "calls-R-005" ]
            },
            {
                "queryId" : "calls-G-005",
                "referenceIds" : [ "calls-G-002", "calls-A-001", "calls-A-002", "calls-R-002" ]
            },

        ]
    },
    { 
        id : "13",
        name : "R clan",
        highScore : 0,
        match : ['name'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "calls-R-001",
                "referenceIds" : [ "calls-R-002", "calls-G-001", "calls-A-001", "calls-A-004" ]
            },
            {
                "queryId" : "calls-R-003",
                "referenceIds" : [ "calls-R-004", "calls-G-002", "calls-A-002", "calls-A-005" ]
            },            
            {
                "queryId" : "calls-R-005",
                "referenceIds" : [ "calls-R-001", "calls-G-003", "calls-G-004", "calls-A-001" ]
            },
            {
                "queryId" : "calls-R-002",
                "referenceIds" : [ "calls-R-004", "calls-G-001", "calls-G-005", "calls-A-005" ]
            },
            {
                "queryId" : "calls-R-005",
                "referenceIds" : [ "calls-R-002", "calls-G-001", "calls-G-002", "calls-A-002" ]
            },

        ]
    },
        { 
            id : "14",
            levelNumber : "4",
            name : "As N1",
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
                    "queryId" : "N01_A12_64",
                    "referenceIds" : [ "N01_A34_142", "N03_A12_68", "N09_A12_84", "N02_A34_143" ]
                },

            ]
        },
        { 
            id : "15",
            levelNumber : "2",
            name : "As N4",
            highScore : 0,
            match : ['name'],
            played : false,
            locked: false,
            turns : [
                {
                    "queryId" : "N04_A12_71",
                    "referenceIds" : [ "N04_A12_73", "N03_A12_68", "N08_A12_80", "weeawu_A11_52" ]
                },
                {
                    "queryId" : "N04_A12_70",
                    "referenceIds" : [ "N04_A12_71", "N11_A12_89", "N05_A12_76", "N02_A34_143" ]
                },
                {
                    "queryId" : "N04_A12_72",
                    "referenceIds" : [ "N04_A12_69", "N01_A12_65", "N09_A05_17", "N03_A12_68" ]
                },
                {
                    "queryId" : "N04_A12_73",
                    "referenceIds" : [ "N04_A12_69", "N02_A34_143", "weeawu_A11_52", "N01_A12_65" ]
                },
            ]
        },
        { 
            id : "16",
            levelNumber : "10",
            name : "As N2",
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
            id : "17",
            levelNumber : "8",
            name : "As N7",
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
            id : "18",
            levelNumber : "17",
            name : "Bs N16",
            highScore : 0,
            match : ['name'],
            played : false,
            locked: false,
            turns : [
                {
                    "queryId" : "N16_B07_200",
                    "referenceIds" : [ "N16_B07_201", "N09_A08_37", "N09_A11_50", "N09_A36_172" ]
                },
                {
                    "queryId" : "N16_B07_201",
                    "referenceIds" : [ "N16_B07_200", "N09_A11_50", "N09_A36_172", "N09_A05_17" ]
                },
                {
                    "queryId" : "N16_B07_202",
                    "referenceIds" : [ "N16_B07_201", "N09_A36_172", "N09_A05_17", "N07_A30_121" ]
                },
                {
                    "queryId" : "N16_B07_203",
                    "referenceIds" : [ "N16_B07_200", "N09_A05_17", "N07_A30_121", "N09_A12_84" ]
                },
                {
                    "queryId" : "N16_B07_200",
                    "referenceIds" : [ "N16_B07_201", "N09_A08_37", "N09_A11_50", "N09_A36_172" ]
                },
            ]
        },
        { 
            id : "19",
            levelNumber : "13",
            name : "Gs ping",
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
                    "queryId" : "ping_G_262",
                    "referenceIds" : [ "ping_G_264", "N24_G_253", "N05_I18_320", "N24_I31_329" ]
                },
            ]
        },
        { 
            id : "20",
            levelNumber : "15",
            name : "Gs N23",
            highScore : 0,
            match : ['name'],
            played : false,
            locked: false,
            turns : [
                {
                    "queryId" : "N23_G_252",
                    "referenceIds" : [ "N23_G03_270", "N01_A12_64", "N01_A34_142", "N01_A30_113" ]
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
                    "queryId" : "N23_G03_270",
                    "referenceIds" : [ "N23_G_252", "N01_A12_64", "N01_A34_140", "N01_C_206" ]
                },
            ]
        },
        { 
            id : "21",
            levelNumber : "22",
            name : "Gs N29",
            highScore : 0,
            match : ['name'],
            played : false,
            locked: false,
            turns : [
                {
                    "queryId" : "N29_G17_277",
                    "referenceIds" : [ "N29_G17_277", "N17_A08_41", "N44_G17_279", "N45_G_258" ]
                },
            ]
        },
        { 
            id : "22",
            levelNumber : "6",
            name : "Gs trill",
            highScore : 0,
            match : ['name'],
            played : false,
            locked: false,
            turns : [
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
                {
                    "queryId" : "trill_G_266",
                    "referenceIds" : [ "trill_G_267", "honk_A24_106", "squawk_I15_312", "honk_A04_9" ]
                },
            ]
        },
        { 
            id : "23",
            levelNumber : "22",
            name : "Rs N32/N33",
            highScore : 0,
            match : ['name'],
            played : false,
            locked: false,
            turns : [
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
                {
                    "queryId" : "N33_R_339",
                    "referenceIds" : [ "N33_R_338", "N41_G17_278", "N17_A08_40", "N18_B07_205" ]
                },
                {
                    "queryId" : "N34_R_340",
                    "referenceIds" : [ "N34_R_340", "N03_C06_217", "N02_A08_27", "trill_A30_138" ]
                },
            ]
        },
    { 
        id : "24",
        name : "",
        highScore : 0,
        match : ['name','matriline'],
        played : false,
        locked: false,
        turns : [
            {
                "queryId" : "californiasealion-001",
                "referenceIds" : [ "californiasealion-002", "", "", "" ]
            },
            {
                "queryId" : "californiasealion-003",
                "referenceIds" : [ "californiasealion-004", "", "", "" ]
            },            
            {
                "queryId" : "californiasealion-005",
                "referenceIds" : [ "californiasealion-001", "", "", "" ]
            },

        ]
    },



];