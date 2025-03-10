const express = require('express');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const { performance } = require('perf_hooks');

const app = express();
const port = 3000;

app.use(express.json());

let jobQueue = []; 
let jobIdCounter = 1;

const getStoreMaster = async () => {
    const filePath = path.join(__dirname, 'store_master.csv');
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const stores = lines.map(line => {
        const [store_id, store_name, area_code] = line.split(',');
        return { store_id, store_name, area_code };
    });
    return stores;
};

// Helper function to calculate the perimeter of an image
const calculatePerimeter = (width, height) => {
    return 2 * (width + height);
};

// Job Submission Route
app.post('/api/submit/', async (req, res) => {
    const { count, visits } = req.body;

    if (!count || count !== visits.length) {
        return res.status(400).json({ error: "Invalid count or visits data." });
    }

    // Create a job
    const jobId = jobIdCounter++;
    const job = {
        job_id: jobId,
        visits: visits,
        status: 'ongoing',
    };

    jobQueue.push(job);
    res.status(201).json({ job_id: jobId });

    // Start processing the job in a simulated manner
    for (const visit of visits) {
        for (const imageUrl of visit.image_url) {
            try {
                // Simulate image download and perimeter calculation
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const { height, width } = { height: 100, width: 200 }; // Simulate dimensions

                // Calculate perimeter
                const perimeter = calculatePerimeter(width, height);
                console.log(`Store ID: ${visit.store_id}, Image URL: ${imageUrl}, Perimeter: ${perimeter}`);

                // Simulate GPU processing
                const randomSleep = _.random(0.1, 0.4, true);
                await new Promise(resolve => setTimeout(resolve, randomSleep * 1000));

                // Store results (simulated)
                console.log(`Processed Image for Store ID: ${visit.store_id}`);

            } catch (error) {
                // If image download or processing fails
                console.log(`Failed to process image for Store ID: ${visit.store_id}`);
                job.status = 'failed';
                job.error = [{ store_id: visit.store_id, error: "Image download failed" }];
                break;
            }
        }
    }

    // Mark job as completed
    job.status = 'completed';
    console.log(`Job ${jobId} completed`);
});

// Job Status Route
app.get('/api/status', (req, res) => {
    const { jobid } = req.query;
    const job = jobQueue.find(j => j.job_id == jobid);

    if (!job) {
        return res.status(400).json({});
    }

    res.status(200).json({
        status: job.status,
        job_id: job.job_id,
        error: job.error || null,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
