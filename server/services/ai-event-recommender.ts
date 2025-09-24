import OpenAI from "openai";
import { EventRecommendationRequest, EventRecommendation, AIRecommendationResponse } from "@shared/schema";
import { Exhibition, INDIAN_EXHIBITIONS } from "@shared/exhibitions-data";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class AIEventRecommender {
  async getEventRecommendations(request: EventRecommendationRequest): Promise<AIRecommendationResponse> {
    try {
      // Get relevant exhibitions from our database
      const relevantExhibitions = this.filterExhibitionsByRequest(request);
      
      // Create a comprehensive prompt for OpenAI
      const prompt = this.buildRecommendationPrompt(request, relevantExhibitions);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert exhibition and trade show consultant with deep knowledge of Indian and global markets. Your role is to analyze user requirements and recommend the most suitable events based on their industry, budget, goals, and experience level. Provide practical, actionable recommendations that maximize ROI and business opportunities."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Validate and enhance the AI response with our local data
      return this.enhanceAIResponse(result, relevantExhibitions, request);
      
    } catch (error) {
      console.error("AI Event Recommender Error:", error);
      // Fallback to rule-based recommendations if AI fails
      return this.getFallbackRecommendations(request);
    }
  }

  private filterExhibitionsByRequest(request: EventRecommendationRequest): Exhibition[] {
    return INDIAN_EXHIBITIONS.filter((exhibition: Exhibition) => {
      // Filter by industry
      if (request.industry && !exhibition.industry.includes(request.industry)) {
        return false;
      }
      
      // Filter by location if specified
      if (request.location && !exhibition.city.toLowerCase().includes(request.location.toLowerCase())) {
        return false;
      }
      
      // Filter by budget if specified - use estimated cost from pricing
      const estimatedCost = parseInt(exhibition.stallPricing.shellScheme.replace(/[₹,]/g, '').split('-')[0]) * 18; // Estimate for 18sqm
      if (request.budget && estimatedCost > request.budget * 1.5) {
        return false;
      }
      
      return true;
    });
  }

  private buildRecommendationPrompt(request: EventRecommendationRequest, exhibitions: Exhibition[]): string {
    return `
Based on the following user requirements, recommend the most suitable trade shows/exhibitions from the provided list:

USER REQUIREMENTS:
- Industry: ${request.industry}
- Location Preference: ${request.location || "Any"}
- Budget Range: ${request.budget ? `₹${request.budget.toLocaleString()}` : "Not specified"}
- Team Size: ${request.teamSize || "Not specified"}
- Company Size: ${request.companySize || "Not specified"}
- Experience Level: ${request.experience || "Not specified"}
- Goals: ${request.goals?.join(", ") || "General business growth"}
- Timeline: ${request.timeline || "Next 6-12 months"}

AVAILABLE EXHIBITIONS:
${exhibitions.map(ex => `
- Name: ${ex.name}
- Industry: ${ex.industry.join(", ")}
- Location: ${ex.city}, ${ex.state}
- Dates: ${ex.dates.map(d => `${d.startDate} to ${d.endDate}`).join(", ")}
- Venue: ${ex.venue}
- Expected Visitors: ${ex.expectedVisitors}
- Stall Pricing: ${ex.stallPricing.shellScheme}
- Description: ${ex.description}
`).join("\n")}

Please analyze these requirements and exhibitions, then provide recommendations in the following JSON format:

{
  "recommendations": [
    {
      "id": "exhibition_id",
      "name": "Exhibition Name",
      "description": "Brief description focusing on why it matches user needs",
      "industry": "Primary industry",
      "location": "City, State",
      "dates": "Event dates",
      "venue": "Venue name",
      "expectedVisitors": number,
      "averageBoothCost": number,
      "relevanceScore": number (0-100),
      "reasons": ["reason 1", "reason 2", "reason 3"],
      "benefits": ["benefit 1", "benefit 2", "benefit 3"],
      "competitorPresence": "low|medium|high",
      "roiPotential": "low|medium|high",
      "difficulty": "beginner|intermediate|advanced",
      "website": "website_url_if_available"
    }
  ],
  "reasoning": "Overall explanation of recommendations and strategy",
  "totalCount": number,
  "confidence": number (0-100)
}

Prioritize exhibitions that:
1. Closely match the user's industry
2. Fit within their budget constraints
3. Are appropriate for their experience level
4. Align with their stated goals
5. Offer good ROI potential

Provide 3-5 top recommendations ranked by relevance score.
`;
  }

  private enhanceAIResponse(aiResult: any, exhibitions: Exhibition[], request: EventRecommendationRequest): AIRecommendationResponse {
    // Validate and enhance AI recommendations with actual exhibition data
    const enhancedRecommendations: EventRecommendation[] = [];
    
    if (aiResult.recommendations && Array.isArray(aiResult.recommendations)) {
      for (const rec of aiResult.recommendations) {
        // Find matching exhibition from our data
        const matchingExhibition = exhibitions.find(ex => 
          ex.name.toLowerCase().includes(rec.name?.toLowerCase()) ||
          rec.name?.toLowerCase().includes(ex.name.toLowerCase())
        );
        
        if (matchingExhibition) {
          const estimatedCost = parseInt(matchingExhibition.stallPricing.shellScheme.replace(/[₹,]/g, '').split('-')[0]) * 18;
          const visitorCount = parseInt(matchingExhibition.expectedVisitors.replace(/[,+]/g, '')) || 0;
          
          enhancedRecommendations.push({
            id: matchingExhibition.id || rec.id || `rec_${Date.now()}_${Math.random()}`,
            name: matchingExhibition.name,
            description: rec.description || matchingExhibition.description,
            industry: matchingExhibition.industry[0] || rec.industry,
            location: `${matchingExhibition.city}, ${matchingExhibition.state}`,
            dates: matchingExhibition.dates.map(d => `${d.startDate} to ${d.endDate}`).join(", "),
            venue: matchingExhibition.venue || rec.venue,
            expectedVisitors: visitorCount,
            averageBoothCost: estimatedCost,
            relevanceScore: rec.relevanceScore || 85,
            reasons: rec.reasons || [],
            benefits: rec.benefits || [],
            competitorPresence: rec.competitorPresence || "medium",
            roiPotential: rec.roiPotential || "medium",
            difficulty: rec.difficulty || "intermediate",
            website: matchingExhibition.website || rec.website,
          });
        }
      }
    }
    
    return {
      recommendations: enhancedRecommendations,
      reasoning: aiResult.reasoning || "Recommendations based on industry match and business goals",
      totalCount: enhancedRecommendations.length,
      confidence: aiResult.confidence || 80,
    };
  }

  private getFallbackRecommendations(request: EventRecommendationRequest): AIRecommendationResponse {
    // Rule-based fallback when AI is unavailable
    const relevantExhibitions = this.filterExhibitionsByRequest(request);
    
    const recommendations: EventRecommendation[] = relevantExhibitions.slice(0, 3).map((ex: Exhibition, index: number) => {
      const estimatedCost = parseInt(ex.stallPricing.shellScheme.replace(/[₹,]/g, '').split('-')[0]) * 18;
      const visitorCount = parseInt(ex.expectedVisitors.replace(/[,+]/g, '')) || 0;
      
      return {
        id: ex.id || `fallback_${Date.now()}_${index}`,
        name: ex.name,
        description: ex.description,
        industry: ex.industry[0],
        location: `${ex.city}, ${ex.state}`,
        dates: ex.dates.map(d => `${d.startDate} to ${d.endDate}`).join(", "),
        venue: ex.venue,
        expectedVisitors: visitorCount,
        averageBoothCost: estimatedCost,
        relevanceScore: 75 - (index * 5), // Decreasing score
        reasons: [`Matches your ${request.industry} industry`, "Established event with good attendance", "Suitable for business networking"],
        benefits: ["Industry-focused audience", "Networking opportunities", "Brand visibility"],
        competitorPresence: "medium",
        roiPotential: "medium",
        difficulty: "intermediate",
        website: ex.website,
      };
    });
    
    return {
      recommendations,
      reasoning: "Recommendations based on industry matching and basic filtering criteria",
      totalCount: recommendations.length,
      confidence: 70,
    };
  }
}

export const aiEventRecommender = new AIEventRecommender();