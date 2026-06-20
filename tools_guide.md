# Scottsdale Real Estate Integration Guide: MLS, CRM, and Chatbots

This integration guide describes how to connect this landing page to your production systems—**FlexMLS (ARMLS)** and the **Luxury Presence CRM**—and how to deploy a fully autonomous AI chatbot to streamline client follow-ups.

---

## 1. Connecting the Lead Forms to Luxury Presence CRM

Your contact forms and home valuation forms can automatically push data directly to your **Luxury Presence CRM** database.

### Integration Pathways
Because Luxury Presence is a luxury-focused closed ecosystem, lead syncing is typically achieved through one of three methods:

#### Method A: Direct Webhook Endpoint (Recommended)
1. Log into your **Luxury Presence Agent Dashboard**.
2. Navigate to **Settings > Integrations** and find your **API Webhook Endpoint URL**.
3. In your landing page's `app.js` submit handlers, replace the simulated console log with a native `fetch()` POST request:
```javascript
fetch('https://api.luxurypresence.com/v1/leads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_LUXURY_PRESENCE_API_KEY'
    },
    body: JSON.stringify({
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' '),
        email: email,
        phone: phone,
        budget: budget,
        message: msg,
        source: 'Scottsdale Portal - Landing Page'
    })
})
.then(response => response.json())
.then(data => console.log('Lead synced successfully:', data))
.catch(error => console.error('CRM sync error:', error));
```

#### Method B: Zapier Middleware
If direct API posting is restricted by your Luxury Presence plan:
1. **Trigger**: Select **Webhooks by Zapier** ➔ *Catch Hook*. Use the generated Zapier webhook URL inside your `app.js` form submit code.
2. **Action**: Select **Luxury Presence** (or **Follow Up Boss / LionDesk** if synced downstream) ➔ *Create Lead*, mapping your custom form variables.

---

## 2. Setting Up Live FlexMLS IDX Feeds (armls.flexmls.com)

To display live, searchable listings instead of static portfolio grids, you must connect to the Arizona Regional MLS (ARMLS) syndication feed.

### Steps to Acquire IDX Access:
1. **Apply for IDX Licensing**:
   - Log into [armls.flexmls.com](https://armls.flexmls.com).
   - Go to **Preferences > IDX Manager**.
   - Register your domain name and request an IDX SmartFrame or API key approval. (This process usually requires broker signature approval).
2. **Implement FlexMLS SmartFrames (Low Code)**:
   - Once approved, FlexMLS provides iframe snippet codes for specific saved searches (e.g., "Silverleaf listings over $3M").
   - Replace the property grid in `index.html` with the generated iframe:
     ```html
     <iframe src="https://armls.flexmls.com/idx/savedsearch/your_search_id" width="100%" height="700px" frameborder="0"></iframe>
     ```
3. **Implement Spark API (Custom Data Integration)**:
   - For high-fidelity card widgets (like our custom Scottsdale Showcases grid), apply for **Spark API** credentials via the FBS Developer portal.
   - Use serverless fetch requests to retrieve JSON feeds of active listings in zip codes `85255`, `85260`, and `85251`.

---

## 3. Deploying a Live AI Chatbot ("Desert Assistant")

The chatbot on this page acts as an interactive client-side demo. To connect this to a live, AI-driven backend, utilize these production tools:

### Recommended Setup: Voiceflow + OpenAI + Luxury Presence
1. **Voiceflow (No-Code AI Builder)**:
   - Create a Voiceflow workspace and set up an Agent chatbot flow.
   - **Knowledge Base Integration**: Upload local PDFs (e.g., Scottsdale HOA reports, Silverleaf design guidelines, local school ratings, and recent MLS market stats).
   - **OpenAI Assistant API**: Configure the AI model to use *GPT-4o* for conversational replies.
2. **Configure Lead Capture Prompts**:
   - Program the chatbot: *"If a user asks to view a house, inquire about buying, or asks for a valuation, ask for their email/phone number. Once provided, trigger an API POST to Luxury Presence CRM."*
3. **Embed the Chatbot Widget**:
   - Voiceflow will generate a script tag. Simply copy and paste it into the footer of `index.html` to replace our custom HTML chatbot layout.
   - Example embed:
     ```html
     <script type="text/javascript">
       (function(d, t) {
           var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
           v.onload = function() {
             window.voiceflow.chat.load({
               verify: { projectID: 'your-voiceflow-project-id' },
               url: 'https://general-runtime.voiceflow.com',
               versionID: 'production'
             });
           }
           v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
       })(document, 'script');
     </script>
     ```

---

## 4. Hyperlocal News Content Automation

To automatically pull Scottsdale-specific real estate updates:
- **RSS Syndication**: Use **RSS.app** or a similar service to scrape real estate blogs such as *Phoenix Business Journal (Real Estate Section)*, *Scottsdale Progress*, or the *ARMLS Blog*.
- **Sync to Page**: Feed the RSS RSS-to-JSON API into the `app.js` file to dynamically overwrite the hyperlocal news cards.
