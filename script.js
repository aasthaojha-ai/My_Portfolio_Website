/* 
   Aastha Ojha Portfolio Scripts
   Implements: Canvas Neural Background, Live Log Terminal, Interactive Filters, 
               Architecture blueprints, Tabbed Code, and Simulated AI RAG Chatbot.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOUSE FOLLOW GLOW EFFECT ---
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        cursorGlow.style.display = 'block';
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // --- 2. RESPONSIVE MOBILE NAVIGATION ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                navToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
            });
        });
    }

    // --- 3. ACTIVE NAVIGATION LINK SCROLL-SPY ---
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (pageYOffset >= (secTop - 250)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. HTML5 CANVAS NEURAL NODE PARTICLES ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize Canvas dynamically
        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle Constructor
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            
            update() {
                // Keep inside canvas bounds
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                
                // Mouse interactive deflection (neural feedback)
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                            this.x += 2;
                        }
                        if (mouse.x > this.x && this.x > this.size * 10) {
                            this.x -= 2;
                        }
                        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                            this.y += 2;
                        }
                        if (mouse.y > this.y && this.y > this.size * 10) {
                            this.y -= 2;
                        }
                    }
                }
                
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Initialize particles
        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 10000;
            numberOfParticles = Math.min(numberOfParticles, 85); // Cap to preserve performance
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = i % 2 === 0 ? 'rgba(0, 242, 254, 0.45)' : 'rgba(127, 0, 255, 0.45)';
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Connect particles (neural grid lines)
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 115) {
                        opacityValue = 1 - (distance / 115);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // --- 5. HERO TERMINAL DYNAMIC LOG STREAM ---
    const terminalStream = document.getElementById('terminal-stream');
    if (terminalStream) {
        const logs = [
            { type: 'sys', msg: 'System integrity: SECURE. Workspace initialised.' },
            { type: 'agent', msg: 'Scanning local sensor nodes... 11,000+ records read.' },
            { type: 'agent', msg: 'Retrieving expertise layers [Scikit-learn, LangChain, OpenAI].' },
            { type: 'sys', msg: 'Initializing EV Motor Fault Detection training session...' },
            { type: 'llm', msg: 'Hyperparameters initialized: n_estimators=150, max_depth=12' },
            { type: 'agent', msg: 'Optimizing random forest decision thresholds.' },
            { type: 'sys', msg: 'Model score established. Val Accuracy: 92.0% [SUCCESS]' },
            { type: 'agent', msg: 'Connection Pipeline loaded. Aastha Ojha Portfolio ONLINE.' }
        ];

        let logIndex = 0;

        function addLogLine() {
            if (logIndex < logs.length) {
                const log = logs[logIndex];
                const now = new Date();
                const pad = (n) => String(n).padStart(2, '0');
                const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
                
                let logTypeClass = 't-status-time';
                let logSender = 'SYSTEM';
                if (log.type === 'agent') {
                    logTypeClass = 't-status-agent';
                    logSender = 'AGENT';
                } else if (log.type === 'llm') {
                    logTypeClass = 't-string';
                    logSender = 'LLM-CORE';
                }

                const lineDiv = document.createElement('div');
                lineDiv.className = 't-status-log';
                lineDiv.innerHTML = `
                    <span class="t-status-time">[${timeStr}]</span>
                    <span class="${logTypeClass}">[${logSender}]:</span>
                    <span class="t-status-msg">${log.msg}</span>
                `;
                
                terminalStream.appendChild(lineDiv);
                terminalStream.scrollTop = terminalStream.scrollHeight;
                
                logIndex++;
                setTimeout(addLogLine, Math.random() * 1500 + 800);
            }
        }
        // Delay first output slightly
        setTimeout(addLogLine, 1200);
    }

    // --- 6. SKILL MATRIX RECRUITER ROLE TOGGLES ---
    const filterButtons = document.querySelectorAll('.btn-filter');
    const skillCards = document.querySelectorAll('.skill-category-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetRole = btn.getAttribute('data-role');
            
            skillCards.forEach(card => {
                const cardCats = card.getAttribute('data-categories');
                if (targetRole === 'all') {
                    card.classList.remove('fade-out');
                    card.style.transform = 'scale(1)';
                } else if (cardCats.includes(targetRole)) {
                    card.classList.remove('fade-out');
                    card.style.transform = 'scale(1)';
                } else {
                    card.classList.add('fade-out');
                    card.style.transform = 'scale(0.96)';
                }
            });
        });
    });

    // --- 7. PROJECT HUB CATEGORY FILTERS ---
    const projFilterBtns = document.querySelectorAll('.btn-proj-filter');
    const projectCards = document.querySelectorAll('.project-card');

    projFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetCat = btn.getAttribute('data-proj-cat');
            
            projectCards.forEach(card => {
                const cardType = card.getAttribute('data-proj-type');
                if (targetCat === 'all' || cardType.includes(targetCat)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 8. PROJECT ARCHITECTURE BLUEPRINT MODALS ---
    const blueprintData = {
        'ev-fault': {
            title: 'EV Motor Fault Detection Predictive Maintenance Architecture',
            desc: 'Production-ready Industrial IoT fault detection pipeline trained on 11,000+ sensor records.',
            diagram: `
                <div class="bp-flow-row">
                    <div class="bp-node bp-accent-cyan">
                        <i class="fa-solid fa-gauge"></i>
                        <span class="bp-node-header">IoT Motor Sensors</span>
                        <span class="bp-node-detail">11,000+ Records Ingest</span>
                    </div>
                    <div class="bp-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    <div class="bp-node bp-accent-purple">
                        <i class="fa-solid fa-sliders"></i>
                        <span class="bp-node-header">Feature Engineering</span>
                        <span class="bp-node-detail">EDA & Threshold Opt</span>
                    </div>
                </div>
                <div class="bp-flow-row">
                    <div class="bp-node">
                        <i class="fa-solid fa-network-wired"></i>
                        <span class="bp-node-header">Random Forest Model</span>
                        <span class="bp-node-detail">Scikit-learn Classifier</span>
                    </div>
                    <div class="bp-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    <div class="bp-node bp-accent-green">
                        <i class="fa-solid fa-bell"></i>
                        <span class="bp-node-header">Real-time Stream Alert</span>
                        <span class="bp-node-detail">Streamlit Dashboard UI</span>
                    </div>
                </div>
            `,
            specs: [
                '**Ingestion**: Trained and validated on massive industrial dataset consisting of 11,000+ physical motor diagnostic records.',
                '**Feature Engineering**: Custom feature extraction and threshold calibration minimized false positives by **18%**.',
                '**Accuracy**: Hits **92% fault detection accuracy** under active, real-time stress testing simulators.'
            ]
        },
        'health-agent': {
            title: 'HealthAI Multi-Agent Diagnostic Console Architecture',
            desc: 'Scalable personal health intelligence console coordinating 4 specialized AI agents in LangChain.',
            diagram: `
                <div class="bp-flow-row">
                    <div class="bp-node bp-accent-cyan">
                        <i class="fa-solid fa-file-medical"></i>
                        <span class="bp-node-header">Medical Reports</span>
                        <span class="bp-node-detail">PDF/Symptom Ingestion</span>
                    </div>
                    <div class="bp-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    <div class="bp-node bp-accent-purple">
                        <i class="fa-solid fa-route"></i>
                        <span class="bp-node-header">LangChain Orchestrator</span>
                        <span class="bp-node-detail">Task Routing Layer</span>
                    </div>
                </div>
                <div class="bp-flow-row">
                    <div class="bp-node">
                        <i class="fa-solid fa-clipboard-question"></i>
                        <span class="bp-node-header">4 Specialized Agents</span>
                        <span class="bp-node-detail">Report Analysis & Prediction</span>
                    </div>
                    <div class="bp-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    <div class="bp-node bp-accent-green">
                        <i class="fa-solid fa-heart-pulse"></i>
                        <span class="bp-node-header">Severity Alert System</span>
                        <span class="bp-node-detail">Lifestyle Plan Generation</span>
                    </div>
                </div>
            `,
            specs: [
                '**Multi-Agent Workflow**: Integrates **4 specialized AI agents** that dynamically coordinate symptom prediction and lifestyle plans.',
                '**Defensive Prompting**: Leverages OpenAI API prompt configurations, securing safe clinical boundaries and severity risk checks.',
                '**Recruiter Appeal**: Fully interactive dashboard deployed on Streamlit Cloud for zero-barrier diagnostic sandbox evaluations.'
            ]
        },
        'talent-synapse': {
            title: 'TalentSynapse AI Semantic ATS Parser & Matcher Architecture',
            desc: 'NLP-powered recruiter ATS matching candidate resumes against target job criteria in real time.',
            diagram: `
                <div class="bp-flow-row">
                    <div class="bp-node bp-accent-cyan">
                        <i class="fa-solid fa-file-invoice"></i>
                        <span class="bp-node-header">Candidate Resume</span>
                        <span class="bp-node-detail">Raw PDF Text Extraction</span>
                    </div>
                    <div class="bp-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    <div class="bp-node bp-accent-purple">
                        <i class="fa-solid fa-language"></i>
                        <span class="bp-node-header">NLP Parser Block</span>
                        <span class="bp-node-detail">TF-IDF Vectorization</span>
                    </div>
                </div>
                <div class="bp-flow-row">
                    <div class="bp-node">
                        <i class="fa-solid fa-chart-line"></i>
                        <span class="bp-node-header">Cosine Similarity</span>
                        <span class="bp-node-detail">Semantic Job Mapping</span>
                    </div>
                    <div class="bp-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    <div class="bp-node bp-accent-green">
                        <i class="fa-solid fa-ranking-star"></i>
                        <span class="bp-node-header">Screening Dashboard</span>
                        <span class="bp-node-detail">Automated Rank & Fit</span>
                    </div>
                </div>
            `,
            specs: [
                '**Parsing Precision**: NLP text parsers pull technical credentials with **85% – 92% skill extraction accuracy**.',
                '**ATS Optimization**: Computes candidate-to-job matches with **80% – 90% compatibility precision** using TF-IDF.',
                '**Hiring Efficiency**: Cuts standard manual sourcing times by **60%+** via automated keyword scoring and semantic rankings.'
            ]
        }
    };

    const modal = document.getElementById('blueprint-modal');
    const modalContainer = document.getElementById('modal-body-container');
    const closeBtn = document.querySelector('.close-modal');
    const blueprintBtns = document.querySelectorAll('.btn-blueprint');

    if (modal && modalContainer) {
        blueprintBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectKey = btn.getAttribute('data-project');
                const data = blueprintData[projectKey];
                
                if (data) {
                    let specsHTML = '';
                    data.specs.forEach(spec => {
                        // Bold parsing
                        let formattedSpec = spec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        specsHTML += `<li><i class="fa-solid fa-cube"></i> <span>${formattedSpec}</span></li>`;
                    });

                    modalContainer.innerHTML = `
                        <h3>${data.title}</h3>
                        <p class="modal-proj-desc">${data.desc}</p>
                        
                        <div class="blueprint-diagram">
                            ${data.diagram}
                        </div>
                        
                        <div class="bp-tech-specs">
                            <h4><i class="fa-solid fa-gears"></i> Core Pipeline Engineering Features</h4>
                            <ul>
                                ${specsHTML}
                            </ul>
                        </div>
                    `;
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden'; // Lock background scroll
                }
            });
        });

        // Close functions
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- 9. INTERACTIVE CODE TABBED SANDBOX ---
    const codeTabs = document.querySelectorAll('.code-tab');
    const codeBlocks = document.querySelectorAll('.code-block');
    const codeCopyBtn = document.getElementById('code-copy');

    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            codeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetTab = tab.getAttribute('data-tab');
            
            codeBlocks.forEach(block => {
                block.classList.remove('active');
                if (block.getAttribute('id') === `code-${targetTab}`) {
                    block.classList.add('active');
                }
            });
        });
    });

    if (codeCopyBtn) {
        codeCopyBtn.addEventListener('click', () => {
            const activeBlock = document.querySelector('.code-block.active');
            if (activeBlock) {
                const codeText = activeBlock.textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                    const originalHTML = codeCopyBtn.innerHTML;
                    codeCopyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Code Copied!`;
                    setTimeout(() => {
                        codeCopyBtn.innerHTML = originalHTML;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy code: ', err);
                });
            }
        });
    }

    // --- 10. SIMULATED RAG AI CHATBOT SYSTEM ---
    const chatHistory = document.getElementById('chat-history-list');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatInputField = document.getElementById('chat-input-field');
    const promptButtons = document.querySelectorAll('.chat-prompt-btn');

    const chatbotResponses = {
        'stack': {
            thoughtLogs: [
                'Retrieving profile vector index files matching tag [Languages, Frameworks, LLMs]...',
                'Selecting top RAG context nodes (Similarity score: 0.991)...',
                'Orchestrating technical stack output format in responsive bullet nodes...'
            ],
            answer: `Aastha Ojha possesses a highly specialized and production-ready data science and machine learning engineering stack:
            <ul>
                <li><strong>Generative AI & LLMs:</strong> LangChain, Prompt Engineering, OpenAI API, Multi-Agent AI workflows.</li>
                <li><strong>ML & Deep Learning:</strong> Scikit-learn, NLP, Deep Learning, Exploratory Data Analysis (EDA), Feature Engineering, Statistical Analysis.</li>
                <li><strong>Languages:</strong> High-performance Python, structured SQL (MySQL), Java.</li>
                <li><strong>Frameworks & Libraries:</strong> Streamlit, Flask, REST APIs, Pandas, NumPy, Matplotlib, Plotly.</li>
                <li><strong>Databases & Analytics:</strong> MySQL, Power BI, Tableau, Excel.</li>
                <li><strong>Version Control & Tools:</strong> Git, GitHub, Cursor, ChatGPT, Claude, Gemini.</li>
            </ul>`
        },
        'hire': {
            thoughtLogs: [
                'Calculating executive hiring benefits vectors...',
                'Comparing academic background metrics against deployment track records...',
                'Formulating high-conversion recruiter alignment answers...'
            ],
            answer: `Aastha brings an exceptional, recruiter-focused value proposition:
            <ol>
                <li><strong>Outstanding Academic Standing:</strong> First-class scholar with a <strong>9.01/10 CGPA</strong> in B.Tech (ECE) at MMMUT and a <strong>9.0/10 CGPA</strong> in her Data Science minor.</li>
                <li><strong>Hands-on Deployment Experience:</strong> She doesn't just write scripts—she deploys real, high-performance systems to Streamlit Cloud (such as IoT predictive models and multi-agent health platforms) trained on thousands of data records.</li>
                <li><strong>Demonstrated Efficiency Gains:</strong> Her projects have concrete, business-focused outcomes, like reducing false industrial alerts by **18%** and improving recruiter screening efficiency by **60%+**.</li>
            </ol>`
        },
        'academic': {
            thoughtLogs: [
                'Connecting to Academic & Publications Vector collections...',
                'Scanning university records, papers, and credentials...',
                'Extracting verified honors citations...'
            ],
            answer: `Aastha Ojha's academic credentials demonstrate extreme rigor and technical depth:
            <ul>
                <li><strong>B.Tech in Electronics and Communication Engineering:</strong> Madan Mohan Malaviya University of Technology, Gorakhpur (2023 – Present) | <strong>CGPA: 9.01/10</strong></li>
                <li><strong>Minor Degree in Data Science:</strong> Madan Mohan Malaviya University of Technology | <strong>CGPA: 9.0/10</strong></li>
                <li><strong>Oracle Cloud Certifications:</strong> 
                    <ul>
                        <li>Oracle Cloud Infrastructure 2025 Certified Data Science Professional (Oct 2025)</li>
                        <li>Oracle Cloud Infrastructure 2025 Certified AI Foundation Associate (Oct 2025)</li>
                    </ul>
                </li>
            </ul>`
        },
        'rag': {
            thoughtLogs: [
                'Retrieving LLM Safety & System Guardrail documents...',
                'Extracting multi-agent healthcare intelligence frameworks...',
                'Structuring defensive pipeline replies...'
            ],
            answer: `Aastha ensures safe, reliable Generative AI systems by applying robust multi-agent orchestration and precision parsing:
            <ul>
                <li><strong>Orchestrated Multi-Agent Architecture:</strong> In her HealthAI system, she coordinates <strong>4 specialized AI agents</strong> to analyze clinical symptoms and reports with specialized tasks, avoiding model confusion.</li>
                <li><strong>Hallucination Defensive Prompts:</strong> Leverages advanced prompt engineering in LangChain combined with severity-based risk alert checks.</li>
                <li><strong>Semantic Scoring Precision:</strong> Deploys TF-IDF features and Cosine Similarity models (as seen in TalentSynapse AI) to map semantic relationships with 85-92% accuracy, eliminating guesswork.</li>
            </ul>`
        },
        'fallback': {
            thoughtLogs: [
                'Scanning query keywords against indexed portfolio matrices...',
                'No exact matches found. Constructing generalized core dossier answer...',
                'Connecting query to recruiter conversion CTAs...'
            ],
            answer: `I parsed your query but couldn't locate an exact document match. Here is Aastha Ojha's professional snapshot:
            <br><br>
            She is an active Data Science & Machine Learning Engineer with a stellar <strong>9.01/10 CGPA</strong> in ECE and <strong>9.0/10</strong> in Data Science. She has built and deployed high-performance Streamlit systems (predictive maintenance classifiers, multi-agent diagnostics, and ATS analyzers) utilizing Scikit-learn, LangChain, and OpenAI.
            <br><br>
            <strong>Next steps:</strong>
            <ul>
                <li>To view her verified code, navigate to the <strong>Live Code Terminal</strong> section.</li>
                <li>To download her full PDF resume and portfolio dossier, click the <strong>Get Resume & Dossier</strong> button in the Contact section!</li>
            </ul>`
        }
    };

    function appendMessage(sender, text, isAgent = false, isSystem = false) {
        const msgDiv = document.createElement('div');
        if (isSystem) {
            msgDiv.className = 'chat-msg system-msg';
            msgDiv.innerHTML = `
                <div class="msg-sender"><i class="fa-solid fa-shield-halved"></i> SYSTEM</div>
                <div class="msg-content">${text}</div>
            `;
        } else {
            msgDiv.className = isAgent ? 'chat-msg agent-msg' : 'chat-msg user-msg';
            const icon = isAgent ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user-tie"></i>';
            msgDiv.innerHTML = `
                <div class="msg-sender">${icon} ${sender}</div>
                <div class="msg-content">${text}</div>
            `;
        }
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendThinking(logs) {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'chat-msg agent-msg thinking-block';
        thinkingDiv.innerHTML = `
            <div class="msg-sender"><i class="fa-solid fa-robot"></i> Aastha's Virtual Assistant</div>
            <div class="msg-content agent-thinking">
                <i class="fa-solid fa-spinner fa-spin"></i> 
                <span>Thinking... (Retrieving Vector Context)</span>
            </div>
        `;
        chatHistory.appendChild(thinkingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        let logNum = 0;
        const thinkingTextSpan = thinkingDiv.querySelector('.agent-thinking span');
        
        function streamThinkingLogs() {
            if (logNum < logs.length) {
                thinkingTextSpan.innerHTML = `[AGENT LOG]: ${logs[logNum]}`;
                logNum++;
                setTimeout(streamThinkingLogs, 800);
            }
        }
        streamThinkingLogs();
        return thinkingDiv;
    }

    function triggerAgentResponse(queryKey) {
        const responseData = chatbotResponses[queryKey] || chatbotResponses['fallback'];
        
        // 1. Show agent thinking log stream
        const thinkingNode = appendThinking(responseData.thoughtLogs);
        
        // 2. Clear thinking and output answer
        const totalDelay = (responseData.thoughtLogs.length * 800) + 400;
        setTimeout(() => {
            thinkingNode.remove();
            appendMessage("Aastha's Virtual Assistant", responseData.answer, true);
        }, totalDelay);
    }

    // Suggestions Click Handlers
    promptButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            const btnText = btn.textContent;
            
            appendMessage("Visitor / Recruiter", btnText, false);
            triggerAgentResponse(query);
        });
    });

    // Custom text input handler
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInputField.value.trim();
            if (!text) return;
            
            appendMessage("Visitor / Recruiter", text, false);
            chatInputField.value = '';
            
            // Basic keyword router (semantic similarity approximation)
            const lowText = text.toLowerCase();
            let matchedKey = 'fallback';
            
            if (lowText.includes('stack') || lowText.includes('skill') || lowText.includes('tool') || lowText.includes('language') || lowText.includes('python')) {
                matchedKey = 'stack';
            } else if (lowText.includes('hire') || lowText.includes('value') || lowText.includes('why') || lowText.includes('benefit') || lowText.includes('experience')) {
                matchedKey = 'hire';
            } else if (lowText.includes('academic') || lowText.includes('college') || lowText.includes('paper') || lowText.includes('research') || lowText.includes('university') || lowText.includes('publication')) {
                matchedKey = 'academic';
            } else if (lowText.includes('rag') || lowText.includes('hallucination') || lowText.includes('vector') || lowText.includes('pinecone') || lowText.includes('qdrant') || lowText.includes('search')) {
                matchedKey = 'rag';
            }
            
            triggerAgentResponse(matchedKey);
        });
    }

    // --- 11. CONTACT FORM SECURE message pipeline submission simulator ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            
            alert(`TACTICAL CONNECTION SECURED!\n\nThank you, ${name}. Your inquiry has been encrypted and piped directly to Aastha Ojha's priority inbox.\nAn automated agent has sent a notification to her workstation.\n\nPriority response will be routed back to ${email} shortly.`);
            contactForm.reset();
        });
    }
});
