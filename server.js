const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Data persistence
const DATA_FILE = path.join(__dirname, 'data.json');

// Load data from file
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return { participants: [] };
}

// Save data to file
function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Initialize data
let appData = loadData();

// Demo Benutzer (wie im Frontend erwartet)
const users = {
    'admin': { password: 'jrk2024!', role: 'admin', name: 'Administrator' },
    'leitung': { password: 'jrk2024!', role: 'leitung', name: 'Leitung' },
    'team1': { password: 'checkin123', role: 'team', name: 'Team 1' },
    'team2': { password: 'checkin123', role: 'team', name: 'Team 2' },
    'team3': { password: 'checkin123', role: 'team', name: 'Team 3' }
};

// API Endpoints

// Data endpoint (wie vom Frontend erwartet)
app.get('/api/data', (req, res) => {
    res.json(appData);
});

// Check-in endpoint
app.post('/api/checkin/:id', (req, res) => {
    try {
        const participantId = parseInt(req.params.id);
        const { status, user } = req.body;
        
        const participant = appData.participants.find(p => p.id === participantId);
        if (!participant) {
            return res.status(404).json({ success: false, message: 'Teilnehmer nicht gefunden' });
        }

        // Update status and timestamp
        participant.status = status;
        const timestamp = new Date().toLocaleString('de-DE');
        
        // Clear all timestamps first
        participant.checkInTime = null;
        participant.checkOutTime = null;
        participant.ausflugsTime = null;
        participant.krankTime = null;
        
        // Set appropriate timestamp
        switch(status) {
            case 'present':
                participant.checkInTime = timestamp;
                break;
            case 'absent':
                participant.checkOutTime = timestamp;
                break;
            case 'ausflug':
                participant.ausflugsTime = timestamp;
                break;
            case 'krank':
                participant.krankTime = timestamp;
                break;
        }

        // Save data
        if (saveData(appData)) {
            res.json({ success: true, participant });
        } else {
            res.status(500).json({ success: false, message: 'Fehler beim Speichern' });
        }
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Participants endpoint
app.post('/api/participants', (req, res) => {
    try {
        const { participants, user } = req.body;
        appData.participants = participants || [];
        
        if (saveData(appData)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, message: 'Fehler beim Speichern' });
        }
    } catch (error) {
        console.error('Save participants error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get participants
app.get('/api/participants', (req, res) => {
    res.json(appData.participants);
});

// Upload Excel (Demo-Daten)
app.post('/api/upload-excel', (req, res) => {
    try {
        const demoData = [
            {
                id: 1,
                firstName: 'Anna',
                lastName: 'Müller',
                name: 'Anna Müller',
                booking: 'AWE-001',
                age: '25',
                room: '15',
                originalRoom: '15',
                building: 'A-EG',
                catering: 'Vollkost',
                status: 'absent',
                checkInTime: null,
                checkOutTime: null,
                ausflugsTime: null,
                krankTime: null,
                roomChanges: []
            },
            {
                id: 2,
                firstName: 'Max',
                lastName: 'Schmidt',
                name: 'Max Schmidt',
                booking: 'AWE-002',
                age: '30',
                room: '32',
                originalRoom: '32',
                building: 'A-OG',
                catering: 'Vegetarisch',
                status: 'absent',
                checkInTime: null,
                checkOutTime: null,
                ausflugsTime: null,
                krankTime: null,
                roomChanges: []
            },
            {
                id: 3,
                firstName: 'Lisa',
                lastName: 'Weber',
                name: 'Lisa Weber',
                booking: 'AWE-003',
                age: '28',
                room: '45',
                originalRoom: '45',
                building: 'B-EG',
                catering: 'Vegan',
                status: 'absent',
                checkInTime: null,
                checkOutTime: null,
                ausflugsTime: null,
                krankTime: null,
                roomChanges: []
            },
            {
                id: 4,
                firstName: 'Tom',
                lastName: 'Fischer',
                name: 'Tom Fischer',
                booking: 'AWE-004',
                age: '22',
                room: '52',
                originalRoom: '52',
                building: 'B-OG',
                catering: 'Vollkost',
                status: 'absent',
                checkInTime: null,
                checkOutTime: null,
                ausflugsTime: null,
                krankTime: null,
                roomChanges: []
            },
            {
                id: 5,
                firstName: 'Sarah',
                lastName: 'Klein',
                name: 'Sarah Klein',
                booking: 'AWE-005',
                age: '26',
                room: '83',
                originalRoom: '83',
                building: 'SH',
                catering: 'Vegetarisch',
                status: 'absent',
                checkInTime: null,
                checkOutTime: null,
                ausflugsTime: null,
                krankTime: null,
                roomChanges: []
            }
        ];
        
        appData.participants = demoData;
        
        if (saveData(appData)) {
            res.json({ success: true, data: demoData });
        } else {
            res.status(500).json({ success: false, message: 'Fehler beim Speichern' });
        }
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Backup endpoint
app.get('/api/backup', (req, res) => {
    res.json(appData);
});

app.post('/api/backup', (req, res) => {
    try {
        appData = req.body;
        if (saveData(appData)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ success: false, message: 'Fehler beim Speichern' });
        }
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler' });
});

app.listen(PORT, () => {
    console.log(`🚀 JRK Check-in App läuft auf Port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`💾 Daten werden in ${DATA_FILE} gespeichert`);
});
