describe('CallCollection', function () {

    beforeEach(function () {
        queryCalls = new CallCollection(window.callData);
    });

    it('Should load a call catalog', function () {
        expect(queryCalls.length).toEqual(1111);
    });

    
});


describe('QueryListView', function () {

    beforeEach(function () {
        queryCalls = new CallCollection(window.callData);
        queryView = new QueryListView({collection: queryCalls});
    });

    it('Should start with a currentItem of 1', function () {
        expect(queryView.currentItem).toEqual(1);
    });

    it('Should start with a currentItem of 1', function () {
        queryView.nextItem();
        expect(queryView.currentItem).toEqual(2);
    });

    it('Should loop to the last item when doing prevItem on item 1', function () {
        queryView.prevItem();
        expect(queryView.currentItem).toEqual(queryCalls.length - 1);
    });

    it('Should be able to set the currentItem', function () {
        queryView.setItem(2);
        expect(queryView.currentItem).toEqual(2);
    });

    it('Should loop to the first item when doing nextItem on the last item', function () {
        queryView.setItem(queryCalls.length - 1);
        queryView.nextItem();
        expect(queryView.currentItem).toEqual(1);
    });

    
});

