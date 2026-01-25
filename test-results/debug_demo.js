// Simple JavaScript file for debugging demonstration
function calculateSum(a, b) {
    let result = a + b;
    console.log(`Calculating sum of ${a} and ${b}`);
    return result;
}

function processData() {
    console.log('Starting data processing...');
    let x = 10;
    let y = 20;
    let sum = calculateSum(x, y);
    
    // Intentional delay to allow for debugging
    for (let i = 0; i < 5; i++) {
        console.log(`Processing step ${i + 1}, sum is ${sum}`);
        sum += i;
    }
    
    console.log('Final sum:', sum);
    return sum;
}

// Call the function
processData();

console.log('Script execution completed');