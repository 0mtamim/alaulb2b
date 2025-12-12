
import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAiClient = () => {
  if (aiInstance) return aiInstance;

  try {
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will run in mock mode.");
      aiInstance = new GoogleGenAI({ apiKey: 'DUMMY_KEY_FOR_SAFE_INIT' });
    } else {
      aiInstance = new GoogleGenAI({ apiKey });
    }
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI client", e);
    // Fallback dummy to prevent crashes
    aiInstance = new GoogleGenAI({ apiKey: 'DUMMY_KEY' }); 
  }
  return aiInstance;
};

const modelId = "gemini-2.5-flash";

/**
 * Simulate OCR and Document Verification for Registration
 */
export const verifyDocumentOCR = async (docType: string, expectedName: string): Promise<{ match: boolean, confidence: number, text: string }> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      match: true,
      confidence: 0.98,
      text: `OCR Scanned: ${docType} verified for entity ${expectedName}. Registration Number: CN-${Math.floor(Math.random() * 100000)}.`
    };
  } catch (e) {
    return { match: false, confidence: 0, text: "OCR Failed" };
  }
};

/**
 * Risk Assessment for New Registrations
 */
export const performRiskAssessment = async (data: any): Promise<{ riskLevel: 'Low' | 'Medium' | 'High', flags: string[] }> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isGenericEmail = data.email && (data.email.includes('gmail') || data.email.includes('yahoo'));
    if (isGenericEmail && data.role === 'seller') {
      return { riskLevel: 'High', flags: ['Generic Email Domain for Seller', 'Manual Review Required'] };
    }
    return { riskLevel: 'Low', flags: [] };
  } catch (e) {
    return { riskLevel: 'Medium', flags: ['Analysis Timeout'] };
  }
};

export const analyzeRFQ = async (text: string) => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Analyze this RFQ request: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { 
                            type: Type.STRING,
                            description: 'A brief summary of the RFQ.' 
                        },
                        category: { 
                            type: Type.STRING,
                            description: 'A suggested product category for the RFQ.'
                        },
                        suggestions: { 
                            type: Type.STRING,
                            description: 'Suggestions for the user to improve their RFQ for better quotes.'
                        },
                    },
                    required: ["summary", "category", "suggestions"]
                },
            },
        });
        const responseText = response.text;
        if (!responseText) {
          return { summary: "Analysis failed", category: "General", suggestions: "Received an empty response from the AI." };
        }
        const result = JSON.parse(responseText.trim());
        return result;
    } catch (e) {
        console.error("Error analyzing RFQ with Gemini:", e);
        return { summary: "Analysis failed", category: "General", suggestions: "Please add more details." };
    }
};

export const generateProductDescription = async (details: string) => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Write a professional B2B product description for: ${details}`,
        });
        return response.text || '';
    } catch (e) {
        return "High quality product meeting industry standards.";
    }
};

export const analyzeProductCompliance = async (description: string): Promise<{ compliant: boolean; issues: string[] }> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI thinking
    
    const restrictedKeywords = ['weapon', 'ivory', 'tobacco', 'replica'];
    const issues: string[] = [];
    
    restrictedKeywords.forEach(keyword => {
        if (description.toLowerCase().includes(keyword)) {
            issues.push(`Contains restricted keyword: "${keyword}"`);
        }
    });

    if (issues.length > 0) {
        return { compliant: false, issues };
    }
    
    return { compliant: true, issues: [] };
};

export const getMarketInsights = async (category: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        trend: 'up',
        priceChange: '+5.2%',
        topKeywords: ['Sustainable', 'Smart', 'Efficiency']
    };
};

export const negotiateAssistant = async (history: string[], newMessage: string) => {
    return "Tip: Ask about volume discounts for orders over 500 units.";
};

export const predictLogisticsDelay = async () => { return null; };
export const generateFranchiseMarketing = async () => { return null; };
export const generateFranchiseContract = async () => { return null; };
export const analyzeFinancialTrends = async () => { return null; };
export const generateEventConcept = async () => { return null; };

export const analyzeDocument = async (docType: string, entityName: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (docType.includes('License') || docType.includes('Business')) {
        return {
            valid: true,
            confidence: 0.98,
            extractedData: {
                "Entity Name": entityName || "Detected Company LLC",
                "Registration No": `CN-${Math.floor(10000000 + Math.random() * 90000000)}`,
                "Incorporation Date": "2018-05-12",
                "Address": "123 Innovation Drive, Shenzhen, China",
                "Legal Rep": "Zhang Wei"
            }
        };
    } else {
        return {
            valid: true,
            confidence: 0.95,
            extractedData: {
                "Full Name": "John Doe",
                "ID Number": `${Math.floor(100000000 + Math.random() * 900000000)}`,
                "DOB": "1985-08-20",
                "Nationality": "United States",
                "Expiry Date": "2028-08-20"
            }
        };
    }
};

export const analyzeProductListing = async (product: { title: string; category: string; description?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let issues = [];
    let suggestions = [];
    let qualityScore = 85;

    if (product.title.toLowerCase().includes('replica')) {
        issues.push("Prohibited keyword 'replica' found in title. Potential counterfeit item.");
        qualityScore -= 50;
    }
    if (product.title.toLowerCase().includes('luxury watch') && product.category === 'Watches') {
        issues.push("High-risk category 'Luxury Watches' requires brand authorization documents.");
        qualityScore -= 15;
    }
    if (qualityScore < 50) {
        suggestions.push("This item should likely be rejected due to multiple policy violations.");
    } else {
        suggestions.push("Add more detailed specifications to improve listing quality.");
    }

    return {
        qualityScore,
        issues,
        suggestions
    };
};

export const analyzeDispute = async () => { return null; };
export const analyzeSystemLog = async () => { return null; };
export const suggestCodeFix = async () => { return null; };

export const auditSupplier = async (supplierData: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
        score: 85,
        summary: "Supplier shows strong consistency in production but response times vary on weekends.",
        pros: ["Verified Business License", "5+ Years Active", "ISO Certified"]
    };
};

export const analyzeLogistics = async (origin: string, dest: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [
        { mode: 'Ocean Freight', transitTime: '25-30 Days', costEstimate: '$1,200', riskFactor: 'Low', carbonFootprint: 'Low' },
        { mode: 'Air Freight', transitTime: '3-5 Days', costEstimate: '$4,500', riskFactor: 'Low', carbonFootprint: 'High' }
    ];
};

export const assessCreditRisk = async (company: string, amount: number) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        riskLevel: 'Low',
        maxLimit: amount * 1.5,
        rationale: "Company has stable public records and verified trade history."
    };
};

export const calculateInsurancePremium = async (details: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const value = parseInt(details.value) || 10000;
    return {
        premium: value * 0.015,
        deductible: value * 0.05,
        riskFactors: ['International Route', 'Electronics Category']
    };
};

export const analyzeResume = async (jobDesc: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
        matchScore: 78,
        tips: "Highlight your experience with international logistics protocols.",
        missingSkills: ["SAP ERP", "Mandarin Basics"]
    };
};

export const analyzePrototypingFeasibility = async (desc: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
        feasibilityScore: 92,
        estimatedTimeline: "4-6 Weeks",
        challenges: ["Battery certification for shipping", "Mold tooling costs"]
    };
};

export const analyzeBuyerCredibility = async (buyerData: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
        riskLevel: 'Low',
        score: 88,
        reason: "Buyer has a verified payment history on platform and validated corporate registration."
    };
};

export const calculateBuyerMatch = async (supplierProfile: string, buyerNeeds: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        score: 95,
        reason: "Strong match on industry (Electronics) and volume capacity."
    };
};
