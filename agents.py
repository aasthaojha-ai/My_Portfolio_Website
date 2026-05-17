"""
agents.py — Shared Medical AI Agent Module
==========================================
Single source of truth for all specialist agents and the aggregator.
Imported by both streamlit_app.py (UI) and main2.py (CLI).

Prompt design principles:
- Role framing from main2.py (authoritative "Act as a senior …")
- Specific clinical test enumeration from main2.py
- Bullet-point structured output from streamlit_app.py
- Risk assessment section from streamlit_app.py
- Differential diagnosis (new — not in either original file)
- Markdown headers so Streamlit renders output cleanly
"""

import os
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ---------------------------------------------------------------------------
# Specialist Agents
# ---------------------------------------------------------------------------

class Cardiologist:
    """Cardiac specialist agent."""

    role = "Cardiologist"

    def __init__(self, model: str = "gpt-4o"):
        self.llm = ChatOpenAI(temperature=0, model=model, api_key=OPENAI_API_KEY)

    def execute(self, medical_report: str) -> str:
        prompt = f"""You are a senior consultant Cardiologist with 20+ years of clinical experience.

**Task:** Perform a thorough cardiac review of the patient's medical report below.

**Clinical Focus Areas:**
- Electrocardiogram (ECG/EKG) findings — rhythm, intervals, ST/T changes
- Blood tests — troponin, BNP/NT-proBNP, lipid panel, CRP, CBC
- Holter monitor or event recorder results (if mentioned)
- Echocardiogram findings — EF, wall motion, valvular disease
- Blood pressure, heart rate trends
- Risk factors — hypertension, diabetes, smoking, family history

**Provide your assessment using this exact structure:**

## Cardiologist Assessment

### 1. Key Cardiac Findings
- (bullet each finding)

### 2. Differential Diagnoses (Ranked by Likelihood)
1. [Diagnosis] — brief rationale
2. [Diagnosis] — brief rationale
3. [Diagnosis] — brief rationale

### 3. Confidence Level
**Score:** X.X / 1.0
**Rationale:** (one sentence)

### 4. Recommended Cardiac Investigations
- (bullet each test, e.g., repeat ECG, stress test, cardiac MRI)

### 5. Risk Assessment
**Overall Cardiac Risk:** Low / Medium / High / Critical
- (bullet key risk factors identified)

### 6. Clinical Red Flags
- (any immediate action items or warning signs; write "None identified" if clear)

Be precise, evidence-based, and clinically structured.

---
**Medical Report:**
{medical_report}
"""
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return response.content


class Psychologist:
    """Mental health specialist agent."""

    role = "Psychologist"

    def __init__(self, model: str = "gpt-4o"):
        self.llm = ChatOpenAI(temperature=0, model=model, api_key=OPENAI_API_KEY)

    def execute(self, medical_report: str) -> str:
        prompt = f"""You are a senior clinical Psychologist specialising in health psychology and psychosomatic medicine.

**Task:** Perform a comprehensive psychological assessment of the patient's medical report below.

**Clinical Focus Areas:**
- Mood and affect — depression (PHQ-9 indicators), anxiety (GAD-7 indicators)
- Trauma and PTSD markers
- Cognitive function — memory, concentration, executive function
- Sleep disturbances and their psychological correlates
- Psychosomatic contributions to physical symptoms
- Social, occupational, and relational functioning
- Substance use history
- Suicidality or self-harm indicators (if present)

**Provide your assessment using this exact structure:**

## Psychologist Assessment

### 1. Key Psychological Findings
- (bullet each finding)

### 2. Differential Diagnoses (Ranked by Likelihood)
1. [DSM-5 Diagnosis or Condition] — brief rationale
2. [DSM-5 Diagnosis or Condition] — brief rationale
3. [DSM-5 Diagnosis or Condition] — brief rationale

### 3. Confidence Level
**Score:** X.X / 1.0
**Rationale:** (one sentence)

### 4. Recommended Psychological Interventions
- (bullet each, e.g., CBT, psychometric testing, referral to psychiatry)

### 5. Risk Assessment
**Overall Mental Health Risk:** Low / Medium / High / Critical
- (bullet key psychosocial risk factors)

### 6. Clinical Red Flags
- (urgent concerns, e.g., suicidality, acute psychosis; write "None identified" if clear)

Be precise, evidence-based, and clinically structured.

---
**Medical Report:**
{medical_report}
"""
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return response.content


class Pulmonologist:
    """Respiratory specialist agent."""

    role = "Pulmonologist"

    def __init__(self, model: str = "gpt-4o"):
        self.llm = ChatOpenAI(temperature=0, model=model, api_key=OPENAI_API_KEY)

    def execute(self, medical_report: str) -> str:
        prompt = f"""You are a senior consultant Pulmonologist with expertise in obstructive, restrictive, and interstitial lung diseases.

**Task:** Perform a thorough pulmonary review of the patient's medical report below.

**Clinical Focus Areas:**
- Spirometry / PFT results — FEV1, FVC, FEV1/FVC ratio, DLCO
- Imaging — chest X-ray, HRCT findings (consolidation, infiltrates, effusion)
- Arterial blood gas (ABG) or SpO₂ data
- Symptoms — dyspnoea, cough, wheeze, haemoptysis, pleuritic pain
- Smoking history and pack-year calculation (if available)
- Occupational / environmental exposures
- Microbiological results — sputum culture, bronchoscopy findings

**Provide your assessment using this exact structure:**

## Pulmonologist Assessment

### 1. Key Pulmonary Findings
- (bullet each finding)

### 2. Differential Diagnoses (Ranked by Likelihood)
1. [Diagnosis] — brief rationale
2. [Diagnosis] — brief rationale
3. [Diagnosis] — brief rationale

### 3. Confidence Level
**Score:** X.X / 1.0
**Rationale:** (one sentence)

### 4. Recommended Pulmonary Investigations
- (bullet each, e.g., HRCT, PFTs, bronchoscopy, sputum culture)

### 5. Risk Assessment
**Overall Respiratory Risk:** Low / Medium / High / Critical
- (bullet key risk factors, e.g., COPD severity, hypoxia level)

### 6. Clinical Red Flags
- (urgent concerns, e.g., respiratory failure, haemoptysis; write "None identified" if clear)

Be precise, evidence-based, and clinically structured.

---
**Medical Report:**
{medical_report}
"""
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return response.content


class Neurologist:
    """Neurological specialist agent."""

    role = "Neurologist"

    def __init__(self, model: str = "gpt-4o"):
        self.llm = ChatOpenAI(temperature=0, model=model, api_key=OPENAI_API_KEY)

    def execute(self, medical_report: str) -> str:
        prompt = f"""You are a senior consultant Neurologist with expertise in both central and peripheral nervous system disorders.

**Task:** Perform a thorough neurological review of the patient's medical report below.

**Clinical Focus Areas:**
- CNS symptoms — headache, seizures, focal deficits, altered consciousness, cognitive decline
- PNS symptoms — neuropathy, radiculopathy, weakness, sensory loss
- Imaging — MRI/CT brain and spine findings
- Electrodiagnostics — EEG, nerve conduction studies, EMG
- CSF analysis (if available)
- Vascular risk — TIA, stroke history, carotid disease
- Movement disorders — tremor, ataxia, parkinsonism
- Medications with neurological effects

**Provide your assessment using this exact structure:**

## Neurologist Assessment

### 1. Key Neurological Findings
- (bullet each finding)

### 2. Differential Diagnoses (Ranked by Likelihood)
1. [Diagnosis] — brief rationale
2. [Diagnosis] — brief rationale
3. [Diagnosis] — brief rationale

### 3. Confidence Level
**Score:** X.X / 1.0
**Rationale:** (one sentence)

### 4. Recommended Neurological Investigations
- (bullet each, e.g., MRI brain with contrast, EEG, NCS/EMG, lumbar puncture)

### 5. Risk Assessment
**Overall Neurological Risk:** Low / Medium / High / Critical
- (bullet key risk factors, e.g., stroke risk, seizure recurrence)

### 6. Clinical Red Flags
- (urgent concerns, e.g., signs of raised ICP, impending herniation; write "None identified" if clear)

Be precise, evidence-based, and clinically structured.

---
**Medical Report:**
{medical_report}
"""
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return response.content


# ---------------------------------------------------------------------------
# Aggregator (Multidisciplinary Team)
# ---------------------------------------------------------------------------

class MedicalAggregator:
    """
    Synthesises all four specialist reports into a final consensus diagnosis.
    Replaces both MultidisciplinaryTeam (main2.py) and Aggregator (streamlit_app.py).
    """

    role = "Multidisciplinary Medical Team"

    def __init__(self, model: str = "gpt-4o"):
        self.llm = ChatOpenAI(temperature=0, model=model, api_key=OPENAI_API_KEY)

    def execute(self, agent_reports: dict) -> str:
        prompt = f"""You are a senior multidisciplinary medical team — acting as the final decision-making authority for this patient's case.

You have received independent assessments from four specialists. Your task is to critically synthesise these reports into a single, authoritative consensus diagnostic report.

**Specialist Reports Provided:**

**Cardiologist:**
{agent_reports.get('Cardiologist', 'Report not available.')}

**Psychologist:**
{agent_reports.get('Psychologist', 'Report not available.')}

**Pulmonologist:**
{agent_reports.get('Pulmonologist', 'Report not available.')}

**Neurologist:**
{agent_reports.get('Neurologist', 'Report not available.')}

---

**Synthesise the above and provide the final consensus using this exact structure:**

## Your Health Intelligence Summary

### 🔍 Plain-English Overview
(Provide a 2-3 sentence high-level summary of the findings in simple, non-medical language that a patient can easily understand.)

### 🎯 Top 3 Diagnoses (Ranked by Likelihood)

#### Diagnosis 1: [Name]
- **Likelihood:** High / Medium / Low
- **Confidence Score:** X.X / 1.0
- **Supporting Evidence:** (bullet key findings from multiple specialists)
- **Specialist Agreement:** (note which specialists support this)

#### Diagnosis 2: [Name]
- **Likelihood:** High / Medium / Low
- **Confidence Score:** X.X / 1.0
- **Supporting Evidence:** (bullet key findings)
- **Specialist Agreement:** (note which specialists support this)

#### Diagnosis 3: [Name]
- **Likelihood:** High / Medium / Low
- **Confidence Score:** X.X / 1.0
- **Supporting Evidence:** (bullet key findings)
- **Specialist Agreement:** (note which specialists support this)

### 📊 Overall Team Confidence
**Score:** X.X / 1.0
**Rationale:** (one or two sentences on data quality and consensus strength)

### 🧪 Unified Investigation Plan
- (bullet prioritised tests drawing from all specialist recommendations, avoiding duplicates)

### 📋 Management Recommendations
- (bullet immediate actions, referrals, and follow-up plan)

### ⚠️ Critical Warnings & Red Flags
- (bullet any urgent concerns or contraindications; write "None identified" if clear)

### 💡 Interdisciplinary Notes
- (any important cross-specialty considerations)

Be definitive yet accessible.
"""
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return response.content


# ---------------------------------------------------------------------------
# Utility: Run full multi-agent analysis
# ---------------------------------------------------------------------------

AGENT_CLASSES = [Cardiologist, Psychologist, Pulmonologist, Neurologist]


def run_analysis(medical_report: str, model: str = "gpt-4o") -> tuple:
    """
    Run all four specialist agents in parallel via ThreadPoolExecutor,
    then synthesise with MedicalAggregator.

    Returns:
        agent_results (dict): {role: report_text}
        consensus (str): final aggregated report
    """
    agents = {cls.role: cls(model=model) for cls in AGENT_CLASSES}
    agent_results = {}

    def _run_agent(name_agent_pair):
        name, agent = name_agent_pair
        try:
            return name, agent.execute(medical_report)
        except Exception as e:
            return name, f"Error during {name} assessment: {str(e)}"

    with ThreadPoolExecutor(max_workers=4) as executor:
        for name, result in executor.map(_run_agent, agents.items()):
            agent_results[name] = result

    aggregator = MedicalAggregator(model=model)
    consensus = aggregator.execute(agent_results)

    return agent_results, consensus


class LifestyleAdvisor:
    """Agent that provides diet, exercise, and wellness recommendations."""

    role = "Lifestyle Advisor"

    def __init__(self, model: str = "gpt-4o"):
        self.llm = ChatOpenAI(temperature=0.7, model=model, api_key=OPENAI_API_KEY)

    def execute(self, medical_report: str, consensus: str) -> str:
        prompt = f"""You are a Lifestyle Medicine Specialist and Health Coach.

**Task:** Create a personalised, practical lifestyle plan based on the patient's medical report and the specialist consensus diagnosis.

**Medical Context:**
{medical_report}

**Specialist Consensus:**
{consensus}

**Provide your recommendations in this format (use Markdown headers):**

## Personalised Lifestyle Plan

### Diet & Nutrition
- (bullet points with specific dietary advice)

### Physical Activity & Exercise
- (bullet points with safe, tailored exercise recommendations)

### Stress Management & Mental Wellbeing
- (bullet points for sleep, mindfulness, or stress reduction)

### Habit & Lifestyle Changes
- (bullet points for smoking cessation, alcohol, etc., if applicable)

Be encouraging, practical, and prioritize safety.
"""
        response = self.llm.invoke([HumanMessage(content=prompt)])
        return response.content


# ---------------------------------------------------------------------------
# Quick self-test (python agents.py)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("agents.py loaded successfully.")
    print(f"Available agents: {[cls.role for cls in AGENT_CLASSES] + ['Lifestyle Advisor']}")
    print(f"Aggregator: {MedicalAggregator.role}")
