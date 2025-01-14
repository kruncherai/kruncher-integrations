// index.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const integrationApi = axios.create({
  baseURL: process.env.INTEGRATION_API_BASE_URL,
  headers: {
    Authorization: `${process.env.INTEGRATION_API_KEY}`,
    "Content-Type": "application/json",
  },
});


// Health Check Endpoint
app.get("/", (req, res) => {
  res.send("Integration Demo Server is running!");
});

app.post("/project", async (req, res) => {
  //check if the website is valid if not return it
  if (!req.body.website || validURL(req.body.website) == false) {
    return res.status(400).json({ error: "Invalid website URL." });
  }
  const project = {
    name: req.body.name ? req.body.name : req.body.website, // required field
    companyWebsite: req.body.website, // required field
    projectType: "projectAnalysisNoFile",
  };

  try {
    const response = await integrationApi.post("/project", project);
    console.log(response);
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).json({ error: "Failed to create project." });
  }
});

// 2. Get Analysis by ID
app.get("/analysis/:id", async (req, res) => {
  const analysisId = req.params.id;
  try {
    const response = await integrationApi.get(`/analysis/detail?analysisId=${analysisId}`);
    res.status(200).json(response.data);

  } catch (error) {
    console.error(`Error fetching analysis ${analysisId}:`, error.message);
    res.status(500).json({ error: "Failed to fetch analysis." });
  }
});

// Webhook Endpoint
app.post("/webhook", async (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  if (event === "analysisCompleted") {
    const { analysisId, projectId } = data;

    try {
      // Fetch detailed analysis data from the integration API
      const analysisResponse = await integrationApi.get(
        `/analysis/detail?analysisId=${analysisId}`
      );
      const analysisDetails = analysisResponse.data;

      console.log("Analysis completed:", analysisDetails);
      // Respond with success
      res.status(200).json({ message: "Webhook processed successfully." });
    } catch (error) {
      console.error("Error processing webhook event:", error.message);
      res.status(500).json({ error: "Failed to process webhook." });
    }
  } else {
    console.warn(`Unhandled event type: ${event}`);
    res.status(400).json({ error: `Unhandled event type: ${event}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kruncher Integration listening on port ${PORT}`);
});
