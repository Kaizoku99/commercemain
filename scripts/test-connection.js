
console.log('Testing connection to api.vercel.com using fetch...');

async function testFetch() {
    try {
        const res = await fetch('https://api.vercel.com/v2/files', {
            method: 'GET',
        });
        console.log(`STATUS: ${res.status}`);
        const text = await res.text();
        console.log('Body length:', text.length);
    } catch (e) {
        console.error(`FETCH ERROR:`, e);
        if (e.cause) console.error('Cause:', e.cause);
    }
}

testFetch();
