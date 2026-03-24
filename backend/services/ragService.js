const ProjectDocument = require('../models/ProjectDocument');
const axios = require('axios');

class RAGService {
    async searchDocuments(projectId, queryEmbedding, topK = 5) {
        try {
            const documents = await ProjectDocument.find({
                projectId,
                isLatestVersion: true,
                embeddingStatus: 'completed'
            });

            if (!documents.length) return { success: false, results: [] };

            const chunks = [];
            for (let doc of documents) {
                for (let chunk of doc.chunks) {
                    if (chunk.embeddings && chunk.embeddings.length > 0) {
                        const similarity = this.cosineSimilarity(queryEmbedding, chunk.embeddings);
                        chunks.push({
                            documentId: doc._id,
                            fileName: doc.fileName,
                            text: chunk.text,
                            similarity
                        });
                    }
                }
            }

            chunks.sort((a, b) => b.similarity - a.similarity);
            const results = chunks.slice(0, topK);

            return {
                success: true,
                results: results.map(r => ({
                    fileName: r.fileName,
                    snippet: r.text.substring(0, 500),
                    similarity: r.similarity.toFixed(3)
                }))
            };
        } catch (error) {
            console.error('RAG search error:', error);
            throw error;
        }
    }

    async generateAnswer(projectId, query, retrievedContext) {
        try {
            const contextText = retrievedContext.map(r => `Document: ${r.fileName}\nContext: ${r.snippet}`).join('\n\n');
            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

            if (GEMINI_API_KEY) {
                try {
                    const response = await axios.post(
                        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                        {
                            contents: [{
                                parts: [{
                                    text: `You are an expert project assistant. Based on this project context:\n\n${contextText}\n\nAnswer the user query: "${query}"\n\nBe professional and concise.`
                                }]
                            }]
                        },
                        { timeout: 10000 }
                    );
                    const aiAnswer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (aiAnswer) {
                        return {
                            answer: aiAnswer.trim(),
                            citations: retrievedContext.map(r => r.fileName)
                        };
                    }
                } catch (e) {
                    console.warn('Gemini RAG failed, using fallback');
                }
            }

            return {
                answer: `Based on the project files (${retrievedContext[0]?.fileName}), here is what I found: ${retrievedContext[0]?.snippet}`,
                citations: [retrievedContext[0]?.fileName]
            };
        } catch (error) {
            console.error('Answer generation error:', error);
            throw error;
        }
    }

    async handleMultimodalQuery(projectId, userInput, inputType = 'text', language = 'en') {
        try {
            const queryEmbedding = await this.getQueryEmbedding(userInput);
            const searchResults = await this.searchDocuments(projectId, queryEmbedding);

            if (!searchResults.success || !searchResults.results.length) {
                return {
                    success: false,
                    answer: "I couldn't find relevant project documentation for that query."
                };
            }

            const answerResult = await this.generateAnswer(projectId, userInput, searchResults.results);

            return {
                success: true,
                answer: answerResult.answer,
                citations: answerResult.citations
            };
        } catch (error) {
            console.error('Multimodal query error:', error);
            throw error;
        }
    }

    async getQueryEmbedding(query) {
        // Placeholder embedding logic
        return Array(1536).fill(0).map(() => Math.random());
    }

    cosineSimilarity(vec1, vec2) {
        const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
        const mag1 = Math.sqrt(vec1.reduce((s, v) => s + v * v, 0));
        const mag2 = Math.sqrt(vec2.reduce((s, v) => s + v * v, 0));
        return (mag1 && mag2) ? (dotProduct / (mag1 * mag2)) : 0;
    }
}

module.exports = new RAGService();


module.exports = new RAGService();
