import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import time
import datetime
import warnings

# Suppress sklearn warning about feature names if any, and single label warnings
warnings.filterwarnings('ignore')

print("Initializing Real-Time Motor Monitoring Simulation...")

# 1. Load Training Data & Train Model
print("Training the fault detection model using historical data...")
X_train = pd.read_csv('X_train.csv')
y_train = pd.read_csv('y_train.csv')

rf = RandomForestClassifier(random_state=42)
rf.fit(X_train, y_train['Fault Label'])
print("Model trained successfully! Starting live simulation...")
print("Press Ctrl+C to stop the simulation.\n")
print("-" * 80)

# 2. Load Testing Data to Simulate Live Feed
X_live = pd.read_csv('X_test.csv')

# 3. Simulate real-time monitoring
try:
    for index, current_row in X_live.iterrows():
        # Get current timestamp for log
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Prepare the single sample
        # current_row is a Series, we convert it to a DataFrame with 1 row to preserve feature names
        sample = pd.DataFrame([current_row])
        
        # Make Prediction
        prediction = rf.predict(sample)[0]
        
        # In this specific dataset, we currently only have label 1.0 (Faults), 
        # but we prepare the logic for binary 0/1 prediction.
        if prediction == 1.0:
            status = "CRITICAL FAULT DETECTED"
        else:
            status = "SYSTEM NORMAL"
            
        # Format the output log (extracting relevant sensor data)
        features_str = (f"Speed: {current_row['Motor Speed (RPM)']:.0f} RPM | "
                        f"Temp: {current_row.iloc[3]:.1f}°C | "
                        f"Vib: {current_row['Vibration (g)']:.2f}g | "
                        f"Voltage: {current_row['Voltage (V)']:.1f}V | "
                        f"Current: {current_row['Current (A)']:.1f}A")
        
        # Print simulated live dashboard
        print(f"[LIVE FEED {now}] {features_str}")
        print(f"[ANALYSIS  {now}] >> STATUS: {status}")
        print("-" * 80)
        
        # Important: Add the requested delay
        time.sleep(1)

except KeyboardInterrupt:
    print("\n[!] Simulation stopped by user.")
