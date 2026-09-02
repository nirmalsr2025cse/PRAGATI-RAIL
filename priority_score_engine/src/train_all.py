"""
train_all.py
------------
Trains ONE model per algorithm (LightGBM, XGBoost, Random Forest) on the
COMBINED dataset (all 3 departments together). Department is passed in as
an input feature, so each model still learns department-specific patterns
-- it just lives in a single .pkl file per algorithm instead of 9 files.

Run:
    python src/train_all.py                # trains all 3 algorithms
    python src/train_all.py --algo lightgbm # trains just one
"""

import os
import argparse
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from lightgbm import LGBMRegressor
from xgboost import XGBRegressor

from data_prep import build_combined_dataset, FEATURE_COLS, TARGET_COL

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def get_model(algo_name: str):
    if algo_name == "lightgbm":
        return LGBMRegressor(
            n_estimators=500, learning_rate=0.05, max_depth=-1,
            num_leaves=31, subsample=0.8, colsample_bytree=0.8, random_state=42,
        )
    if algo_name == "xgboost":
        return XGBRegressor(
            n_estimators=500, learning_rate=0.05, max_depth=6,
            subsample=0.8, colsample_bytree=0.8, random_state=42, eval_metric="mae",
        )
    if algo_name == "random_forest":
        return RandomForestRegressor(
            n_estimators=500, max_depth=None, min_samples_split=4,
            min_samples_leaf=2, n_jobs=-1, random_state=42,
        )
    raise ValueError(f"Unknown algorithm: {algo_name}")


def train_one(algo_name: str, df: pd.DataFrame):
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    # stratify-ish split isn't needed for regression, but keep department mix
    # roughly even across train/test by shuffling with a fixed seed
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = get_model(algo_name)

    if algo_name == "lightgbm":
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], eval_metric="mae")
    elif algo_name == "xgboost":
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    else:
        model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    print(f"\n=== {algo_name} (all departments combined) ===")
    print(f"MAE  : {mae:.3f}")
    print(f"RMSE : {rmse:.3f}")
    print(f"R2   : {r2:.3f}")

    importances = pd.Series(model.feature_importances_, index=FEATURE_COLS)
    print("Feature Importances:")
    print(importances.sort_values(ascending=False))

    model_path = os.path.join(MODEL_DIR, f"{algo_name}_model.pkl")
    joblib.dump(model, model_path)
    print(f"Model saved -> {model_path}")

    return {"algorithm": algo_name, "mae": mae, "rmse": rmse, "r2": r2}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--algo", choices=["lightgbm", "xgboost", "random_forest"],
                         default=None, help="Train only this algorithm. Default: all 3.")
    args = parser.parse_args()

    df = build_combined_dataset()
    algorithms = [args.algo] if args.algo else ["lightgbm", "xgboost", "random_forest"]

    results = [train_one(algo, df) for algo in algorithms]

    summary = pd.DataFrame(results).sort_values("mae")
    print("\n\n================ SUMMARY (lower MAE/RMSE = better, higher R2 = better) ================")
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
