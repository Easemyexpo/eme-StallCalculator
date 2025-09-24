import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAIResponse(
  userMessage: string,
  context: {
    currentStep: string;
    formData: any;
    completedSteps: string[];
  }
): Promise<string> {
  try {
    const systemPrompt = `You are an expert exhibition and trade show planning assistant for EaseMyExpo. 
    
Current context:
- User is on step: ${context.currentStep}
- Completed steps: ${context.completedSteps.join(', ')}
- Exhibition: ${context.formData?.exhibitionName || 'Not specified'}
- Industry: ${context.formData?.industry || 'Not specified'}
- Location: ${context.formData?.destinationCity || 'Not specified'}
- Booth size: ${context.formData?.boothSize || context.formData?.customSize || 'Not specified'} sqm
- Team size: ${context.formData?.teamSize || 'Not specified'}
- Budget considerations: Focus on Indian market pricing in INR

Provide helpful, specific advice about exhibition planning, cost optimization, vendor selection, booth design, travel planning, and industry best practices. Keep responses concise but informative. Always include actionable insights when possible.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try asking your question differently.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm experiencing technical difficulties. Please try your question again in a moment.";
  }
}

export async function generateContextualSuggestions(
  context: {
    currentStep: string;
    formData: any;
    completedSteps: string[];
  }
): Promise<string[]> {
  try {
    const prompt = `Based on the current exhibition planning context:
- Step: ${context.currentStep}
- Industry: ${context.formData?.industry || 'Not specified'}
- Location: ${context.formData?.destinationCity || 'Not specified'}

Generate 3 short, specific questions (max 8 words each) that users commonly ask at this stage of exhibition planning. Focus on practical, actionable questions.

Format as JSON array: ["question1", "question2", "question3"]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || result.questions || [];
  } catch (error) {
    console.error("Error generating suggestions:", error);
    // Fallback suggestions based on current step
    const fallbackSuggestions = {
      'Details': ['What booth size do I need?', 'How to choose exhibition location?', 'Industry-specific booth requirements?'],
      'Stall Design': ['Best materials for my budget?', 'How to maximize booth appeal?', 'What design elements work best?'],
      'Flights': ['When to book for best prices?', 'Group booking discounts available?', 'Best airlines for business travel?'],
      'Hotels': ['How close should hotel be?', 'Business vs luxury worth it?', 'Group accommodation discounts?'],
      'Quote': ['How to present to management?', 'What costs can be reduced?', 'ROI calculation methods?']
    };
    return fallbackSuggestions[context.currentStep as keyof typeof fallbackSuggestions] || 
           ['How to optimize costs?', 'Industry best practices?', 'Next steps recommendations?'];
  }
}