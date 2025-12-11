
# TradeGenius Registration Specifications

## 1. Human-Readable Registration Flows

### Buyer Role — Streamlined Sourcing Flow
*   **Step 1: Account Basics**
    *   **Purpose:** Create login credentials and establish contact channel.
    *   **Fields:** `full_name`, `email` (Business preferred), `password`, `phone`.
    *   **Verification:** Email verification link sent immediately.
*   **Step 2: Sourcing Profile (Progressive)**
    *   **Purpose:** Personalize the AI feed and supplier recommendations.
    *   **Fields:** `interested_categories` (Multi-select), `sourcing_volume` (Dropdown), `shipping_country`.
*   **Step 3: Company Details (Optional for "Verified Buyer" Badge)**
    *   **Purpose:** Increases trust with suppliers for credit terms.
    *   **Fields:** `company_name`, `tax_id`, `business_license` (Upload).
*   **UX Notes:** "Skip for now" available on Step 3. Social login (LinkedIn) auto-fills Steps 1 & 3.

### Seller Role — High-Trust Verification Flow
*   **Step 1: Credentials & Contact**
    *   **Purpose:** Secure account and verify human owner.
    *   **Fields:** `email` (Corporate domain required), `phone_mobile` (OTP Required), `password`.
*   **Step 2: Business Registration**
    *   **Purpose:** Legal entity verification.
    *   **Fields:** `company_legal_name`, `registration_number`, `year_established`, `business_type`.
*   **Step 3: Operations Profile**
    *   **Purpose:** Supplier matching logic.
    *   **Fields:** `main_categories`, `factory_location`, `min_order_quantity`, `production_lead_time`.
*   **Step 4: Compliance & KYC**
    *   **Purpose:** Fraud prevention.
    *   **Documents:** Business License (PDF), Tax Certificate, ID Proof of Owner, Bank Statement header.
*   **Admin State:** Account created -> `status: pending_verification`.

### Franchise Partner Role — Investment Vetting Flow
*   **Step 1: Application Basics**
    *   **Purpose:** Lead capture.
    *   **Fields:** `full_name`, `email`, `phone`, `current_role`.
*   **Step 2: Territory & Capacity**
    *   **Purpose:** Assess strategic fit.
    *   **Fields:** `target_territory`, `warehouse_space`, `investment_budget` ($50k-$200k+).
*   **Step 3: Financial Proof**
    *   **Purpose:** Proof of funds (POF).
    *   **Documents:** Bank letter or audited financials (PDF).
*   **Step 4: Interview Booking**
    *   **Action:** Calendar booking for franchise onboarding call.

---

## 2. JSON Schemas (Data Models)

### Buyer Schema
```json
{
  "role": "buyer",
  "account": {
    "email": "user@example.com",
    "phone": "+15550000000",
    "is_verified": false
  },
  "profile": {
    "full_name": "Jane Doe",
    "sourcing_interests": ["electronics", "home_garden"],
    "shipping_country": "US"
  },
  "company_info": {
    "name": "JD Retail LLC",
    "tax_id": "EIN-123",
    "verification_status": "pending" 
  }
}
```

### Seller Schema
```json
{
  "role": "seller",
  "status": "under_review", 
  "account": {
    "email": "sales@factory.com",
    "phone": "+8613900000000",
    "contact_person": "Zhang Wei"
  },
  "business_entity": {
    "legal_name": "Wei Manufacturing Ltd",
    "reg_number": "CN-98765",
    "type": "manufacturer",
    "year_est": 2010
  },
  "operations": {
    "categories": ["machinery"],
    "moq_range": "100-500",
    "lead_time_days": 15
  },
  "compliance_docs": {
    "business_license_url": "s3://...",
    "id_proof_url": "s3://..."
  }
}
```

---

## 3. Admin Workflow & Notifications

### Admin State Machine (Seller Context)
1.  **Submitted:** User completes Step 4. Triggers `auto_ocr_check`.
2.  **OCR Processing:** System validates Company Name on Form matches PDF.
    *   *Match:* Move to `Under Review`.
    *   *Mismatch:* Auto-move to `Needs More Info`.
3.  **Under Review:** Manual Admin checks bank headers and blacklist databases (OFAC/Sanctions).
4.  **Outcomes:** `Approved` (Activates dashboard), `Rejected` (Fraud suspected), `Needs Info` (Blurry docs).

### Notification Templates
*   **Verification Email:** "Your verification code is **8920**. Expires in 10 minutes."
*   **Approval:** "Congratulations, [Company Name]. Your documents have been verified. Access your Supplier Dashboard now."
*   **Rejection/Info:** "We need clarification. The Business License upload was unreadable. Please re-upload."

---

## 4. Security & Compliance Checklist

*   **Data Privacy (GDPR/CCPA):**
    *   [ ] Explicit consent checkbox for data processing.
    *   [ ] "Right to be Forgotten" mechanism.
    *   [ ] Private S3 bucket with strict IAM policies for KYC docs.
*   **Encryption:**
    *   [ ] AES-256 encryption for documents at rest.
    *   [ ] TLS 1.3 for data in transit.
    *   [ ] Passwords hashed using Bcrypt/Argon2.
*   **Fraud Prevention:**
    *   [ ] Rate limiting on OTP generation.
    *   [ ] Corporate domain enforcement for Sellers.
    *   [ ] Sanctions List Screening (OFAC).
