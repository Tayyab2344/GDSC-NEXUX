
async function main() {
    try {
        const res = await fetch('http://localhost:3000/announcements');
        if (!res.ok) {
            console.error('Status:', res.status, res.statusText);
            const text = await res.text();
            console.error('Body:', text);
            return;
        }
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

main();
