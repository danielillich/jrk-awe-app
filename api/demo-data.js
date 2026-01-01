const demoData = [
    {
        id: 1,
        name: "Anna Müller",
        firstName: "Anna",
        lastName: "Müller",
        booking: "JRK2024001",
        age: "16",
        room: "26",
        originalRoom: "26",
        building: "A-OG",
        catering: "Vegetarisch",
        workshop: "Workshop 10, 120",
        workshops: [
            { number: 10, timeSlot: "10:00 - 11:30" },
            { number: 120, timeSlot: "16:00 - 17:30" }
        ],
        status: 'absent',
        checkInTime: null,
        checkOutTime: null,
        ausflugsTime: null,
        krankTime: null,
        roomChanges: []
    },
    {
        id: 2,
        name: "Max Schmidt",
        firstName: "Max",
        lastName: "Schmidt",
        booking: "JRK2024002",
        age: "17",
        room: "37",
        originalRoom: "37",
        building: "B-EG",
        catering: "Vollkost",
        workshop: "Workshop 20, 130",
        workshops: [
            { number: 20, timeSlot: "12:00 - 13:30" },
            { number: 130, timeSlot: "16:00 - 17:30" }
        ],
        status: 'present',
        checkInTime: "23.12.2024, 09:15:30",
        checkOutTime: null,
        ausflugsTime: null,
        krankTime: null,
        roomChanges: []
    }
];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method === 'POST') {
        res.status(200).json({ 
            success: true, 
            data: demoData 
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
