/**
 * Test Runner Implementation for MRW Website Tests
 */

// Global test runner initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Test runner loaded. Click "Run All Tests" to start testing.');
    
    // Add some initial statistics
    updateTestStats();
});

function updateTestStats() {
    // Count total tests across all suites
    let totalTests = 0;
    
    for (const suiteName in testFramework.testSuites) {
        totalTests += testFramework.testSuites[suiteName].length;
    }
    
    document.getElementById('total-tests').textContent = totalTests;
}

// Enhanced runAllTests function with progress tracking
async function runAllTests() {
    console.log('Starting test execution...');
    
    const runButton = document.querySelector('.run-button');
    const originalText = runButton.textContent;
    
    // Disable button and show progress
    runButton.disabled = true;
    runButton.textContent = 'Running Tests...';
    runButton.style.background = '#6c757d';
    
    try {
        // Clear previous results
        document.getElementById('test-results').innerHTML = '';
        
        // Reset statistics
        document.getElementById('passed-tests').textContent = '0';
        document.getElementById('failed-tests').textContent = '0';
        document.getElementById('skipped-tests').textContent = '0';
        
        // Run the tests
        const results = await testFramework.runAllTests();
        
        console.log('Test execution completed:', results);
        
        // Log summary to console
        console.log(`Total tests: ${results.total}`);
        console.log(`Passed: ${results.passed}`);
        console.log(`Failed: ${results.failed}`);
        console.log(`Skipped: ${results.skipped}`);
        
        // Show success or failure color on button
        if (results.failed === 0) {
            runButton.style.background = '#28a745';
            runButton.textContent = `All Tests Passed! (${results.passed}/${results.total})`;
        } else {
            runButton.style.background = '#dc3545';
            runButton.textContent = `Tests Completed (${results.failed} failed)`;
        }
        
    } catch (error) {
        console.error('Error running tests:', error);
        runButton.style.background = '#dc3545';
        runButton.textContent = 'Test Execution Failed';
        
        // Show error in results
        const resultsContainer = document.getElementById('test-results');
        resultsContainer.innerHTML = `
            <div class="test-suite">
                <div class="test-suite-header" style="background: #dc3545;">
                    Test Execution Error
                </div>
                <div class="test-case">
                    <div class="test-name">Failed to execute tests</div>
                    <div class="test-status fail">ERROR</div>
                </div>
                <div class="error-details">
                    ${error.message}
                </div>
            </div>
        `;
    }
    
    // Re-enable button after delay
    setTimeout(() => {
        runButton.disabled = false;
        runButton.textContent = originalText;
        runButton.style.background = '#007acc';
    }, 3000);
}

// Add keyboard shortcut to run tests
document.addEventListener('keydown', function(e) {
    // Ctrl+R or Cmd+R to run tests
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        runAllTests();
    }
});

// Add test result filtering functionality
function addTestFilters() {
    const container = document.querySelector('.container');
    const summaryDiv = document.querySelector('.summary');
    
    // Create filter buttons
    const filterDiv = document.createElement('div');
    filterDiv.style.cssText = `
        margin: 20px 0;
        text-align: center;
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
    `;
    
    const filters = [
        { name: 'All', class: 'all', color: '#007acc' },
        { name: 'Passed', class: 'pass', color: '#28a745' },
        { name: 'Failed', class: 'fail', color: '#dc3545' },
        { name: 'Skipped', class: 'skip', color: '#ffc107' }
    ];
    
    filters.forEach(filter => {
        const button = document.createElement('button');
        button.textContent = `Show ${filter.name}`;
        button.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: ${filter.color};
            color: white;
            cursor: pointer;
            font-size: 14px;
        `;
        
        button.addEventListener('click', () => filterTests(filter.class));
        filterDiv.appendChild(button);
    });
    
    container.insertBefore(filterDiv, summaryDiv.nextSibling);
}

function filterTests(filterClass) {
    const testCases = document.querySelectorAll('.test-case');
    
    testCases.forEach(testCase => {
        const status = testCase.querySelector('.test-status');
        if (filterClass === 'all' || status.classList.contains(filterClass)) {
            testCase.style.display = 'flex';
        } else {
            testCase.style.display = 'none';
        }
    });
}

// Add export functionality for test results
function addExportFunctionality() {
    const container = document.querySelector('.container');
    const runButton = document.querySelector('.run-button');
    
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Results';
    exportButton.className = 'run-button';
    exportButton.style.marginLeft = '10px';
    exportButton.style.background = '#17a2b8';
    
    exportButton.addEventListener('click', exportTestResults);
    runButton.parentNode.insertBefore(exportButton, runButton.nextSibling);
}

function exportTestResults() {
    const results = testFramework.results;
    
    let report = `MRW Website Test Results\n`;
    report += `========================\n\n`;
    report += `Total Tests: ${results.total}\n`;
    report += `Passed: ${results.passed}\n`;
    report += `Failed: ${results.failed}\n`;
    report += `Skipped: ${results.skipped}\n`;
    report += `Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n\n`;
    
    for (const suiteName in testFramework.testSuites) {
        const tests = testFramework.testSuites[suiteName];
        const suiteStats = results.suites[suiteName];
        
        report += `${suiteName}\n`;
        report += `${'='.repeat(suiteName.length)}\n`;
        report += `Passed: ${suiteStats.passed}/${tests.length}\n\n`;
        
        tests.forEach(test => {
            report += `  ${test.status.toUpperCase()}: ${test.name}\n`;
            if (test.error) {
                report += `    Error: ${test.error.message}\n`;
            }
        });
        report += '\n';
    }
    
    // Create and download file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mrw-test-results-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add filter functionality after a short delay
    setTimeout(() => {
        addTestFilters();
        addExportFunctionality();
    }, 100);
});

// Performance monitoring
const performanceMonitor = {
    startTime: null,
    endTime: null,
    
    start() {
        this.startTime = performance.now();
    },
    
    end() {
        this.endTime = performance.now();
        return this.endTime - this.startTime;
    },
    
    formatTime(milliseconds) {
        if (milliseconds < 1000) {
            return `${Math.round(milliseconds)}ms`;
        } else {
            return `${(milliseconds / 1000).toFixed(2)}s`;
        }
    }
};

// Override the original runAllTests to add performance monitoring
const originalRunAllTests = runAllTests;
runAllTests = async function() {
    performanceMonitor.start();
    
    try {
        await originalRunAllTests();
        const duration = performanceMonitor.end();
        console.log(`Tests completed in ${performanceMonitor.formatTime(duration)}`);
        
        // Add performance info to the page
        const container = document.querySelector('.container');
        let perfDiv = document.getElementById('performance-info');
        
        if (!perfDiv) {
            perfDiv = document.createElement('div');
            perfDiv.id = 'performance-info';
            perfDiv.style.cssText = `
                text-align: center;
                margin: 10px 0;
                font-size: 14px;
                color: #666;
            `;
            container.appendChild(perfDiv);
        }
        
        perfDiv.textContent = `Test execution completed in ${performanceMonitor.formatTime(duration)}`;
        
    } catch (error) {
        performanceMonitor.end();
        throw error;
    }
};

// Add test coverage information
function addCoverageInfo() {
    const container = document.querySelector('.container');
    
    const coverageDiv = document.createElement('div');
    coverageDiv.style.cssText = `
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 15px;
        margin: 20px 0;
    `;
    
    const coveredFiles = [
        'main.js',
        'rating-system.js',
        'animations.js',
        'hover-fix.js',
        'script.js',
        'update-all-pages.py'
    ];
    
    coverageDiv.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #495057;">Test Coverage</h3>
        <p style="margin: 5px 0; color: #6c757d;">Files covered by tests:</p>
        <ul style="margin: 10px 0; padding-left: 20px; color: #495057;">
            ${coveredFiles.map(file => `<li>${file}</li>`).join('')}
        </ul>
        <p style="margin: 5px 0; color: #6c757d; font-size: 14px;">
            Coverage: ${coveredFiles.length} files with ${testFramework.results.total} total test cases
        </p>
    `;
    
    container.appendChild(coverageDiv);
}

// Add coverage info after tests are loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addCoverageInfo();
    }, 200);
});

console.log('Test runner initialized. Available functions:');
console.log('- runAllTests(): Execute all test suites');
console.log('- filterTests(type): Filter results by "all", "pass", "fail", or "skip"');
console.log('- exportTestResults(): Export results to text file');
console.log('- Use Ctrl+R (or Cmd+R) to quickly run all tests');