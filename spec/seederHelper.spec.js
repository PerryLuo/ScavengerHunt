var dataArray = require('../js/seederHelper').dataArray;

describe('Given two lists, return the attributes as keys and the data as values', function(){

    it('a typical user table', function(){
        var attributes = ['username', 'email', 'firstName', 'lastName'];
        var usernames = ['jonsnow', 'aryastark', 'olenna'];
        var emails = ['jonsnow@winterfell.com', 'aryastark@winterfell.com', 'olenna@tyrell.com'];
        var firstNames = ['Jon', 'Arya', 'Olenna'];
        var lastNames = ['Snow', 'Stark', 'Redwyne'];
        var data = [usernames, emails, firstNames, lastNames];
        expect(dataArray(attributes, data)).toEqual([
            {'username':'jonsnow', 'email':'jonsnow@winterfell.com', 'firstName':'Jon', 'lastName':'Snow'},
            {'username':'aryastark', 'email':'aryastark@winterfell.com', 'firstName':'Arya', 'lastName':'Stark'},
            {'username':'olenna', 'email':'olenna@tyrell.com', 'firstName':'Olenna', 'lastName':'Redwyne'}
        ]);
    });

    it('empty strings', function(){
        var attributes = ['username', 'email', 'firstName', 'lastName'];
        var usernames = ['','',''];
        var emails = ['','',''];
        var firstNames = ['','',''];
        var lastNames = ['','',''];
        var data = [usernames, emails, firstNames, lastNames];
        expect(dataArray(attributes, data)).toEqual([
            {'username':'', 'email':'', 'firstName':'', 'lastName':''},
            {'username':'', 'email':'', 'firstName':'', 'lastName':''},
            {'username':'', 'email':'', 'firstName':'', 'lastName':''}
        ]);
    });

});
