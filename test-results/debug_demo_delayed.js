// JavaScript file for debugging demonstration with intentional delays
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
    
    console.log('About to enter loop...');
    
    // Loop with artificial delay to allow for debugging
    for (let i = 0; i < 5; i++) {
        console.log(`Processing step ${i + 1}, sum is ${sum}`);
        sum += i;
        
        // Artificial delay to allow debugging
        const start = Date.now();
        while (Date.now() - start < 1000); // 1 second delay
    }
    
    console.log('Final sum:', sum);
    return sum;
}

// Call the function
processData();

console.log('Script execution completed');

// Keep the process alive for debugging
setTimeout(() => {
    console.log('Exiting after delay');
}, 10000);