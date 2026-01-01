export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { id } = req.query;
    
    if (req.method === 'POST') {
        const { status, user } = req.body;
        const timestamp = new Date().toLocaleString('de-DE');
        
        console.log(`Status update: ID ${id}, Status: ${status}, User: ${user}`);
        
        // Erfolgreiche Antwort für echte Daten
        res.status(200).json({ 
            success: true, 
            participant: {
                id: parseInt(id),
                status: status,
                timestamp: timestamp
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
