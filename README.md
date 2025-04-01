# Real-Time Anomaly Detection in IoT Networks

## **Overview**
The **Real-Time Anomaly Detection in IoT Networks** application is designed to monitor IoT devices in real-time, detect anomalies using AI-powered models, and notify security analysts or administrators of potential threats. The system supports **real-time data collection, anomaly detection, alerting, visualization, and incident management** to ensure secure and reliable IoT networks.

## **Key Features**

### **1. User Management**
- Secure authentication and authorization
- Role-based access control (Admin, Device Owners, Security Analysts)
- API keys for IoT devices

### **2. IoT Device Management**
- Device registration and tracking
- Status monitoring (online/offline)
- Metadata storage (device type, location, firmware version)

### **3. Real-Time Data Collection & Streaming**
- Supports MQTT, WebSockets, and HTTP protocols
- Time-series data storage
- Scalable architecture to handle high-volume telemetry

### **4. Anomaly Detection Engine**
- Machine Learning-based anomaly detection
- Configurable threshold-based alerts
- Adaptive learning to improve detection accuracy

### **5. Alert & Notification System**
- Email, SMS, and webhook notifications
- Customizable alert levels (Critical, Warning, Info)
- Real-time anomaly reporting

### **6. Visualization & Analytics Dashboard**
- Real-time monitoring of device health and anomalies
- Graphs and charts for IoT data trends
- Security breach visualization

### **7. Incident Management**
- Logging and tracking of detected anomalies
- Assignment of security analysts to review incidents
- Status tracking (New, Investigating, Resolved)

### **8. Reports & Logs**
- Security and performance reports
- Downloadable logs for forensic analysis
- Compliance audit reports

---

## **Database Schema & Relationships**

### **1. Users Table**
| Column       | Type        | Description |
|-------------|------------|-------------|
| id          | UUID (PK)  | Unique identifier |
| name        | String     | User's full name |
| email       | String     | Unique email |
| password    | String (hashed) | Secure password |
| role        | Enum (Admin, Analyst, DeviceOwner) | Role-based access |
| created_at  | Timestamp  | Registration date |

### **2. Devices Table**
| Column       | Type        | Description |
|-------------|------------|-------------|
| id          | UUID (PK)  | Unique identifier |
| owner_id    | UUID (FK)  | Device owner reference |
| name        | String     | Device name |
| type        | String     | Device type |
| location    | String     | Device location |
| status      | Enum (Online, Offline) | Connectivity status |
| created_at  | Timestamp  | Registration date |

### **3. Device_Data Table (Time-Series)**
| Column       | Type        | Description |
|-------------|------------|-------------|
| id          | UUID (PK)  | Unique identifier |
| device_id   | UUID (FK)  | Reference to device |
| timestamp   | Timestamp  | Data capture time |
| metric      | String     | Metric name (temperature, power, etc.) |
| value       | Float      | Captured value |

### **4. Anomalies Table**
| Column       | Type        | Description |
|-------------|------------|-------------|
| id          | UUID (PK)  | Unique identifier |
| device_id   | UUID (FK)  | Affected device |
| detected_at | Timestamp  | Time detected |
| severity    | Enum (Critical, Warning, Info) | Impact level |
| description | String     | Anomaly details |
| resolved    | Boolean    | Resolution status |

### **5. Alerts Table**
| Column       | Type        | Description |
|-------------|------------|-------------|
| id          | UUID (PK)  | Unique identifier |
| anomaly_id  | UUID (FK)  | Related anomaly |
| user_id     | UUID (FK)  | Notified user |
| sent_at     | Timestamp  | Time alert sent |
| method      | Enum (Email, SMS, Webhook) | Notification method |

### **6. Incidents Table**
| Column       | Type        | Description |
|-------------|------------|-------------|
| id          | UUID (PK)  | Unique identifier |
| anomaly_id  | UUID (FK)  | Related anomaly |
| assigned_to | UUID (FK)  | Assigned analyst |
| status      | Enum (New, Investigating, Resolved) | Incident status |
| created_at  | Timestamp  | Logged date |

---

## **Technology Stack**

### **Backend:**
- **Programming Language:** Python or Node.js
- **Frameworks:** Flask/Django (Python) or Express (Node.js)
- **Database:** PostgreSQL for structured data, InfluxDB for time-series data
- **AI/ML:** TensorFlow/PyTorch, Scikit-learn for anomaly detection
- **Message Brokers:** RabbitMQ/Kafka for real-time streaming

### **Frontend:**
- **Framework:** React.js (Vite for fast development)
- **Visualization:** Chart.js, D3.js, or Grafana for real-time monitoring
- **State Management:** Redux/Zustand
- **UI Components:** TailwindCSS, ShadCN

### **IoT Communication Protocols:**
- **MQTT** for low-latency IoT data transfer
- **WebSockets** for real-time updates
- **RESTful API** for device and user management

### **Deployment & DevOps:**
- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Cloud Hosting:** AWS/GCP/Azure
- **Monitoring & Logging:** Prometheus, Grafana, ELK Stack

---

## **Installation & Setup**

### **1. Clone the Repository**
```sh
git clone https://github.com/your-repo/anomaly-detection-iot.git
cd anomaly-detection-iot
```

### **2. Backend Setup**
```sh
cd backend
python -m venv venv
source venv/bin/activate  # (Linux/macOS)
venv\Scripts\activate  # (Windows)
pip install -r requirements.txt
python app.py
```

### **3. Frontend Setup**
```sh
cd frontend
npm install
npm run dev
```

### **4. Run Database Migrations**
```sh
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

---

## **Usage**
- **Register/Login:** Users can create accounts and log in.
- **Add IoT Devices:** Device owners register and monitor devices.
- **Monitor Data:** Real-time metrics available via dashboard.
- **Detect Anomalies:** AI-powered system highlights security threats.
- **Manage Alerts:** Users receive notifications based on alert severity.
- **Investigate Incidents:** Analysts review and resolve detected anomalies.

---

## **License**
This project is licensed under the MIT License.

---

## **Contributing**
- Fork the repository
- Create a feature branch (`git checkout -b feature-name`)
- Commit changes (`git commit -m "Added new feature"`)
- Push to your branch (`git push origin feature-name`)
- Open a Pull Request

---

## **Contact**
For inquiries, contact **Benjamin Mweri Baya** at **b3njaminbaya@gmail.com**.

