import { api } from './api';

export interface ExtractedImageItem {
    id: string;
    target_text: string;
    phonetic: string;
    meaning: string;
    example_sentence: string;
    category: string;
}

export interface ImageOCRResponse {
    source_type: string;
    title: string;
    target_language: string;
    comfortable_language: string;
    extracted_count: number;
    items: ExtractedImageItem[];
}

export const imageLearnService = {
    async analyzeSample(sampleType: string): Promise<ImageOCRResponse> {
        try {
            return await api.post<ImageOCRResponse>('/ocr/analyze/', { sample_type: sampleType });
        } catch (err) {
            return {
                source_type: sampleType,
                title: "Restaurant Menu 📋",
                target_language: "Hindi",
                comfortable_language: "English",
                extracted_count: 2,
                items: [
                    {
                        id: "item_1",
                        target_text: "स्वादिष्ट मसाला डोसा",
                        phonetic: "Swadisht Masala Dosa",
                        meaning: "Crispy savory crepe filled with spiced potatoes",
                        example_sentence: "मुझे एक मसाला डोसा चाहिए।",
                        category: "Food"
                    },
                    {
                        id: "item_2",
                        target_text: "गर्म अदरक चाय",
                        phonetic: "Garam Adrak Chai",
                        meaning: "Hot ginger spiced milk tea",
                        example_sentence: "एक कप गर्म चाय लाइए।",
                        category: "Beverage"
                    }
                ]
            };
        }
    },

    saveVocabularyWord(word: ExtractedImageItem): void {
        const saved = JSON.parse(localStorage.getItem('lingopath_saved_vocab') || '[]');
        if (!saved.some((item: any) => item.id === word.id)) {
            saved.push(word);
            localStorage.setItem('lingopath_saved_vocab', JSON.stringify(saved));
        }
    },

    getSavedVocabulary(): ExtractedImageItem[] {
        return JSON.parse(localStorage.getItem('lingopath_saved_vocab') || '[]');
    }
};
