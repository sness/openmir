describe('GameModel', function () {

    beforeEach(function () {
        gameModel = new GameModel();
    });

    it('should start with a currentLevel of 0', function() {
        expect(gameModel.get("currentLevel")).toEqual(0);
    });
});

describe('QueryModel', function () {

    beforeEach(function () {
        queryModel = new QueryModel();
    });

    it('should start with a blank name and imageUrl', function() {
        expect(queryModel.get("name")).toEqual('');
    });
});
