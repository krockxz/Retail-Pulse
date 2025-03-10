const { getStoreMaster } = require('../services/storeService');
const { processImages, calculatePerimeter } = require('../services/imageService');
const { STORE_MASTER_PATH } = require('../config');
const _ = require('lodash');

const validatePayload = (payload) => {
    if (!payload.count || payload.count !== payload.visits.length) {
        return false;
    }
    return true;
};

const submitJob = async (req, res) => {
    const { count, visits } = req.body;

    if (!validatePayload(req.body)) {
        return res.status(400).json({ error: "Invalid count or visits data." });
    }

    const jobId = _.uniqueId('job_');
    const job = {
        job_id: jobId,
        visits: visits,
        status: 'ongoing',
    };

    require('../config').JOB_QUEUE.push(job);
    res.status(201).json({ job_id: jobId });

    for (const visit of visits) {
        const storeMaster = await getStoreMaster(STORE_MASTER_PATH);

        if (!storeMaster.find(store => store.store_id === visit.store_id)) {
            job.status = 'failed';
            job.error = [{ store_id: visit.store_id, error: "Store ID not found in store master" }];
            break;
        }

        for (const imageUrl of visit.image_url) {
            try {
                const { height, width } = { height: 100, width: 200 }; 
                const perimeter = calculatePerimeter(width, height);
                console.log(`Store ID: ${visit.store_id}, Image URL: ${imageUrl}, Perimeter: ${perimeter}`);

                await processImages(imageUrl);

                console.log(`Processed Image for Store ID: ${visit.store_id}`);

            } catch (error) {
                job.status = 'failed';
                job.error = [{ store_id: visit.store_id, error: "Image processing failed" }];
                break;
            }
        }
    }

    job.status = 'completed';
    console.log(`Job ${jobId} completed`);
};

const getJobStatus = (req, res) => {
    const { jobid } = req.query;
    const job = require('../config').JOB_QUEUE.find(j => j.job_id === jobid);

    if (!job) {
        return res.status(400).json({ error: 'Job not found' });
    }

    res.status(200).json({
        status: job.status,
        job_id: job.job_id,
        error: job.error || null,
    });
};

module.exports = { submitJob, getJobStatus };
