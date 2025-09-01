/**
 * Simple Test Framework for MRW Website
 */

class TestFramework {
    constructor() {
        this.testSuites = {};
        this.currentSuite = null;
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            suites: {}
        };
    }

    describe(suiteName, callback) {
        this.currentSuite = suiteName;
        this.testSuites[suiteName] = [];
        this.results.suites[suiteName] = {
            tests: [],
            passed: 0,
            failed: 0,
            skipped: 0
        };
        
        callback();
        this.currentSuite = null;
    }

    it(testName, callback) {
        if (!this.currentSuite) {
            throw new Error('Tests must be defined within a describe block');
        }

        const test = {
            name: testName,
            callback: callback,
            status: 'pending',
            error: null,
            suite: this.currentSuite
        };

        this.testSuites[this.currentSuite].push(test);
        this.results.suites[this.currentSuite].tests.push(test);
        this.results.total++;
    }

    async runAllTests() {
        this.resetResults();

        for (const suiteName in this.testSuites) {
            const tests = this.testSuites[suiteName];
            
            for (const test of tests) {
                try {
                    await test.callback();
                    test.status = 'pass';
                    this.results.passed++;
                    this.results.suites[suiteName].passed++;
                } catch (error) {
                    test.status = 'fail';
                    test.error = error;
                    this.results.failed++;
                    this.results.suites[suiteName].failed++;
                }
            }
        }

        this.displayResults();
        return this.results;
    }

    resetResults() {
        this.results.passed = 0;
        this.results.failed = 0;
        this.results.skipped = 0;

        for (const suiteName in this.results.suites) {
            this.results.suites[suiteName].passed = 0;
            this.results.suites[suiteName].failed = 0;
            this.results.suites[suiteName].skipped = 0;
        }
    }

    displayResults() {
        // Update summary statistics
        document.getElementById('total-tests').textContent = this.results.total;
        document.getElementById('passed-tests').textContent = this.results.passed;
        document.getElementById('failed-tests').textContent = this.results.failed;
        document.getElementById('skipped-tests').textContent = this.results.skipped;

        // Display detailed results
        const resultsContainer = document.getElementById('test-results');
        resultsContainer.innerHTML = '';

        for (const suiteName in this.testSuites) {
            const suiteElement = this.createSuiteElement(suiteName);
            resultsContainer.appendChild(suiteElement);
        }
    }

    createSuiteElement(suiteName) {
        const tests = this.testSuites[suiteName];
        const suiteStats = this.results.suites[suiteName];

        const suiteElement = document.createElement('div');
        suiteElement.className = 'test-suite';

        const header = document.createElement('div');
        header.className = 'test-suite-header';
        header.textContent = `${suiteName} (${suiteStats.passed}/${tests.length} passed)`;
        suiteElement.appendChild(header);

        for (const test of tests) {
            const testElement = document.createElement('div');
            testElement.className = 'test-case';

            const testName = document.createElement('div');
            testName.className = 'test-name';
            testName.textContent = test.name;
            testElement.appendChild(testName);

            const testStatus = document.createElement('div');
            testStatus.className = `test-status ${test.status}`;
            testStatus.textContent = test.status.toUpperCase();
            testElement.appendChild(testStatus);

            if (test.error) {
                const errorDetails = document.createElement('div');
                errorDetails.className = 'error-details';
                errorDetails.textContent = `Error: ${test.error.message}`;
                testElement.appendChild(errorDetails);
            }

            suiteElement.appendChild(testElement);
        }

        return suiteElement;
    }
}

// Assertion functions
function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
            }
        },
        
        toEqual(expected) {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
            }
        },
        
        toBeTruthy() {
            if (!actual) {
                throw new Error(`Expected truthy value but got ${JSON.stringify(actual)}`);
            }
        },
        
        toBeFalsy() {
            if (actual) {
                throw new Error(`Expected falsy value but got ${JSON.stringify(actual)}`);
            }
        },
        
        toBeNull() {
            if (actual !== null) {
                throw new Error(`Expected null but got ${JSON.stringify(actual)}`);
            }
        },
        
        toBeUndefined() {
            if (actual !== undefined) {
                throw new Error(`Expected undefined but got ${JSON.stringify(actual)}`);
            }
        },
        
        toContain(expected) {
            if (typeof actual === 'string' && !actual.includes(expected)) {
                throw new Error(`Expected string "${actual}" to contain "${expected}"`);
            }
            if (Array.isArray(actual) && !actual.includes(expected)) {
                throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
            }
        },
        
        toHaveLength(expected) {
            if (actual.length !== expected) {
                throw new Error(`Expected length ${expected} but got ${actual.length}`);
            }
        },
        
        toThrow() {
            if (typeof actual !== 'function') {
                throw new Error('Expected a function to test for throwing');
            }
            
            let threw = false;
            try {
                actual();
            } catch (e) {
                threw = true;
            }
            
            if (!threw) {
                throw new Error('Expected function to throw an error');
            }
        }
    };
}

// Mock functions
function jest() {
    return {
        fn(implementation) {
            const mockFn = function(...args) {
                mockFn.calls.push(args);
                mockFn.results.push({
                    type: 'return',
                    value: implementation ? implementation(...args) : undefined
                });
                return mockFn.returnValue;
            };
            
            mockFn.calls = [];
            mockFn.results = [];
            mockFn.returnValue = undefined;
            
            mockFn.mockReturnValue = function(value) {
                mockFn.returnValue = value;
                return mockFn;
            };
            
            mockFn.mockImplementation = function(impl) {
                implementation = impl;
                return mockFn;
            };
            
            return mockFn;
        }
    };
}

// DOM testing utilities
function createMockElement(tagName, attributes = {}) {
    const element = document.createElement(tagName);
    
    Object.keys(attributes).forEach(key => {
        if (key === 'textContent') {
            element.textContent = attributes[key];
        } else if (key === 'innerHTML') {
            element.innerHTML = attributes[key];
        } else if (key === 'className') {
            element.className = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    return element;
}

function triggerEvent(element, eventType, eventInit = {}) {
    const event = new Event(eventType, eventInit);
    element.dispatchEvent(event);
}

// Global test framework instance
const testFramework = new TestFramework();
const describe = testFramework.describe.bind(testFramework);
const it = testFramework.it.bind(testFramework);

// Global function to run tests
function runAllTests() {
    return testFramework.runAllTests();
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TestFramework,
        expect,
        jest,
        createMockElement,
        triggerEvent,
        describe,
        it,
        runAllTests
    };
}