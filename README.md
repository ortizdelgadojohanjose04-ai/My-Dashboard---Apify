# 📊 Apify Analytics Dashboard | Full-Stack Web App

<div align="center">
  <img src="https://github.com/ortizdelgadojohanjose04-ai.png" alt="Johan Ortiz" width="120" style="border-radius: 50%;" />
  <h3>Built by Johan Ortiz - Python Developer & Data Extraction Specialist</h3>
  <p>A production-ready web application for monitoring Apify Actors, tracking data extraction metrics, and managing financial performance.</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Apify](https://img.shields.io/badge/Apify-00A9E0?style=for-the-badge&logo=apify&logoColor=white)](https://apify.com/)
  [![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://developer.paypal.com/)
</div>

---

## 🚀 About the Project

This is a **Full-Stack Dashboard** built to solve a real-world problem: monitoring and managing a portfolio of web scrapers in production. 

I created this application to act as a centralized hub for my **12 production-ready Apify Actors**, allowing me to track their health, execution success rates, and financial performance (via PayPal API) in real-time.

## ✨ Key Features

*   **📈 Real-Time Metrics:** Connects directly to the Apify API to fetch live data on Actor runs, success rates, and health scores.
*   **💰 Financial Overview (Protected):** Integrates the official PayPal API to fetch real transaction data, revenue, and net profit.
*   **🔒 Admin Security:** Implements a custom cookie-based authentication system. Public users (recruiters) can view the dashboard metrics, but **only the admin (me)** can access the financial earnings tab via a secure token.
*   **🌙 Dark Mode:** Fully responsive UI with a seamless dark/light theme toggle using `next-themes`.
*   **🔍 Command Palette:** Press `Ctrl + K` to instantly search actors and navigate the app (built with `cmdk`).
*   **📊 Interactive Charts:** Beautiful, responsive area charts using `Recharts` to visualize run performance over time.

## 🛠️ Tech Stack

*   **Framework:** Next.js 16 (App Router) & React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS & Lucide React (Icons)
*   **APIs:** Apify REST API & PayPal REST API
*   **Deployment:** Vercel

## ⚙️ How to Run Locally

If you want to run this project on your own machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ortizdelgadojohanjose04-ai/My-Dashboard---Apify.git
   cd My-Dashboard---Apify
