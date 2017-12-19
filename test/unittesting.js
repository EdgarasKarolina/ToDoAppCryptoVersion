var expect  = require('chai').expect;
require( 'mocha-directory' )();

var methods = require("./../javascript/functions.js");

describe("tests()", function(){
    
    it("testing if user name is between 3 and 15 characters, inserting 3 characters", function(){
        var result = methods.checkUserNames("Joc");
        expect(result).to.equal(true);
    });

    it("testing if user name is between 3 and 15 characters, inserting 2 characters", function(){
        var result = methods.checkUserNames("Jo");
        expect(result).to.equal(false);
    });

    it("testing if user name is between 3 and 15 characters, inserting 4 characters", function(){
        var result = methods.checkUserNames("John");
        expect(result).to.equal(true);
    });

    it("testing if user name is between 3 and 15 characters, inserting 14 characters", function(){
        var result = methods.checkUserNames("1234567890John");
        expect(result).to.equal(true);
    });

    it("testing if user name is between 3 and 15 characters, inserting 15 characters", function(){
        var result = methods.checkUserNames("12345678901John");
        expect(result).to.equal(true);
    });

    it("testing if user name is between 3 and 15 characters, inserting 16 characters", function(){
        var result = methods.checkUserNames("123456789012John");
        expect(result).to.equal(false);
    });

    it("testing if password contains number", function(){
        var result = methods.checkPasswords("kazkada56");
        expect(result).to.equal(true);
    });

    it("testing if password contains upper case letter", function(){
        var result = methods.containsUpperCases("k65azkdaS");
        expect(result).to.equal(true);
    });

    it("testing if message is not empty, giving not empty message", function(){
        var result = methods.isNotEmpty("message");
        expect(result).to.equal(true);
    });

    it("testing if message is not empty, giving empty message", function(){
        var result = methods.isNotEmpty("");
        expect(result).to.equal(false);
    });

    it("testing if message is not longer than 60 characters, inserting 59", function(){
        var message = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        var result = methods.maximum60Characters(message);
        expect(result).to.equal(true);
    });

    it("testing if message is not longer than 60 characters, inserting 60", function(){
        var message = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeb";
        var result = methods.maximum60Characters(message);
        expect(result).to.equal(true);
    });

    it("testing if message is not longer than 60 characters, inserting 61", function(){
        var message = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeebbb";
        var result = methods.maximum60Characters(message);
        expect(result).to.equal(false);
    });
});