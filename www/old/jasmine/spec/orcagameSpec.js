//
// Level model
//
describe('Level', function () {

    beforeEach(function () {
        level = new Level(window.initLevelData[4]);
    });

    it('Should have 0 stars with a score of 0', function() {
        expect(level.get("stars")).toEqual(0);
    });

    it('Should have 1 stars with a score of 1/3 the max score', function() {
        var maxScore = level.get("turns").length *  BASE_TURN_SCORE;
        var oneStarScore = Math.floor(maxScore / 3) + 1;
        level.set("score",oneStarScore)
        expect(level.get("stars")).toEqual(1);
    });

    it('Should have 1 stars with a score of 1/2 the max score', function() {
        var maxScore = level.get("turns").length *  BASE_TURN_SCORE;
        var oneStarScore = Math.floor(maxScore / 3) + 1;
        var twoStarScore = oneStarScore * 2;
        level.set("score",twoStarScore )
        expect(level.get("stars")).toEqual(2);
    });

    it('Should have 1 stars with the max score', function() {
        var maxScore = level.get("turns").length *  BASE_TURN_SCORE;
        var oneStarScore = Math.floor(maxScore / 3) + 1;
        var threeStarScore = oneStarScore * 3;
        level.set("score",threeStarScore)
        expect(level.get("stars")).toEqual(3);
    });

    it('Should be able to add to the score', function() {
        expect(level.get("score")).toEqual(0);
        var increment = 10000;
        level.addToScore(increment);
        expect(level.get("score")).toEqual(increment);
    });

});


//
// Achievement model
//
describe('Achievement', function () {

    beforeEach(function () {
        achievement = new Achievement(window.initAchievementData[0]);
    });

    it('Should start off locked', function() {
        expect(achievement.get("locked")).toBeTruthy();
    }); 

    it('Should unlock when it gets the correct number of calls', function() {
        achievement.set("currentNum",NUM_CALLS_TO_UNLOCK_ACHIEVEMENT);
        expect(achievement.get("locked")).toBeFalsy();
    }); 

    it('Should start with a currentNum of 0', function() {
        expect(achievement.get("currentNum")).toEqual(0);
    });

    it('Should be able to increment the currentNum', function() {
        achievement.incrementCurrentNum();
        expect(achievement.get("currentNum")).toEqual(1);
    });


});

//
// Level collection
//
describe('LevelCollection', function () {

    beforeEach(function () {
        levelCollection = new LevelCollection(window.levelData);
        calls = new CallCollection(window.callCatalog);
    });

    it('Each level should have a correct answer', function() {
        levelCollection.each(function(n) {
            var turns = n.get("turns");
            var match = n.get("match");
            _.each(turns, function(turn) {
                var query = calls.get(turn.queryId);
                var oneMatches = false;
                _.each(turn.referenceIds, function(referenceId) {
                    var reference = calls.get(referenceId);
                    if (doQueryAndReferenceMatch(reference, query, match)) {
                        oneMatches = true;
                    }
                });
                expect(oneMatches).toBeTruthy();
            });
        });
    });

});

//
// AchievementCollection
//
describe('AchievementCollection', function() {

    beforeEach(function() {
        achievementCollection = new AchievementCollection(window.achievementData);
        levelCollection = new LevelCollection(window.levelData);
        calls = new CallCollection(window.callCatalog);
    });
    
    it('All achievements should be able to be unlocked', function() {

        // Loop over all querys for all levels and increment the
        // currentNum for each achievement once per query.  This
        // simulates a user going through all the levels.
        levelCollection.each(function(level) {
            var turns = level.get("turns");
            _.each(turns, function(turn) {
                var query = calls.get(turn.queryId);
                var achievement = _.find(achievementCollection.models, function(n) {
                    return (n.get("name") === query.get("name"));
                });
                if (achievement !== undefined) {
                    achievement.incrementCurrentNum();
                }
            });
        });

        // Make sure that after we've gone through all the levels, all
        // the achievements are unlocked
        achievementCollection.each(function(achievement) {
            expect(achievement.get("locked")).toBeFalsy();
        });

    });
});



