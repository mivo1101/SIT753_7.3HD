const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating subscriptions table:', err.message);
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            nationality TEXT NOT NULL,
            phone TEXT,
            email TEXT NOT NULL,
            dob DATE,
            travelertype TEXT,
            travelpriorities TEXT,
            travelstyle TEXT NOT NULL,
            trippace TEXT NOT NULL,
            regions TEXT,
            specificspots TEXT NOT NULL,
            spotsinput TEXT,
            startdate DATE NOT NULL,
            enddate DATE NOT NULL,
            numbertravelers INTEGER NOT NULL,
            extra TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating contacts table:', err.message);
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT NOT NULL,
            email TEXT NOT NULL,
            nationality TEXT,
            phone TEXT,
            overall TEXT NOT NULL,
            quality TEXT NOT NULL,
            responsiveness TEXT NOT NULL,
            expectations TEXT NOT NULL,
            recommend TEXT NOT NULL,
            comments TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating feedback table:', err.message);
            }
        });
    }
});

function addSubscription(email, callback) {
    db.run(`INSERT INTO subscriptions (email) VALUES (?)`, [email], function(err) {
        if (err) {
            console.error('Database insert error:', err.message); // Log the error message
        }
        callback(err, this);
    });
}

function getAllSubscriptions(callback) {
    db.all(`SELECT * FROM subscriptions`, [], (err, rows) => {
        callback(err, rows);
    });
}

function addContact(contact, callback) {
    const { firstname, lastname, nationality, phone, email, dob, travelertype, travelpriorities, travelstyle, trippace, regions, specificspots, spotsinput, preferred_travel_dates } = contact;

    db.run(`INSERT INTO contacts (firstname, lastname, nationality, phone, email, dob, travelertype, travelpriorities, travelstyle, trippace, regions, specificspots, spotsinput, preferred_travel_dates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [firstname, lastname, nationality, phone, email, dob, travelertype, travelpriorities, travelstyle, trippace, regions, specificspots, spotsinput, preferred_travel_dates], 
        function(err) {
            if (err) {
                console.error('Database insert error:', err.message); // Log the error message
            }
            callback(err, this);
        });
}

function getAllContacts(callback) {
    db.all(`SELECT * FROM contacts`, [], (err, rows) => {
        callback(err, rows);
    });
}

function addFeedback(feedback, callback) {
    const { firstname, email, nationality, phone, overall, quality, responsiveness, expectations, recommend, comments } = feedback;

    db.run(`INSERT INTO feedback (firstname, email, nationality, phone, overall, quality, responsiveness, expectations, recommend, comments) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [firstname, email, nationality || null, phone || null, overall, quality, responsiveness, expectations, recommend, comments || null], 
        function(err) {
            if (err) {
                console.error('Database insert error:', err.message);
            }
            callback(err, this);
        });
}

function getAllFeedback(callback) {
    db.all(`SELECT * FROM feedback`, [], (err, rows) => {
        callback(err, rows);
    });
}

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
    });
}

module.exports = {
    addSubscription,
    getAllSubscriptions,
    addContact,
    getAllContacts,
    addFeedback,
    getAllFeedback,
    closeDatabase
};