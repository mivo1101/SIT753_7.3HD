const request = require('supertest');
const app = require('../index'); // Import the configured app from index.js
const createDB = require('../createDB');

jest.mock('../createDB');


describe('POST /subscribe', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 for invalid email format', async () => {
        const response = await request(app)
            .post('/subscribe')
            .send({ email: 'invalid-email' });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid email format.');
    });

    test('should return 400 if email already subscribed', async () => {
        createDB.getAllSubscriptions.mockImplementation((callback) => {
            callback(null, [{ email: 'test@example.com' }]);
        });

        const response = await request(app)
            .post('/subscribe')
            .send({ email: 'test@example.com' });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Email already subscribed.');
    });

    test('should redirect to subscription-success on successful subscription', async () => {
        createDB.getAllSubscriptions.mockImplementation((callback) => {
            callback(null, []);
        });
        createDB.addSubscription.mockImplementation((email, callback) => {
            callback(null);
        });

        const response = await request(app)
            .post('/subscribe')
            .send({ email: 'test@example.com' });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/subscription-success?email=test%40example.com');
    });

    test('should return 500 on database error', async () => {
        createDB.getAllSubscriptions.mockImplementation((callback) => {
            callback(new Error('Database error'), null);
        });

        const response = await request(app)
            .post('/subscribe')
            .send({ email: 'test@example.com' });
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error processing subscription. Please try again!');
    });
});

describe('POST /feedback', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/feedback')
            .send({
                firstname: 'John',
                email: 'test@example.com',
                // Missing required fields: overall, quality, responsiveness, expectations, recommend
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Please fill out all required fields.');
    });

    test('should render feedbackSuccess on successful feedback submission', async () => {
        createDB.addFeedback.mockImplementation((feedbackData, callback) => {
            callback(null);
        });

        const feedbackData = {
            firstname: 'John',
            email: 'test@example.com',
            overall: 'Satisfied',
            quality: 'Satisfied',
            responsiveness: 'Satisfied',
            expectations: 'Satisfied',
            recommend: 'Yes',
            nationality: 'Australia',
            phone: '1234567890',
            comments: 'Great service!'
        };

        const response = await request(app)
            .post('/feedback')
            .send(feedbackData);
        expect(response.status).toBe(200);
        expect(createDB.addFeedback).toHaveBeenCalledWith(feedbackData, expect.any(Function));
    });

    test('should return 500 on database error', async () => {
        createDB.addFeedback.mockImplementation((feedbackData, callback) => {
            callback(new Error('Database error'));
        });

        const response = await request(app)
            .post('/feedback')
            .send({
                firstname: 'John',
                email: 'test@example.com',
                overall: 'Satisfied',
                quality: 'Satisfied',
                responsiveness: 'Satisfied',
                expectations: 'Satisfied',
                recommend: 'Yes'
            });
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error processing feedback form. Please try again!');
    });
});