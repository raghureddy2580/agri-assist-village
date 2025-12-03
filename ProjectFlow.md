# Agri-Assist (Vishwachinnapor) - Project Flow

## Main Application Flow

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   Login/    │────►│  Dashboard  │
│  Register   │     └──────┬──────┘
└─────────────┘            │
                           ▼
            ┌─────────────────────────────┐
            │        Main Features        │
            └──────┬──────────────┬───────┘
                   │              │
                   ▼              ▼
        ┌─────────────┐    ┌─────────────┐
        │  Labor      │    │ Marketplace │
        │ Management  │    │   System    │
        └──────┬──────┘    └──────┬──────┘
               │                 │
               ▼                 ▼
        ┌─────────────┐    ┌─────────────┐
        │ Post Jobs   │    │ List        │
        │ Hire Workers│    │ Products    │
        └─────────────┘    │ Buy/Sell    │
                           └──────┬──────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │  Checkout   │
                           │  Payment    │
                           └──────┬──────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │Order Confirm│
                           └─────────────┘

┌─────────────────────────────────────────────────┐
│              Supporting Features               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Weather Widget ──► Real-time forecasts        │
│                                                 │
│  Plant Scanner ──► AI disease detection         │
│                                                 │
│  Smart Alerts ──► Notifications & updates       │
│                                                 │
│  Knowledge Hub ──► Educational content          │
│                                                 │
│  Multi-language ──► English/Hindi/Punjabi       │
│                                                 │
└─────────────────────────────────────────────────┘
```

## User Journey Flow

### Farmer User Flow:
1. **Register/Login** → Access platform
2. **Check Weather** → Plan farming activities
3. **Scan Plants** → Detect diseases early
4. **Post Jobs** → Hire labor when needed
5. **List Produce** → Sell directly to buyers
6. **Monitor Alerts** → Stay updated on market/govt info

### Laborer User Flow:
1. **Create Profile** → Register skills & availability
2. **Browse Jobs** → Find suitable work
3. **Apply for Jobs** → Submit applications
4. **Get Hired** → Work with farmers
5. **Complete Tasks** → Earn and get reviews

### Buyer User Flow:
1. **Browse Marketplace** → View farmer listings
2. **Select Products** → Add to cart
3. **Negotiate Prices** → Direct communication
4. **Place Orders** → Secure checkout
5. **Track Delivery** → Receive products

## Data Flow Architecture

```
External APIs → Agri-Assist App → User Interface
     ▲                ▲                │
     │                │                ▼
Weather Data ←── Processing ←── User Actions
SMS Alerts   ←── Notifications ←── System Events
Location     ←── Geolocation ←── User Location
```

## Key Features Summary

- **Labor Management**: Job posting, worker matching, hiring
- **Crop Protection**: AI-powered plant disease detection
- **Direct Marketplace**: Farmer-to-buyer trading platform
- **Weather Intelligence**: Real-time forecasts and planning
- **Smart Notifications**: Alerts for weather, pests, markets
- **Educational Hub**: Farming knowledge and best practices
- **Multi-language**: Support for regional languages

## Technology Stack Flow

```
React + TypeScript → Vite Build → Web App
         │
         ▼
Tailwind CSS + Shadcn/ui → Responsive UI
         │
         ▼
React Router + Context API → Navigation & State
         │
         ▼
Axios + External APIs → Data Integration