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

    // --- 10. INTERACTIVE MACHINE LEARNING SANDBOX PLAYGROUND ---
    const canvasSandbox = document.getElementById('sandbox-canvas');
    if (canvasSandbox) {
        const ctxS = canvasSandbox.getContext('2d');
        let currentAlgo = 'regression';

        // 1. Data Points definition (Static distributions for visual stability and clean lessons)
        const regressionPoints = [
            { x: 100, y: 310 },
            { x: 160, y: 260 },
            { x: 220, y: 230 },
            { x: 280, y: 190 },
            { x: 340, y: 160 },
            { x: 400, y: 110 },
            { x: 460, y: 70 }
        ];

        const kmeansPoints = [
            // Cluster 1 (Left-Top)
            { x: 110, y: 120, label: -1 }, { x: 130, y: 100, label: -1 }, { x: 140, y: 140, label: -1 }, { x: 90, y: 150, label: -1 }, { x: 120, y: 160, label: -1 },
            // Cluster 2 (Right-Top)
            { x: 420, y: 130, label: -1 }, { x: 440, y: 110, label: -1 }, { x: 380, y: 120, label: -1 }, { x: 400, y: 160, label: -1 }, { x: 460, y: 150, label: -1 },
            // Cluster 3 (Bottom-Center)
            { x: 250, y: 320, label: -1 }, { x: 280, y: 300, label: -1 }, { x: 220, y: 310, label: -1 }, { x: 270, y: 340, label: -1 }, { x: 290, y: 280, label: -1 }, { x: 230, y: 270, label: -1 }
        ];

        const neuronPoints = [
            // Class 0 (Red - Top-Left)
            { x: 100, y: 100, class: 0 }, { x: 140, y: 120, class: 0 }, { x: 120, y: 160, class: 0 }, { x: 180, y: 110, class: 0 }, { x: 90, y: 170, class: 0 }, { x: 160, y: 180, class: 0 }, { x: 210, y: 130, class: 0 },
            // Class 1 (Blue - Bottom-Right)
            { x: 380, y: 280, class: 1 }, { x: 420, y: 300, class: 1 }, { x: 350, y: 330, class: 1 }, { x: 440, y: 250, class: 1 }, { x: 390, y: 350, class: 1 }, { x: 320, y: 310, class: 1 }, { x: 430, y: 320, class: 1 }
        ];

        // Centroids list for K-Means
        let centroids = [];
        const centroidColors = ['#ef4444', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

        // DOM elements cache
        const algoTabs = document.querySelectorAll('.sandbox-tab');
        const regWSlider = document.getElementById('reg-w');
        const regBSlider = document.getElementById('reg-b');
        const regWVal = document.getElementById('reg-w-val');
        const regBVal = document.getElementById('reg-b-val');

        const kmeansKSlider = document.getElementById('kmeans-k');
        const kmeansKVal = document.getElementById('kmeans-k-val');

        const neuronW1Slider = document.getElementById('neuron-w1');
        const neuronW2Slider = document.getElementById('neuron-w2');
        const neuronBiasSlider = document.getElementById('neuron-bias');
        const neuronW1Val = document.getElementById('neuron-w1-val');
        const neuronW2Val = document.getElementById('neuron-w2-val');
        const neuronBiasVal = document.getElementById('neuron-bias-val');

        const controlReg = document.getElementById('control-regression');
        const controlKmeans = document.getElementById('control-kmeans');
        const controlNeuron = document.getElementById('control-neuron');

        const formulaText = document.getElementById('algo-formula');
        const instructionsText = document.getElementById('sandbox-instructions');

        const metricLabel1 = document.getElementById('metric-label-1');
        const metricVal1 = document.getElementById('metric-val-1');
        const metricLabel2 = document.getElementById('metric-label-2');
        const metricVal2 = document.getElementById('metric-val-2');

        const btnAction = document.getElementById('btn-algo-action');
        const btnReset = document.getElementById('btn-algo-reset');

        // Governing formulas map
        const formulas = {
            regression: `ŷ = w•x + b<br>MSE = (1/n)•Σ(y_i - ŷ_i)²`,
            kmeans: `J = Σ_{j=1}^K Σ_{i ∈ S_j} ||x_i - μ_j||²<br>(Minimize Inertia)`,
            neuron: `a = σ(w_1•x_1 + w_2•x_2 + b)<br>σ(z) = 1 / (1 + e^{-z})`
        };

        // Instructions map
        const instructions = {
            regression: `<i class="fa-solid fa-circle-info"></i> Objective: Adjust the Slope (w) and Intercept (b) sliders to tilt the regression line and minimize Mean Squared Error (MSE) under 500!`,
            kmeans: `<i class="fa-solid fa-circle-info"></i> Objective: Change K value, then click "Step Clustering Iteration" repeatedly to watch centroids converge step-by-step!`,
            neuron: `<i class="fa-solid fa-circle-info"></i> Objective: Drag w1, w2, and bias sliders to orient the neuron decision divider and perfectly separate Red from Blue!`
        };

        // Grid renderer helper
        function drawGrid() {
            ctxS.clearRect(0, 0, canvasSandbox.width, canvasSandbox.height);
            ctxS.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctxS.lineWidth = 1;
            const step = 40;
            for (let x = 0; x < canvasSandbox.width; x += step) {
                ctxS.beginPath();
                ctxS.moveTo(x, 0);
                ctxS.lineTo(x, canvasSandbox.height);
                ctxS.stroke();
            }
            for (let y = 0; y < canvasSandbox.height; y += step) {
                ctxS.beginPath();
                ctxS.moveTo(0, y);
                ctxS.lineTo(canvasSandbox.width, y);
                ctxS.stroke();
            }
            // Draw axis lines
            ctxS.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctxS.lineWidth = 2;
            ctxS.beginPath();
            ctxS.moveTo(canvasSandbox.width / 2, 0);
            ctxS.lineTo(canvasSandbox.width / 2, canvasSandbox.height);
            ctxS.moveTo(0, canvasSandbox.height / 2);
            ctxS.lineTo(canvasSandbox.width, canvasSandbox.height / 2);
            ctxS.stroke();
        }

        // Initialize K-Means centroids
        function initKMeansCentroids() {
            const K = parseInt(kmeansKSlider.value);
            centroids = [];
            kmeansPoints.forEach(p => p.label = -1);
            for (let i = 0; i < K; i++) {
                centroids.push({
                    x: Math.random() * (canvasSandbox.width - 100) + 50,
                    y: Math.random() * (canvasSandbox.height - 100) + 50,
                    color: centroidColors[i % centroidColors.length]
                });
            }
        }

        // Render everything based on active algorithm
        function render() {
            drawGrid();

            if (currentAlgo === 'regression') {
                const w = parseFloat(regWSlider.value);
                const b = parseFloat(regBSlider.value);

                // yHat = b - w * (x - 275)
                // Draw residual line bars (glowing pink dashed vectors)
                ctxS.strokeStyle = 'rgba(244, 63, 94, 0.4)';
                ctxS.setLineDash([4, 4]);
                ctxS.lineWidth = 2;
                let sumSqErr = 0;

                regressionPoints.forEach(pt => {
                    const yHat = b - w * (pt.x - 275);
                    sumSqErr += Math.pow(pt.y - yHat, 2);

                    ctxS.beginPath();
                    ctxS.moveTo(pt.x, pt.y);
                    ctxS.lineTo(pt.x, yHat);
                    ctxS.stroke();
                });

                ctxS.setLineDash([]); // Reset
                const mse = (sumSqErr / regressionPoints.length).toFixed(1);

                // Draw fitted line
                ctxS.strokeStyle = 'var(--accent-cyan)';
                ctxS.lineWidth = 4;
                ctxS.shadowColor = 'rgba(0, 242, 254, 0.4)';
                ctxS.shadowBlur = 10;
                ctxS.beginPath();
                ctxS.moveTo(0, b - w * (0 - 275));
                ctxS.lineTo(canvasSandbox.width, b - w * (canvasSandbox.width - 275));
                ctxS.stroke();
                ctxS.shadowBlur = 0; // Reset

                // Draw Scatter points
                regressionPoints.forEach(pt => {
                    ctxS.beginPath();
                    ctxS.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
                    ctxS.fillStyle = '#fff';
                    ctxS.strokeStyle = 'var(--accent-cyan)';
                    ctxS.lineWidth = 3;
                    ctxS.fill();
                    ctxS.stroke();
                });

                // Update metrics
                metricLabel1.textContent = 'Mean Squared Error (MSE)';
                metricVal1.textContent = mse;
                metricLabel2.textContent = 'Game Target (Under 500)';
                if (mse < 500) {
                    metricVal2.textContent = '🎉 Fit Achieved!';
                    metricVal2.className = 'metric-val val-green';
                } else {
                    metricVal2.textContent = 'Fit Sliders';
                    metricVal2.className = 'metric-val';
                }
            }
            else if (currentAlgo === 'kmeans') {
                // Draw centroid connection attraction bonds
                ctxS.lineWidth = 1.5;
                kmeansPoints.forEach(pt => {
                    if (pt.label !== -1) {
                        const cent = centroids[pt.label];
                        ctxS.strokeStyle = cent.color + '26'; // faint transparency
                        ctxS.beginPath();
                        ctxS.moveTo(pt.x, pt.y);
                        ctxS.lineTo(cent.x, cent.y);
                        ctxS.stroke();
                    }
                });

                // Draw data points colored by assigned cluster centroid
                kmeansPoints.forEach(pt => {
                    ctxS.beginPath();
                    ctxS.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
                    if (pt.label === -1) {
                        ctxS.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        ctxS.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    } else {
                        ctxS.fillStyle = centroids[pt.label].color;
                        ctxS.strokeStyle = '#fff';
                    }
                    ctxS.lineWidth = 2;
                    ctxS.fill();
                    ctxS.stroke();
                });

                // Draw centroids as glowing crosshairs
                centroids.forEach((cent, idx) => {
                    ctxS.shadowColor = cent.color;
                    ctxS.shadowBlur = 12;
                    ctxS.fillStyle = cent.color;
                    ctxS.strokeStyle = '#fff';
                    ctxS.lineWidth = 3;

                    // Centroid representation
                    ctxS.beginPath();
                    ctxS.arc(cent.x, cent.y, 11, 0, Math.PI * 2);
                    ctxS.fill();
                    ctxS.stroke();

                    // Plus sign inside
                    ctxS.strokeStyle = '#000';
                    ctxS.lineWidth = 2;
                    ctxS.beginPath();
                    ctxS.moveTo(cent.x - 6, cent.y);
                    ctxS.lineTo(cent.x + 6, cent.y);
                    ctxS.moveTo(cent.x, cent.y - 6);
                    ctxS.lineTo(cent.x, cent.y + 6);
                    ctxS.stroke();

                    ctxS.shadowBlur = 0; // Reset
                });

                // Compute Clustering Inertia (Within-Cluster Sum of Squares)
                let inertia = 0;
                let assignedCount = 0;
                kmeansPoints.forEach(pt => {
                    if (pt.label !== -1) {
                        const cent = centroids[pt.label];
                        inertia += Math.pow(pt.x - cent.x, 2) + Math.pow(pt.y - cent.y, 2);
                        assignedCount++;
                    }
                });

                metricLabel1.textContent = 'Clustering Inertia (WCSS)';
                metricVal1.textContent = assignedCount === 0 ? 'Not Initialized' : Math.round(inertia / 100);
                metricLabel2.textContent = 'Convergence status';
                if (assignedCount === kmeansPoints.length) {
                    metricVal2.textContent = 'Converged';
                    metricVal2.className = 'metric-val val-green';
                } else {
                    metricVal2.textContent = 'Click "Step"';
                    metricVal2.className = 'metric-val';
                }
            }
            else if (currentAlgo === 'neuron') {
                const w1 = parseFloat(neuronW1Slider.value);
                const w2 = parseFloat(neuronW2Slider.value);
                const b = parseFloat(neuronBiasSlider.value);

                // Draw 2D Shaded decision backdrop grid
                const step = 8;
                for (let px = 0; px < canvasSandbox.width; px += step) {
                    for (let py = 0; py < canvasSandbox.height; py += step) {
                        // Map pixels to standard feature space coordinates centered at 0
                        const xNorm = (px - 275) / 100;
                        const yNorm = (200 - py) / 100;

                        const z = w1 * xNorm + w2 * yNorm + b;
                        const a = 1 / (1 + Math.exp(-z)); // Sigmoid activation

                        if (a > 0.5) {
                            ctxS.fillStyle = `rgba(6, 182, 212, ${0.08 * a})`;
                        } else {
                            ctxS.fillStyle = `rgba(239, 68, 68, ${0.08 * (1 - a)})`;
                        }
                        ctxS.fillRect(px, py, step, step);
                    }
                }

                // Draw linear partition boundary line (w1*x + w2*y + b = 0)
                ctxS.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctxS.lineWidth = 2.5;
                ctxS.beginPath();
                // Find two boundary coordinates
                if (Math.abs(w2) > 0.01) {
                    const x0 = 0, y0 = 200 - 100 * (-(w1 * (-275 / 100) + b) / w2);
                    const x1 = canvasSandbox.width, y1 = 200 - 100 * (-(w1 * ((canvasSandbox.width - 275) / 100) + b) / w2);
                    ctxS.moveTo(x0, y0);
                    ctxS.lineTo(x1, y1);
                } else if (Math.abs(w1) > 0.01) {
                    const x = 275 + 100 * (-b / w1);
                    ctxS.moveTo(x, 0);
                    ctxS.lineTo(x, canvasSandbox.height);
                }
                ctxS.stroke();

                // Draw Class Points
                let correctCount = 0;
                neuronPoints.forEach(pt => {
                    ctxS.beginPath();
                    ctxS.arc(pt.x, pt.y, 7.5, 0, Math.PI * 2);

                    const xNorm = (pt.x - 275) / 100;
                    const yNorm = (200 - pt.y) / 100;
                    const z = w1 * xNorm + w2 * yNorm + b;
                    const pred = z >= 0 ? 1 : 0;

                    if (pt.class === 0) {
                        ctxS.fillStyle = '#ef4444'; // Red
                        ctxS.strokeStyle = pred === pt.class ? '#fff' : 'rgba(239, 68, 68, 0.4)';
                    } else {
                        ctxS.fillStyle = '#06b6d4'; // Blue
                        ctxS.strokeStyle = pred === pt.class ? '#fff' : 'rgba(6, 182, 212, 0.4)';
                    }

                    if (pred === pt.class) correctCount++;

                    ctxS.lineWidth = 3;
                    ctxS.fill();
                    ctxS.stroke();
                });

                const accuracy = Math.round((correctCount / neuronPoints.length) * 100);

                metricLabel1.textContent = 'Classification Accuracy';
                metricVal1.textContent = accuracy + '%';
                metricLabel2.textContent = 'Objective Target (100%)';
                if (accuracy === 100) {
                    metricVal2.textContent = '🎉 Separation Complete!';
                    metricVal2.className = 'metric-val val-green';
                } else {
                    metricVal2.textContent = 'Incomplete';
                    metricVal2.className = 'metric-val';
                }
            }
        }

        // Centroid convergence assignment and updates step function
        function stepKMeans() {
            const K = centroids.length;

            // 1. Assignment Step
            let changed = false;
            kmeansPoints.forEach(pt => {
                let minDist = Infinity;
                let bestIdx = -1;
                centroids.forEach((cent, idx) => {
                    const d = Math.pow(pt.x - cent.x, 2) + Math.pow(pt.y - cent.y, 2);
                    if (d < minDist) {
                        minDist = d;
                        bestIdx = idx;
                    }
                });
                if (pt.label !== bestIdx) {
                    pt.label = bestIdx;
                    changed = true;
                }
            });

            // 2. Update Centroid Means step
            for (let cIdx = 0; cIdx < K; cIdx++) {
                let sumX = 0, sumY = 0, count = 0;
                kmeansPoints.forEach(pt => {
                    if (pt.label === cIdx) {
                        sumX += pt.x;
                        sumY += pt.y;
                        count++;
                    }
                });
                if (count > 0) {
                    const targetX = sumX / count;
                    const targetY = sumY / count;

                    // Glide centroids slightly towards target (or snap directly)
                    centroids[cIdx].x = targetX;
                    centroids[cIdx].y = targetY;
                }
            }
            render();
        }

        // Tab Switching Click Event Listeners
        algoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                algoTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentAlgo = tab.getAttribute('data-algo');

                // Hide all slider parameters blocks, show matching active block
                controlReg.style.display = 'none';
                controlKmeans.style.display = 'none';
                controlNeuron.style.display = 'none';
                btnAction.style.display = 'none';

                if (currentAlgo === 'regression') {
                    controlReg.style.display = 'block';
                } else if (currentAlgo === 'kmeans') {
                    controlKmeans.style.display = 'block';
                    btnAction.style.display = 'block';
                    initKMeansCentroids();
                } else if (currentAlgo === 'neuron') {
                    controlNeuron.style.display = 'block';
                }

                formulaText.innerHTML = formulas[currentAlgo];
                instructionsText.innerHTML = instructions[currentAlgo];
                render();
            });
        });

        // Sliders Listeners
        regWSlider.addEventListener('input', () => {
            regWVal.textContent = regWSlider.value;
            render();
        });
        regBSlider.addEventListener('input', () => {
            regBVal.textContent = regBSlider.value;
            render();
        });

        kmeansKSlider.addEventListener('input', () => {
            kmeansKVal.textContent = kmeansKSlider.value;
            initKMeansCentroids();
            render();
        });

        neuronW1Slider.addEventListener('input', () => {
            neuronW1Val.textContent = neuronW1Slider.value;
            render();
        });
        neuronW2Slider.addEventListener('input', () => {
            neuronW2Val.textContent = neuronW2Slider.value;
            render();
        });
        neuronBiasSlider.addEventListener('input', () => {
            neuronBiasVal.textContent = neuronBiasSlider.value;
            render();
        });

        // Action Deck Button Listeners
        btnAction.addEventListener('click', () => {
            if (currentAlgo === 'kmeans') {
                stepKMeans();
            }
        });

        btnReset.addEventListener('click', () => {
            if (currentAlgo === 'regression') {
                regWSlider.value = '1.0';
                regBSlider.value = '200';
                regWVal.textContent = '1.0';
                regBVal.textContent = '200';
            } else if (currentAlgo === 'kmeans') {
                kmeansKSlider.value = '3';
                kmeansKVal.textContent = '3';
                initKMeansCentroids();
            } else if (currentAlgo === 'neuron') {
                neuronW1Slider.value = '0.5';
                neuronW2Slider.value = '0.5';
                neuronBiasSlider.value = '0.0';
                neuronW1Val.textContent = '0.5';
                neuronW2Val.textContent = '0.5';
                neuronBiasVal.textContent = '0.0';
            }
            render();
        });

        // Initial setup execution
        render();
    }
});
