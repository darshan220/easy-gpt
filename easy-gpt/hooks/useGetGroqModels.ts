import axios from "axios";
import { useState } from "react";
import { appConfig } from "@/config/app.config";

interface GroqModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

interface GroqModelsResponse {
  object: string;
  data: GroqModel[];
}

export const useGetGroqModels = () => {
  const [models, setModels] = useState<GroqModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<GroqModelsResponse>(
        "https://api.groq.com/openai/v1/models",
        {
          headers: {
            "Authorization": `Bearer ${appConfig.groqApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setModels(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error("Failed to fetch Groq models");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { models, loading, error, fetchModels };
};
