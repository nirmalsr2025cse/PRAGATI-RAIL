"""
data_prep.py
------------
Loads TDMS, TMS, SMMS datasets and combines them into ONE dataset.
'Department' is kept as an input FEATURE (one-hot encoded), so a single
model learns department-specific patterns and uses whichever department
you give it at prediction time.

Target column : Priority_Score
Core features : Severity_Level, Predicted_Resolution_Time_Hours, Department
Extra features : Overdue_Days, Asset_Age_Years, Historical_Failure_Count,
                  Joint_Block_Feasibility_Score, Confidence_Score,
                  Task_Urgency_Tier
"""

import os
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
os.makedirs(PROCESSED_DIR, exist_ok=True)

DEPARTMENTS = {
    "TDMS": "TDMS_dataset.csv",
    "TMS": "TMS_dataset.csv",
    "SMMS": "SMMS_dataset.csv",
}

# Severity is ordinal -> map it to numbers so tree models can use the order
SEVERITY_MAP = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}

# Urgency tier is also ordinal
URGENCY_MAP = {
    "Programmed": 1,
    "This_Month": 2, "This Month": 2,
    "This_Week": 3, "This Week": 3,
    "Immediate": 4,
}

COMMON_COLS = [
    "Defect_ID", "Severity_Level", "Predicted_Resolution_Time_Hours",
    "Overdue_Days", "Asset_Age_Years", "Historical_Failure_Count",
    "Joint_Block_Feasibility_Score", "Confidence_Score",
    "Task_Urgency_Tier", "Priority_Score",
]

# Department is one-hot encoded into these columns -- keep this list and
# DEPARTMENTS in sync so predict.py can build rows consistently.
FEATURE_COLS = [
    "Severity_Level_Enc",
    "Predicted_Resolution_Time_Hours",
    "Overdue_Days",
    "Asset_Age_Years",
    "Historical_Failure_Count",
    "Joint_Block_Feasibility_Score",
    "Confidence_Score",
    "Task_Urgency_Tier_Enc",
    "Dept_TDMS",
    "Dept_TMS",
    "Dept_SMMS",
]
TARGET_COL = "Priority_Score"


def _load_one(department: str) -> pd.DataFrame:
    filename = DEPARTMENTS[department]
    path = os.path.join(RAW_DIR, filename)
    df = pd.read_csv(path)

    missing = [c for c in COMMON_COLS if c not in df.columns]
    if missing:
        raise ValueError(f"{filename} is missing expected columns: {missing}")

    df = df[COMMON_COLS].copy()
    df["Department"] = department
    return df


def build_combined_dataset() -> pd.DataFrame:
    """Load all 3 departments, tag each row with its Department, combine into one table."""
    frames = [_load_one(dept) for dept in DEPARTMENTS]
    combined = pd.concat(frames, ignore_index=True)

    # Encode categoricals
    combined["Severity_Level_Enc"] = combined["Severity_Level"].map(SEVERITY_MAP)
    combined["Task_Urgency_Tier_Enc"] = combined["Task_Urgency_Tier"].map(URGENCY_MAP)

    # One-hot encode Department -> Dept_TDMS, Dept_TMS, Dept_SMMS
    combined = pd.get_dummies(combined, columns=["Department"], prefix="Dept")
    for col in ["Dept_TDMS", "Dept_TMS", "Dept_SMMS"]:
        if col not in combined.columns:
            combined[col] = 0
    combined[["Dept_TDMS", "Dept_TMS", "Dept_SMMS"]] = combined[
        ["Dept_TDMS", "Dept_TMS", "Dept_SMMS"]
    ].astype(int)

    # Drop rows with missing target or key features
    combined = combined.dropna(subset=["Priority_Score", "Severity_Level_Enc",
                                        "Predicted_Resolution_Time_Hours"])

    out_path = os.path.join(PROCESSED_DIR, "combined_dataset.csv")
    combined.to_csv(out_path, index=False)
    print(f"Combined dataset saved -> {out_path}")
    print(f"Total rows: {len(combined)}")
    print(combined[["Dept_TDMS", "Dept_TMS", "Dept_SMMS"]].sum())

    return combined


if __name__ == "__main__":
    build_combined_dataset()
