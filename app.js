// SCOTTSDALE AND PHOENIX REAL ESTATE PORTAL - JAVASCRIPT LOGIC

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- SYSTEM & AUTH STATE ---
    let isLoggedIn = sessionStorage.getItem('agent_logged_in') === 'true';
    let agentPasscode = localStorage.getItem('agent_passcode') || 'scottsdale2026';
    const agentEmail = 'kasayaandco@gmail.com';

    // --- LEADS STATE MANAGEMENT ---
    let leads = [];
    const defaultLeads = [
        {
            id: 'lead-1',
            name: 'Robert Chen',
            email: 'robert.chen@techcorp.com',
            phone: '(415) 555-0812',
            role: 'Buy',
            budget: '$2.5M - $5M',
            message: 'Interested in custom golf properties in Troon North / Grayhawk. Seeking a 4+ bed with a view.',
            status: 'Contacted',
            timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString(), // 4 hours ago
            source: 'Website Contact'
        },
        {
            id: 'lead-2',
            name: 'Amanda Miller',
            email: 'amanda.m@millermedia.co',
            phone: '(602) 555-9831',
            role: 'Sell',
            budget: '$1M - $2.5M',
            message: 'Looking to sell our single-family home in McCormick Ranch (85260). Want to align listing for late summer.',
            status: 'New',
            timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(), // 2 hours ago
            source: 'Valuation Lead'
        },
        {
            id: 'lead-3',
            name: 'David Vance',
            email: 'david.vance@vanceequity.com',
            phone: '(312) 555-4309',
            role: 'Invest',
            budget: '$5M+',
            message: 'Relocating Chicago office. Looking for a custom lot or spec home in Silverleaf. Cash buyer.',
            status: 'New',
            timestamp: new Date(Date.now() - 600000).toLocaleString(), // 10 mins ago
            source: 'Assistant Chat'
        }
    ];

    function loadLeads() {
        const stored = localStorage.getItem('scottsdale_leads');
        if (stored) {
            leads = JSON.parse(stored);
        } else {
            leads = [...defaultLeads];
            localStorage.setItem('scottsdale_leads', JSON.stringify(leads));
        }
    }
    loadLeads();

    // --- DAY TO DAY TASKS STATE ---
    let tasks = [];
    const defaultTasks = [
        { id: 'task-1', text: 'Follow up with Amanda Miller regarding listing comps in McCormick Ranch.', completed: true },
        { id: 'task-2', text: 'Cross-reference Silverleaf golf course active inventory for Robert Chen.', completed: false },
        { id: 'task-3', text: 'Verify Luxury Presence webhook integration sync with team lead.', completed: false },
        { id: 'task-4', text: 'Update CMA valuation guidelines for hillsides in 85262.', completed: false }
    ];

    function loadTasks() {
        const stored = localStorage.getItem('agent_tasks');
        if (stored) {
            tasks = JSON.parse(stored);
        } else {
            tasks = [...defaultTasks];
            localStorage.setItem('agent_tasks', JSON.stringify(tasks));
        }
    }
    loadTasks();

    // --- CHATBOT THREADS STATE ---
    let chatSessions = [];
    const defaultChatSessions = [
        {
            id: 'session-1',
            clientName: 'Visitor from North Scottsdale and Phoenix',
            location: 'IP: 198.162.1.25 (85255)',
            timestamp: 'Today, 4:10 PM',
            icon: 'map-pin',
            messages: [
                { text: "Welcome to Scottsdale and Phoenix! 🌵 I'm Juliet's assistant. Whether you're looking for home listings, Scottsdale and Phoenix market metrics, or scheduling a consultation, I'm here to help.", sender: 'incoming', time: '4:08 PM' },
                { text: "Can you tell me about the schools in 85255?", sender: 'outgoing', time: '4:09 PM' },
                { text: "Scottsdale and Phoenix Unified School District (SUSD) has highly-rated institutions, especially in 85255 and 85260 (e.g. Copper Ridge, Desert Mountain High). If schools are a priority, I can filter active listing boundaries for you. What is your price point?", sender: 'incoming', time: '4:09 PM' },
                { text: "Looking for $2.5M to $5M custom estates.", sender: 'outgoing', time: '4:10 PM' }
            ]
        },
        {
            id: 'session-2',
            clientName: 'Old Town Waterfront Inquiry',
            location: 'IP: 74.125.19.14 (85251)',
            timestamp: 'Today, 2:32 PM',
            icon: 'building',
            messages: [
                { text: "Welcome to Scottsdale and Phoenix! 🌵 I'm Juliet's assistant. Whether you're looking for home listings, Scottsdale and Phoenix market metrics, or scheduling a consultation, I'm here to help.", sender: 'incoming', time: '2:30 PM' },
                { text: "Search FlexMLS Listings", sender: 'outgoing', time: '2:31 PM' },
                { text: "I can check active inventory... Are you looking for golf course custom lots (Troon, Desert Mountain), luxury properties in DC Ranch / Silverleaf, or walkable townhouses near Old Town?", sender: 'incoming', time: '2:31 PM' },
                { text: "Walkable condos near Old Town under $2M.", sender: 'outgoing', time: '2:32 PM' }
            ]
        },
        {
            id: 'session-live',
            clientName: 'Active Visitor Session (Live)',
            location: 'Scottsdale and Phoenix Public Widget',
            timestamp: 'Active Now',
            icon: 'activity',
            messages: [
                { text: "Welcome to Scottsdale and Phoenix! 🌵 I'm Juliet's assistant. Whether you're looking for home listings, Scottsdale and Phoenix market metrics, or scheduling a consultation, I'm here to help.", sender: 'incoming', time: 'Now' },
                { text: "How can I help?", sender: 'incoming', time: 'Now' }
            ]
        }
    ];

    function loadChatSessions() {
        const stored = localStorage.getItem('agent_chats');
        if (stored) {
            chatSessions = JSON.parse(stored);
        } else {
            chatSessions = [...defaultChatSessions];
            localStorage.setItem('agent_chats', JSON.stringify(chatSessions));
        }
    }
    loadChatSessions();

    let selectedChatSessionId = 'session-live';

    // --- NAVIGATION & DOM ELEMENT REFERENCES ---
    const portalBtn = document.getElementById('portal-btn');
    const portalBtnText = document.getElementById('portal-btn-text');
    const publicView = document.getElementById('public-view');
    const agentView = document.getElementById('agent-view');
    const navLogo = document.getElementById('nav-logo');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const publicLinks = document.querySelectorAll('.public-element');

    // Login Modal Elements
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('agent-login-form');
    const loginCloseBtn = document.getElementById('login-close-btn');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginErrorMsg = document.getElementById('login-error-msg');

    // Sidebar navigation & panels
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');
    const agentPanels = document.querySelectorAll('.agent-panel');
    const agentPanelTitle = document.getElementById('agent-panel-title');
    const agentPanelSubtitle = document.getElementById('agent-panel-subtitle');
    const logoutBtn = document.getElementById('agent-logout-btn');

    // Task Checklist Elements
    const addTaskForm = document.getElementById('add-task-form');
    const newTaskInput = document.getElementById('new-task-input');
    const taskListItems = document.getElementById('task-list-items');

    // Chatbot Logs Panel Elements
    const chatSessionsListContainer = document.getElementById('chat-sessions-list-container');
    const chatTranscriptBodyContainer = document.getElementById('chat-transcript-body-container');
    const activeSessionStatus = document.getElementById('active-session-status');

    // RPR Hub Elements
    const rprGeneratorForm = document.getElementById('rpr-generator-form');
    const rprAddressInput = document.getElementById('rpr-address');
    const rprReportTypeSelect = document.getElementById('rpr-report-type');
    const rprSubmitBtn = document.getElementById('rpr-submit-btn');
    const rprProgressContainer = document.getElementById('rpr-progress-container');
    const rprProgressStatus = document.getElementById('rpr-progress-status');
    const rprProgressPercent = document.getElementById('rpr-progress-percent');
    const rprProgressBar = document.getElementById('rpr-progress-bar');
    const rprReportsList = document.getElementById('rpr-reports-list');

    // Sync Toggles & Settings
    const armlsSyncToggle = document.getElementById('sync-armls-toggle');
    const crmSyncToggle = document.getElementById('sync-crm-toggle');
    const savePasscodeBtn = document.getElementById('save-passcode-btn');
    const settingsPasscodeField = document.getElementById('settings-passcode-field');

    // --- LOGIN MODAL & WORKSPACE AUTH ---

    function openLoginModal() {
        loginModal.classList.add('active');
        loginErrorMsg.textContent = '';
        loginPasswordInput.value = '';
        loginEmailInput.value = agentEmail;
    }

    function closeLoginModal() {
        loginModal.classList.remove('active');
    }

    portalBtn.addEventListener('click', () => {
        if (isLoggedIn) {
            toggleView('public');
        } else {
            openLoginModal();
        }
    });

    loginCloseBtn.addEventListener('click', closeLoginModal);

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = loginEmailInput.value.trim();
        const passVal = loginPasswordInput.value;

        if (emailVal === agentEmail && passVal === agentPasscode) {
            isLoggedIn = true;
            sessionStorage.setItem('agent_logged_in', 'true');
            closeLoginModal();
            toggleView('agent');
            addLogEntry(`[Auth Success] Agent Juliet Kasaya unlocked portal session.`, 'success');
        } else {
            loginErrorMsg.textContent = 'Invalid credentials. Please verify your passcode.';
            addLogEntry(`[Auth Failed] Access denied for user: ${emailVal}`, 'warn');
        }
    });

    function handleLogout() {
        isLoggedIn = false;
        sessionStorage.setItem('agent_logged_in', 'false');
        toggleView('public');
        addLogEntry('[Session Closed] Agent logged out. Workspace locked.', 'info');
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // --- VIEW TOGGLER SYSTEM ---

    let currentPanel = 'dashboard';

    function toggleView(view) {
        if (view === 'agent' && isLoggedIn) {
            publicView.classList.remove('active-view');
            publicView.classList.add('hidden-view');
            agentView.classList.remove('hidden-view');
            agentView.classList.add('active-view');
            
            portalBtn.classList.add('active-portal');
            portalBtnText.textContent = 'Logout Session';
            portalBtn.querySelector('i').setAttribute('data-lucide', 'unlock');
            
            switchPanel(currentPanel);
            
            renderLeadsTable();
            renderTasks();
            renderChatSessions();
            renderRprReports();
            addLogEntry('Connected to dashboard console.', 'info');
        } else {
            agentView.classList.remove('active-view');
            agentView.classList.add('hidden-view');
            publicView.classList.remove('hidden-view');
            publicView.classList.add('active-view');
            
            portalBtn.classList.remove('active-portal');
            portalBtnText.textContent = 'Agent Portal';
            portalBtn.querySelector('i').setAttribute('data-lucide', 'lock');
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    if (isLoggedIn) {
        toggleView('agent');
    } else {
        toggleView('public');
    }

    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        toggleView('public');
    });

    publicLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isLoggedIn) {
                toggleView('public');
            }
            navMenu.classList.remove('mobile-active');
        });
    });

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-active');
    });

    // --- SIDEBAR PANELS SWITCHING SYSTEM ---

    const panelMeta = {
        dashboard: {
            title: 'Dashboard Overview',
            subtitle: 'Welcome back, Juliet. Systems synced successfully.'
        },
        flexmls: {
            title: 'FlexMLS Manager',
            subtitle: 'Direct IDX listings & saved search embeddings via armls.flexmls.com'
        },
        crm: {
            title: 'CRM Hub Integrations',
            subtitle: 'Real-time synchronization logs with your Luxury Presence account.'
        },
        helper: {
            title: 'Day-to-Day Helper',
            subtitle: 'Your active planner, outreach email templates, and system portals.'
        },
        chats: {
            title: 'Chatbot Conversation Logs',
            subtitle: 'Review interactive client dialogues compiled from the public widget.'
        },
        rpr: {
            title: 'Realtor Property Resource (RPR) Hub',
            subtitle: 'Generate comprehensive property reports, valuation studies, and neighborhood demographics.'
        },
        settings: {
            title: 'Control Settings',
            subtitle: 'Manage authorization passcodes and API webhook toggles.'
        }
    };

    function switchPanel(panelName) {
        currentPanel = panelName;
        sidebarLinks.forEach(link => link.classList.remove('active'));
        agentPanels.forEach(panel => panel.classList.remove('active-panel'));

        const targetLink = document.getElementById(`sb-link-${panelName}`);
        const targetPanel = document.getElementById(`panel-${panelName}`);
        
        if (targetLink && targetPanel) {
            targetLink.classList.add('active');
            targetPanel.classList.add('active-panel');
            
            agentPanelTitle.textContent = panelMeta[panelName].title;
            agentPanelSubtitle.textContent = panelMeta[panelName].subtitle;
            
            addLogEntry(`[Navigation] Tab changed to: ${panelMeta[panelName].title}`, 'info');

            if (panelName === 'chats') {
                renderChatSessions();
            } else if (panelName === 'rpr') {
                renderRprReports();
            }
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const panelName = link.getAttribute('data-panel');
            switchPanel(panelName);
        });
    });

    // --- DATA VISUALIZATION (CHART.JS) ---
    const marketData = {
        all: {
            label: 'Scottsdale and Phoenix Average',
            prices: [1290, 1310, 1335, 1320, 1350, 1380, 1410, 1405, 1420, 1445, 1470, 1485],
            inventory: [1280, 1250, 1220, 1190, 1180, 1150, 1120, 1100, 1140, 1180, 1160, 1142],
            days: 38,
            type: "Seller's Market",
            medianVal: "$1,485,000",
            inventoryVal: "1,142 Units",
            priceYoY: "+4.2% YoY",
            invYoY: "-2.8% YoY",
            daysYoY: "-6 Days YoY"
        },
        85255: {
            label: 'North Scottsdale and Phoenix (85255)',
            prices: [1750, 1780, 1810, 1800, 1830, 1860, 1910, 1895, 1920, 1950, 1970, 1995],
            inventory: [420, 410, 395, 380, 370, 360, 350, 335, 345, 360, 355, 348],
            days: 42,
            type: "Strong Seller's Market",
            medianVal: "$1,995,000",
            inventoryVal: "348 Units",
            priceYoY: "+6.1% YoY",
            invYoY: "-5.4% YoY",
            daysYoY: "-9 Days YoY"
        },
        85260: {
            label: 'Central Scottsdale and Phoenix (85260)',
            prices: [890, 910, 925, 920, 935, 950, 965, 960, 975, 980, 995, 1010],
            inventory: [320, 305, 290, 280, 275, 270, 260, 255, 270, 285, 280, 276],
            days: 34,
            type: "Balanced Market",
            medianVal: "$1,010,000",
            inventoryVal: "276 Units",
            priceYoY: "+3.8% YoY",
            invYoY: "-1.5% YoY",
            daysYoY: "-3 Days YoY"
        },
        85251: {
            label: 'Old Town/South (85251)',
            prices: [640, 655, 670, 665, 680, 695, 710, 705, 715, 725, 740, 755],
            inventory: [280, 270, 260, 255, 250, 245, 235, 230, 240, 250, 245, 242],
            days: 29,
            type: "Seller's Market",
            medianVal: "$755,000",
            inventoryVal: "242 Units",
            priceYoY: "+5.3% YoY",
            invYoY: "-3.1% YoY",
            daysYoY: "-5 Days YoY"
        }
    };

    const months = ['Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26'];
    
    let marketChart = null;
    function initChart(zipKey = 'all') {
        const chartCanvas = document.getElementById('marketChart');
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        const dataSet = marketData[zipKey];
        
        if (marketChart) {
            marketChart.destroy();
        }
        
        marketChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Median Price (in $1,000s)',
                        data: dataSet.prices,
                        borderColor: '#d4af37',
                        backgroundColor: 'rgba(212, 175, 55, 0.08)',
                        borderWidth: 2.5,
                        pointBackgroundColor: '#d4af37',
                        pointBorderColor: '#0d0c0b',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.35,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Active Inventory (Homes)',
                        data: dataSet.inventory,
                        borderColor: '#a3a19c',
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#a3a19c',
                        pointBorderColor: '#0d0c0b',
                        pointRadius: 3,
                        tension: 0.1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#1c1a17',
                            font: { family: 'Montserrat', size: 10 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1c1a17',
                        titleColor: '#d4af37',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(0,0,0,0.08)',
                        borderWidth: 1,
                        titleFont: { family: 'Playfair Display' },
                        bodyFont: { family: 'Montserrat' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#5e5a55', font: { family: 'Montserrat', size: 9 } }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(0, 0, 0, 0.06)' },
                        ticks: {
                            color: '#b58d24',
                            callback: value => '$' + value + 'k',
                            font: { family: 'Montserrat', size: 9 }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#5e5a55', font: { family: 'Montserrat', size: 9 } }
                    }
                }
            }
        });

        // Update Side Cards
        document.getElementById('stat-median-price').textContent = dataSet.medianVal;
        document.getElementById('stat-active-inventory').textContent = dataSet.inventoryVal;
        document.getElementById('stat-days-market').textContent = `${dataSet.days} Days`;
        document.getElementById('stat-market-type').textContent = dataSet.type;

        // Update indicators
        const priceDelta = document.getElementById('stat-median-price').nextElementSibling;
        const invDelta = document.getElementById('stat-active-inventory').nextElementSibling;
        const daysDelta = document.getElementById('stat-days-market').nextElementSibling;

        priceDelta.innerHTML = `<i data-lucide="arrow-up"></i> ${dataSet.priceYoY}`;
        invDelta.innerHTML = `<i data-lucide="arrow-down"></i> ${dataSet.invYoY}`;
        daysDelta.innerHTML = `<i data-lucide="arrow-down"></i> ${dataSet.daysYoY}`;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initChart('all');

    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const zip = tab.getAttribute('data-zip');
            initChart(zip);
            addLogEntry(`[FlexMLS Query] Loaded market analytics data set for zip/region: ${zip.toUpperCase()}`, 'info');
        });
    });

    // --- LEAD INTEGRATION SYSTEM ---

    function captureLead(newLead) {
        leads.unshift(newLead);
        localStorage.setItem('scottsdale_leads', JSON.stringify(leads));
        
        const isCrmSyncActive = !crmSyncToggle || crmSyncToggle.checked;

        if (isCrmSyncActive) {
            addLogEntry(`[API POST] Sending lead to Luxury Presence CRM...`, 'info');
            setTimeout(() => {
                const lpSyncId = `LP_${Math.floor(Math.random() * 90000 + 10000)}`;
                addLogEntry(`[Luxury Presence CRM] Success 201. Lead Synced ID: ${lpSyncId}`, 'success');
                appendCrmLog(newLead.name, lpSyncId, 201);
            }, 1000);
        } else {
            addLogEntry(`[CRM Warning] Luxury Presence integration toggled OFFLINE in settings. Lead saved locally only.`, 'warn');
        }

        const isMlsSyncActive = !armlsSyncToggle || armlsSyncToggle.checked;
        if (isMlsSyncActive && isCrmSyncActive) {
            setTimeout(() => {
                addLogEntry(`[ARMLS FlexMLS] Triggered saved boundary scan for lead interest.`, 'success');
            }, 1600);
        }

        updateMetrics();
        
        if (isLoggedIn) {
            renderLeadsTable();
        }
    }

    function appendCrmLog(name, lpId, status) {
        const crmLogsBox = document.getElementById('crm-webhook-logs');
        if (!crmLogsBox) return;

        const row = document.createElement('div');
        row.className = 'sync-log-row';
        row.innerHTML = `
            <span class="log-time">[${new Date().toLocaleTimeString().substring(0,5)}]</span>
            <span class="log-txt">Lead '${name}' posted to LP API (${lpId})</span>
            <span class="log-badge success">${status}</span>
        `;
        crmLogsBox.insertBefore(row, crmLogsBox.firstChild);
    }

    function updateMetrics() {
        const leadCountEl = document.getElementById('metric-lead-count');
        const followupsEl = document.getElementById('metric-followups');
        
        if (leadCountEl) leadCountEl.textContent = leads.length;
        if (followupsEl) {
            const pending = leads.filter(l => l.status === 'New').length;
            followupsEl.textContent = pending;
        }
    }

    // Hero Address Valuation Form Submit
    const heroValForm = document.getElementById('hero-valuation-form');
    if (heroValForm) {
        heroValForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const address = document.getElementById('val-address').value;
            const email = document.getElementById('val-email').value;

            const valLead = {
                id: 'lead-' + Date.now(),
                name: 'Valuation Request',
                email: email,
                phone: 'N/A',
                role: 'Sell',
                budget: 'Valuation Requested',
                message: `Automated Comparative Market Analysis (CMA) inquiry for Scottsdale and Phoenix property: ${address}`,
                status: 'New',
                timestamp: new Date().toLocaleString(),
                source: 'Hero Valuation Box'
            };

            captureLead(valLead);
            alert(`Thank you! A real-time CMA report for ${address} is being compiled and synced to the Luxury Presence CRM. We will contact you at ${email} shortly.`);
            heroValForm.reset();
        });
    }

    // Contact Form Submit
    const contactLeadForm = document.getElementById('contact-lead-form');
    if (contactLeadForm) {
        contactLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const phone = document.getElementById('lead-phone').value;
            const role = document.getElementById('lead-role').value;
            const budget = document.getElementById('lead-budget').value;
            const msg = document.getElementById('lead-msg').value;

            const contactLead = {
                id: 'lead-' + Date.now(),
                name: name,
                email: email,
                phone: phone,
                role: role,
                budget: budget,
                message: msg,
                status: 'New',
                timestamp: new Date().toLocaleString(),
                source: 'Contact Form'
            };

            captureLead(contactLead);
            alert(`Inquiry received, ${name}! Juliet is syncing details with FlexMLS to match your budget (${budget}) to active Scottsdale and Phoenix inventory.`);
            contactLeadForm.reset();
        });
    }

    // Request Showing Buttons
    const requestBtns = document.querySelectorAll('.request-showing-btn');
    requestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const propertyAddress = btn.getAttribute('data-property');
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const msgBox = document.getElementById('lead-msg');
                if (msgBox) {
                    msgBox.value = `I would like to schedule a private tour of the listing at ${propertyAddress}. Please cross-reference my scheduling requests.`;
                    msgBox.focus();
                }
                addLogEntry(`[Listing Click] Property detail clicked for: ${propertyAddress}`, 'info');
            }
        });
    });

    // --- LEADS TABLE RENDERING ---
    const leadsTableBody = document.getElementById('leads-table-body');
    const clearLeadsBtn = document.getElementById('clear-leads-btn');

    function renderLeadsTable() {
        if (!leadsTableBody) return;
        leadsTableBody.innerHTML = '';

        if (leads.length === 0) {
            leadsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No active leads found.</td></tr>`;
            return;
        }

        leads.forEach(lead => {
            const row = document.createElement('tr');
            
            const nameCell = `
                <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${lead.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${lead.source} | ${lead.timestamp}</div>
                </td>
            `;

            const contactCell = `
                <td>
                    <div>${lead.email}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${lead.phone}</div>
                </td>
            `;

            const interestCell = `
                <td>
                    <div style="font-weight: 500; color: var(--gold);">${lead.role} - ${lead.budget}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 240px;" title="${lead.message}">${lead.message}</div>
                </td>
            `;

            const statusCell = `
                <td>
                    <span class="status-pill ${lead.status.toLowerCase()}">${lead.status}</span>
                </td>
            `;

            const actionCell = `
                <td>
                    ${lead.status === 'New' 
                        ? `<button class="action-btn" onclick="triggerFollowUp('${lead.id}')">Follow Up</button>` 
                        : `<span style="font-size: 0.75rem; color: #22c55e;"><i data-lucide="check-circle" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>Emailed</span>`}
                </td>
            `;

            row.innerHTML = nameCell + contactCell + interestCell + statusCell + actionCell;
            leadsTableBody.appendChild(row);
        });

        updateMetrics();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    window.triggerFollowUp = function(leadId) {
        const leadIdx = leads.findIndex(l => l.id === leadId);
        if (leadIdx === -1) return;

        leads[leadIdx].status = 'Contacted';
        localStorage.setItem('scottsdale_leads', JSON.stringify(leads));

        addLogEntry(`[Email Dispatch] Outreach templates compiled and sent to ${leads[leadIdx].email}`, 'info');
        
        setTimeout(() => {
            addLogEntry(`[Luxury Presence CRM] CRM status synchronized: 'Contacted' for lead ${leads[leadIdx].name}`, 'success');
            renderLeadsTable();
        }, 800);
    };

    if (clearLeadsBtn) {
        clearLeadsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset leads back to demo state?')) {
                localStorage.removeItem('scottsdale_leads');
                loadLeads();
                renderLeadsTable();
                addLogEntry('[Database Reset] Local storage leads database reset.', 'warn');
            }
        });
    }

    const testCrmBtn = document.getElementById('test-crm-sync-btn');
    if (testCrmBtn) {
        testCrmBtn.addEventListener('click', () => {
            addLogEntry('[CRM Hook] Testing handshake protocol with api.luxurypresence.com...', 'info');
            testCrmBtn.textContent = 'Testing...';
            testCrmBtn.disabled = true;
            
            setTimeout(() => {
                addLogEntry('[CRM Hub] Handshake verified. Status: 200 Connection active.', 'success');
                testCrmBtn.textContent = 'Test Connection';
                testCrmBtn.disabled = false;
                alert('Connection test successful! Webhook handshake returned 200 OK.');
            }, 1500);
        });
    }

    if (savePasscodeBtn) {
        savePasscodeBtn.addEventListener('click', () => {
            const newCode = settingsPasscodeField.value;
            if (newCode.length < 4) {
                alert('Passcode must be at least 4 characters long.');
                return;
            }
            agentPasscode = newCode;
            localStorage.setItem('agent_passcode', agentPasscode);
            addLogEntry('[Settings Update] Agent Command Center login passcode modified.', 'warn');
            alert('Security passcode updated successfully!');
        });
    }


    // --- DYNAMIC PLANNER TASKS CHECKLIST ---

    function renderTasks() {
        if (!taskListItems) return;
        taskListItems.innerHTML = '';

        if (tasks.length === 0) {
            taskListItems.innerHTML = `<li style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:10px;">Checklist empty. Add a task above!</li>`;
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <label class="task-checkbox-label">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                    <span>${task.text}</span>
                </label>
                <button class="delete-task-btn" onclick="deleteTask('${task.id}')" aria-label="Delete task">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
            `;
            taskListItems.appendChild(li);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    window.toggleTask = function(taskId) {
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx === -1) return;
        tasks[idx].completed = !tasks[idx].completed;
        localStorage.setItem('agent_tasks', JSON.stringify(tasks));
        renderTasks();
        addLogEntry(`[Task Manager] Check state updated for: "${tasks[idx].text.substring(0,25)}..."`, 'info');
    };

    window.deleteTask = function(taskId) {
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx === -1) return;
        const text = tasks[idx].text;
        tasks.splice(idx, 1);
        localStorage.setItem('agent_tasks', JSON.stringify(tasks));
        renderTasks();
        addLogEntry(`[Task Manager] Removed checklist item: "${text.substring(0,25)}..."`, 'warn');
    };

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const textVal = newTaskInput.value.trim();
            if (!textVal) return;

            const newTask = {
                id: 'task-' + Date.now(),
                text: textVal,
                completed: false
            };

            tasks.push(newTask);
            localStorage.setItem('agent_tasks', JSON.stringify(tasks));
            renderTasks();
            newTaskInput.value = '';
            addLogEntry(`[Task Manager] Added new checklist item: "${textVal.substring(0,25)}..."`, 'success');
        });
    }

    // --- CHATBOT SESSION TRANSCRIPT RENDERING ---

    function renderChatSessions() {
        if (!chatSessionsListContainer) return;
        chatSessionsListContainer.innerHTML = '';

        chatSessions.forEach(session => {
            const card = document.createElement('button');
            card.className = `chat-session-card ${session.id === selectedChatSessionId ? 'active-session' : ''}`;
            card.onclick = () => selectChatSession(session.id);

            const lastMessageText = session.messages.length > 0 
                ? session.messages[session.messages.length - 1].text 
                : 'No messages';

            card.innerHTML = `
                <div class="chat-session-icon">
                    <i data-lucide="${session.icon || 'message-square'}"></i>
                </div>
                <div class="chat-session-info">
                    <h6>${session.clientName}</h6>
                    <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px;">${lastMessageText}</p>
                </div>
            `;
            chatSessionsListContainer.appendChild(card);
        });

        renderChatTranscript(selectedChatSessionId);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function selectChatSession(sessionId) {
        selectedChatSessionId = sessionId;
        renderChatSessions();
    }

    function renderChatTranscript(sessionId) {
        if (!chatTranscriptBodyContainer) return;
        chatTranscriptBodyContainer.innerHTML = '';

        const session = chatSessions.find(s => s.id === sessionId);
        if (!session) {
            chatTranscriptBodyContainer.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding-top:100px;">No conversation selected.</div>`;
            activeSessionStatus.textContent = 'No session selected';
            return;
        }

        activeSessionStatus.textContent = `${session.location} | ${session.timestamp}`;

        session.messages.forEach(msg => {
            const row = document.createElement('div');
            row.className = `chat-msg-row ${msg.sender === 'incoming' ? 'incoming-row' : 'outgoing-row'}`;
            
            row.innerHTML = `
                <div class="chat-msg-bubble">
                    <p>${msg.text}</p>
                </div>
                <span class="chat-msg-time">${msg.time}</span>
            `;
            chatTranscriptBodyContainer.appendChild(row);
        });

        chatTranscriptBodyContainer.scrollTop = chatTranscriptBodyContainer.scrollHeight;
    }

    // --- COPY EMAIL TEMPLATES LOGIC ---
    const copyBtns = document.querySelectorAll('.copy-template-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rawTemplate = btn.getAttribute('data-template');
            const cleanText = rawTemplate.replace(/\\n/g, '\n');
            
            navigator.clipboard.writeText(cleanText)
                .then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied to Clipboard!';
                    btn.classList.add('btn-gold');
                    btn.classList.remove('btn-outline');
                    
                    addLogEntry('[Clipboard Sync] Outreach email template copied successfully.', 'success');
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.add('btn-outline');
                        btn.classList.remove('btn-gold');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Clipboard copy failed:', err);
                    alert('Copy failed. Please manually select and copy text.');
                });
        });
    });


    // --- REAL-TIME SYSTEM LOGS SIMULATOR ---
    const consoleLogs = document.getElementById('console-logs');

    function addLogEntry(text, type = 'info') {
        if (!consoleLogs) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        let typeClass = 'info';
        if (type === 'success') typeClass = 'success';
        if (type === 'warn') typeClass = 'warn';

        entry.innerHTML = `
            <span class="log-entry timestamp">[${timestamp}]</span>
            <span class="log-entry ${typeClass}">${text}</span>
        `;

        consoleLogs.appendChild(entry);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;

        while (consoleLogs.children.length > 40) {
            consoleLogs.removeChild(consoleLogs.firstChild);
        }
    }

    // Seed log entries
    addLogEntry('Establishing Webhook channels with Luxury Presence CRM...', 'info');
    setTimeout(() => addLogEntry('Luxury Presence API Handshake: 200 Connection active.', 'success'), 400);
    setTimeout(() => addLogEntry('FlexMLS IDX Feed syncing active listings from armls.flexmls.com...', 'info'), 800);
    setTimeout(() => addLogEntry('ARMLS Synced: 24 active listings compiled in cache.', 'success'), 1200);

    // Periodic simulation log entries
    setInterval(() => {
        if (isLoggedIn) {
            const isMlsSyncActive = !armlsSyncToggle || armlsSyncToggle.checked;
            const isCrmSyncActive = !crmSyncToggle || crmSyncToggle.checked;

            if (isMlsSyncActive) {
                const randomMLSNum = Math.floor(Math.random() * 900000 + 6000000);
                addLogEntry(`[FlexMLS IDX Feed] Checked active status for MLS# ${randomMLSNum} - 0 status deviations.`, 'info');
            } else {
                addLogEntry('[FlexMLS Warnings] Auto-Sync API toggled OFFLINE in settings tab.', 'warn');
            }

            if (isCrmSyncActive) {
                addLogEntry('[Luxury Presence CRM API] Heartbeat webhook dispatch validation: 200 OK.', 'success');
            } else {
                addLogEntry('[CRM Warning] Direct CRM integration webhook toggled OFFLINE in settings.', 'warn');
            }
        }
    }, 15000);


    // --- CHATBOT ASSISTANT INTERACTION ---
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-input');
    const quickReplies = document.getElementById('chat-quick-replies');

    chatbotTrigger.addEventListener('click', () => {
        chatbotTrigger.classList.toggle('chat-open');
        chatbotWindow.classList.toggle('chat-active');
        
        const ping = chatbotTrigger.querySelector('.trigger-ping');
        if (ping) ping.remove();

        chatMessages.scrollTop = chatMessages.scrollHeight;
        addLogEntry('[Chatbot Widget] Interactive window expanded by visitor.', 'info');
    });

    quickReplies.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply-btn')) {
            const replyText = e.target.getAttribute('data-reply');
            handleUserMessage(replyText);
        }
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        
        handleUserMessage(text);
        chatInput.value = '';
    });

    function appendMessage(text, sender = 'incoming') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message incoming typing-indicator-msg';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `<p style="display: flex; gap: 4px; align-items: center;"><span class="dot" style="width:6px;height:6px;background:var(--text-muted);border-radius:50%;animation: float 1s infinite;"></span><span class="dot" style="width:6px;height:6px;background:var(--text-muted);border-radius:50%;animation: float 1s infinite 0.2s;"></span><span class="dot" style="width:6px;height:6px;background:var(--text-muted);border-radius:50%;animation: float 1s infinite 0.4s;"></span></p>`;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('typing-indicator');
        if (ind) ind.remove();
    }

    function handleUserMessage(userText) {
        appendMessage(userText, 'outgoing');
        
        // Push to active visitor live chat log session (incoming = agent, outgoing = client visitor)
        const liveSession = chatSessions.find(s => s.id === 'session-live');
        if (liveSession) {
            liveSession.messages.push({
                text: userText,
                sender: 'outgoing', // Client sent
                time: new Date().toLocaleTimeString().substring(0,5)
            });
            localStorage.setItem('agent_chats', JSON.stringify(chatSessions));
            
            // If agent is currently viewing the chats tab, update layout in real time!
            if (isLoggedIn && currentPanel === 'chats') {
                renderChatSessions();
            }
        }

        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const reply = getChatbotResponse(userText);
            appendMessage(reply, 'incoming');
            
            // Push response to logs
            if (liveSession) {
                liveSession.messages.push({
                    text: reply,
                    sender: 'incoming', // Assistant sent
                    time: new Date().toLocaleTimeString().substring(0,5)
                });
                localStorage.setItem('agent_chats', JSON.stringify(chatSessions));
                
                if (isLoggedIn && currentPanel === 'chats') {
                    renderChatSessions();
                }
            }

            addLogEntry(`[Chatbot Session] Processed inquiry: "${userText.substring(0, 20)}..."`, 'info');
        }, 1000);
    }

    function getChatbotResponse(input) {
        const query = input.toLowerCase();

        if (query.includes('market info')) {
            return `Scottsdale and Phoenix's luxury market is highly active! 📈 Here are the latest May 2026 hyperlocal metrics:
            <br><br>
            • <strong>North Scottsdale and Phoenix (85255):</strong> Median Sales Price is $1.99M (+6.1% YoY) with low inventory.
            <br>
            • <strong>Central Scottsdale and Phoenix (85260):</strong> Median Sales Price is $1.01M with balanced seller-buyer leverage.
            <br>
            • <strong>Old Town (85251):</strong> Median Sales Price is $755K. High demand for canal-front condos.
            <br><br>
            Use the interactive chart on this page to analyze 12-month trends!`;
        }

        if (query.includes('flexmls listings') || query.includes('search listings')) {
            return `I can cross-reference active listings directly from <strong>armls.flexmls.com</strong>. 🔍 
            <br><br>
            Are you looking for golf course custom lots (Troon, Desert Mountain), luxury properties in DC Ranch / Silverleaf, or walkable townhouses near Old Town? Let me know your preferred zip code and budget.`;
        }

        if (query.includes('book') || query.includes('showing') || query.includes('consult')) {
            return `Let's schedule a private showing or a real estate strategy call! 📅
            <br><br>
            Please provide your email address or phone number, and I will sync your details to Juliet's Luxury Presence CRM calendar.`;
        }

        if (query.includes('contact juliet')) {
            return `You can reach Juliet Kasaya directly:
            <br><br>
            ✉️ <strong>Email:</strong> kasayaandco@gmail.com
            <br>
            📞 <strong>Phone:</strong> 480-770-6570
            <br><br>
            Or, submit your contact information via the form on this page to sync immediately to our CRM lead feed!`;
        }

        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
        const phoneRegex = /(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

        if (emailRegex.test(input) || phoneRegex.test(input)) {
            const emailMatch = input.match(emailRegex);
            const phoneMatch = input.match(phoneRegex);
            const email = emailMatch ? emailMatch[0] : 'Chat Captured';
            const phone = phoneMatch ? phoneMatch[0] : 'Chat Captured';

            const chatLead = {
                id: 'lead-' + Date.now(),
                name: 'Chat Assistant Lead',
                email: email,
                phone: phone,
                role: 'Buy/Sell Inquiry',
                budget: 'Flexible',
                message: `Lead details captured via chatbot conversation. Message context: "${input}"`,
                status: 'New',
                timestamp: new Date().toLocaleString(),
                source: 'Chat Assistant'
            };

            captureLead(chatLead);
            return `Excellent! I have captured your details (${emailMatch ? email : ''} ${phoneMatch ? phone : ''}) and synchronized them with Juliet's Luxury Presence CRM pipeline. She will contact you directly within 15 minutes! 🌵`;
        }

        if (query.includes('silverleaf') || query.includes('dc ranch')) {
            return `Silverleaf and DC Ranch are premier luxury communities in Scottsdale and Phoenix. 🏰 Homes currently range from $3.5M to $18M+. Saguaro-studded hillside custom lots are in very high demand. Would you like me to compile an active FlexMLS listing list for DC Ranch?`;
        }

        if (query.includes('sell') || query.includes('value') || query.includes('worth')) {
            return `Interested in your home's current market value? 🏡 You can enter your address in our <strong>Valuation Box</strong> in the hero section for a comparative analysis, or simply type your address here and I will generate a CMA request for you.`;
        }

        if (query.includes('buy') || query.includes('move') || query.includes('relocat')) {
            return `Finding a home in Scottsdale and Phoenix requires sharp local knowledge. From golf communities to Old Town condos, I can match your budget and criteria to active ARMLS inventory. What budget range are you thinking? ($1M-$2.5M, $2.5M-$5M, or $5M+)`;
        }

        if (query.includes('school') || query.includes('district')) {
            return `Scottsdale and Phoenix Unified School District (SUSD) has highly-rated institutions, especially in 85255 and 85260 (e.g. Copper Ridge, Desert Mountain High). If schools are a priority, I can filter active listing boundaries for you.`;
        }

        return `I've received your request! Juliet Kasaya specializes in Scottsdale and Phoenix real estate. I can compile custom FlexMLS reports or help set up home tours. 
        <br><br>
        Feel free to type your <strong>email or phone number</strong> to schedule a quick call, or ask me about "Scottsdale and Phoenix Market Info" for hyperlocal trends.`;
    }

    // --- RPR HUB PLATFORM STATE & GENERATION ---
    let rprReports = [];
    const defaultRprReports = [
        {
            id: 'rpr-1',
            address: '10450 E Cactus Rd, Scottsdale and Phoenix, AZ 85259',
            reportType: 'Seller\'s Valuation Report (CMA)',
            timestamp: 'Today, 10:45 AM',
            status: 'Completed',
            size: '2.4 MB',
            pages: 18
        },
        {
            id: 'rpr-2',
            address: '10825 E Desert Camp Dr, Scottsdale and Phoenix, AZ 85255',
            reportType: 'Property Comprehensive Report',
            timestamp: 'Yesterday, 3:12 PM',
            status: 'Completed',
            size: '4.8 MB',
            pages: 32
        },
        {
            id: 'rpr-3',
            address: '4200 N Miller Rd, Scottsdale and Phoenix, AZ 85251',
            reportType: 'Neighborhood Demographics Report',
            timestamp: 'June 08, 2026',
            status: 'Completed',
            size: '1.2 MB',
            pages: 12
        }
    ];

    function loadRprReports() {
        const stored = localStorage.getItem('rpr_reports');
        if (stored) {
            rprReports = JSON.parse(stored);
        } else {
            rprReports = [...defaultRprReports];
            localStorage.setItem('rpr_reports', JSON.stringify(rprReports));
        }
    }

    function renderRprReports() {
        if (!rprReportsList) return;
        loadRprReports();
        
        rprReportsList.innerHTML = '';
        rprReports.forEach(report => {
            const card = document.createElement('div');
            card.className = 'rpr-report-card glass';
            card.style.cssText = 'padding:15px; border-radius:4px; border:1px solid var(--border-glass); background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center; transition:var(--transition);';
            card.innerHTML = `
                <div>
                    <h6 style="color:var(--gold); font-size:0.8rem; font-weight:600; margin-bottom:4px;">${report.address}</h6>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">${report.reportType} • ${report.pages} pages</p>
                    <span style="font-size:0.7rem; color:var(--text-muted);">${report.timestamp}</span>
                </div>
                <div style="text-align:right; display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                    <span style="font-size:0.7rem; padding:2px 8px; border-radius:10px; background:rgba(34,197,94,0.15); color:#22c55e; border:1px solid rgba(34,197,94,0.3); font-weight:600;">${report.status}</span>
                    <button class="btn btn-outline btn-xs open-report-btn" data-id="${report.id}" style="padding: 2px 6px; font-size: 0.65rem;">View</button>
                </div>
            `;
            rprReportsList.appendChild(card);
        });

        rprReportsList.querySelectorAll('.open-report-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const rId = btn.getAttribute('data-id');
                const rep = rprReports.find(r => r.id === rId);
                if (rep) {
                    alert(`Opening RPR PDF Document for:\n${rep.address}\n\nReport Type: ${rep.reportType}\nGenerated: ${rep.timestamp}\nStatus: ${rep.status}\nFile Size: ${rep.size}`);
                }
            });
        });
    }

    if (rprGeneratorForm) {
        rprGeneratorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const address = rprAddressInput.value.trim();
            const reportTypeVal = rprReportTypeSelect.value;
            let reportTypeLabel = 'Property Comprehensive Report';
            if (reportTypeVal === 'seller') reportTypeLabel = 'Seller\'s Valuation Report (CMA)';
            if (reportTypeVal === 'neighborhood') reportTypeLabel = 'Neighborhood Demographics Report';

            rprSubmitBtn.disabled = true;
            rprSubmitBtn.textContent = 'Generating...';
            rprProgressContainer.style.display = 'block';

            const steps = [
                { progress: 10, status: 'Connecting to narrpr.com API...' },
                { progress: 30, status: 'Searching MLS records...' },
                { progress: 55, status: 'Retrieving comp sales data...' },
                { progress: 78, status: 'Calculating CMA estimate...' },
                { progress: 95, status: 'Assembling final PDF report...' },
                { progress: 100, status: 'Report generated successfully!' }
            ];

            let stepIdx = 0;
            const interval = setInterval(() => {
                if (stepIdx < steps.length) {
                    const step = steps[stepIdx];
                    rprProgressPercent.textContent = step.progress + '%';
                    rprProgressStatus.textContent = step.status;
                    rprProgressBar.style.width = step.progress + '%';
                    stepIdx++;
                } else {
                    clearInterval(interval);
                    
                    // Add new report to list
                    const newReport = {
                        id: 'rpr-' + Date.now(),
                        address: address,
                        reportType: reportTypeLabel,
                        timestamp: 'Just Now',
                        status: 'Completed',
                        size: (1.5 + Math.random() * 3).toFixed(1) + ' MB',
                        pages: Math.floor(12 + Math.random() * 20)
                    };
                    
                    rprReports.unshift(newReport);
                    localStorage.setItem('rpr_reports', JSON.stringify(rprReports));
                    renderRprReports();
                    
                    addLogEntry(`[RPR Hub] Report generated successfully for ${address}.`, 'success');
                    
                    setTimeout(() => {
                        rprProgressContainer.style.display = 'none';
                        rprProgressBar.style.width = '0%';
                        rprProgressPercent.textContent = '0%';
                        rprProgressStatus.textContent = 'Initializing RPR API Connection...';
                        rprSubmitBtn.disabled = false;
                        rprSubmitBtn.textContent = 'Generate RPR Report';
                        rprAddressInput.value = '';
                    }, 1500);
                }
            }, 600);
        });
    }
});
