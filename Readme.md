# SmartLink API

---

## Description

SmartLink is a RESTful API service for shortening URLs, generating QR codes, and tracking analytics for each link. The main goal of this project is to demonstrate dynamic scaling using Kubernetes Horizontal Pod Autoscaler (HPA).

---

## Features

- **Shorten URLs:** Converts long URLs into short, easy-to-share links.
- **Generate QR Codes:** Creates QR codes for any URL and serves them as images.
- **Track Analytics:** Records visits, including timestamp, IP, user agent, and location.
- **Prometheus Metrics:** Exposes `/metrics` endpoint for monitoring.
- **Rate Limiting:** Prevents abuse with configurable request limits.
- **API Key Authentication:** (Optional) Secure endpoints with API keys.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or remote)
- Docker
- Kubernetes (required for HPA testing)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/FASJ20/SmartlinkAPI.git
   cd Smartlink
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment:**
   - Copy `.env` and edit as needed:
     ```
     PORT=MyPORT
     API_KEYS=MyapiKey
     MONGO_URL=Mongo_uri
     NODE_ENV=Node_env
     ```

4. **Start the server:**
   ```sh
   npm start
   ```
   Or for development:
   ```sh
   npm run dev
   ```

---

## API Endpoints

### URL Shortening

- `POST /api/shorten`
  - Request: `{ "originalUrl": "https://example.com" }`
  - Response: Shortened URL object

- `GET /:shortCode`
  - Redirects to the original URL

### QR Code

- `POST /api/generateQrCode`
  - Request: `{ "url": "https://example.com" }`
  - Response: PNG image of QR code

- `GET /api/getQr/:shortCode`
  - Response: PNG image of QR code for the shortened URL

### Analytics

- `GET /api/analytics`
  - Returns all analytics records

- `GET /api/analytics/:shortCode`
  - Returns analytics for a specific short URL

### Metrics

- `GET /metrics`
  - Prometheus metrics endpoint

---

## Kubernetes Deployment

Kubernetes is required for this project to test HPA. Example manifests are provided in the [`k8s`](k8s) directory:

- [`k8s/deployment.yaml`](k8s/deployment.yaml) – Deploys the app
- [`k8s/service.yaml`](k8s/service.yaml) – Exposes the app via NodePort
- [`k8s/hpa.yaml`](k8s/hpa.yaml) – Enables Horizontal Pod Autoscaling
- [`k8s/configmap.yaml`](k8s/configmap.yaml) – Injects environment variables

Apply all resources:
```sh
kubectl apply -f k8s/
```

---

## Load Testing

Use the provided PowerShell script [`smartLink-LoadTest.ps1`](smartLink-LoadTest.ps1) to simulate traffic patterns and test HPA scaling.

---

