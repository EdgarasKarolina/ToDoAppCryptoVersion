/**
 * Copyright (C) 2016 Michael Lyons
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function() {
    'use strict';

    var assert = require( 'assert' ),
        callsite = require( 'callsite' ),
        path = require( 'path' ),
        fs = require( 'fs' ),
        _ = require( 'underscore' );

    var MOCHA_LIFECYCLE_METHODS = [
        'before',
        'beforeEach',
        'after',
        'afterEach',
        'lifecycle'
    ];

    assert( describe );

    var removeExtension = function( filename ) {
        var filename_split = filename.split( '.' );
        filename_split.pop(); // Remove the last thing, which is the extension
        return filename_split.join( '.' );
    };

    var getCallerRoot = function() {
        var stack = callsite();
        var last_call = stack[ 2 ]; // 2 because we are being called in here too
        return path.dirname( last_call.getFileName() );
    };

    var requireAbsolute = function( absolute_path ) {
        var relative = path.relative( __dirname, removeExtension( absolute_path ) );
        require( './' + relative );
    };

    var recursiveTestImport = function( root_directory ) {
        var file_list = fs.readdirSync( root_directory );

        // Run files
        _
            .chain( file_list )
            .filter( function( file ) {
                return !file.match( /^\..*/ );
            } )
            .filter( function( file ) {
                return file.match( /.*\.js$/ );
            } )
            .map( function( file ) {
                return path.resolve( root_directory, file );
            } )
            .filter( function( file ) {
                return fs.lstatSync( file ).isFile()
            } )
            .each( function( file ) {
                var basename = path.basename( file, '.js' );

                if( _.contains( MOCHA_LIFECYCLE_METHODS, basename ) ) {
                    requireAbsolute( file );
                } else {
                    describe( basename, function() {
                        requireAbsolute( file );
                    } );
                }
            } );

        // Recurse on directories
        _
            .chain( file_list )
            .filter( function( file ) {
                var file_path = path.resolve( root_directory, file );
                return fs.lstatSync( file_path ).isDirectory()
            } )
            .each( function( file ) {
                var file_path = path.resolve( root_directory, file );
                describe( file, function() {
                    recursiveTestImport( file_path );
                } )
            } );
    };

    module.exports = function() {
        recursiveTestImport( getCallerRoot() );
    }

})();
