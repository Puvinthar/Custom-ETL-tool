import pandas as pd
import numpy as np
import requests
from io import StringIO
from sklearn.preprocessing import StandardScaler
from sqlalchemy import create_engine

# ========== EXTRACT ========== #
def extract_csv(file):
    return pd.read_csv(file)

def extract_json(file):
    return pd.read_json(file)

def extract_api(url):
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        return pd.DataFrame(data)
    return None

# ========== TRANSFORM ========== #
def clean_data(df):
    df.columns = [col.lower().strip().replace(" ", "_") for col in df.columns]
    df.drop_duplicates(inplace=True)
    return df

def handle_missing_data(df):
    return df.dropna(axis=0)

def parse_dates(df):
    for col in df.columns:
        if "date" in col or "time" in col:
            try:
                df[col] = pd.to_datetime(df[col])
            except:
                pass
    return df

def convert_types(df):
    return df.convert_dtypes()

def create_dummies(df):
    return pd.get_dummies(df, drop_first=True)

def remove_outliers(df, z_thresh=3):
    return df[(np.abs((df - df.mean()) / df.std()) < z_thresh).all(axis=1)]

def scale_features(df):
    scaler = StandardScaler()
    num_df = df.select_dtypes(include=[np.number])
    df[num_df.columns] = scaler.fit_transform(num_df)
    return df

def feature_engineering(df):
    if 'price' in df.columns and 'quantity' in df.columns:
        df['total_value'] = df['price'] * df['quantity']
    return df

# ========== LOAD ========== #
def load_to_database(df, db_url, table_name):
    engine = create_engine(db_url)
    df.to_sql(table_name, engine, if_exists='replace', index=False)
