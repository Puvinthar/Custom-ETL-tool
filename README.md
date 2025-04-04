# Custom-ETL-tool
The **ETL Pipeline Web App** is a no-code tool for extracting, transforming, and loading data from CSV, JSON, or APIs into a database. It offers data cleaning, parsing, outlier removal, scaling, and feature engineering. Users can store processed data in SQLite or PostgreSQL, making it ideal for data analysts, engineers, and business users. 
# **ETL Pipeline Web App**  

The ETL Pipeline Web App is a no-code, interactive tool for extracting data from **CSV, JSON, and APIs**, transforming it with **data cleaning, parsing, and feature engineering**, and loading it into a **SQLite or PostgreSQL database**. It is designed for data analysts, engineers, and business users who need an efficient ETL solution.  

## **Features**  

### **Extract Data From:**  
- CSV files  
- JSON files  
- APIs (via URL)  

### **Transform Data:**  
- Clean column names and remove duplicates  
- Parse date columns and fix data types  
- Handle missing values and outliers  
- Encode categorical variables  
- Scale and normalize features  
- Apply feature engineering  

### **Load to Database:**  
- Store transformed data in **SQLite** (default) or **PostgreSQL**  

## **Technology Stack**  
- **Frontend**: Streamlit  
- **Backend**: Pandas, NumPy, Requests  
- **Storage**: SQLite / PostgreSQL  
- **Machine Learning Support**: Scikit-learn  

## **Installation and Usage**  

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-repo/etl-pipeline-web-app.git
   cd etl-pipeline-web-app
   ```

2. **Install dependencies:**  
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Streamlit app:**  
   ```bash
   streamlit run etl_web_app.py
   ```

## **Future Enhancements**  
- Cloud storage integration (AWS S3, Google Drive)  
- Automated scheduling with APScheduler  
- Data visualization dashboard  

This tool provides a streamlined ETL workflow without requiring coding expertise, making data transformation and integration accessible to all users.
