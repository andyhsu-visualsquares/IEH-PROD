/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 */
 define(['N/search', 'N/error', 'N/file', 'N/log', 'N/record', 'N/runtime'], function(search, error, file, log, record, runtime) {

    function getInputData() {
        return [492268,429601,895260,597445,960864,940890,1036808,709103,920101,3071,920102,871995,1036795,928935,975441,1036797,749097,1017030,1005023,1035814,969035,437007,58906,913787,3066,1001735,929942,1026052,940894,3081,872246,1036799,58901,1025360,833992,935365,652254,488138,872199,772468,3048,671940,595245,880721,872247,1036813,640351,923518,922617,25840,872002,1012532,823557,864573,3092,935871,524012,1011422,360818,610540,872207,1024659,1040873,1018667,974436,1036796,26140,591328,857811,601699,1004472,6140,762885,505953,1040892,58904,1036805,889643,1040901,160683,1014582,1036807,3056,721369,1015390,872227,888038,511698,890145,488248,645367,585904,1038608,488142,1040936,1001932,541765,919006,1040944,872203,1030661,872204,872235,1023655,815305,629487,1026663,708008,992740,712743,73222,911945,3083,869896,661296,507582,652252,740298,1036814,403185,857897,1041068,872225,1002592,1036817,967909,3096,642705,631323,684985,416484,712740,1041105,912005,3088,784007,859224,1015468,677076,1017956,941402,780433,3065,959387,923714,722773,5940,879416,456338,815309,910316,417185,857941,902123,1026212,646707,783838,928934,844975,872001,944326,872202,740792,549296,1026715,503934,1040579,3085,1041184,503252,1009592,1006150,891354,1041202,895257,315559,882441,871102,1036820,1041218,1041220,935364,3094,486429,1036811,1041224,872205,708301,659994,872197,1041231,922008,1036812,505951,1041234,620105,535241,1011938,127670,729628,871999,1038816,651062,708819,58905,805500,3064,815310,872226,560821,79345,591394,600984,84454,1026792,1041320,1041324,783836,150710,1041332,872305,1041335,907598,668245,910365,603088,771889,256195,766728,851605,931248,1008530,839627,1037207,761111,1030672,872195,789704,1016337,431401,562757,30741,336973,720996,18042,627688,865190,924818,921927,593956,48972,599458,936371,709724,762997,490461,1022797,871991,690968,1013546,718692,1041657,1018865,924616,931660,1041665,938279,872232,869309,1036801,933762,588606,931569,675183,58902,699922,1041687,999231,289741,932177,623881,870989,216996,714556,695884,61407,931157,570123,941812,872005,612680,1036804,1017286,463095,896287,3067,816758,497687,1041753,589769,936270,629779,762094,708334,599916,3042,503349,888238,627318,1041780,1019702,658681,1041785,1041786,890144,681237,511792,1036420,740414,3046,15641,330671,442707,566716,783835,870991,871032,661295,1004156,863171,861741,473998,974546,872196,648586,992931,917618,704592,702003,872240,1040619,522477,1030556,951951,317463,969038,1021048,681565,747639,980150,1014944,984891,734030,1041873,644587,413584,503266,3053,921520,1014094,331072,1041907,549381,1041910,731245,1041914,1036802,633749,558780,815561,297445,809437,925521,583382,738824,3049,939516,941093,661297,157941,783839,712741,669858,1036315,724258,486486,861813,650665,853987,871016,629892,872499,1041983,25641,989534,631816,923150,930680,726001,826294,493899,1042010,444407,813749,1042017,646384,725587,456639,3087,627934,726437,1042037,3068,859689,1042044,1042045,647072,634628,885535,1042049,1042050,924617,627945,872237,741456,689800,897016,669453,730200,860853,915412,867932,716572,1042086,1000252,994852,731298,872230,3098,747827,1021805,506414,740443,2840,1004701,782608,292344,1019050,690481,1016533,702051,909657,1032967,1042136,1042138,496814,38547,1042145,902996,549397,1036816,909662,393873,716575,674853,1025809,1036815,1042167,637508,1042169,663128,607227,929987,722037,712745,783843,869117,872206,546774,3062,1042196,890146,603365,718860,779621,815613,575050,909686,463895,815616,923716,1024049,609446,865797,963579,3040,834496,828054,936301,738702,3073,1035712,510702,349178,698112,872194,1002745,910618,1034398,949165,40353,1042266,981247,616827,647965,477707,597388,1025050,13743,522501,1042301,455339,872201,872193,503286,881533,872233,647402,498522,3057,831396,941505,12140,12141,12143,12142,12144,1034297]
    }

    function map(context) {
      log.debug("Check"+typeof(context.value), "context.value:"+JSON.stringify(context.value));
        var newID = record.submitFields({
            type: "customer",
            id: context.value,
            values: {
                "isinactive": false,
                "custentity_approve":true,
            }
        })
    }

    function reduce(context) {
        
    }

    function summarize(summary) {
        
    }

    return {
        getInputData: getInputData,
        map: map,
        // reduce: reduce,
        summarize: summarize
    }
});