const express = require('express');
const morgan = require('morgan');

const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const pages = require('./pagesData');

const createDB = require('./createDB');

const northData = require('./data/north.json');
const centralData = require('./data/central.json');
const southData = require('./data/south.json');
const insightsData = require('./data/insights.json')


const app = express();
const port = 3000;

app.use(morgan('common'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public_html')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/explore', (req, res) => {
    res.render('explore');
});

app.get('/insights', (req, res) => {
    res.render('insights', { data: insightsData });
});

app.get('/explore/north', (req, res) => {
    res.render('north', { data: northData });
});

app.get('/explore/central', (req, res) => {
    res.render('central', { data: centralData });
});

app.get('/explore/south', (req, res) => {
    res.render('south', { data: southData });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/feedback', (req, res) => {
    res.render('feedback');
});

// Content Route
app.get('/explore/:region/:card', (req, res) => {
    const region = req.params.region.charAt(0).toUpperCase() + req.params.region.slice(1);
    const card = req.params.card;

    const jsonFilePath = path.join(__dirname, 'data', `${region}.json`);
    const contentFilePath = path.join(__dirname, 'data', `${region}Content.json`);

    fs.readFile(jsonFilePath, 'utf8', (err, regionData) => {
        if (err) {
            console.error('Error loading regional data:', err);
            return res.status(500).send('Error loading data');
        }

        fs.readFile(contentFilePath, 'utf8', (err, contentData) => {
            if (err) {
                console.error('Error loading content data:', err);
                return res.status(500).send('Error loading content data');
            }

            const regionJson = JSON.parse(regionData); 
            const contentJson = JSON.parse(contentData);

            const selectedContent = contentJson.find(content => content.id === card);

            if (!selectedContent) {
                return res.status(404).send('Content not found');
            }

            res.render('content', {
                title: selectedContent.title,
                image: selectedContent.image,
                description: selectedContent.description,
                overview: selectedContent.overview,
                attractions: selectedContent.attractions,
                activities: selectedContent.activities,
                best_time: selectedContent.best_time,
                getting_there: selectedContent.getting_there,
                conclusion: selectedContent.conclusion,
                breadcrumbLink: `/explore/${region}/${card}`,
                topSpots: regionJson.topSpots,
                regionName: regionJson.region_name,
                region: region
            });
        });
    });
});

//Subscription Form
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    console.log(`Email before subscription: ${email}`);

    createDB.getAllSubscriptions((err, rows) => {
        if (err) {
            console.error('Error retrieving subscriptions:', err.message);
            return res.status(500).send('Error processing subscription. Please try again!'); // General error
        }

        const existingEmail = rows.find(row => row.email === email);
        if (existingEmail) {
            return res.status(400).send('Email already subscribed.'); // Specific message for already subscribed email
        }

        createDB.addSubscription(email, (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).send('Email already subscribed.'); // Specific message for unique constraint violation
                }
                console.error('Error saving subscription:', err.message);
                return res.status(500).send('Error processing subscription. Please try again!'); // General error
            }

            console.log(`Subscription added for email: ${email}`);
            return res.redirect(`/subscription-success?email=${encodeURIComponent(email)}`);
        });
    });
});

app.get('/subscription-success', (req, res) => {
    const email = req.query.email;
    console.log('Email passed to success page:', email);
    res.render('subscriptionSuccess', { email });
});

app.get('/search', (req, res) => {
    const query = req.query.query;
    const results = performSearch(query);
    res.render('searchResults', { results, query });
});

//Search Query
function performSearch(query) {
    const results = pages.filter(page => 
        page.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    ).map(page => {
        const matchingSentence = page.description.split('.').find(sentence => 
            sentence.toLowerCase().includes(query.toLowerCase())
        ) || 'No relevant description found.';
        
        return { ...page, matchingSentence };
    });
    return results;
}

//Contact Form
app.post('/contact', (req, res) => {
    const contactData = req.body;

    if (!contactData.firstname || !contactData.lastname || !contactData.email) {
        return res.status(400).send('Please fill out all required fields.');
    }

    createDB.addContact(contactData, (err) => {
        if (err) {
            console.error('Error saving contact:', err.message);
            return res.status(500).send('Error processing contact form. Please try again!');
        }

        console.log('Contact added:', contactData);
        return res.render('contactSuccess', {
            firstname: contactData.firstname,
            lastname: contactData.lastname,
            nationality: contactData.nationality,
            phone: contactData.phone,
            email: contactData.email,
            dob: contactData.dob,
            travelertype: contactData.travelertype,
            travelpriorities: contactData.travelpriorities,
            travelstyle: contactData.travelstyle,
            trippace: contactData.trippace,
            regions: contactData.regions,
            specificspots: contactData.specificspots,
            spotsinput: contactData.spotsinput,
            startdate: contactData.startdate,
            enddate: contactData.enddate,
            numbertravelers: contactData.numbertravelers,
            extra: contactData.extra
        });
    });
});

app.get('/contact-success', (req, res) => {
    res.render('contactSuccess', {
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        nationality: req.query.nationality,
        phone: req.query.phone,
        email: req.query.email,
        dob: req.query.dob,
        travelertype: req.query.travelertype,
        travelpriorities: req.query.travelpriorities,
        travelstyle: req.query.travelstyle,
        trippace: req.query.trippace,
        regions: req.query.regions,
        specificspots: req.query.specificspots,
        spotsinput: req.query.spotsinput,
        startdate: req.query.startdate,
        enddate: req.query.enddate,
        numbertravelers: req.query.numbertravelers,
        extra: req.query.extra
    });
});

//Feedback Form
app.post('/feedback', (req, res) => {
    const feedbackData = req.body;

    if (!feedbackData.firstname || !feedbackData.email || !feedbackData.overall || !feedbackData.quality || !feedbackData.responsiveness || !feedbackData.expectations || !feedbackData.recommend) {
        return res.status(400).send('Please fill out all required fields.');
    }

    createDB.addFeedback(feedbackData, (err) => {
        if (err) {
            console.error('Error saving feedback:', err.message);
            return res.status(500).send('Error processing feedback form. Please try again!');
        }

        console.log('Feedback added:', feedbackData);
        return res.render('feedbackSuccess', {
            firstname: feedbackData.firstname,
            email: feedbackData.email,
            nationality: feedbackData.nationality,
            phone: feedbackData.phone,
            overall: feedbackData.overall,
            quality: feedbackData.quality,
            responsiveness: feedbackData.responsiveness,
            expectations: feedbackData.expectations,
            recommend: feedbackData.recommend,
            comments: feedbackData.comments
        });
    });
});

app.get('/feedback-success', (req, res) => {
    res.render('feedbackSuccess', {
        firstname: req.query.firstname,
        email: req.query.email,
        nationality: req.query.nationality,
        phone: req.query.phone,
        overall: req.query.overall,
        quality: req.query.quality,
        responsiveness: req.query.responsiveness,
        expectations: req.query.expectations,
        recommend: req.query.recommend,
        comments: req.query.comments
    });
});

app.listen(port, () => {
    console.log(`Web server running at: http://localhost:${port}`);
    console.log(`Type Ctrl+C to shut down the web server`);
});