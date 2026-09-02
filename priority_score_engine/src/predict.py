"""
predict.py
----------
Loads ONE model (per algorithm) and predicts Priority_Score for a defect
from ANY department. You tell it the department -> it's fed in as an
input feature (one-hot) so the single model applies department-specific
patterns automatically.

Example:
    python src/predict.py --algo lightgbm --dept TDMS \
        --severity High --resolution_hours 5.2 --overdue_days 30 \
        --asset_age 8.5 --failure_count 3 --joint_block_score 45.0 \
        --confidence 0.8 --urgency This_Week
"""

import os
import argparse
import joblib
import pandas as pd

from data_prep import DEPARTMENTS, SEVERITY_MAP, URGENCY_MAP, FEATURE_COLS

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


def load_model(algo_name: str):
    model_path = os.path.join(MODEL_DIR, f"{algo_name}_model.pkl")
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"No trained model found at {model_path}. "
            f"Run: python src/train_all.py --algo {algo_name}"
        )
    return joblib.load(model_path)


def predict_priority(algo_name: str, department: str, **feature_values) -> float:
    if department not in DEPARTMENTS:
        raise ValueError(f"Unknown department '{department}'. Choose from {list(DEPARTMENTS)}")

    model = load_model(algo_name)

    row = {
        "Severity_Level_Enc": SEVERITY_MAP[feature_values["severity"]],
        "Predicted_Resolution_Time_Hours": feature_values["resolution_hours"],
        "Overdue_Days": feature_values["overdue_days"],
        "Asset_Age_Years": feature_values["asset_age"],
        "Historical_Failure_Count": feature_values["failure_count"],
        "Joint_Block_Feasibility_Score": feature_values["joint_block_score"],
        "Confidence_Score": feature_values["confidence"],
        "Task_Urgency_Tier_Enc": URGENCY_MAP[feature_values["urgency"]],
        # one-hot the requested department, everything else 0
        "Dept_TDMS": 1 if department == "TDMS" else 0,
        "Dept_TMS": 1 if department == "TMS" else 0,
        "Dept_SMMS": 1 if department == "SMMS" else 0,
    }
    X = pd.DataFrame([row])[FEATURE_COLS]

    prediction = model.predict(X)[0]
    return float(prediction)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--algo", required=True,
                         choices=["lightgbm", "xgboost", "random_forest"])
    parser.add_argument("--dept", required=True, choices=list(DEPARTMENTS.keys()))
    parser.add_argument("--severity", required=True, choices=list(SEVERITY_MAP.keys()))
    parser.add_argument("--resolution_hours", required=True, type=float)
    parser.add_argument("--overdue_days", required=True, type=float)
    parser.add_argument("--asset_age", required=True, type=float)
    parser.add_argument("--failure_count", required=True, type=float)
    parser.add_argument("--joint_block_score", required=True, type=float)
    parser.add_argument("--confidence", required=True, type=float)
    parser.add_argument("--urgency", required=True,
                         choices=["Programmed", "This_Month", "This_Week", "Immediate"])
    args = parser.parse_args()

    score = predict_priority(
        algo_name=args.algo,
        department=args.dept,
        severity=args.severity,
        resolution_hours=args.resolution_hours,
        overdue_days=args.overdue_days,
        asset_age=args.asset_age,
        failure_count=args.failure_count,
        joint_block_score=args.joint_block_score,
        confidence=args.confidence,
        urgency=args.urgency,
    )
    print(f"\nAlgorithm  : {args.algo}")
    print(f"Department : {args.dept}")
    print(f"Predicted Priority Score : {score:.2f}")


if __name__ == "__main__":
    main()
