# SparkHub (BidBuddy) System Architecture

This document describes the high-level system architecture of the SparkHub platform and clarifies deployment requirements for AI screening.

## 1. High-Level Architecture
SparkHub is designed as a modern, decoupled web application.

- **Frontend:** React.js, Vite, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **AI Integration:** Google Gemini 2.0 Flash API (via Node.js backend)
- **Blockchain Anchoring:** Algorand Testnet (via AlgoKit)

## 2. Artificial Intelligence (AI & Voice)
**Critical Note for Evaluators:** We do **NOT** deploy any custom machine learning models (e.g., PyTorch, TensorFlow, HuggingFace containers). 

All AI capabilities, including the Retrieval-Augmented Generation (RAG) and Voice Bot intents, are routed directly from the Node.js backend to the **Google Gemini API**. This design choice provides:
- Zero infrastructure overhead for ML models.
- Enterprise-grade reliability and latency.
- State-of-the-art reasoning via Gemini 2.0 Flash.

The RAG logic is handled through Javascript within the backend service (`ragService.js`); documents are chunked and embedded via API request.

## 3. Blockchain Integration
We utilize the Algorand Testnet to anchor project briefs, ensuring an immutable "Living Brief" that freelancers can trust.
- **Smart Contract App ID:** 756282697
- When a client creates a project, the brief is hashed and the SHA-256 fingerprint is stored on-chain.
- The UI contains direct links to the Lora Testnet Explorer for verification.

## 4. Internationalization
The `react-i18next` library provides frontend internationalization. Sparky (the Voice AI) reads the active UI language state to determine how it listens and processes audio context, enabling real-time Kannada Voice commands that the backend Gemini API inherently understands without translation middleware.
