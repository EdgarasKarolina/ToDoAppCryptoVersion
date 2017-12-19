# mocha-directory
Allows you to organize your BDD mocha test suites as directories

## Usage

File tree:

- tests/
  - index.js
  - Test Suite/
    - test.js

tests/Test Suite/test.js:

```javascript
it( 'should be a test', function() {
  // Test
} );
```

index.js

```javascript
require( 'mocha-directory' )();
```

Command:

```bash
mocha tests/
```

Output:

```
Test Suite
    ✓ should be a test

  1 passing (9ms)
```
