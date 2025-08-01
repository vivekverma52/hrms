# HRMS Platform Wireframes
## Comprehensive Interface Design Specifications

---

## 🏠 **1. Main Dashboard Layout (Admin View)**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🏢 HRMS Logo] [Search Bar............] [🔔] [🌐 AR/EN] [👤 User Menu]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ NAVIGATION SIDEBAR                    │ MAIN CONTENT AREA                       │
├─────────────────────────────────────┬─────────────────────────────────────────┤
│ 📊 Dashboard                        │ KEY METRICS (4 columns)                │
│ 🏢 Company & Clients               │ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ 👥 Workforce Management            │ │Revenue  │ │Active   │ │Avg      │     │
│ 🚛 Fleet Management                │ │Growth   │ │Projects │ │Performance│   │
│ 📄 Smart Invoicing                 │ │+15.2%   │ │24       │ │94.2%    │     │
│ 💰 Payroll Management              │ └─────────┘ └─────────┘ └─────────┘     │
│ 🛡️ Compliance & Reports            │ ┌─────────┐                             │
│ ⚙️ Operations Department            │ │Employee │                             │
│ 💼 Finance Department               │ │Satisfaction│                          │
│ 👤 Human Resources                  │ │4.7/5.0  │                             │
│ 🔧 System Setup                     │ └─────────┘                             │
│ 👥 User Management                  │                                         │
│                                     │ ANALYTICS DASHBOARD (2 columns)        │
│ ────────────────────────────────    │ ┌─────────────────┐ ┌─────────────────┐ │
│ 🌐 Language: العربية                │ │Performance      │ │Financial        │ │
│ 🚪 Sign Out                         │ │Trends Chart     │ │Overview         │ │
│                                     │ │(Line/Bar)       │ │(Revenue/Costs)  │ │
│                                     │ └─────────────────┘ └─────────────────┘ │
│                                     │                                         │
│                                     │ RECENT ACTIVITIES & ALERTS              │
│                                     │ ┌─────────────────────────────────────┐ │
│                                     │ │ • Ahmed completed maintenance task  │ │
│                                     │ │ • New employee added to system      │ │
│                                     │ │ • Document expiry alert (15 days)  │ │
│                                     │ │ • Project status updated to 75%    │ │
│                                     │ └─────────────────────────────────────┘ │
└─────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 👤 **2. Employee Management Interface**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ EMPLOYEE MANAGEMENT                                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🔍 Search Employees...] [🏢 All Depts ▼] [📊 Active ▼] [+ Add Employee]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ EMPLOYEE GRID VIEW                                                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ [👤 Photo]      │ │ [👤 Photo]      │ │ [👤 Photo]      │ │ [👤 Photo]      │ │
│ │ Ahmed Al-Rashid │ │ Mohammad Hassan │ │ Ali Al-Mahmoud  │ │ Fatima Al-Zahra │ │
│ │ EMP001          │ │ EMP002          │ │ EMP003          │ │ EMP004          │ │
│ │ Site Supervisor │ │ Equipment Op.   │ │ Electrician     │ │ Safety Officer  │ │
│ │ 📍 Dhahran     │ │ 📍 Dhahran     │ │ 📍 Jubail      │ │ 📍 NEOM        │ │
│ │ 💰 35.00 SAR/h │ │ 💰 28.00 SAR/h │ │ 💰 32.00 SAR/h │ │ 💰 40.00 SAR/h │ │
│ │ 📊 95% Perf.   │ │ 📊 88% Perf.   │ │ 📊 90% Perf.   │ │ 📊 95% Perf.   │ │
│ │ 🟢 Active      │ │ 🟢 Active      │ │ 🟡 Doc Expiry  │ │ 🟢 Active      │ │
│ │ [👁️] [✏️] [📄] │ │ [👁️] [✏️] [📄] │ │ [👁️] [✏️] [📄] │ │ [👁️] [✏️] [📄] │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ EMPLOYEE DETAILS PANEL (Expandable)                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Personal Info │ Professional │ Documents │ Performance │ Financial │ Emergency  │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Name: Ahmed Al-Rashid (أحمد الراشد)                                        │ │
│ │ ID: EMP001 | Trade: Site Supervisor | Nationality: Saudi                   │ │
│ │ Phone: +966501234567 | Email: ahmed.rashid@HRMS.sa                       │ │
│ │ Hire Date: 2022-03-15 | Performance: 95% | Project: Aramco Facility       │ │
│ │ Documents: ✅ Iqama ⚠️ Passport (expires 90 days) ✅ Contract             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 **3. Financial Intelligence Dashboard**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ FINANCIAL INTELLIGENCE CENTER                                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [📅 Monthly ▼] [🏢 All Projects ▼] [💰 SAR] [📊 Export] [🔄 Refresh]          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ REAL-TIME PROFIT METRICS (5 columns)                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │💰 Revenue   │ │💸 Labor Cost│ │💎 Profit    │ │📈 Margin    │ │⚡ Efficiency│ │
│ │8.4M SAR     │ │6.4M SAR     │ │2.0M SAR     │ │23.8%        │ │94.2%        │ │
│ │+15.2% ↗️    │ │+8.3% ↗️     │ │+28.5% ↗️    │ │+2.1% ↗️     │ │+3.1% ↗️     │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ PROFIT ANALYSIS CHARTS (2 columns)                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ 5-WEEK PROFIT TREND             │ │ PROJECT PROFITABILITY BREAKDOWN         │ │
│ │ ┌─────────────────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │
│ │ │     📈 Revenue Line         │ │ │ │ Aramco Facility    │ 28.5% │ 🟢     │ │ │
│ │ │     📉 Cost Line            │ │ │ │ SABIC Construction │ 22.8% │ 🟡     │ │ │
│ │ │     💎 Profit Area          │ │ │ │ NEOM Infrastructure│ 31.2% │ 🟢     │ │ │
│ │ │ Week1 Week2 Week3 Week4 W5  │ │ │ │ Maintenance Proj   │ 18.5% │ 🔴     │ │ │
│ │ └─────────────────────────────┘ │ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ACTIONABLE INSIGHTS                                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 🎯 OPTIMIZATION OPPORTUNITIES                                                   │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚡ High Impact: Optimize NEOM project allocation (+150K SAR potential)      │ │
│ │ ⚠️ Alert: Ali Al-Mahmoud's Iqama expires in 15 days                        │ │
│ │ 🏆 Achievement: Zero safety incidents this month                            │ │
│ │ 💡 Recommendation: Increase Heavy Equipment Operator rates by 10-15%       │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 **4. Mobile Interface (Employee View)**

```
┌─────────────────────────────┐
│ HRMS Employee App         │
├─────────────────────────────┤
│ 👤 Ahmed Al-Rashid          │
│ EMP001 | Site Supervisor    │
│ 📍 Dhahran Complex          │
├─────────────────────────────┤
│ QUICK ACTIONS               │
├─────────────────────────────┤
│ ┌─────────┐ ┌─────────┐     │
│ │ 🕐 Clock│ │ 📋 Tasks│     │
│ │ In/Out  │ │ (3 New) │     │
│ └─────────┘ └─────────┘     │
│ ┌─────────┐ ┌─────────┐     │
│ │ 📸 Work │ │ 📄 Docs │     │
│ │ Progress│ │ (1 Exp) │     │
│ └─────────┘ └─────────┘     │
├─────────────────────────────┤
│ TODAY'S SUMMARY             │
├─────────────────────────────┤
│ ⏰ Hours: 8.5h (0.5h OT)    │
│ 📍 Location: Site A-1       │
│ 🎯 Tasks: 3/5 Complete      │
│ 📊 Performance: 95%         │
├─────────────────────────────┤
│ RECENT NOTIFICATIONS        │
├─────────────────────────────┤
│ 🔔 New task assigned        │
│ ⚠️ Safety briefing at 2PM   │
│ 📄 Document renewal due     │
├─────────────────────────────┤
│ [🏠] [📊] [📋] [📄] [⚙️]    │
└─────────────────────────────┘
```

---

## 🏢 **5. Project Management Interface**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ PROJECT MANAGEMENT DASHBOARD                                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🔍 Search Projects] [📊 Active ▼] [📅 This Month ▼] [+ New Project]          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ PROJECT OVERVIEW CARDS                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏗️ ARAMCO FACILITY MAINTENANCE                                              │ │
│ │ Client: Saudi Aramco | Location: Dhahran | Status: 🟢 Active               │ │
│ │ Progress: ████████████████░░░░ 75% | Budget: 1.2M SAR | Team: 45 workers   │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │ │
│ │ │💰 Revenue   │ │💸 Labor Cost│ │💎 Profit    │ │📈 Margin    │           │ │
│ │ │850K SAR     │ │620K SAR     │ │230K SAR     │ │27.1%        │           │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │ │
│ │ Next Milestone: Equipment inspection (Dec 20) | [📊 View] [✏️ Edit]        │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🏭 SABIC CONSTRUCTION SUPPORT                                               │ │
│ │ Client: SABIC Industries | Location: Jubail | Status: 🟡 Hold              │ │
│ │ Progress: ████████████░░░░░░░░ 60% | Budget: 850K SAR | Team: 32 workers   │ │
│ │ Issue: Weather delays | Follow-up: Dec 18, 2PM | [📞 Contact] [📋 Update] │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ PROJECT ANALYTICS                                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ RESOURCE ALLOCATION             │ │ PERFORMANCE METRICS                     │ │
│ │ ┌─────────────────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Supervisors    ████░ 80%    │ │ │ │ On-time Delivery    ████████ 92%   │ │ │
│ │ │ Operators      ██████ 95%   │ │ │ │ Quality Score       ███████░ 88%   │ │ │
│ │ │ Specialists    ███░░ 65%    │ │ │ │ Safety Compliance   ████████ 100%  │ │ │
│ │ │ Support Staff  ████░ 75%    │ │ │ │ Budget Adherence    ██████░░ 78%   │ │ │
│ │ └─────────────────────────────┘ │ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💰 **6. Smart Invoicing Interface (ZATCA Compliant)**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SMART INVOICING SYSTEM - ZATCA COMPLIANT                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🔍 Search Invoices] [📊 All Status ▼] [📅 This Month ▼] [+ New Invoice]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ INVOICE CREATION WIZARD                                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ STEP 1: CLIENT INFORMATION                                                  │ │
│ │ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐   │ │
│ │ │ Client Name (EN)    │ │ Client Name (AR)    │ │ VAT Number          │   │ │
│ │ │ [Ahmed Hassan....] │ │ │ [أحمد حسن........] │ │ │ [311279658100003] │   │ │
│ │ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ STEP 2: INVOICE ITEMS                                                       │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Description (AR) │ Qty │ Unit Price │ Net Amount │ VAT 15% │ Total     │ │ │
│ │ │ كوستر معدني (أ)   │ 1   │ 8,500 SAR  │ 8,500 SAR  │1,275 SAR│9,775 SAR │ │ │
│ │ │ خدمات إضافية      │ 1   │ 3,000 SAR  │ 3,000 SAR  │ 450 SAR │3,450 SAR │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │ [+ Add Item] [📋 Import from Project]                                       │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ STEP 3: TOTALS & QR CODE                                                    │ │
│ │ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐   │ │
│ │ │ Subtotal: 11,500 SAR│ │ VAT (15%): 1,725 SAR│ │ Total: 13,225 SAR   │   │ │
│ │ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘   │ │
│ │ ┌─────────────────────┐ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ [QR Code Preview]   │ │ ZATCA Compliance Status: ✅ Validated          │ │ │
│ │ │ ████████████████    │ │ Invoice Hash: 7A9F8E2D1C0B3A4F5E6D7C8B9A0F1E2D │ │ │
│ │ │ ████████████████    │ │ Digital Signature: ✅ Applied                   │ │ │
│ │ │ ████████████████    │ │ [📧 Send] [🖨️ Print] [💾 Save Draft]           │ │ │
│ │ └─────────────────────┘ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔔 **7. Notification Center Interface**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ADVANCED NOTIFICATION CENTER                                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🔍 Search notifications] [🔔 All ▼] [📅 Today ▼] [⚙️ Settings]               │
├─────────────────────────────────────────────────────────────────────────────────┤
│ REAL-TIME NOTIFICATION STREAM                                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 CRITICAL: Document Expiry Alert                           [2 min ago]    │ │
│ │ Ali Al-Mahmoud's Iqama expires in 15 days. Immediate renewal required.     │ │
│ │ 📧 Email ✅ | 📱 SMS ✅ | 🔔 Push ✅ | 💬 Slack ✅                          │ │
│ │ [🎯 Take Action] [👁️ Mark Read] [📋 Create Task]                            │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🟡 HIGH: Project Status Change                               [15 min ago]   │ │
│ │ SABIC Construction project status changed from Active to Hold               │ │
│ │ Reason: Weather delays | Next action: Resume when conditions improve       │ │
│ │ 📧 Email ✅ | 🔔 In-app ✅ | 💬 Slack ✅                                    │ │
│ │ [📊 View Project] [✏️ Update Status] [📞 Contact Team]                      │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🟢 MEDIUM: Payroll Processing Complete                      [1 hour ago]    │ │
│ │ December 2024 payroll processed: 186 employees, 2.45M SAR total            │ │
│ │ Payment date: December 25, 2024 | Processed by: HR Manager                 │ │
│ │ 📧 Email ✅ | 🔔 In-app ✅                                                   │ │
│ │ [📊 View Details] [📄 Download Report] [✅ Acknowledge]                     │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ NOTIFICATION ANALYTICS                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│ │📊 Total     │ │✅ Delivered │ │⚡ Avg Time  │ │❌ Failed    │               │
│ │247 Today    │ │98.2%        │ │1.2s         │ │1.8%         │               │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 **8. AI Optimization Dashboard**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ AI OPTIMIZATION & INTELLIGENCE CENTER                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [🧠 AI Models] [⚡ Real-time] [📊 Analytics] [⚙️ Configure]                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ AI PERFORMANCE METRICS                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│ │🎯 Accuracy  │ │⚡ Speed     │ │💡 Insights  │ │🔄 Optimization│              │
│ │99.2%        │ │<50ms        │ │24 Active    │ │15% Improvement│              │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │
├─────────────────────────────────────────────────────────────────────────────────┤
│ RESOURCE OPTIMIZATION RECOMMENDATIONS                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🎯 HIGH IMPACT OPTIMIZATION                                                 │ │
│ │ Reallocate 3 unassigned workers to NEOM project                            │ │
│ │ Expected Benefit: +150K SAR | Implementation Cost: 5K SAR | ROI: 2,900%    │ │
│ │ Confidence: 94% | Timeline: 3 days                                          │ │
│ │ [🚀 Implement] [📊 Analyze] [📋 Create Plan]                                │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 💰 PROFIT OPTIMIZATION                                                      │ │
│ │ Increase Heavy Equipment Operator rates by 12%                             │ │
│ │ Expected Benefit: +75K SAR | Market Analysis: 15% below market rate        │ │
│ │ Confidence: 87% | Timeline: 1 week                                          │ │
│ │ [📈 Implement] [📊 Market Analysis] [💬 Discuss]                            │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ PREDICTIVE ANALYTICS                                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ PROFIT FORECAST (Next 3 Months)│ │ RISK ASSESSMENT                         │ │
│ │ ┌─────────────────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Jan 2025: 2.8M SAR (92%)    │ │ │ │ 🟢 Low Risk: 12 projects           │ │ │
│ │ │ Feb 2025: 3.1M SAR (95%)    │ │ │ │ 🟡 Medium Risk: 8 projects          │ │ │
│ │ │ Mar 2025: 3.4M SAR (97%)    │ │ │ │ 🔴 High Risk: 2 projects            │ │ │
│ │ └─────────────────────────────┘ │ │ │ Overall Risk Score: 23/100 (Low)    │ │ │
│ │ Confidence: 89%                 │ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 **9. Mobile Responsive Layout (Tablet View)**

```
┌─────────────────────────────────────────────────────────────┐
│ HRMS - Tablet Interface                                   │
├─────────────────────────────────────────────────────────────┤
│ [☰] HRMS    [🔔3] [🌐] [👤 Ahmed]             │
├─────────────────────────────────────────────────────────────┤
│ DASHBOARD OVERVIEW                                          │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐                     │
│ │💰 Revenue       │ │👥 Workforce     │                     │
│ │8.4M SAR         │ │186 Active       │                     │
│ │+15.2% ↗️        │ │94.2% Utilized   │                     │
│ └─────────────────┘ └─────────────────┘                     │
│ ┌─────────────────┐ ┌─────────────────┐                     │
│ │📊 Projects      │ │⚡ Performance   │                     │
│ │24 Active        │ │87.5% Avg        │                     │
│ │75% Avg Progress │ │+3.2% ↗️         │                     │
│ └─────────────────┘ └─────────────────┘                     │
├─────────────────────────────────────────────────────────────┤
│ QUICK ACTIONS                                               │
├─────────────────────────────────────────────────────────────┤
│ [👥 Add Employee] [📊 Generate Report] [⚙️ Settings]       │
├─────────────────────────────────────────────────────────────┤
│ RECENT ACTIVITIES                                           │
├─────────────────────────────────────────────────────────────┤
│ • Project status updated (2 min ago)                       │
│ • New employee onboarded (1 hour ago)                      │
│ • Document expiry alert (3 hours ago)                      │
│ • Payroll processed successfully (1 day ago)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 **10. Login & Authentication Interface**

```
┌─────────────────────────────────────────────────────────────┐
│                    HRMS LOGIN                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────┐                           │
│              │   🏢 HRMS     │                           │
│              │   Al-Majmaah    │                           │
│              └─────────────────┘                           │
│                                                             │
│         أموجك المجمعة للعمليات والمقاولات العامة            │
│         Operations & General Contracting                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SIGN IN TO YOUR ACCOUNT                                     │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 👤 Username or Employee ID                              │ │
│ │ [admin...................................]              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔒 Password                                             │ │
│ │ [••••••••••••••••••••••••••••••••••] [👁️]              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ☑️ Remember me          Forgot password?                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │              🔐 SIGN IN                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ DEMO CREDENTIALS                                            │
├─────────────────────────────────────────────────────────────┤
│ [Admin] [HR Manager] [Operations] [Finance]                 │
├─────────────────────────────────────────────────────────────┤
│ 🛡️ Your session is protected with enterprise-grade         │
│ security and will timeout after 8 hours of inactivity     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 **11. Analytics & Reporting Interface**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ADVANCED ANALYTICS & REPORTING CENTER                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [📊 Dashboard] [👥 Workforce] [💰 Financial] [📈 Performance] [🔍 Custom]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ WORKFORCE ANALYTICS                                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ NATIONALITY DISTRIBUTION        │ │ PERFORMANCE HEATMAP                     │ │
│ │ ┌─────────────────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │
│ │ │ 🇸🇦 Saudi      45% ████████ │ │ │ │ Dept    │ Q1  │ Q2  │ Q3  │ Q4     │ │ │
│ │ │ 🇵🇰 Pakistani  25% █████    │ │ │ │ Ops     │🟢95 │🟢92 │🟡88 │🟢94    │ │ │
│ │ │ 🇪🇬 Egyptian   15% ███      │ │ │ │ Maint   │🟡87 │🟢91 │🟢93 │🟢89    │ │ │
│ │ │ 🇮🇳 Indian     10% ██       │ │ │ │ Safety  │🟢98 │🟢97 │🟢99 │🟢98    │ │ │
│ │ │ 🇾🇪 Yemeni      5% █        │ │ │ │ Admin   │🟢92 │🟡86 │🟢91 │🟢93    │ │ │
│ │ └─────────────────────────────┘ │ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ PROFIT TREND ANALYSIS           │ │ TOP PERFORMERS                          │ │
│ │ ┌─────────────────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │
│ │ │     📈 Revenue (Green)      │ │ │ │ 1. Ahmed Al-Rashid    95% 🏆       │ │ │
│ │ │     📉 Costs (Red)          │ │ │ │ 2. Fatima Al-Zahra   92% 🥈       │ │ │
│ │ │     💎 Profit (Blue)        │ │ │ │ 3. Mohammad Hassan   89% 🥉       │ │ │
│ │ │ ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐ │ │ │ │ 4. Ali Al-Mahmoud    87%          │ │ │
│ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ 5. Omar Al-Kindi     85%          │ │ │
│ │ │ └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘ │ │ │ └─────────────────────────────────────┘ │ │
│ │ │ Jan Feb Mar Apr May Jun     │ │ │ [📊 View All] [🏆 Rewards Program]     │ │
│ │ └─────────────────────────────┘ │ │                                         │ │
│ └─────────────────────────────────┘ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ EXPORT & SHARING OPTIONS                                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [📄 PDF Report] [📊 Excel Export] [📧 Email Report] [📅 Schedule Report]      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ **12. System Configuration Interface**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SYSTEM CONFIGURATION & SETTINGS                                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [⚙️ General] [🔔 Notifications] [🔐 Security] [🔌 Integrations] [👥 Users]    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ COMPANY SETTINGS                                                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ COMPANY INFORMATION                                                         │ │
│ │ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐   │ │
│ │ │ Company Name (EN)   │ │ Company Name (AR)   │ │ CR Number           │   │ │
│ │ │ [HRMS] │ │ │ [أموجك المجمعة]    │ │ │ [1010123456]      │   │ │
│ │ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘   │ │
│ │ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐   │ │
│ │ │ VAT Number          │ │ Working Days/Week   │ │ Overtime Rate       │   │ │
│ │ │ [300123456789003]   │ │ │ [6 days ▼]        │ │ │ [1.5x ▼]          │   │ │
│ │ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ INTEGRATION STATUS                                                          │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │ │
│ │ │ 🟢 ZATCA        │ │ 🟢 GOSI         │ │ 🟡 QIWA         │ │ 🔴 Banking  │ │ │
│ │ │ Connected       │ │ Connected       │ │ Configuring     │ │ Not Setup   │ │ │
│ │ │ Last sync: 2min │ │ Last sync: 5min │ │ Setup: 80%      │ │ [Configure] │ │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ NOTIFICATION PREFERENCES                                                    │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Document Expiry Alerts    [🔔 Enabled] [📧 Email] [📱 SMS] [90 days]   │ │ │
│ │ │ Project Status Changes    [🔔 Enabled] [📧 Email] [💬 Slack]            │ │ │
│ │ │ Payroll Notifications     [🔔 Enabled] [📧 Email] [🔔 In-app]           │ │ │
│ │ │ Safety Incidents          [🔔 Enabled] [📧 Email] [📱 SMS] [💬 Slack]   │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [💾 Save Settings] [🔄 Reset to Defaults] [📋 Export Config]                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Key Wireframe Features**

### **Design Principles**
- **Responsive Layout**: Adapts seamlessly from mobile to desktop
- **Bilingual Support**: Arabic and English with proper RTL layouts
- **Gradient Aesthetics**: Modern, professional visual design
- **Information Hierarchy**: Clear visual hierarchy with proper spacing
- **Accessibility**: WCAG 2.1 AA compliant design patterns

### **User Experience Highlights**
- **Intuitive Navigation**: Logical menu structure with breadcrumbs
- **Real-time Updates**: Live data refresh indicators
- **Quick Actions**: Prominent action buttons for common tasks
- **Smart Defaults**: Pre-filled forms with intelligent suggestions
- **Progressive Disclosure**: Expandable sections for detailed information

### **Technical Considerations**
- **Component Modularity**: Reusable UI components across interfaces
- **State Management**: Consistent data flow and state updates
- **Performance Optimization**: Lazy loading and efficient rendering
- **Security Integration**: Role-based UI element visibility
- **API Integration**: Seamless backend data integration

These wireframes provide a comprehensive blueprint for implementing the HRMS platform with **world-class user experience**, **cultural adaptation**, and **technical excellence**.