import {
    LingoBotCustomization,
    DEFAULT_CUSTOMIZATION,
    CUSTOMIZATION_ITEMS,
    CustomizationItem,
    LearnedCustomizationWord,
    ItemCategory
} from '../types/lingobot';

const STORAGE_KEY = 'lingopath_lingobot_customization';
const LEARNED_WORDS_KEY = 'lingopath_lingobot_learned_words';
const UNLOCKED_ITEMS_KEY = 'lingopath_lingobot_unlocked_items';
const EVENT_NAME = 'lingobot_customization_changed';

export const lingoBotService = {
    getCustomization(): LingoBotCustomization {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...DEFAULT_CUSTOMIZATION, ...parsed };
            }
        } catch (e) {
            console.warn('Failed to parse saved LingoBot customization', e);
        }
        return { ...DEFAULT_CUSTOMIZATION };
    },

    saveCustomization(customization: LingoBotCustomization): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
            window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: customization }));
        } catch (e) {
            console.warn('Failed to save LingoBot customization', e);
        }
    },

    resetToDefault(): LingoBotCustomization {
        this.saveCustomization(DEFAULT_CUSTOMIZATION);
        return { ...DEFAULT_CUSTOMIZATION };
    },

    subscribe(callback: (c: LingoBotCustomization) => void): () => void {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<LingoBotCustomization>;
            callback(customEvent.detail || this.getCustomization());
        };
        window.addEventListener(EVENT_NAME, handler);
        return () => window.removeEventListener(EVENT_NAME, handler);
    },

    // 📚 LEARNED WORDS COLLECTION
    getLearnedWords(): LearnedCustomizationWord[] {
        try {
            const raw = localStorage.getItem(LEARNED_WORDS_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn(e);
        }
        // Initial discovered words
        const initial: LearnedCustomizationWord[] = [
            {
                itemId: 'scholar_vest',
                targetWord: 'Vest',
                script: 'वेस्ट (सदरिया)',
                phonetic: 'Vest (Sadriya)',
                meaning: 'A neat sleeveless garment worn over a shirt',
                example: 'मेरा वेस्ट नीला और सुंदर है।',
                category: 'clothes',
                learnedAt: 'Starter Word'
            }
        ];
        this.saveLearnedWords(initial);
        return initial;
    },

    saveLearnedWords(words: LearnedCustomizationWord[]): void {
        try {
            localStorage.setItem(LEARNED_WORDS_KEY, JSON.stringify(words));
        } catch (e) {
            console.warn(e);
        }
    },

    markWordAsLearned(
        item: CustomizationItem,
        targetLang: string = 'hi',
        interfaceLang: string = 'en'
    ): { word: LearnedCustomizationWord; isNew: boolean } {
        const list = this.getLearnedWords();
        const existing = list.find(w => w.itemId === item.id);
        if (existing) return { word: existing, isNew: false };

        const targetScript = item.learning.targetScript[targetLang] || item.learning.targetScript['hi'] || item.learning.targetWord;
        const phonetic = item.learning.phonetic[targetLang] || item.learning.phonetic['hi'] || item.learning.targetWord;
        const meaning = item.learning.meaning[interfaceLang] || item.learning.meaning['en'];
        const example = item.learning.exampleSentence[targetLang] || item.learning.exampleSentence['hi'];

        const newEntry: LearnedCustomizationWord = {
            itemId: item.id,
            targetWord: item.learning.targetWord,
            script: targetScript,
            phonetic,
            meaning,
            example,
            category: item.category,
            learnedAt: new Date().toLocaleDateString()
        };

        list.push(newEntry);
        this.saveLearnedWords(list);
        return { word: newEntry, isNew: true };
    },

    isWordLearned(itemId: string): boolean {
        const list = this.getLearnedWords();
        return list.some(w => w.itemId === itemId);
    },

    getLearnedWordsCountByCategory(): Record<ItemCategory, number> {
        const words = this.getLearnedWords();
        const counts: Record<ItemCategory, number> = {
            clothes: 0,
            hats: 0,
            glasses: 0,
            bags: 0,
            accessories: 0,
            auras: 0
        };
        words.forEach(w => {
            if (counts[w.category] !== undefined) counts[w.category]++;
        });
        return counts;
    },

    // 🔓 LEARN TO UNLOCK / UNLOCKED ITEMS
    getUnlockedItems(): string[] {
        try {
            const raw = localStorage.getItem(UNLOCKED_ITEMS_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn(e);
        }
        return ['scholar_vest', 'none_hat', 'none_glasses', 'none_bag', 'none_acc', 'none_aura'];
    },

    saveUnlockedItems(items: string[]): void {
        try {
            localStorage.setItem(UNLOCKED_ITEMS_KEY, JSON.stringify(items));
        } catch (e) {
            console.warn(e);
        }
    },

    unlockItemByLearning(itemId: string): void {
        const list = this.getUnlockedItems();
        if (!list.includes(itemId)) {
            list.push(itemId);
            this.saveUnlockedItems(list);
        }
    },

    isUnlocked(item: CustomizationItem, userXp: number = 0): boolean {
        if (item.unlockedByDefault || item.xpRequired === 0) return true;
        const manuallyUnlocked = this.getUnlockedItems();
        if (manuallyUnlocked.includes(item.id)) return true;
        return userXp >= item.xpRequired;
    },

    getItemsByCategory(category: string): CustomizationItem[] {
        return CUSTOMIZATION_ITEMS.filter(item => item.category === category);
    }
};
