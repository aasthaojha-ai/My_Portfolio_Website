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

    // --- 10. INTERACTIVE DATA SCIENCE & ML SANDBOX ENGINE ---
    const canvasSandbox = document.getElementById('sandbox-canvas');
    if (canvasSandbox) {
        const ctxS = canvasSandbox.getContext('2d');
        let points = []; // Array of {x, y, label} where label: 0 (Red) or 1 (Blue)
        let paradigm = 'regression'; // 'regression' or 'classification'
        let activeClass = 0; // 0: Red, 1: Blue
        
        const paradigmToggles = document.querySelectorAll('#paradigm-select .btn-toggle');
        const classToggles = document.querySelectorAll('#class-select .btn-toggle');
        const classColorSelector = document.getElementById('class-color-selector');
        const knnKGroup = document.getElementById('knn-k-group');
        const regressionFitGroup = document.getElementById('regression-fit-group');
        const knnKInput = document.getElementById('knn-k');
        const knnKValSpan = document.getElementById('knn-k-val');
        const r2ScoreSpan = document.getElementById('r2-score');
        const regressionEqSpan = document.getElementById('regression-eq');
        const btnFitModel = document.getElementById('btn-fit-model');
        const btnClearSandbox = document.getElementById('btn-clear-sandbox');

        // Draw coordinate grid helper
        function drawGrid() {
            ctxS.clearRect(0, 0, canvasSandbox.width, canvasSandbox.height);
            
            // Draw background grid lines
            ctxS.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctxS.lineWidth = 1;
            
            const gridSpacing = 40;
            for (let x = 0; x < canvasSandbox.width; x += gridSpacing) {
                ctxS.beginPath();
                ctxS.moveTo(x, 0);
                ctxS.lineTo(x, canvasSandbox.height);
                ctxS.stroke();
            }
            for (let y = 0; y < canvasSandbox.height; y += gridSpacing) {
                ctxS.beginPath();
                ctxS.moveTo(0, y);
                ctxS.lineTo(canvasSandbox.width, y);
                ctxS.stroke();
            }

            // Draw center axes (light purple glow)
            ctxS.strokeStyle = 'rgba(127, 0, 255, 0.15)';
            ctxS.lineWidth = 2;
            ctxS.beginPath();
            ctxS.moveTo(canvasSandbox.width / 2, 0);
            ctxS.lineTo(canvasSandbox.width / 2, canvasSandbox.height);
            ctxS.moveTo(0, canvasSandbox.height / 2);
            ctxS.lineTo(canvasSandbox.width, canvasSandbox.height / 2);
            ctxS.stroke();
        }

        // Draw points on canvas
        function drawPoints() {
            points.forEach(pt => {
                ctxS.beginPath();
                ctxS.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
                if (pt.label === 0) {
                    ctxS.fillStyle = '#ef4444'; // Class A: Red
                    ctxS.strokeStyle = 'rgba(239, 68, 68, 0.4)';
                } else {
                    ctxS.fillStyle = '#06b6d4'; // Class B: Blue
                    ctxS.strokeStyle = 'rgba(6, 182, 212, 0.4)';
                }
                ctxS.lineWidth = 4;
                ctxS.fill();
                ctxS.stroke();
            });
        }

        // Standard initialization
        drawGrid();

        // Canvas Click Handler: Add custom coordinates
        canvasSandbox.addEventListener('mousedown', (e) => {
            const rect = canvasSandbox.getBoundingClientRect();
            // Calculate scale in case of responsive layout shrinking
            const scaleX = canvasSandbox.width / rect.width;
            const scaleY = canvasSandbox.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            // In regression paradigm, label is always 0. In classification, use active class toggle
            const label = (paradigm === 'regression') ? 0 : activeClass;
            points.push({ x, y, label });
            
            // Re-render canvas viewport
            trainAndPredict(false); // Quick reactive draw
        });

        // Paradigm Toggle Handlers
        paradigmToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                paradigmToggles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                paradigm = btn.getAttribute('data-paradigm');

                if (paradigm === 'regression') {
                    classColorSelector.style.display = 'none';
                    knnKGroup.style.display = 'none';
                    regressionFitGroup.style.display = 'block';
                    // Reset labels to 0
                    points.forEach(pt => pt.label = 0);
                } else {
                    classColorSelector.style.display = 'block';
                    knnKGroup.style.display = 'block';
                    regressionFitGroup.style.display = 'none';
                }
                trainAndPredict(true);
            });
        });

        // Class Selection Toggle Handlers
        classToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                classToggles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeClass = parseInt(btn.getAttribute('data-class'));
            });
        });

        // Slider value dynamic update
        knnKInput.addEventListener('input', () => {
            knnKValSpan.textContent = knnKInput.value;
            if (paradigm === 'classification') {
                trainAndPredict(true);
            }
        });

        // Fit & Train Machine Learning Model
        function trainAndPredict(fullRedraw = true) {
            drawGrid();

            if (points.length === 0) return;

            if (paradigm === 'regression') {
                // LINEAR REGRESSION LEAST SQUARES FITTING
                if (points.length >= 2) {
                    let sumX = 0, sumY = 0;
                    const n = points.length;

                    points.forEach(pt => {
                        sumX += pt.x;
                        sumY += pt.y;
                    });

                    const meanX = sumX / n;
                    const meanY = sumY / n;

                    // Compute slope (m) and intercept (c)
                    let num = 0;
                    let den = 0;
                    points.forEach(pt => {
                        num += (pt.x - meanX) * (pt.y - meanY);
                        den += (pt.x - meanX) * (pt.x - meanX);
                    });

                    let slope = (den === 0) ? 0 : num / den;
                    let intercept = meanY - slope * meanX;

                    // Calculate R² goodness of fit
                    let totalSS = 0;
                    let residualSS = 0;
                    points.forEach(pt => {
                        const predictedY = slope * pt.x + intercept;
                        totalSS += Math.pow(pt.y - meanY, 2);
                        residualSS += Math.pow(pt.y - predictedY, 2);
                    });

                    let r2 = (totalSS === 0) ? 1.0 : 1 - (residualSS / totalSS);
                    
                    // Convert pixels to pseudo math coordinates for clean metrics representation
                    const pseudoSlope = (-slope).toFixed(2); // Invert y-axis to match typical math grid
                    const pseudoIntercept = (canvasSandbox.height - intercept).toFixed(0);

                    r2ScoreSpan.textContent = r2.toFixed(3);
                    regressionEqSpan.textContent = `y = ${pseudoSlope}x + ${pseudoIntercept}`;

                    // Draw the fitted line
                    ctxS.strokeStyle = 'rgba(0, 242, 254, 0.85)';
                    ctxS.lineWidth = 3;
                    ctxS.shadowColor = 'rgba(0, 242, 254, 0.4)';
                    ctxS.shadowBlur = 10;
                    
                    ctxS.beginPath();
                    const x0 = 0;
                    const y0 = intercept;
                    const x1 = canvasSandbox.width;
                    const y1 = slope * x1 + intercept;
                    ctxS.moveTo(x0, y0);
                    ctxS.lineTo(x1, y1);
                    ctxS.stroke();
                    
                    // Reset shadow glow
                    ctxS.shadowBlur = 0;
                } else {
                    r2ScoreSpan.textContent = '0.000';
                    regressionEqSpan.textContent = 'Need >= 2 coordinates';
                }
            } else if (paradigm === 'classification' && points.length > 0) {
                // K-NEAREST NEIGHBORS (KNN) DECISION BOUNDARY CLASSIFIER
                const k = parseInt(knnKInput.value);
                const step = 8; // Render boundary map in step steps to preserve client-side speed

                // Loop through canvas pixels to draw background decision shaded areas
                for (let px = 0; px < canvasSandbox.width; px += step) {
                    for (let py = 0; py < canvasSandbox.height; py += step) {
                        
                        // Calculate distance to all placed coordinates
                        const distances = [];
                        points.forEach(pt => {
                            const d = Math.pow(px - pt.x, 2) + Math.pow(py - pt.y, 2); // Squared distance
                            distances.push({ d, label: pt.label });
                        });

                        // Sort by distance ascending
                        distances.sort((a, b) => a.d - b.d);

                        // Take first K neighbors
                        const neighbors = distances.slice(0, Math.min(k, distances.length));
                        let class0Votes = 0;
                        let class1Votes = 0;
                        
                        neighbors.forEach(n => {
                            if (n.label === 0) class0Votes++;
                            else class1Votes++;
                        });

                        // Draw shaded background pixel block based on class votes
                        if (class0Votes > class1Votes) {
                            ctxS.fillStyle = 'rgba(239, 68, 68, 0.07)'; // Light red
                        } else if (class1Votes > class0Votes) {
                            ctxS.fillStyle = 'rgba(6, 182, 212, 0.07)'; // Light blue
                        } else {
                            ctxS.fillStyle = 'rgba(127, 0, 255, 0.03)'; // Neutral tie
                        }
                        ctxS.fillRect(px, py, step, step);
                    }
                }
            }

            drawPoints();
        }

        // Fit Model Button Handler
        btnFitModel.addEventListener('click', () => {
            trainAndPredict(true);
        });

        // Reset Sandbox Button Handler
        btnClearSandbox.addEventListener('click', () => {
            points = [];
            r2ScoreSpan.textContent = '0.000';
            regressionEqSpan.textContent = 'y = 0.00x + 0.00';
            drawGrid();
        });
    }
});
