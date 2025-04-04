import streamlit as st
import pandas as pd
from etl_utils import *
from db_config import DB_URL

st.set_page_config(page_title="🔗 ETL Pipeline App", layout="wide")

st.title("🔄 Custom ETL Pipeline Tool")
st.write("Upload CSV/JSON or provide an API URL to start your ETL process.")

# ---------- Extract ----------
st.header("📥 Extract")
source_type = st.radio("Select data source:", ["CSV File", "JSON File", "API URL"])

data = None
if source_type == "CSV File":
    file = st.file_uploader("Upload CSV", type=["csv"])
    if file: data = extract_csv(file)
elif source_type == "JSON File":
    file = st.file_uploader("Upload JSON", type=["json"])
    if file: data = extract_json(file)
elif source_type == "API URL":
    url = st.text_input("Enter API URL")
    if url: data = extract_api(url)

if data is not None:
    st.subheader("✅ Extracted Data")
    st.dataframe(data.head())

    # ---------- Transform ----------
    st.header("🧪 Transform")

    if st.checkbox("Clean Column Names & Remove Duplicates"):
        data = clean_data(data)

    if st.checkbox("Parse Date Columns"):
        data = parse_dates(data)

    if st.checkbox("Convert Data Types"):
        data = convert_types(data)

    if st.checkbox("Drop Missing Data"):
        data = handle_missing_data(data)

    if st.checkbox("Remove Outliers"):
        data = remove_outliers(data)

    if st.checkbox("Encode Categorical Columns (Dummy Variables)"):
        data = create_dummies(data)

    if st.checkbox("Scale Numeric Features"):
        data = scale_features(data)

    if st.checkbox("Apply Feature Engineering"):
        data = feature_engineering(data)

    st.subheader("🔧 Transformed Data")
    st.dataframe(data.head())

    # ---------- Load ----------
    st.header("📤 Load to Database")
    table_name = st.text_input("Enter table name:")
    if st.button("Upload to Database") and table_name:
        try:
            load_to_database(data, DB_URL, table_name)
            st.success(f"🎉 Data uploaded to `{table_name}` in database!")
        except Exception as e:
            st.error(f"Database error: {e}")

else:
    st.info("Please provide a valid data source to begin.")
