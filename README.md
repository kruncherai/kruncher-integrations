### Kruncher Integrations
Integration guides for Affinity x Kruncher


### Directories and guides. 

Please find your directory. Express integration. 

### Setup ENVIRONMENT VARIABLES

1. Get your API key from: https://kruncher.ai/app/settings/integrations
![alt text](image.png)
2. Add in your webhook where you would like to receive your post requests. 
3. Select Trigger on New Analysis Receive. 
4. API_BASE_URL = https://api.kruncher.ai/api/integration'



### Create new API response. 
1. Setup your API integation function
```js
const integrationApi = axios.create({
  baseURL: process.env.INTEGRATION_API_BASE_URL,
  headers: {
    Authorization: `${process.env.INTEGRATION_API_KEY}`,
    "Content-Type": "application/json",
  },
});
```

2. Create a new project 
```js
//check if the website is valid if not return it

function createProject(website:string, name?:string){
  if (!website || validURL(website) == false) {
    return res.status(400).json({ error: "Invalid website URL." });
  }
  const project = {
    name: name ? name : website, // required field
    companyWebsite: website, // required field
    projectType: "projectAnalysisNoFile", // add this filed for projectAnalysis baseed on website. 
  };

  try {
    const response = await integrationApi.post("/project", project);
  }catch(e){
    console.log('Something went wrong')
  }
}
```

3. New project is created with the response of
```json
{
    "metadata": {
        "code": "1000",
        "title": "Successful",
        "description": ""
    },
    "data": {
        "projectId": "76d4d78c-4451-4d43-a46d-5cefcccd59de",
        "analysisId": "5dab4014-df66-40a8-b5a6-6d3f4c14706f",
        "project": {
            "initial": "H",
            "colorLogo": "pink",
            "id": "76d4d78c-4451-4d43-a46d-5cefcccd59de",
            "name": "https://kruncher.ai",
            "companyName": null,
            "companyLegalName": null,
            "companyEmail": null,
            "companyWebsite": "https://kruncher.ai",
            "companyIndustry": null,
            "companyCountry": null,
            "companyBusinessModel": null,
            "companyStage": null,
            "companyRevenueRange": null,
            "companyLogo": null,
            "companySummary": null,
            "companyKeywordSummary": null,
            "isVisibile": false,
            "isPending": false,
            "isUnread": true,
            "processing": "In Progress",
            "originType": "manualUpload",
            "originFullName": "Manual (Koen Schuite)",
            "createdAt": "2025-01-14T15:39:46.389Z",
            "updatedAt": "2025-01-14T15:39:46.389Z",
            "customerId": "0f15a3e6-8bac-4eb9-876b-1d587b9a3365",
            "projectstatusId": "6cc34f51-d1fb-486d-82f8-2f0c1cda8e02",
            "projectphaseId": "631a9cd2-b24b-41cb-89c5-6f8330f7140a",
            "projectownerId": "a19062b4-b1a5-4520-986a-3b58373e3e58"
        }
    },
    "pagination": null
}
```
4. Please wait for a 5-15 minutes before the analysis is completed and returned to your webhook.
5. Once completed your will receive an event with the following data:
   ```json
   {
    "event":"analysisCompleted",
    "data":
        {
            "projectId":"de7a12ba-95a3-4049-ac23-20ce7585df65",
            "analysisId":"873071df-d738-42b1-9ef1-5f78de1442e7",
            "kruncherEntityCompanyId":"d650e9a7-7449-493a-951a-1d55da5ab874",
            "mappings":[],
            "projectName":"Kruncher"
        }
    }
   ``` 
6. You can now call the api to retrieve the infromation from this analyisis 
```js
app.post("/webhook", async (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  if (event === "analysisCompleted") {
    const { analysisId, projectId } = data;

    try {
      const analysisResponse = await integrationApi.get(`/analysis/detail?analysisId=${analysisId}`);
      const analysisDetails = analysisResponse.data;
      console.log(analysisDetails)
    }catch(e){
        console.log(e);
    }
  }
});
```

7. Returning the following example response 
```json
{
    "metadata": {
        "code": "1000",
        "title": "Successful",
        "description": ""
    },
    "data": {
        "analysisData": {
            "companyLogoUrl": {
                "text": "https://kruncherpubliclogo.blob.core.windows.net/companylogos/kruncher_ai_logo_linkedinApi.png",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": null,
                "comments": []
            },
            "companyName": {
                "text": "Kruncher",
                "structuredData": null,
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://kruncher.ai",
                        "logic": "Data found inside the website https://kruncher.ai"
                    }
                ],
                "comments": []
            },
            "keywordSummary": {
                "text": "Data, AI, Venture Capital, Insights, Automation",
                "structuredData": null,
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://kruncher.ai",
                        "logic": "Data found inside the website https://kruncher.ai"
                    }
                ],
                "comments": []
            },
            "companyOneSentence": {
                "text": "Kruncher is a pioneering Data & AI platform designed to support venture capital, incubators, and business angels by providing additional data and insights to solve the 'needle in the haystack' problem. It automates processes, enriches data, and generates actionable insights to aid in investment decision-making, ensuring data security and compliance.",
                "structuredData": null,
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://kruncher.ai",
                        "logic": "Data found inside the website https://kruncher.ai"
                    }
                ],
                "comments": []
            },
            "companyLegalName": {
                "text": "Kruncher Pte. Ltd.",
                "structuredData": null,
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://kruncher.ai",
                        "logic": "Data found inside the website https://kruncher.ai"
                    }
                ],
                "comments": []
            },
            "website": {
                "text": "https://kruncher.ai",
                "structuredData": null,
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://kruncher.ai",
                        "logic": "Data found inside the website https://kruncher.ai"
                    }
                ],
                "comments": []
            },
            "email": {},
            "foundYear": {
                "text": "The company was founded in 2024.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://api.crunchbase.com/v4/data/entities/organizations/kruncher",
                        "logic": "The founding year of Kruncher is explicitly mentioned as 2024 in the data retrieved from the Crunchbase API."
                    }
                ],
                "comments": []
            },
            "officeLocation": {
                "text": "160 Robinson Road, 068914, Singapore",
                "structuredData": null,
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://kruncher.ai",
                        "logic": "Data found inside the website https://kruncher.ai"
                    }
                ],
                "comments": []
            },
            "numberOfEmployees": {
                "text": "The company has 6 employees.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "https://www.linkedin.com/company/kruncher/",
                        "logic": "The number of employees is directly mentioned as 6 on the company's LinkedIn page."
                    }
                ],
                "comments": []
            },
            "totalSales": {},
            "burnRate": {},
            "geography": {},
            "fundsRaised": {
                "text": null,
                "structuredData": {
                    "stock_symbol": "",
                    "num_investors": "",
                    "last_equity_funding_type": "",
                    "last_equity_funding_type_label": "",
                    "last_funding_at": "",
                    "valuation": "",
                    "valuation_date": "",
                    "revenue_range": "",
                    "funding_total": "",
                    "num_funding_rounds": ""
                },
                "type": "structuredData",
                "source": "insight",
                "sources": null,
                "comments": []
            },
            "customersNumber": {},
            "valuation": {},
            "companyPitchUrl": {},
            "companySummary": {
                "text": "Kruncher is a pioneering Data & AI platform designed to support venture capital, incubators, and business angels by providing additional data and insights to solve the 'needle in the haystack' problem. It automates processes, enriches data, and generates actionable insights to aid in investment decision-making, ensuring data security and compliance.",
                "structuredData": null,
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://kruncher.ai",
                        "logic": "Data found inside the website https://kruncher.ai"
                    }
                ],
                "comments": []
            },
            "prosAndCons": {
                "text": null,
                "structuredData": [
                    {
                        "entityKey": "prosShort",
                        "type": "data",
                        "text": "- Innovative AI platform\n- Strong data security\n- Experienced founder",
                        "sources": "[{\"referenceNumber\": \"[1]\", \"file\": \"KruncherReports\", \"logic\": \"The context highlights Kruncher's innovative AI platform designed for venture capitalists, its commitment to data security with ISO 27001:2022 certification, and the founder's extensive experience in AI and digital solutions.\"}]"
                    },
                    {
                        "entityKey": "prosLong",
                        "type": "data",
                        "text": "- Kruncher offers an innovative AI platform that automates data processes for venture capitalists.\n- The company is committed to data security, pursuing ISO 27001:2022 certification.\n- The founder, Francesco De Liva, has extensive experience in AI and digital solutions.\n- The platform provides actionable insights, enhancing investment decision-making.\n- Kruncher targets a growing market with increasing reliance on data-driven decisions.",
                        "sources": "[{\"referenceNumber\": \"[1]\", \"file\": \"KruncherReports\", \"logic\": \"The context provides detailed information about Kruncher's strengths, including its innovative AI platform, focus on data security, experienced founder, and the growing market demand for data-driven decision-making in venture capital.\"}]"
                    },
                    {
                        "entityKey": "consShort",
                        "type": "data",
                        "text": "- Limited leadership diversity\n- Early-stage company\n- Subscription model challenges",
                        "sources": "[{\"referenceNumber\": \"[1]\", \"file\": \"KruncherReports\", \"logic\": \"The context mentions that Kruncher has only one founder, which may limit leadership diversity. It is an early-stage company founded in 2024, and its subscription-based revenue model may face challenges in scaling.\"}]"
                    },
                    {
                        "entityKey": "consLong",
                        "type": "data",
                        "text": "- Kruncher has only one founder, which may limit leadership diversity and expertise across business functions.\n- As an early-stage company founded in 2024, Kruncher may face challenges in establishing market presence.\n- The subscription-based revenue model may encounter difficulties in scaling and attracting diverse customer segments.\n- The company lacks a CTO, CRO, or CPO, which could be critical roles for a data-driven AI company.\n- There is no detailed information on the company's financials or funding, which may pose a risk for investors.",
                        "sources": "[{\"referenceNumber\": \"[1]\", \"file\": \"KruncherReports\", \"logic\": \"The context outlines concerns about Kruncher's leadership structure, early-stage status, subscription model, lack of certain executive roles, and limited financial information, which are potential risks for investors.\"}]"
                    },
                    {
                        "entityKey": "questionsShort",
                        "type": "data",
                        "text": "- Leadership team plans\n- Market expansion strategy\n- Financial projections clarity",
                        "sources": "[{\"referenceNumber\": \"[1]\", \"file\": \"KruncherReports\", \"logic\": \"The context suggests focusing on the leadership team, market expansion strategy, and clarity on financial projections as key areas for investor inquiry.\"}]"
                    },
                    {
                        "entityKey": "questionsLong",
                        "type": "data",
                        "text": "- What are the plans to diversify the leadership team and fill critical roles like CTO, CRO, or CPO?\n- How does Kruncher plan to establish its market presence and scale its subscription-based model?\n- Can you provide detailed financial projections and funding plans for the next few years?\n- What strategies are in place to ensure customer acquisition and retention in a competitive market?\n- How will Kruncher maintain its competitive edge in data security and AI innovation?",
                        "sources": "[{\"referenceNumber\": \"[1]\", \"file\": \"KruncherReports\", \"logic\": \"The context provides insights into potential areas of concern and interest for investors, such as leadership diversity, market strategy, financial clarity, customer acquisition, and maintaining a competitive edge in technology and security.\"}]"
                    }
                ],
                "type": "structuredData",
                "source": "postAnalysis",
                "sources": [],
                "comments": []
            },
            "founders": {},
            "founderStructured": {
                "text": "Kruncher has been founded by: A. Francesco De Liva (Founder, 15+ years’ experienced technical architect working as a bridge between business and tech teams, previously AI Architect at Microsoft, LEAD Business Program, Business Administration and Management, General from Stanford University Graduate School of Business).",
                "structuredData": [
                    {
                        "kruncherEntityPersonId": null,
                        "profileImage": "https://kruncherpubliclogo.blob.core.windows.net/linkedinpersonlogo/ACoAAAVRB64BSN_ZLRH_EmDRwzJOqnFg64Sjghs.png",
                        "fullName": "Francesco De Liva",
                        "roleInCompany": "founder",
                        "linkedinUrl": "https://www.linkedin.com/in/francescodeliva/",
                        "tags": [
                            "Tech Founder",
                            "Serial Entrepreneur",
                            "Between 2 and 4 years in the industry",
                            "20+ years working"
                        ],
                        "pastExperience": [
                            {
                                "role": "AI and Digital Architect",
                                "name": "Microsoft",
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/1035.png",
                                "employerDescription": "Every company has a mission. What's ours? To empower every person and every organization to achieve more. We believe technology can and should be a force for good and that meaningful innovation contributes to a brighter world in the future and today. Our culture doesn’t just encourage curiosity; it embraces it. Each day we make progress together by showing up as our authentic selves. We show up with a learn-it-all mentality. We show up cheering on others, knowing their success doesn't diminish our own. We show up every day open to learning our own biases, changing our behavior, and inviting in differences. Because impact matters. \n\nMicrosoft operates in 190 countries and is made up of approximately 228,000 passionate employees worldwide.",
                                "roleDescription": "[{'description': [{'type': 'textComponent', 'text': 'Intelligent Applications - Cloud Solution Architect:\\n•\\tHelping Singaporean customers in their app modernization and cloud journey\\n•\\tTransforming businesses with Generative AI: OpenAi, ChatGPT, Co-Pilot (coding), langchain and vectorDBs\\n•\\tServing several industries from banking to public sector\\n•\\tSpeaker in several WW events (MSBuild, LearningDays, DevMeetups); author of several contributions in Microsoft Architecture Center'}, {'type': 'textComponent', 'text': 'Skills: Artificial Intelligence (AI) · Generative AI · Natural Language Processing (NLP)'}]}]",
                                "duration": 47,
                                "startDate": "01/2021",
                                "endDate": "12/2024",
                                "isTopCompany": true
                            },
                            {
                                "role": "Solutions Architect",
                                "name": "Accenture",
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/1033.png",
                                "employerDescription": "Accenture is a leading global professional services company that helps the world’s leading businesses, governments and other organizations build their digital core, optimize their operations, accelerate revenue growth and enhance citizen services—creating tangible value at speed and scale.\n \nWe are a talent and innovation-led company serving clients in more than 120 countries. We combine our strength in technology and leadership in cloud, data and AI with unmatched industry experience, functional expertise and global delivery capability. We measure our success by the 360° value we create for our clients, each other, our shareholders, partners and communities.\n\nThis LinkedIn company page is moderated. When engaging with Accenture, we encourage everyone to:\n\n- Use common courtesy and be respectful of others.\n- Create your own original content and avoid content that you know to be fraudulent.\n- Never repost someone else's copyrighted work, unless you have permission.\n- Never post personal, identifying, or confidential information.\n\nWe reserve the right to delete comments or posts we deem to be:\n\n- Profane, obscene, inappropriate, offensive, abusive material.\n- Spam, repeated comments and commercial messages and personal advertisements.\n- Discriminatory or that contain hateful speech of any kind regarding age, gender, race, religion, nationality, sexual orientation, gender identity or disability.\n- Threats; personal attacks; abusive, defamatory, derogatory, or inflammatory language; or stalking or harassment of any individual, entity or organization.\n- False, inaccurate, libelous, or otherwise misleading in any way.",
                                "roleDescription": "[{'title': 'Solutions Architect', 'subtitle': 'Full-time', 'caption': 'Jun 2019 - Jan 2021 · 1 yr 8 mos', 'metadata': 'Singapore', 'description': [{'type': 'textComponent', 'text': '•\\tsolutioning and delivering digital projects in ASEAN;\\n•\\tsolution architect for proposal and RFPs;\\n•\\ttechnical project manager and vendor manager;\\n•\\ttechnologies: AR/VR, analytics, spark, API, front-end & micro-services, cloud, GCC, marketing platform\\n•\\tindustries: financial services, pharmaceutical, capital projects, ticketing, payments, media & entrainment;'}]}, {'title': 'Front-end lead of an innovative lending solution', 'caption': 'Jul 2018 - Jun 2019 · 1 yr', 'metadata': 'Bangkok Metropolitan Area, Thailand', 'description': [{'type': 'textComponent', 'text': '•\\tFront-end lead of a new digital lending product for a major bank in Thailand, integrated with Adobe Marketing Cloud: responsible of the staffing, the solutioning and the delivery of the front-ends of the biggest financial service project in ASEAN; leading twenty mobile, web and AEM developers across multiple geographies; delivered the first MVP in 4 months.'}, {'type': 'textComponent', 'text': 'Skills: Artificial Intelligence (AI)'}]}, {'title': 'Mobile Delivery Lead - Banking App', 'caption': 'Nov 2016 - Jun 2019 · 2 yrs 8 mos', 'metadata': 'Thailand', 'description': [{'type': 'textComponent', 'text': '•\\tMobile lead of a mobile banking app (6M MAU) in Thailand: built the team from scratch up to forty developers (iOS/Android); delivered the app in the market in 7 months from ideation; set up the process and architecture to allow a new release every month; 5 vendors PMO; agile methodologies;\\n•\\tWorked with onshore and offshores teams from Philippines to Brazil;'}, {'type': 'textComponent', 'text': 'Skills: Artificial Intelligence (AI)'}]}]",
                                "duration": 50,
                                "startDate": "11/2016",
                                "endDate": "01/2021",
                                "isTopCompany": true
                            },
                            {
                                "role": "Technical leader, Project Manager and Web Developer",
                                "name": "Freelance",
                                "logo": null,
                                "employerDescription": null,
                                "roleDescription": "[{'description': [{'type': 'textComponent', 'text': 'Part-time\\n•\\tSolution Architect and technical project manager for mobile projects (2 developers and a UX designer): To Alice (puzzle game - iOs and Android apps), Matita (math learning, iOs app), Cucinare Facile and Spicchio d’Aglio (cooking receipts, Android and iOs apps)\\n•\\tTechnical lead and web developer in web projects for Manigi Srl (Italian law websites), Socially (Malaysian advertisement agency), sfidadeigiovani.org and eclab.eu (R.U.E., Italian No profit).'}]}]",
                                "duration": 136,
                                "startDate": "05/2005",
                                "endDate": "09/2016",
                                "isTopCompany": false
                            },
                            {
                                "role": "Co-Founder and CTO",
                                "name": "Spotlime",
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/28936780.png",
                                "employerDescription": "Gestiamo i profili Social di Piccole e Medie Imprese accompagnandole in un percorso di crescita online e offline. Creiamo strategie taylor-made, completiamo la cura dei profili con Campagne di Advertising integrate (Facebook, Instagram e Google Ads). Il nostro lavoro è trasparente ed efficace.\n",
                                "roleDescription": "[{'description': [{'type': 'textComponent', 'text': '•\\tTechnical lead and architect: 4 developers (iOS, Android, Web and Java/J2EE) and 2 UI/UX designers;\\n•\\tMarketing director and product owner: a team of 3 designers and 2 marketing analysts; responsible for the product brand & positioning, the advertisement (Google Ads and Facebook Ads) and the digital marketing strategy\\n\\nDiscover more about Spotlime: https://www.spotlimeapp.com'}, {'type': 'textComponent', 'text': 'Skills: Artificial Intelligence (AI)'}, {'type': 'mediaComponent', 'text': 'An article on Spotlime, featured on Wired', 'thumbnail': 'https://media.licdn.com/dms/image/v2/C562DAQGk91fcVavFvg/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1601816802029?e=1736668800&v=beta&t=ctuGu4TS06ZtxmHVyF3WvyokKdTHfr1xmVhbbVuh2VA'}, {'type': 'mediaComponent', 'text': 'An article on Spotlime, featured on Sole 24 Ore, the main Italian Financial Newspaper', 'thumbnail': 'https://media.licdn.com/dms/image/v2/C562DAQGT7gjKx7drWw/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1601367557561?e=1736668800&v=beta&t=RqJKyOUYiaXBRLDdrlGIUvjWwkLPcwZ0EOKoCF0RRBQ'}, {'type': 'mediaComponent', 'text': 'Spotlime represents Italy in the MasterCard Mobile Top App Index 2015', 'thumbnail': 'https://media.licdn.com/dms/image/v2/C562DAQGdZqgDQVHk4Q/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1601798770486?e=1736668800&v=beta&t=M33kLwQb5Y2UMl2OqkwM6aZ2UUHioom2iUnkLKLyI6w'}]}]",
                                "duration": 40,
                                "startDate": "07/2013",
                                "endDate": "11/2016",
                                "isTopCompany": false
                            },
                            {
                                "role": "Investor",
                                "name": "TechCare",
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/96921507.png",
                                "employerDescription": "Empower your employees to find any answer they are looking for, perform tasks and create knowledge with an AI powered platform that connects all your data securely.",
                                "roleDescription": "[{'description': [{'type': 'textComponent', 'text': 'Skills: Artificial Intelligence (AI) · Generative AI · Retrieval-Augmented Generation (RAG) · Enterprise Architecture · Information Security'}]}]",
                                "duration": 24,
                                "startDate": "01/2023",
                                "endDate": "01/2025",
                                "isTopCompany": false
                            },
                            {
                                "role": "Software Engineer",
                                "name": "Amadeus IT Group",
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/2780.png",
                                "employerDescription": "We make the experience of travel better for everyone, everywhere by inspiring innovation, partnerships and responsibility to people, places and planet.\n\nOur technology powers the travel and tourism industry. \n\nWe inspire more connected ways of thinking, centered around the traveler. \n\nOur platform connects the travel and hospitality ecosystem. We are making travel a force for social and environmental good. \n\nWe are passionate about travel. With a unique perspective, at the heart of our industry, we are redesigning the travel of tomorrow.",
                                "roleDescription": "[{'description': [{'type': 'textComponent', 'text': 'I worked in the Amadeus IT Airlines Payment team (R&D department), $17B transactions a month. My main clients: Lufthansa, Cathay Pacific, Southwest Airline. \\n\\nTechnologies: UML, Java, Maven, ClearCase, Weblogic, SOAP, Debugging, Testing and SQL\\n'}]}]",
                                "duration": 35,
                                "startDate": "02/2011",
                                "endDate": "01/2014",
                                "isTopCompany": false
                            },
                            {
                                "role": "Operations Director",
                                "name": "R.U.E. - Risorse Umane Europa",
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/1324408.png",
                                "employerDescription": "RUE – Risorse Umane Europa è un’ associazione non profit, costituita a Udine il 27 febbraio 1992, che si è posta l’obiettivo di intervenire attraverso la formazione, l’informazione e la ricerca – azione sulle tematiche riferite all’intercultura, alle discriminazioni razziali, alla cittadinanza attiva e al processo di integrazione europea. Il gruppo di lavoro è infatti impegnato da anni nella realizzazione di progetti regionali ed europei rivolti agli operatori dei servizi socio educativi e sanitari, ai dirigenti, ai docenti, ai minori stranieri ed alle loro famiglie, agli studenti delle scuole medie inferiori e superiori ed ai giovani della Regione Autonoma Friuli Venezia Giulia.\r\nL’associazione si occupa inoltre di promuovere seminari, convegni a regia regionale sulle tematiche sopra enunciate.\r\n\r\nContattateci via mail: ruefvg@gmail.com\r\n\r\nAccreditamenti:\r\nIscrizione  alla sezione prima dell’ Albo regionale FVG delle Associazioni e degli Enti per l’immigrazione\r\nEnte di formazione accreditato dal M.I.U.R., DG formazione e l’aggiornamento del personale della scuola\r\nEnte legittimato ad agire in giudizio per conto delle vittime della discriminazione razziale ex DLvo 215/03\r\nAssociazione non profit  iscritta nel Registro \"Immigrazione\" del Dipartimento degli Affari Sociali\r\nServizio di promozione europea della Regione Autonoma Friuli Venezia Giulia\r\nPunto della Rete informativa per l’orientamento Friuli Venezia Giulia",
                                "roleDescription": "[{'description': [{'type': 'textComponent', 'text': 'Third sector project management: implemented and administrated 4 projects (€250K) for the Public Sector (Italian Ministry of Economic Development, Friuli-Venezia Giulia region and Udine Province).\\nManaged a team of 6 people.\\n'}]}]",
                                "duration": 13,
                                "startDate": "09/2011",
                                "endDate": "10/2012",
                                "isTopCompany": false
                            }
                        ],
                        "education": [
                            {
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/165509.png",
                                "universityName": "Politecnico di Milano",
                                "degree": "Bachelor's degree, Computer Engineering",
                                "isBachelorOrMaster": true,
                                "completionDate": "06/2008"
                            },
                            {
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/165509.png",
                                "universityName": "Politecnico di Milano",
                                "degree": "Master's degree, Computer Engineering",
                                "isBachelorOrMaster": true,
                                "completionDate": "06/2010"
                            },
                            {
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/2649.png",
                                "universityName": "University of Illinois Chicago",
                                "degree": "Master of Science (M.S.), Computer Science",
                                "isBachelorOrMaster": true,
                                "completionDate": "06/2010"
                            },
                            {
                                "logo": "https://kruncherpubliclogo.blob.core.windows.net/linkedincompanylogo/1791.png",
                                "universityName": "Stanford University Graduate School of Business",
                                "degree": "LEAD Business Program, Business Administration and Management, General",
                                "isBachelorOrMaster": false,
                                "completionDate": "06/2023"
                            },
                            {
                                "logo": null,
                                "universityName": "Liceo Scientifico \"G. Marinelli\" - Udine",
                                "degree": "Diploma, Major: computer science and physics",
                                "isBachelorOrMaster": false,
                                "completionDate": "06/2005"
                            }
                        ],
                        "links": [
                            {
                                "logo": "linkedin",
                                "name": "linkedin",
                                "link": "https://www.linkedin.com/in/francescodeliva/"
                            },
                            {
                                "logo": "crunchbase",
                                "name": "crunchbase",
                                "link": "https://www.crunchbase.com/person/francesco-de-liva"
                            }
                        ],
                        "shortBio": "CEO and Founder of Kruncher, experienced technical architect with a background in AI and digital solutions, educated in computer science and engineering.",
                        "country": "Singapore",
                        "addressWithoutCountry": "Singapore",
                        "linkedinConnection": 3002,
                        "yearOfBirth": "1983",
                        "startupFullTime": true,
                        "salesExperience": false
                    }
                ],
                "type": "structuredData",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://api.crunchbase.com/v4/data/entities/organizations/kruncher",
                        "logic": "Francesco De Liva is identified as the founder with a detailed bio and previous position at Microsoft."
                    },
                    {
                        "referenceNumber": "[4]",
                        "file": "https://www.linkedin.com/in/francescodeliva/",
                        "logic": "Francesco De Liva's LinkedIn profile confirms his role as founder and provides additional details about his background and education."
                    },
                    {
                        "referenceNumber": "[5]",
                        "file": "linkedinFounderAnalysis",
                        "logic": "The analysis provides comprehensive information about Francesco De Liva's education and professional background."
                    }
                ],
                "comments": []
            },
            "teamMembers": {
                "text": "Kruncher has several C-level executives including: A. Francesco De Liva (Founder, 15+ years’ experienced technical architect working as a bridge between business and tech teams, previously AI Architect at Microsoft, LEAD Business Program, Business Administration and Management, General from Stanford University Graduate School of Business).",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[2]",
                        "file": "https://kruncher.ai",
                        "logic": "The company website mentions Francesco De Liva as a key executive, suggesting he plays a significant role in the executive team."
                    },
                    {
                        "referenceNumber": "[4]",
                        "file": "https://www.linkedin.com/in/francescodeliva/",
                        "logic": "Francesco De Liva's LinkedIn profile confirms his role as founder and provides additional details about his background and education."
                    }
                ],
                "comments": []
            },
            "companyStructure": {
                "text": "1. Founders Pros: Francesco De Liva brings over 15 years of experience as a technical architect, bridging business and tech teams, which is a significant strength for Kruncher. 2. Founders Cons: With only one founder mentioned, there might be challenges in diversifying leadership and expertise across different business functions. 3. Missing component: The information does not mention a CTO, CRO, or CPO, which could be critical roles for a data-driven AI company. 4. Domain experience: Francesco De Liva has extensive experience in financial services and startups, which aligns well with Kruncher's focus on venture capital and data insights.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[1]",
                        "file": "https://api.crunchbase.com/v4/data/entities/organizations/kruncher",
                        "logic": "Francesco De Liva's experience and role as a founder are highlighted, providing insights into his strengths and potential challenges."
                    },
                    {
                        "referenceNumber": "[4]",
                        "file": "https://www.linkedin.com/in/francescodeliva/",
                        "logic": "Francesco De Liva's LinkedIn profile provides detailed information about his background, supporting the analysis of his strengths and the company's potential gaps."
                    },
                    {
                        "referenceNumber": "[5]",
                        "file": "linkedinFounderAnalysis",
                        "logic": "The analysis provides comprehensive information about Francesco De Liva's education and professional background, aiding in the assessment of domain expertise and missing components."
                    }
                ],
                "comments": []
            },
            "foundersCsv": {},
            "problemSolution": {
                "text": "Kruncher addresses the 'needle in the haystack' problem faced by venture capitalists, incubators, and business angels. The due diligence process is often time-consuming and inefficient, relying on outdated technology. Kruncher automates these processes, providing actionable insights and data-driven decision-making to enhance productivity and reduce the risk of missing valuable investment opportunities.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[2]",
                        "file": "https://kruncher.ai",
                        "logic": "The problem Kruncher solves is described as converting complex data into actionable insights and automating processes to support investment decisions. This is emphasized on their website."
                    },
                    {
                        "referenceNumber": "[3]",
                        "file": "https://kruncher.ai/about-us",
                        "logic": "The problem is further elaborated on the 'About Us' page, highlighting the inefficiencies in the due diligence process and how Kruncher aims to automate and streamline these tasks."
                    }
                ],
                "comments": []
            },
            "productService": {
                "text": "Kruncher's unique value proposition lies in its ability to transform chaotic data into actionable insights through automation and AI, enhancing productivity and decision-making for venture capitalists. It offers a secure, private platform with advanced data processing technologies, ensuring data-driven decisions and maintaining trust with limited partners.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[2]",
                        "file": "https://kruncher.ai",
                        "logic": "The unique selling point is highlighted on the website, emphasizing the platform's ability to automate and provide insights while ensuring data security."
                    }
                ],
                "comments": []
            },
            "roadmap": {},
            "revenueStreams": {
                "text": "Kruncher employs a subscription-based pricing model tailored for business-to-business (B2B) customers, specifically targeting venture capitalists and investment funds. The pricing strategy includes different tiers: a free trial for startups and individuals, a 'Screening Basic' plan starting at $999 per year for early-stage high-volume VCs, and a 'Screening Pro' plan starting at $1,499 per year for investment funds. These plans offer varying levels of document analysis and collaboration features, with the ability to connect email and download reports.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "The pricing model is described in the context, where Kruncher offers a tiered subscription model with different plans for different customer needs. The free trial is aimed at startups and individuals, while the 'Screening Basic' and 'Screening Pro' plans are designed for venture capitalists and investment funds, indicating a B2B focus. The pricing is annual, starting at $999 and $1,499 respectively, which aligns with a subscription-based model."
                    }
                ],
                "comments": []
            },
            "partnerships": {},
            "usecases": {},
            "gotoTargetMarket": {},
            "targetCustomers": {
                "text": "Kruncher's target customers include venture capitalists, incubators, business angels, and investment firms. These customers are looking for data-driven insights to enhance their investment decision-making processes and streamline due diligence.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[2]",
                        "file": "https://kruncher.ai",
                        "logic": "The website mentions the target customers as venture capitalists, incubators, and business angels, focusing on their need for data-driven insights."
                    }
                ],
                "comments": []
            },
            "gotoCustomerAcquisitionChannel": {},
            "gotoSalesStrategyInitiatives": {},
            "gotoSalesPartnerships": {},
            "gotoEarlyStageProductMarketFit": {},
            "tamAndSam": {
                "text": "The Total Addressable Market (TAM) for Kruncher can be estimated by considering the global market for data and AI platforms in the venture capital industry. Given the increasing reliance on data-driven decision-making and automation, the TAM is substantial. Assuming a global market size of $50 billion for data and AI platforms, the TAM for Kruncher would be a portion of this, considering its specific focus on venture capital. The Serviceable Addressable Market (SAM) would be a subset of the TAM, focusing on venture capitalists, incubators, and business angels who are Kruncher's target customers. Assuming Kruncher can capture 5% of the TAM, the SAM would be $2.5 billion. The Serviceable Obtainable Market (SOM) would be a further subset of the SAM, reflecting Kruncher's competitive positioning and capabilities. Assuming Kruncher can realistically capture 10% of the SAM, the SOM would be $250 million.",
                "structuredData": [
                    {
                        "insightTamAndSam": "The Total Addressable Market (TAM) for Kruncher can be estimated by considering the global market for data and AI platforms in the venture capital industry. Given the increasing reliance on data-driven decision-making and automation, the TAM is substantial. Assuming a global market size of $50 billion for data and AI platforms, the TAM for Kruncher would be a portion of this, considering its specific focus on venture capital. The Serviceable Addressable Market (SAM) would be a subset of the TAM, focusing on venture capitalists, incubators, and business angels who are Kruncher's target customers. Assuming Kruncher can capture 5% of the TAM, the SAM would be $2.5 billion. The Serviceable Obtainable Market (SOM) would be a further subset of the SAM, reflecting Kruncher's competitive positioning and capabilities. Assuming Kruncher can realistically capture 10% of the SAM, the SOM would be $250 million."
                    },
                    {
                        "insightTamValueUsd": "50000000000"
                    },
                    {
                        "insightSamValueUsd": "2500000000"
                    },
                    {
                        "insightSomValueUsd": "250000000"
                    },
                    {
                        "tamExplanation": "The TAM for Kruncher is estimated by considering the global market size for data and AI platforms in the venture capital industry. Given the increasing reliance on data-driven decision-making and automation, the TAM is substantial. I assumed a global market size of $50 billion for data and AI platforms, reflecting the significant demand for these services in the venture capital industry."
                    },
                    {
                        "samExplanation": "The SAM for Kruncher is a subset of the TAM, focusing on Kruncher's target customers, such as venture capitalists, incubators, and business angels. I assumed Kruncher can capture 5% of the TAM, resulting in a SAM of $2.5 billion. This reflects the relevant market share that Kruncher can realistically serve given its resources and market positioning."
                    },
                    {
                        "somExplanation": "The SOM for Kruncher is a further subset of the SAM, reflecting Kruncher's competitive positioning and capabilities. I assumed Kruncher can realistically capture 10% of the SAM, resulting in a SOM of $250 million. This reflects the portion of the SAM that Kruncher can realistically capture, considering its market share ambitions and strategic initiatives."
                    },
                    {
                        "insightBottomUpMarketSizingValueUsd": "11250000"
                    },
                    {
                        "bottomUpMarketSizingExplanation": "To compute the Bottom-Up Market Sizing value, I followed these steps: A. Core revenue-generating units are the subscription plans ('Screening Basic' and 'Screening Pro'). B. Assuming 500 potential customers (venture capitalists and investment funds) in the target market, with 60% opting for 'Screening Basic' ($999/year) and 40% for 'Screening Pro' ($1,499/year). C. Calculating potential revenue: (300 customers * $999) + (200 customers * $1,499) = $299,700 + $299,800 = $599,500 annually. D. Adjusting for market dynamics and competition, assume a 75% market penetration, resulting in $449,625. E. Projecting 5-year revenue using a 17.5% CAGR (average of 15% to 20%): $449,625 * (1 + 0.175)^5 ≈ $1,125,000. This results in a 5-year market sizing value of approximately $11,250,000 USD."
                    },
                    {
                        "opportunitySummary": "#### Total Addressable Market: $50B \nThe TAM for Kruncher is estimated by considering the global market size for data and AI platforms in the venture capital industry. Given the increasing reliance on data-driven decision-making and automation, the TAM is substantial. I assumed a global market size of $50 billion for data and AI platforms, reflecting the significant demand for these services in the venture capital industry.\n\n#### Serviceable Addressable Market: $2B \nThe SAM for Kruncher is a subset of the TAM, focusing on Kruncher's target customers, such as venture capitalists, incubators, and business angels. I assumed Kruncher can capture 5% of the TAM, resulting in a SAM of $2.5 billion. This reflects the relevant market share that Kruncher can realistically serve given its resources and market positioning.\n\n#### Serviceable Obtainable Market: $250M \nThe SOM for Kruncher is a further subset of the SAM, reflecting Kruncher's competitive positioning and capabilities. I assumed Kruncher can realistically capture 10% of the SAM, resulting in a SOM of $250 million. This reflects the portion of the SAM that Kruncher can realistically capture, considering its market share ambitions and strategic initiatives.\n\n#### Bottom Up Market Sizing: $11M \n To compute the Bottom-Up Market Sizing value, I followed these steps: A. Core revenue-generating units are the subscription plans ('Screening Basic' and 'Screening Pro'). B. Assuming 500 potential customers (venture capitalists and investment funds) in the target market, with 60% opting for 'Screening Basic' ($999/year) and 40% for 'Screening Pro' ($1,499/year). C. Calculating potential revenue: (300 customers * $999) + (200 customers * $1,499) = $299,700 + $299,800 = $599,500 annually. D. Adjusting for market dynamics and competition, assume a 75% market penetration, resulting in $449,625. E. Projecting 5-year revenue using a 17.5% CAGR (average of 15% to 20%): $449,625 * (1 + 0.175)^5 ≈ $1,125,000. This results in a 5-year market sizing value of approximately $11,250,000 USD.\n\n#### Assumptions: \n- Increasing reliance on data-driven decision-making by venture capitalists will drive demand for platforms like Kruncher.\n- Automation needs in processing large volumes of data will enhance the value proposition of Kruncher's offerings.\n- The demand for actionable insights to identify promising investment opportunities will support market growth.\n- Data security and compliance, evidenced by Kruncher's pursuit of ISO 27001:2022 certification, will be crucial as data privacy concerns rise.\n- The subscription-based pricing model with tiered plans will attract a diverse range of investment entities, expanding market reach.\n\n"
                    },
                    {
                        "insightPricingModel": "Kruncher employs a subscription-based pricing model tailored for business-to-business (B2B) customers, specifically targeting venture capitalists and investment funds. The pricing strategy includes different tiers: a free trial for startups and individuals, a 'Screening Basic' plan starting at $999 per year for early-stage high-volume VCs, and a 'Screening Pro' plan starting at $1,499 per year for investment funds. These plans offer varying levels of document analysis and collaboration features, with the ability to connect email and download reports."
                    },
                    {
                        "insightMarketAssumptions": "- Increasing reliance on data-driven decision-making by venture capitalists will drive demand for platforms like Kruncher.\n- Automation needs in processing large volumes of data will enhance the value proposition of Kruncher's offerings.\n- The demand for actionable insights to identify promising investment opportunities will support market growth.\n- Data security and compliance, evidenced by Kruncher's pursuit of ISO 27001:2022 certification, will be crucial as data privacy concerns rise.\n- The subscription-based pricing model with tiered plans will attract a diverse range of investment entities, expanding market reach."
                    }
                ],
                "type": "structuredData",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "The TAM, SAM, and SOM are estimated based on the global market size for data and AI platforms in the venture capital industry. The TAM is assumed to be $50 billion, reflecting the significant demand for data-driven insights and automation. The SAM is a portion of the TAM, focusing on Kruncher's target customers, such as venture capitalists and incubators. A 5% capture rate of the TAM is assumed for the SAM, resulting in $2.5 billion. The SOM is a further subset of the SAM, reflecting Kruncher's competitive positioning and capabilities, with a 10% capture rate of the SAM assumed for the SOM, resulting in $250 million."
                    }
                ],
                "comments": []
            },
            "tam": {},
            "sam": {},
            "som": {
                "text": "250000000",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "The SOM for Kruncher is a further subset of the SAM, reflecting Kruncher's competitive positioning and capabilities. It is assumed that Kruncher can realistically capture 10% of the SAM, resulting in a SOM of $250 million. This reflects the portion of the SAM that Kruncher can realistically capture, considering its market share ambitions and strategic initiatives."
                    }
                ],
                "comments": []
            },
            "bottomUpMarketSizing": {
                "text": "11250000",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "To compute the Bottom-Up Market Sizing value, the core revenue-generating units are the subscription plans ('Screening Basic' and 'Screening Pro'). Assuming 500 potential customers in the target market, with 60% opting for 'Screening Basic' ($999/year) and 40% for 'Screening Pro' ($1,499/year), the potential revenue is calculated as (300 customers * $999) + (200 customers * $1,499) = $299,700 + $299,800 = $599,500 annually. Adjusting for market dynamics and competition, a 75% market penetration is assumed, resulting in $449,625. Projecting 5-year revenue using a 17.5% CAGR (average of 15% to 20%): $449,625 * (1 + 0.175)^5 ≈ $1,125,000. This results in a 5-year market sizing value of approximately $11,250,000 USD."
                    }
                ],
                "comments": []
            },
            "marketAssumptions": {
                "text": "- Increasing reliance on data-driven decision-making by venture capitalists will drive demand for platforms like Kruncher.\n- Automation needs in processing large volumes of data will enhance the value proposition of Kruncher's offerings.\n- The demand for actionable insights to identify promising investment opportunities will support market growth.\n- Data security and compliance, evidenced by Kruncher's pursuit of ISO 27001:2022 certification, will be crucial as data privacy concerns rise.\n- The subscription-based pricing model with tiered plans will attract a diverse range of investment entities, expanding market reach.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "The assumptions are derived from the trends and business model described in the context. The increasing reliance on data-driven decision-making and automation needs are key drivers for Kruncher's market. The demand for actionable insights aligns with the company's offerings. Data security and compliance are critical due to rising privacy concerns, and the subscription-based model is designed to attract a wide range of customers, supporting market expansion."
                    }
                ],
                "comments": []
            },
            "industry": {
                "text": "The most representative revenue multiplier for Kruncher, operating in the Data & AI for Venture Capital industry in Singapore, is likely around 8x to 12x. This estimation is based on typical revenue multipliers for SaaS companies in the data and AI sector, which often range from 8x to 12x, depending on growth rates, market demand, and competitive positioning.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "To estimate the revenue multiplier, Kruncher's industry (Data & AI for Venture Capital) and its business model (subscription-based SaaS) were considered. SaaS companies in the data and AI sector often have revenue multipliers between 8x to 12x due to high growth potential and recurring revenue streams. The geographic location (Singapore) and the focus on venture capitalists, which is a niche market, also support this range."
                    }
                ],
                "comments": []
            },
            "cagr": {
                "text": "The estimated CAGR for the Data & AI platform market in the venture capital industry over the next 5 years is approximately 15% to 20%. This growth is driven by increasing reliance on data-driven decision-making, automation needs, and demand for actionable insights.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "The CAGR estimation is based on the trends identified in the context, which highlight a significant growth in the market for data and AI platforms in the venture capital industry. The increasing reliance on data-driven decision-making and automation, along with the demand for actionable insights, suggest a robust growth rate. The focus on data security and compliance further supports this growth trajectory."
                    }
                ],
                "comments": []
            },
            "keyIndustryPlayers": {},
            "industryTrends": {
                "text": "The market for data and AI platforms in the venture capital industry is expected to grow significantly over the next 2-5 years. Key trends driving this growth include the increasing reliance on data-driven decision-making by venture capitalists, the need for automation in processing large volumes of data, and the demand for actionable insights to identify promising investment opportunities. As venture capitalists seek to enhance their investment strategies, platforms like Kruncher that offer enriched data and insights will become increasingly valuable. Additionally, the focus on data security and compliance, as evidenced by Kruncher's pursuit of ISO 27001:2022 certification, will be a critical trend as data privacy concerns continue to rise. The subscription-based pricing model with tiered plans will likely attract a diverse range of investment entities, further expanding the market reach.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[3]",
                        "file": "MarketFinder",
                        "logic": "The market trends for Kruncher are estimated based on the company's focus on data and AI for venture capital, the subscription-based pricing model, and the target customers. The venture capital industry is increasingly adopting data-driven approaches, which aligns with Kruncher's offerings. The automation of data processing and the generation of insights are crucial for venture capitalists to make informed decisions, suggesting a growing demand for such platforms. The pursuit of ISO 27001:2022 certification indicates a trend towards increased data security and compliance."
                    }
                ],
                "comments": []
            },
            "majorCompetitors": {},
            "competitiveAdvantage": {},
            "patents": {
                "text": "Kruncher is in the process of getting certified for ISO 27001:2022, which is a standard for information security management systems. This certification ensures that Kruncher adheres to international standards for data security and privacy.",
                "structuredData": [],
                "type": "data",
                "source": "insight",
                "sources": [
                    {
                        "referenceNumber": "[2]",
                        "file": "https://kruncher.ai",
                        "logic": "The website mentions that Kruncher is in the process of obtaining ISO 27001:2022 certification, highlighting their commitment to data security."
                    }
                ],
                "comments": []
            },
            "investmentMemo": {
                "text": "# Investment Memo: Kruncher\n\n## Defensibility Analysis\nKruncher operates in the Data & AI sector, specifically targeting venture capitalists, incubators, and business angels. The company's competitive edge lies in its ability to automate data processes and provide actionable insights, addressing the \"needle in the haystack\" problem in investment decision-making. While Kruncher is in the process of obtaining ISO 27001:2022 certification, which enhances its data security credentials, there is no mention of proprietary technology or patents, which could be a potential vulnerability in terms of intellectual property defensibility. The market position is strengthened by its focus on data security and compliance, a growing concern in the industry.\n\n## Team\nThe founder, Francesco De Liva, brings over 15 years of experience as a technical architect, with a background in AI and digital solutions. His previous roles at Microsoft and Accenture, along with his education from Stanford University Graduate School of Business, provide a strong foundation for leading Kruncher. However, the team appears to be small, with only six employees, which might limit the company's ability to scale rapidly. The lack of a diversified leadership team, such as a CTO or CRO, could also be a constraint.\n\n## Traction\nKruncher offers subscription plans with pricing tiers, indicating a structured revenue model. However, there is no detailed information on user engagement, growth metrics, or partnerships. The company is relatively new, founded in 2024, and may still be in the early stages of gaining market traction. The absence of specific revenue figures or funding rounds makes it challenging to assess its financial health compared to industry standards.\n\n## Tech\nKruncher's platform is designed to automate and enrich investment data, offering features like intelligent algorithms and external data enrichment. The integration with Microsoft365 and focus on end-to-end encryption and data privacy measures highlight its technical feasibility and potential for disruption. However, without detailed technical specifications or a demonstration of unique technology, it is difficult to fully evaluate the innovation and scalability of the platform.\n\n## Timing\nThe market for data and AI platforms in the venture capital industry is expected to grow significantly, with an estimated CAGR of 15% to 20% over the next five years. Kruncher's focus on data-driven decision-making and automation aligns well with these trends. The increasing demand for actionable insights and data security positions Kruncher favorably in the current market landscape.\n\n## Terms\nThere is no specific information on the proposed investment terms, valuation, or equity offered. The company employs a subscription-based pricing model, which is typical for SaaS businesses, but further details on funding needs or exit strategies are not provided.\n\n## Pros and Cons\n\n### Pros\n- **Market Opportunity**: Growing demand for data-driven decision-making and automation in venture capital.\n- **Team Capability**: Experienced founder with a strong background in AI and digital solutions.\n- **Innovative Technology**: Platform offers automation and data enrichment features, with a focus on security and compliance.\n\n### Cons\n- **Market Competition**: Lack of proprietary technology or patents could be a disadvantage.\n- **Execution Risk**: Small team size and limited leadership diversity may hinder rapid scaling.\n- **Financial Projections**: Absence of detailed financial metrics or funding history.\n\n## Opinionated Suggestion for Next Steps\nGiven the promising market trends and the founder's expertise, it is recommended to proceed with further due diligence. This should include a deeper dive into the company's financials, user engagement metrics, and competitive landscape. Additionally, exploring potential partnerships or collaborations could strengthen Kruncher's market position. If these aspects align with investment criteria, negotiating terms that address the identified risks would be advisable.\n\n---\n\n### Reflection and Evaluation\n- **Logical Soundness**: 8/10. The analysis is based on available data, but the lack of specific financial and traction metrics limits the depth of evaluation.\n- **Correctness**: The response is believed to be correct based on the provided context.\n- **Areas for Improvement**: More detailed financial data, user engagement metrics, and competitive analysis would enhance the clarity and depth of the investment memo.",
                "structuredData": null,
                "type": "data",
                "source": "postAnalysis",
                "sources": [],
                "comments": []
            },
            "noteText": {
                "text": "",
                "structuredData": null,
                "type": "data",
                "source": "postAnalysis",
                "sources": [],
                "comments": []
            }
        },
        "kruncherEntityCompanyId": "8d5c9460-799e-426c-96e3-f61d30581c0a",
        "kruncherEntityCompanyDomainsCsv": "https://kruncher.ai,https://kruncher.ai",
        "founders": [],
        "projectId": "ddddd8e5-d8df-449a-8d99-38014d6f8298",
        "project": {
            "initial": "H",
            "colorLogo": "violet",
            "id": "ddddd8e5-d8df-449a-8d99-38014d6f8298",
            "name": "https://kruncher.ai",
            "companyName": "Kruncher",
            "companyLegalName": "Kruncher Pte. Ltd.",
            "companyEmail": null,
            "companyWebsite": "https://kruncher.ai",
            "companyIndustry": "artificialintelligenceandmachinelearning, softwareasaservice, investmentmanagementandfundoperators",
            "companyCountry": "SG",
            "companyBusinessModel": "b2b",
            "companyStage": "seed",
            "companyRevenueRange": "below10k",
            "companyLogo": "https://kruncherpubliclogo.blob.core.windows.net/companylogos/kruncher_ai_logo_linkedinApi.png",
            "companySummary": "Kruncher is a pioneering Data & AI platform designed to support venture capital, incubators, and business angels by providing additional data and insights to solve the 'needle in the haystack' problem. It automates processes, enriches data, and generates actionable insights to aid in investment decision-making, ensuring data security and compliance.",
            "companyKeywordSummary": "Data, AI, Venture Capital, Insights, Automation",
            "isVisibile": true,
            "isPending": false,
            "isUnread": false,
            "processing": "Done",
            "originType": "manualUpload",
            "originFullName": "Manual (Koen Schuite)",
            "createdAt": "2025-01-14T15:06:54.644Z",
            "updatedAt": "2025-01-14T15:14:14.483Z",
            "customerId": "0f15a3e6-8bac-4eb9-876b-1d587b9a3365",
            "projectstatusId": "6cc34f51-d1fb-486d-82f8-2f0c1cda8e02",
            "projectphaseId": "631a9cd2-b24b-41cb-89c5-6f8330f7140a",
            "projectownerId": "a19062b4-b1a5-4520-986a-3b58373e3e58",
            "projectscores": [
                {
                    "id": "7f1cc712-4461-4eba-8dd7-7b737015943e",
                    "status": "done",
                    "scoreText": "Match",
                    "score": 48,
                    "structuredData": "[{\"status\":\"secondary\",\"criteriadimensionType\":\"companyIndustry\",\"criteriadimensionLabel\":\"Industry\",\"criteriaSelectedCodes\":\"artificialintelligenceandmachinelearning, softwareasaservice, investmentmanagementandfundoperators\",\"criteriaSelectedNames\":\"Artificial Intelligence and Machine Learning (AI/ML) , Software as a Service (SaaS), Investment Management & Fund Operators\",\"postanalysisoutputId\":\"6f753138-9a35-4b4e-8505-4b5ecd8969b0\"},{\"status\":\"secondary\",\"criteriadimensionType\":\"companyStage\",\"criteriadimensionLabel\":\"Company Stage\",\"criteriaSelectedCodes\":\"seed\",\"criteriaSelectedNames\":\"Seed\",\"postanalysisoutputId\":\"0961530d-09d5-442d-afc5-cc1953328e16\"},{\"status\":\"secondary\",\"criteriadimensionType\":\"companyBusinessModel\",\"criteriadimensionLabel\":\"Business Model\",\"criteriaSelectedCodes\":\"b2b\",\"criteriaSelectedNames\":\"B2B\",\"postanalysisoutputId\":\"24f8a2f4-9f3e-4503-9b9e-fb4636e4dbaa\"},{\"status\":\"secondary\",\"criteriadimensionType\":\"companyCountry\",\"criteriadimensionLabel\":\"Geography\",\"criteriaSelectedCodes\":\"SG\",\"criteriaSelectedNames\":\"Singapore\",\"postanalysisoutputId\":\"96cad4c0-1c02-4868-b6f4-4d254d43b676\"},{\"status\":\"secondary\",\"criteriadimensionType\":\"companyRevenueRange\",\"criteriadimensionLabel\":\"Monthly Revenue Range\",\"criteriaSelectedCodes\":\"below10k\",\"criteriaSelectedNames\":\"<10.000 $/month\",\"postanalysisoutputId\":\"d3c08a49-e1a5-4fc9-bb24-818b540d2e44\"}]",
                    "createdAt": "2025-01-14T15:14:14.458Z",
                    "updatedAt": "2025-01-14T15:14:14.476Z",
                    "projectId": "ddddd8e5-d8df-449a-8d99-38014d6f8298",
                    "analyasisId": "ae51df4a-6e3a-4ae1-948b-12aa24874607",
                    "criterionId": "30332ad7-1c99-45d6-8226-4f7844c6b515",
                    "criterion": {
                        "id": "30332ad7-1c99-45d6-8226-4f7844c6b515",
                        "versionName": "Default",
                        "versionNumber": 0,
                        "createdAt": "2024-08-29T17:43:33.387Z",
                        "updatedAt": "2024-08-29T17:43:33.387Z",
                        "customerId": null,
                        "customeruserId": null
                    },
                    "redflags": [],
                    "warnings": []
                }
            ]
        }
    },
    "pagination": null
}
```