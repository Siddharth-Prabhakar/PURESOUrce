import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async validateGroundwaterData(data) {
    try {
      const prompt = `
        As an environmental scientist, analyze this groundwater heavy metal data for scientific accuracy and completeness:
        
        Data: ${JSON.stringify(data, null, 2)}
        
        Please evaluate:
        1. Metal concentration ranges (are they realistic for groundwater?)
        2. Location data accuracy (valid coordinates?)
        3. Data completeness and consistency
        4. Potential outliers or errors
        5. WHO/Indian standards compliance
        
        Provide assessment in this JSON format:
        {
          "quality_score": number (0-100),
          "overall_assessment": "detailed assessment text",
          "issues_found": ["list of specific issues"],
          "recommendations": ["list of recommendations"],
          "data_corrections": [
            {
              "location": "site name",
              "issue": "problem description", 
              "suggested_value": "corrected value",
              "confidence": "high/medium/low"
            }
          ],
          "compliance_status": {
            "who_standards": "compliant/non-compliant/partial",
            "indian_standards": "compliant/non-compliant/partial"
          }
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        quality_score: 75,
        overall_assessment: text,
        issues_found: [],
        recommendations: ["Manual review recommended"],
        data_corrections: [],
        compliance_status: {
          who_standards: "partial",
          indian_standards: "partial"
        }
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI validation service temporarily unavailable');
    }
  }

  async generateDataInsights(samples) {
    try {
      const prompt = `
        Analyze this groundwater dataset and provide scientific insights:
        
        Dataset: ${JSON.stringify(samples.slice(0, 10), null, 2)}
        Total samples: ${samples.length}
        
        Provide insights about:
        1. Overall contamination patterns
        2. Geographic risk distribution
        3. Most concerning metals
        4. Trend analysis
        5. Policy recommendations
        
        Format as JSON:
        {
          "key_findings": ["list of main findings"],
          "risk_assessment": "overall risk level and explanation",
          "priority_metals": ["metals of highest concern"],
          "geographic_patterns": "spatial distribution insights",
          "policy_recommendations": ["actionable recommendations"],
          "health_implications": "potential health impacts"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        key_findings: ["Analysis completed"],
        risk_assessment: text,
        priority_metals: [],
        geographic_patterns: "Requires further analysis",
        policy_recommendations: [],
        health_implications: "Consult environmental health experts"
      };
    } catch (error) {
      console.error('Gemini insights error:', error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();