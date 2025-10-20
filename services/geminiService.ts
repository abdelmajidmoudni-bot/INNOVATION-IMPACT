import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (fieldName: string, context: any): string => {
    const { proposition, currentValue, ...restContext } = context;

    let basePrompt = `You are an expert in project proposal management for non-profit organizations. Your task is to help fill out a project management form.
The response should be just the text for the field, without any preamble or explanation. The response must be in French.`;

    let specificInstruction = `Based on the provided context, please generate a concise and relevant suggestion for the "${fieldName}" field.`;
    
    // Specific prompts for better results
    switch (fieldName) {
        case 'description_contexte':
            specificInstruction = `Rédige une description du contexte et de la problématique pour la proposition de projet : ${context.nom_projet || 'Nouvelle proposition'}.
            Porteur: ${context.porteur || 'Non défini'}.
            Zone d'intervention: ${context.zone_intervention || 'Non définie'}.
            Année: ${context.annee || 'Non définie'}.`;
            break;
        case 'defis_identifies':
            specificInstruction = `Liste les principaux défis identifiés pour la proposition de projet "${context.proposition.nom_projet}" en te basant sur le contexte suivant : ${context.proposition.description_contexte}. Réponds avec une liste à puces.`;
            break;
        case 'justification':
            specificInstruction = `Rédige une justification pour la proposition de projet "${context.proposition.nom_projet}" en te basant sur le contexte et les défis identifiés.`;
            break;
        case 'formulation_long_terme':
            specificInstruction = `Formule une vision à long terme (impact) pour la proposition de projet "${context.proposition.nom_projet}".`;
            break;
        case 'hypotheses_clefs':
            specificInstruction = `Énumère les hypothèses clés sur lesquelles repose la théorie du changement du projet, en te basant sur sa vision : "${context.formulation_long_terme}".`;
            break;
        case 'intitule_activite':
            specificInstruction = `Propose un intitulé clair et concis pour une activité qui contribuera au résultat suivant : "${context.resultat?.formulation_resultat}".`;
            break;
    }

    let prompt = `${basePrompt}\n\n${specificInstruction}`;

    if (proposition) {
        prompt += `\n\nProposal Information:\n${JSON.stringify(proposition, null, 2)}`;
    }
    
    if (Object.keys(restContext).length > 0) {
        prompt += `\n\nForm Information:\n${JSON.stringify(restContext, null, 2)}`;
    }

    if (currentValue) {
        prompt += `\n\nImprove or complete the current value: "${currentValue}"`;
    }

    return prompt;
};

export const generateContentForField = async (fieldName: string, context: any): Promise<string> => {
    const prompt = generatePrompt(fieldName, context);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        return text ? text.trim() : '';
    } catch (error) {
        console.error("Error generating content from Gemini API:", error);
        return "Erreur lors de la génération de contenu. Veuillez réessayer.";
    }
};