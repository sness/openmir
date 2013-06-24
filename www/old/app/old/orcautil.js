////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// game.js                                                                    //
//                                                                            //
// a matching game for orca calls using phonegap on the ipad and iphone       //
//                                                                            //
// sness@sness.net - 2012 - GPLv3                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// One global settings object for the application
window.settings = {
    phonegapReady : false,
    mute: false
};

var currentDownButton = undefined;
var currentDownButtonWidth = undefined;

function bindClickButtons() {
    // $('img').bind('dragstart', function(event) { event.preventDefault(); });
    // $('h1').bind('dragstart', function(event) { event.preventDefault(); });

    // $(".clickButton").on('xdown', function() {
    //     $(this).animate({width: "+=10px", "top": "-=3px", "left": "-=3px"}, 50);
    //     currentDownButton = $(this);
    //     currentDownButtonWidth = $(this).width();
    // });

    // $(document).on('xup', function() {
    //     if (currentDownButton !== undefined) {
    //         currentDownButton.animate({width: currentDownButtonWidth, "top": "+=3px", "left": "+=3px"}, 50);
    //     }
    // });
}

//
// Preload all the pushed button states to avoid flicker
//
var BACKGROUND_IMAGES = new Array()

function preload() {
    for (i = 0; i < preload.arguments.length; i++) {
        BACKGROUND_IMAGES[i] = new Image()
        BACKGROUND_IMAGES[i].src = preload.arguments[i]
    }
}


function preloadButtonImages() {
    // preload(
    //     'assets/images/backgrounds/mainScreen.png',
    //     'assets/images/backgrounds/scoreBoardScreen.png',
    //     'assets/images/backgrounds/playScreen.png',
    //     'assets/images/backgrounds/levelCompleteBackground.png',
    //     'assets/images/buttons/mainPlayButton.png',
    //     'assets/images/buttons/mainPlayButtonPressed.png',
    //     'assets/images/buttons/levelLocked.png',
    //     'assets/images/buttons/levelUnlocked.png',
    //     'assets/images/buttons/levelUnlockedPressed.png',
    //     'assets/images/buttons/backButton.png',
    //     'assets/images/buttons/backButtonPressed.png',
    //     'assets/images/buttons/selectButton.png',
    //     'assets/images/buttons/selectButtonPressed.png',
    //     'assets/images/buttons/nextButton.png',
    //     'assets/images/buttons/nextButtonPressed.png',
    //     'assets/images/backgrounds/pickReferenceCallScreen.png',
    //     'assets/images/backgrounds/didntMatch1.png',
    //     'assets/images/backgrounds/didntMatch2.png',
    //     'assets/images/backgrounds/didntMatch3.png',
    //     'assets/images/buttons/tryAgainButton.png',
    //     'assets/images/buttons/tryAgainButtonPressed.png',
    //     'assets/images/buttons/showAnswerButton.png',
    //     'assets/images/buttons/showAnswerButtonPressed.png',
    //     'assets/images/buttons/scoreBoard.png',
    //     'assets/images/buttons/scoreBoardPressed.png',
    //     'assets/images/buttons/replayLevel.png',
    //     'assets/images/buttons/replayLevelPressed.png',
    //     'assets/images/buttons/nextLevel.png',
    //     'assets/images/buttons/nextLevelPressed.png',
    //     'assets/images/buttons/pauseButton.png',
    //     'assets/images/buttons/pauseButtonPressed.png',
    //     'assets/images/backgrounds/pauseScreenBackground.png',
    //     'assets/images/buttons/scoreBoardButton.png',
    //     'assets/images/buttons/scoreBoardButtonPressed.png',
    //     'assets/images/buttons/replayLevelButton.png',
    //     'assets/images/buttons/replayLevelButtonPressed.png',
    //     'assets/images/buttons/playButton.png',
    //     'assets/images/buttons/playButtonPressed.png',
    //     'assets/images/buttons/helpButton.png',
    //     'assets/images/buttons/helpButtonPressed.png',
    //     'assets/images/backgrounds/helpScreen0.png',
    //     'assets/images/backgrounds/helpScreen1.png',
    //     'assets/images/backgrounds/helpScreen2.png',
    //     'assets/images/backgrounds/helpScreen3.png',
    //     'assets/images/buttons/forwardButton.png',
    //     'assets/images/buttons/forwardButtonPressed.png'
    //     // "assets/orca/call-catalog/jpg/A04-N01-070706-D011-10403.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N02-070706-D011-10326.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N03-081806-D054-11845.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N04-070706-D011-10314.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N04-070706-D011-10406.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N07-071906-D020-13144.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N07-080406-D032-12346.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N08-071906-D020-13145.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-N08-080406-D032-12347.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-honk-070706-D011-10255.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-honk-070706-D011-10359.jpg",
    //     // "assets/orca/call-catalog/jpg/A04-weeawu-081606-D052-14856.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N02-072606-D024-04150.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N03-072606-D024-14103.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N04-082108-D120-11350.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N07-072606-D024-04535.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N08-072606-D024-04536.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N09-080906-D041-05938.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N09-082108-D120-11258.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N11-072606-D024-04506.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N11-072606-D024-04525.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N12-072606-D024-13527.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N12-082108-D120-11256.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N12-082108-D120-11303.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N13-072606-D024-04123.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-N13-072606-D024-13524.jpg",
    //     // "assets/orca/call-catalog/jpg/A05-bark-082108-D120-11244.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N02-082010-D072-15040.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N04-071110-D013-01214.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N04-071110-D013-01314.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N04-082010-D072-15117.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N05-082010-D072-14521.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N07-071110-D013-01151.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N07-071110-D013-01156.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N07-082010-D072-15209.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N07-082010-D072-15246.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N08-082010-D072-15210.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N09-082010-D072-15303.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N11-082010-D072-14800.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N12-082010-D072-15224.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N17-071110-D013-01344.jpg",
    //     // "assets/orca/call-catalog/jpg/A08-N17-082010-D072-14804.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N01-070806-D013-00132.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N01-070806-D013-00205.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N04-070806-D013-00057.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N04-070806-D013-00128.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N04-070806-D013-00136.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N04-073106-D028-02111.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N09-070806-D013-00139.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N09-070806-D013-00836.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-N09-073106-D028-02124.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-honk-073106-D028-02110.jpg",
    //     // "assets/orca/call-catalog/jpg/A11-weeawu-070806-D013-00817.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A12sp-072706-D025-04216.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A12sp-080110-D055-03601.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A12sp-080110-D055-03603.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A12sp-080210-D056-15011.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A12sp-080906-D041-10040.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A12sp-090206-D075-12530.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A12sp-090206-D075-12554.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-A30sp-081306-D047-10922.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-I15im-080906-D041-10805.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-I15im-080906-D041-11138.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-I15im-081506-D050-13735.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N01-090206-D075-12550.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N01-091904-D096-11541.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N02-070102-D005-14101.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N02-091904-D096-11742.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N03-072706-D025-04226.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N04-080110-D055-03845.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N04-080210-D056-14550.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N04-080906-D041-10126.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N04-090206-D075-12610.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N04-090206-D075-12646.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N05-090206-D075-12527.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N05-090206-D075-12541.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N05-093006-D107-14124.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N07-080906-D041-10049.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N07-091906-D096-11804.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N08-080906-D041-10050.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N08-091904-D096-11805.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N09-070102-D005-14103.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N09-070102-D005-15638.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N09-080906-D041-10038.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N09-091904-D096-11559.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N09-091904-D096-11611.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N10-090206-D075-12428.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N10-091206-D092-03926.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N11-080110-D055-04101.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N11-090306-D077-03209.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N12-070602-D007-15338.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N47-080210-D056-15012.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N47-080210-D056-15021.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N9sh-082510-D098-02612.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-N9sh-092503-D103-00803.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-bark-090206-D075-12641.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-bark-090306-D077-03114.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-crunch-091904-D096-12022.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-un-080110-D055-04014.jpg",
    //     // "assets/orca/call-catalog/jpg/A12-un-080110-D055-04022.jpg",
    //     // "assets/orca/call-catalog/jpg/A24-A12sp-073107-D043-12325.jpg",
    //     // "assets/orca/call-catalog/jpg/A24-N01-073107-D043-12617.jpg",
    //     // "assets/orca/call-catalog/jpg/A24-N03-073107-D043-12241.jpg",
    //     // "assets/orca/call-catalog/jpg/A24-N09-073107-D043-12314.jpg",
    //     // "assets/orca/call-catalog/jpg/A24-N7N8-073107-D043-12327.jpg",
    //     // "assets/orca/call-catalog/jpg/A24-honk-073107-D043-12329.jpg",
    //     // "assets/orca/call-catalog/jpg/A25-A25-082108-D120-11255.jpg",
    //     // "assets/orca/call-catalog/jpg/A25-A25-082108-D120-11301.jpg",
    //     // "assets/orca/call-catalog/jpg/A25-un-082108-D120-11243.jpg",
    //     // "assets/orca/call-catalog/jpg/A25-un-082108-D120-11257.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-A12sp-090506-D081-04437.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N01-072806-D026-13433.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N01-080606-D036-13529.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N01-081306-D045-10304.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N02-100206-D11100230.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N03-072806-D026-13644.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N03-072806-D026-13646.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N04-080606-D036-13438.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N05-081106-D043-11417.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N07-080406-D032-12526.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N08-080406-D032-12527.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N09-081106-D043-11214.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N09-081106-D043-11238.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N09-081106-D043-11242.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N09-081306-D045-10325.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N10-081106-D043-11356.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N11-080506-D033-00053.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N11-080506-D033-00106.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N11-080506-D033-00111.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N12-072806-D026-13154.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N12-080406-D032-13208.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N12-080406-D032-13209.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N47-080606-D036-13438.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N47-081106-D043-11254.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-N47-081306-D045-10410.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-bark-072806-D026-13140.jpg",
    //     // "assets/orca/call-catalog/jpg/A30-trill-091010-D137-14141.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-N01-070806-D013-00038.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-N01-070806-D013-00525.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-N01-093006-D107-14004.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-N01-093006-D107-14010.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-N02-093006-D107-14016.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-N04-070806-D013-00017.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-N47-093006-D107-14013.jpg",
    //     // "assets/orca/call-catalog/jpg/A34-bark-093006-D107-14040.jpg",
    //     // "assets/orca/call-catalog/jpg/A35-N04-070606-D011-04225.jpg",
    //     // "assets/orca/call-catalog/jpg/A35-N05-070606-D011-04146.jpg",
    //     // "assets/orca/call-catalog/jpg/A35-N09-070606-D011-04235.jpg",
    //     // "assets/orca/call-catalog/jpg/A35-N09-072706-D025-05549.jpg",
    //     // "assets/orca/call-catalog/jpg/A35-N09-072806-D026-13247.jpg",
    //     // "assets/orca/call-catalog/jpg/A35-weeawu-072706-D025-05702.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-A30sp-091306-D093-12245.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N01-062802-D004-12218.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N01-063002-D005-10943.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N01-070806-D012-14021.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N01-070806-D012-14025.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N02-063002-D005-10750.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N02-070806-D012-13927.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N02-071506-D017-05913.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N03-071506-D017-10139.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N03-071506-D017-12142.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N04-063002-D005-10843.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N04-071506-D017-05806.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N04-071506-D017-10946.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N05-070806-D012-13913.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N05-070806-D012-13917.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N05-070806-D012-13921.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N05-071506-D017-11311.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N07-071506-D017-03940.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N07-071506-D017-03949.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N09-071506-D017-05845.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N09-071506-D017-13101.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N09sh-070806-D012-13940.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N09sh-070806-D012-13945.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N09sh-071506-D017-13028.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N10-063002-D005-10937.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N10-063002-D005-10954.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N1AP-070806-D012-14152.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N1AP-070806-D012-14157.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N47-091306-D093-12247.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-N47-091306-D093-12256.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-ds-070806-D012-13453.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-ds-070806-D012-13523.jpg",
    //     // "assets/orca/call-catalog/jpg/A36-weeawu-063002-D005-10958.jpg",
    //     // "assets/orca/call-catalog/jpg/AI-N01-082906-D069-02201.jpg",
    //     // "assets/orca/call-catalog/jpg/AI-N01-082906-D069-02203.jpg",
    //     // "assets/orca/call-catalog/jpg/AI-N16-082906-D069-02005.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N01-090406-D079-20013.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N01-090406-D079-20024.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N01-090604-D080-13923.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N05-090604-D080-12611.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N07-071702-D026-02121.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N07-090306-D077-03216.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N07-090604-D080-14025.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N08-071702-D026-02128.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N08-090604-D080-13211.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N08-090604-D080-14026.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N12-071702-D026-02116.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N16-071702-D026-02131.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N16-090406-D079-20032.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N16-090604-D080-13209.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N16-090604-D080-14023.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N18-090406-D079-20010.jpg",
    //     // "assets/orca/call-catalog/jpg/B07-N18-090604-D080-13907.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N01-070306-D008-14422.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N01-081601-D043-15952.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N07-081601-D043-15807.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N08-081601-D043-15808.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N11-070801-D005A-10749.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N11-070801-D005A-11807.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N16-070306-D008-14439.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N16s-070306-D008-14715.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N16s-070801-D005A-10814.jpg",
    //     // "assets/orca/call-catalog/jpg/C-N20-070306-D008-14711.jpg",
    //     // "assets/orca/call-catalog/jpg/C06-N01-080110-D056-02121.jpg",
    //     // "assets/orca/call-catalog/jpg/C06-N03-080110-D056-01747.jpg",
    //     // "assets/orca/call-catalog/jpg/C06-N12-080110-D056-01619.jpg",
    //     // "assets/orca/call-catalog/jpg/C06-N16-080110-D056-02147.jpg",
    //     // "assets/orca/call-catalog/jpg/C06-N16s-080110-D056-02201.jpg",
    //     // "assets/orca/call-catalog/jpg/C06-N20-080110-D056-01716.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N01-062902-D005-03118.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N01-072307-D033-34220.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N03-061804-D010-2-13355.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N03-062802-D004-14934.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N11-081798-D023-13747.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N12-062902-D005-00019.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N12-081798-D023-13813.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N16-081798-D023-13655.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N16-081798-D023-14100.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N16s-0817989-D023-14130.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N18-081798-D023-13740.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N20-062802-D004-14927.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N20-062802-D004-15050.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N20-062902-D005-00024.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-N7N8-072307-D034-00011.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-un-062902-D005-00058.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-un-072307-D033-34306.jpg",
    //     // "assets/orca/call-catalog/jpg/C10-un-072307-D033-35118.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N01-081998-D024-20159.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N01-082604-D074-14108.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N08-081998-D024-20112.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N11-082604-D074-14114.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N12-081998-D024-20012.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N12-081998-D024-20014.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N12-081998-D024-20057.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N16-082604-D074-14134.jpg",
    //     // "assets/orca/call-catalog/jpg/D-N20-082604-D074-14053.jpg",
    //     // "assets/orca/call-catalog/jpg/D-un-082604-D074-14126.jpg",
    //     // "assets/orca/call-catalog/jpg/D-un-082604-D074-14235.jpg",
    //     // "assets/orca/call-catalog/jpg/G-N23-102106-D132-00228.jpg",
    //     // "assets/orca/call-catalog/jpg/G-N24-082906-D067-13049.jpg",
    //     // "assets/orca/call-catalog/jpg/G-N28-082906-D067-14122.jpg",
    //     // "assets/orca/call-catalog/jpg/G-N38-102106-D132-00907.jpg",
    //     // "assets/orca/call-catalog/jpg/G-N41-090106-D075-03702.jpg",
    //     // "assets/orca/call-catalog/jpg/G-N41-102106-D132-00340.jpg",
    //     // "assets/orca/call-catalog/jpg/G-N45-102106-D132-00632.jpg",
    //     // "assets/orca/call-catalog/jpg/G-Ooooh-091003-D086-11520.jpg",
    //     // "assets/orca/call-catalog/jpg/G-Ooooh-091003-D086-11523.jpg",
    //     // "assets/orca/call-catalog/jpg/G-ping-090106-D075-03650.jpg",
    //     // "assets/orca/call-catalog/jpg/G-ping-090106-D075-03657.jpg",
    //     // "assets/orca/call-catalog/jpg/G-ping-102106-D132-00112.jpg",
    //     // "assets/orca/call-catalog/jpg/G-ping-102106-D132-00311.jpg",
    //     // "assets/orca/call-catalog/jpg/G-pingAP-102106-D132-00344.jpg",
    //     // "assets/orca/call-catalog/jpg/G-trill-083110-D114-01933.jpg",
    //     // "assets/orca/call-catalog/jpg/G-trill-090106-D075-03525.jpg",
    //     // "assets/orca/call-catalog/jpg/G-trill-102106-D132-00501.jpg",
    //     // "assets/orca/call-catalog/jpg/G-trill-102106-D132-00906.jpg",
    //     // "assets/orca/call-catalog/jpg/G03-N23-082906-D067-14116.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N23-102607-D195-13523.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N23-102607-D195-13814.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N25-101607-D195-13525.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N26-102607-D195-12955.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N26-102607-D195-13933.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N28-102607-D195-13501.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N29-102607-D195-12943.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N41-102607-D195-13844.jpg",
    //     // "assets/orca/call-catalog/jpg/G17-N44-102607-D195-13102.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N01-072693-D005-02023.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N01-073193-D007-00603.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N03-072693-D005-00514.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N05-073193-D007-00558.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N07-072693-D005-00721.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N08-072693-D005-00723.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N11-073193-D007-00452.jpg",
    //     // "assets/orca/call-catalog/jpg/H-N16-072693-D005-01435.jpg",
    //     // "assets/orca/call-catalog/jpg/H-un-073193-D007-00315.jpg",
    //     // "assets/orca/call-catalog/jpg/I1-082204-D068-15543.jpg",
    //     // "assets/orca/call-catalog/jpg/I1-082204-D068-15549.jpg",
    //     // "assets/orca/call-catalog/jpg/I11-N23-091506-D095-10232.jpg",
    //     // "assets/orca/call-catalog/jpg/I11-N23-091506-D095-10334.jpg",
    //     // "assets/orca/call-catalog/jpg/I11-N23-091506-D095-10544.jpg",
    //     // "assets/orca/call-catalog/jpg/I11-N23-091506-D095-10556.jpg",
    //     // "assets/orca/call-catalog/jpg/I11-N24-091506-D095-10541.jpg",
    //     // "assets/orca/call-catalog/jpg/I11-N24-091506-D095-10727.jpg",
    //     // "assets/orca/call-catalog/jpg/I11-N26-091506-D095-05903.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-I15-081206-D044-05309.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-I15-081206-D044-13024.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-I15-081206-D044-13035.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-I15-081206-D044-13124.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N23-081106-D043-11452.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N23-081206-D044-03929.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N23-081206-D044-04401.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N24-081106-D043-11625.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N25-081206-D044-02059.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N25-081206-D044-03930.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N25-081206-D044-13229.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-N28-090506-D081-04400.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-ping-081206-D044-13435.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-ping-081306-D045-05737.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-squawk-081206-D044-02101.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-squawk-081206-D044-13545.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-squawk-082610-D099-15209.jpg",
    //     // "assets/orca/call-catalog/jpg/I15-trill-081206-D044-13416.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N01-081797-D079-03753.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N01-081897-D079-10453.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N03-081797-D079-04955.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N05-081797-D079-03642.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N05-081797-D079-04028.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N07-0817970D079-03657.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N08-081797-D079-03658.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N12-081797-D079-04018.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-N16-081897-D079-10454.jpg",
    //     // "assets/orca/call-catalog/jpg/I18-un-081797-D079-04002.jpg",
    //     // "assets/orca/call-catalog/jpg/I31-N23-070706-D011-10950.jpg",
    //     // "assets/orca/call-catalog/jpg/I31-N23-091206-D092-11835.jpg",
    //     // "assets/orca/call-catalog/jpg/I31-N23-091206-D092-11839.jpg",
    //     // "assets/orca/call-catalog/jpg/I31-N24-011106-D002-11430.jpg",
    //     // "assets/orca/call-catalog/jpg/I31-N24-070706-D011-11051.jpg",
    //     // "assets/orca/call-catalog/jpg/I31-N26-070706-D011-11241.jpg",
    //     // "assets/orca/call-catalog/jpg/I31-N30-011106-D002-11336.jpg",
    //     // "assets/orca/call-catalog/jpg/I33-N23-090206-D075-13224.jpg",
    //     // "assets/orca/call-catalog/jpg/I33-N23-090206-D075-13228.jpg",
    //     // "assets/orca/call-catalog/jpg/I33-N24-090206-D075-13510.jpg",
    //     // "assets/orca/call-catalog/jpg/R-N32i-070801-D005A-12214.jpg",
    //     // "assets/orca/call-catalog/jpg/R-N32ii-070801-D005A-11905.jpg",
    //     // "assets/orca/call-catalog/jpg/R-N33-070801-D005A-11906.jpg",
    //     // "assets/orca/call-catalog/jpg/R-N33-070801-D005A-12234.jpg"

    // );
}


//
// Standardized mouse/touch down/up events
//
// The iPad fires both a mousedown and touchdown event when the user
// touches the screen.  This standardizes it so it works on the web
// and the iPad.
$.event.special.xdown = {
    setup: function() {
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        var xdown = isIOS ? "touchstart" : "mousedown";
        $(this).bind(xdown + ".xdownEvent", function(event) {
            event.type = "xdown";
            $.event.handle.apply(this, [event]);
        });
    },
    teardown: function() {
        $(this).unbind(".xdownEvent");
    }
};

$.event.special.xup = {
    setup: function() {
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        var xup = isIOS ? "touchend" : "mouseup";
        $(this).bind(xup + ".xupEvent", function(event) {
            event.type = "xup";
            $.event.handle.apply(this, [event]);
        });
    },
    tearup: function() {
        $(this).unbind(".xupEvent");
    }
};

// If you want to prevent dragging, uncomment this section
function preventBehavior(e) 
{ 
    e.preventDefault(); 
};

function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);

    if (!window.onWeb) {
        document.addEventListener("touchmove", preventBehavior, false);
    }
}

// Is PhoneGap loaded and ready?
function onDeviceReady() {
    window.settings.phonegapReady = true;
}

// Randomly sort an array
function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
}

//
// Save a user event back to the database
//
function recordBaseUserEvent(eventType, e) {
    var uiLocations = findUiLocations();
    recordUserEvent({
        'level' : 'baseEvent',
        'name' : eventType,
        'pageX' : e.originalEvent.pageX,
        'pageY' : e.originalEvent.pageY,
        'ui' : uiLocations
    });
}


function recordUserEvent(userEvent) {
    if (window.onWeb) {
        userEvent['appName'] = window.appName;
        userEvent['timestamp'] = ISODateString(new Date());
        userEvent['guid'] = guidCookie();
        $.post('/log', JSON.stringify(userEvent));
    }
}

//
// Date and time functions
//
function ISODateString(d) {
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours() + - 8)+':' // Converted to PST
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())+'Z'
}

//
// Make Ajax requests work with CSRF
//
// https://docs.djangoproject.com/en/dev/ref/contrib/csrf/#ajax
//
$(document).ajaxSend(function(event, xhr, settings) {

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

//
// Find the absolute position of an HTML element
//
// http://www.quirksmode.org/js/findpos.html
//
function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            'left' : curleft,
            'top' : curtop
        };
    }
    else return {};
};

//
// Find the locations of all user elements
//
function findUiLocations() {
    items = {};
    $("img").each( function(n) {
        var $this = $(this)[0];
        var item = findPos($this);
        item['width'] = $this.width;
        item['height'] = $this.height;
        item['id'] = $this.id;
        var name = $(this).attr('class') + "." + $this.id;
        items[name] = item;
    });
    return items;
}

//
// Find the locations of all game elements
//
function findGameElements() {
    items = [];
    $("img").each( function(n) {
        var name = $(this).attr('class') + "." + $(this)[0].id;
        items.push(name);
    });
    return items;
}

//
// GUID - Globally unique identifier for session
//
function guidCookie() {
    var cookie = new jecookie('guid');
    cookie.load();
    if (cookie.data.guid === undefined) {
        cookie.data.guid = guidGenerator();
        cookie.save();
    }
    return cookie.data.guid;
    
    // if (cookie.load()) {
    //     if (cookie.data.guid === undefined) {
    //         cookie.data.guid = guidGenerator();
    //         cookie.save();
    //     }
    //     return cookie.data.guid;
    // } else {
    //     cookie.data.guid = guidGenerator();
    //     cookie.save();
    //     return cookie.data.guid;
    // }
}


function guidGenerator() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// Send data to tell if it's an orca, background or voice selection
// from the user
function sendData(data) {
    if (window.onWeb) {
        $.post("/data", { 
            app: window.appName,
            user: "",
            query: data['query'], 
        reference: data['reference'], 
            data : JSON.stringify(data)});
    }
}

//
// Save and retrieve the whole collection of levels and achievements to localStorage
//

function isLocalStorageVersionLessThanInitVersion() {

    var localStorageDataVersion = 0.0;

    var retrievedObject = localStorage.getItem('dataVersion');
    if (retrievedObject) {
        localStorageDataVersion = JSON.parse(retrievedObject)
    }

    if (localStorageDataVersion < window.initVersion) {
        return true;
    }
    return false;
}

function getLevelDataFromLocalStorage() {
    var loadFromInitLevelData = false;
    var levelData = undefined;
    var retrievedObject = localStorage.getItem('levelData');

    if (isLocalStorageVersionLessThanInitVersion()) {
        levelData = window.initLevelData;
        localStorage.setItem('dataVersion',window.initVersion);
        getAchievementDataFromLocalStorage();
    } else if (retrievedObject) {
        levelData = JSON.parse(retrievedObject)
    } else {
        levelData = window.initLevelData;
    }

    return levelData;
}

function setLevelDataFromLocalStorage(levelData) {
    localStorage.setItem('levelData', JSON.stringify(levelData));
}


function getAchievementDataFromLocalStorage() {
    var loadFromInitAchievementData = false;
    var achievementData = undefined;
    var retrievedObject = localStorage.getItem('achievementData');

    if (isLocalStorageVersionLessThanInitVersion()) {
        achievementData = window.initAchievementData;
        localStorage.setItem('dataVersion',window.initVersion);
        getLevelDataFromLocalStorage();
    } else if (retrievedObject) {
        achievementData = JSON.parse(retrievedObject)
    } else {
        achievementData = window.initAchievementData;
    }

    return achievementData;
}

function setAchievementDataFromLocalStorage(achievementData) {
    localStorage.setItem('achievementData', JSON.stringify(achievementData));
}


