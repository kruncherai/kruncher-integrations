
# Kruncher API Integration Guide

This document provides detailed instructions and examples for integrating with the Kruncher API.

---

## Documentation

### 1. How do I use the API Key?
The API Key provided should be used in the following requests as an `Authorization` header.

---

### 2. GET Projects

#### API Request and Response Structure

**Request**
- **Method**: GET  
- **URL**: `https://api.kruncher.ai/api/integration/projects`  
- **Authorization**: Use the `apiKey` as an authorization token.

The API will return all projects in a paginated format.

**Response Structure**
- **Metadata**  
  - `code`: Status code of the response (e.g., `1000` for success).  
  - `title`: Short description of the status (e.g., "Successful").  
  - `description`: Additional information (currently empty).  

- **Data**: Contains an array of project objects. Each object includes:
  - `id`, `name`, `companyName`, `companyWebsite`, `companyIndustry`, `companyCountry`, etc.
  - **Analyses**: An array of analysis objects with `id`, `type`, `status`, and `createdAt`.
  - **Project Scores**: Includes `scoreText`, `score`, and evaluation status.
  - **Project Status & Phase**: Details about the current status and phase of the project.
  - **Project Owner**: Information about the owner (e.g., `fullName` and `email`).

- **Pagination**
  - `page`, `totalCount`, `pageSize`, and `nextPage`.

---

### 3. GET Analysis

Every project has an array of analyses. The analysis contains detailed reports. To get the most recent analysis:

**Request**  
- **Method**: GET  
- **URL**: `https://api.kruncher.ai/api/integration/analysis/detail?analysisId=<analysisId>`

---

### 4. POST Create Project

To create a new project, use the following endpoint:

**Request**
- **URL**: POST `https://api.kruncher.ai/api/integration/project`

**Input**
```json
{
    "name": "Your Company Nickname",
    "companyName": "Your Company Name",
    "companyWebsite": "Your Company Website",
    "projectType": "projectAnalysisWithFile"
}
```

**Project Type Options**
- `projectAnalysisWithFile`: Create a project pending file upload for analysis.
- `projectAnalysisNoFile`: Create a project for analysis based on the company website.
- `projectNoAnalysis`: Create a project without analysis.

**Output**
The response includes the project object and `analysisId` if applicable.

---

### 5. POST Upload File for Analysis

After creating a project with `projectType` set to `projectAnalysisWithFile`, upload a file for analysis.

**Request**
- **URL**: POST `https://api.kruncher.ai/api/integrationfiles/upload`

**Headers**
- `Authorization`: Your API Key.  
- `analysisid`: The `analysisId` from the project creation response.

**Example (Python)**
```python
headers = {
    'Authorization': API_KEY,
    'analysisid': analysis_id
}
files_to_upload = [('files', (file, open(file, 'rb'))) for file in files]

response = requests.put(url, headers=headers, files=files_to_upload)
```

---

### 6. PUT Update Analysis Detail

To update specific entities in an analysis, use the following endpoint:

**Request**
- **URL**: PUT `https://api.kruncher.ai/api/integration/analysis/detail`

**Input**
```json
{
    "analysisId": "ID",
    "entityKey": "email",
    "value": "email value"
}
```

- `analysisId`: The ID of the analysis to update.
- `entityKey`: The name of the entity to update (e.g., `email`).
- `value`: The new value for the entity.

---

### 7. GET Kruncher Config

Kruncher exposes an endpoint providing all mappings between internal objects like industries, geographies, statuses, and labels.

**Request**
- **URL**: GET `https://api.kruncher.ai/api/config`

---

### 8. POST Map Kruncher Objects to External Providers

This endpoint allows mapping between Kruncher objects (e.g., `person`, `company`, `opportunity`) and external providers.

**Request**
- **URL**: POST `https://api.kruncher.ai/api/integration/map`

**Input**
```json
{
    "entityType": "person",
    "provider": "affinity",
    "externalId": "ex1234567891",
    "kruncherId": "kr1234567891"
}
```

**Headers**
- **Authorization**: Your `apiKey`.

---

### 9. GET All Mappings for a Specific Customer

This endpoint returns all mappings of Kruncher objects to external providers for a specific customer.

**Request**
- **URL**: GET `https://api.kruncher.ai/api/integration/map/all`

**Response Structure**
- **Metadata**: Contains status code, title, and description.
- **Data**: Array of mapping objects, each with:
  - `id`, `entityType`, `provider`, `kruncherId`, `externalId`, `createdAt`, and `updatedAt`.

**Headers**
- **Authorization**: Your `apiKey`.

---

## Webhook FAQ

### Webhook

When an analysis is completed, a `POST` request will be sent to the registered webhook.

**Request Body**
```json
{
    "event": "analysisCompleted",
    "data": {
        "projectId": "96c5c57f-8f8f-4f77-b7aa-550cb712aae9",
        "analysisId": "34ae8534-feb6-436e-8c92-cdba28a00a98",
        "kruncherEntityCompanyId": "04cc17f7-57d9-47ad-ba61-11912af9c027"
    }
}
```

- `event`: Event type indicating analysis completion.
- `data`: Contains details about the completed analysis.
  - `projectId`: ID of the project the analysis pertains to.
  - `analysisId`: ID of the completed analysis.
  - `kruncherEntityCompanyId`: ID of the related Kruncher entity company.
