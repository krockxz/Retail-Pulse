```markdown
# Retail Pulse Image Processing Service

## Description

This project is an image processing service for Retail Pulse that handles the processing of images collected from stores. The service allows users to submit jobs with a list of images and store details. Each image is processed to calculate its perimeter (2 * [Height + Width]) and simulate GPU processing by introducing a random sleep time between 0.1 to 0.4 seconds. The results are stored at an image level and associated with a store.

## Assumptions

- The image dimensions (height and width) are simulated as 100 and 200, respectively. In a real-world scenario, these values would be dynamically retrieved from the image itself.
- All stores have a unique store ID and can be found in the `store_master.csv` file.
- Jobs will be processed sequentially in a simulated manner, and errors like image download failures will be logged for specific store IDs.

## Installing (Setup) and Testing Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/krockxz/Retail-Pulse.git
cd retail-pulse
```

### 2. Install Dependencies

Run the following command to install the required Node.js dependencies:

```bash
npm install
```

### 3. Create `store_master.csv` File

Ensure that the `store_master.csv` file is available in the root directory. The file should have the following structure:

```csv
S00339218,Store 1,12345
S01408764,Store 2,67890
```

### 4. Run the Application

To start the application, run:

```bash
node app.js
```

The server will start on `http://localhost:3000`.

### 5. Test the Endpoints

#### Submit Job (POST Request)

Use the following `curl` command to submit a job:

```bash
curl -X POST http://localhost:3000/api/submit/ \
  -H "Content-Type: application/json" \
  -d '{
        "count": 2,
        "visits": [
            {
                "store_id": "S00339218",
                "image_url": [
                    "https://www.gstatic.com/webp/gallery/2.jpg",
                    "https://www.gstatic.com/webp/gallery/3.jpg"
                ],
                "visit_time": "2025-03-10T12:00:00"
            },
            {
                "store_id": "S01408764",
                "image_url": [
                    "https://www.gstatic.com/webp/gallery/3.jpg"
                ],
                "visit_time": "2025-03-10T12:30:00"
            }
        ]
      }'
```

#### Check Job Status (GET Request)

After job submission, use this `curl` command to check the job status:

```bash
curl -X GET "http://localhost:3000/api/status?jobid=123"
```

### 6. Failure Simulation

To simulate a job failure (e.g., invalid image URL), modify the job submission to use an invalid image URL and then check the job status:

```json
{
    "count": 2,
    "visits": [
        {
            "store_id": "S00339218",
            "image_url": [
                "https://www.invalid-url.com/2.jpg",
                "https://www.gstatic.com/webp/gallery/3.jpg"
            ],
            "visit_time": "2025-03-10T12:00:00"
        },
        {
            "store_id": "S01408764",
            "image_url": [
                "https://www.gstatic.com/webp/gallery/3.jpg"
            ],
            "visit_time": "2025-03-10T12:30:00"
        }
    ]
}
```

This will cause a failure due to the invalid URL. Use the `curl` command to check the status as shown in the previous section.

## Brief Description of the Work Environment

- **Computer/Operating System**: The application was developed and tested on a Linux-based operating system, but it can run on any system with Node.js installed (e.g., Windows, macOS, Linux).
- **Text Editor/IDE**: The code was written using Visual Studio Code (VS Code) with support for JavaScript and Node.js development.
- **Libraries**:
  - `express`: A fast, unopinionated web framework for Node.js, used to handle HTTP requests and routing.
  - `axios`: A promise-based HTTP client for making requests (e.g., downloading images).
  - `fs-extra`: An extension of the native `fs` module for handling file operations, used to read the `store_master.csv` file.
  - `random-args`: A library used to generate random sleep times for simulating GPU processing.
  - `performance` (from `perf_hooks`): Used to measure the time taken for job processing, although not explicitly used in the code, it can be added for performance tracking.

## Improvements

If given more time, the following improvements could be made to the project:

- **Image Processing**: Instead of simulating image dimensions and perimeter calculations, the actual dimensions of the image could be fetched dynamically using a library like `sharp` or `image-size`.
- **Parallel Processing**: The job processing could be optimized by processing multiple images in parallel rather than sequentially. This could improve performance, especially when dealing with large numbers of images.
- **Error Handling**: The error handling can be made more robust to cover edge cases like network failures, invalid file formats, etc.
- **Database Integration**: Instead of storing job data in memory (in the `jobQueue` array), a database could be integrated for persistent storage of job information and results.
- **Job Queueing**: Introduce a queue system (e.g., using `bull` or `kue`) to manage job submissions and ensure that jobs are processed efficiently.
- **Testing**: Implement unit and integration tests using a testing framework like `jest` to ensure the reliability of the service.
- **Scalability**: Implement horizontal scaling with load balancing to handle large volumes of incoming jobs concurrently.
```