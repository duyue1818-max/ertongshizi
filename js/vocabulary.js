// 词汇联想和管理类
class VocabularyManager {
    constructor() {
        // 初始化词汇数据库
        this.vocabularyDatabase = VOCABULARY_DATABASE;
        this.generalVocabulary = GENERAL_VOCABULARY;
        this.customWords = this.loadCustomWords();
    }

    // 从LocalStorage加载自定义词汇
    loadCustomWords() {
        const saved = localStorage.getItem('customVocabulary');
        return saved ? JSON.parse(saved) : {};
    }

    // 保存自定义词汇到LocalStorage
    saveCustomWords() {
        localStorage.setItem('customVocabulary', JSON.stringify(this.customWords));
    }

    // 根据主题获取词汇
    getWordsByTheme(theme) {
        // 先尝试精确匹配
        if (this.vocabularyDatabase[theme]) {
            return this.vocabularyDatabase[theme];
        }

        // 再尝试自定义词汇
        if (this.customWords[theme]) {
            return this.customWords[theme];
        }

        // 尝试模糊匹配
        const similarTheme = this.findSimilarTheme(theme);
        if (similarTheme) {
            return this.vocabularyDatabase[similarTheme];
        }

        // 最后返回通用词汇
        return this.generalVocabulary;
    }

    // 查找相似的主题
    findSimilarTheme(theme) {
        const themes = Object.keys(this.vocabularyDatabase);
        const themeLower = theme.toLowerCase();

        for (let t of themes) {
            if (t.includes(theme) || theme.includes(t)) {
                return t;
            }
        }

        return null;
    }

    // 格式化词汇为字符串列表
    formatWordsToString(words) {
        if (!words || !words.length) return '';

        return words.map(word => `${word.pinyin} ${word.chinese}`).join('、');
    }

    // 将字符串转换为词汇对象
    parseWordsFromString(text) {
        const words = [];
        const lines = text.split(/[,，、\n]/).filter(line => line.trim());

        for (let line of lines) {
            const trimmed = line.trim();
            // 尝试匹配 "拼音 中文" 格式
            const match = trimmed.match(/^([a-z\s]+)\s+([\u4e00-\u9fa5]+)$/i);

            if (match) {
                words.push({
                    chinese: match[2],
                    pinyin: match[1].replace(/\s+/g, ' ').trim()
                });
            } else if (/^[\u4e00-\u9fa5]+$/.test(trimmed)) {
                // 只有中文，使用简单的拼音转换
                words.push({
                    chinese: trimmed,
                    pinyin: this.generateSimplePinyin(trimmed)
                });
            }
        }

        return words;
    }

    // 简单的拼音生成（仅用于没有拼音的情况）
    generateSimplePinyin(chinese) {
        // 这里使用一个简单的映射，实际应用中应该使用完整的拼音库
        const pinyinMap = {
            '人': 'rén', '大': 'dà', '小': 'xiǎo', '山': 'shān', '水': 'shuǐ',
            '花': 'huā', '树': 'shù', '鸟': 'niǎo', '鱼': 'yú', '马': 'mǎ',
            '牛': 'niú', '羊': 'yáng', '狗': 'gǒu', '猫': 'māo', '鸡': 'jī',
            '书': 'shū', '笔': 'bǐ', '纸': 'zhǐ', '门': 'mén', '窗': 'chuāng',
            '车': 'chē', '船': 'chuán', '飞机': 'fēi jī', '火': 'huǒ', '电': 'diàn'
        };

        let result = '';
        for (let char of chinese) {
            if (pinyinMap[char]) {
                result += pinyinMap[char] + ' ';
            } else {
                result += char + ' ';
            }
        }
        return result.trim();
    }

    // 保存或更新自定义主题词汇
    saveCustomTheme(theme, words) {
        if (!this.customWords[theme]) {
            this.customWords[theme] = {
                core: [],
                items: [],
                environment: []
            };
        }

        this.customWords[theme] = words;
        this.saveCustomWords();
    }

    // 获取所有主题列表
    getAllThemes() {
        const themes = new Set();

        // 添加预置主题
        Object.keys(this.vocabularyDatabase).forEach(theme => themes.add(theme));

        // 添加自定义主题
        Object.keys(this.customWords).forEach(theme => themes.add(theme));

        return Array.from(themes);
    }

    // 随机选择指定数量的词汇
    selectRandomWords(words, count) {
        if (!words || words.length <= count) {
            return words || [];
        }

        const shuffled = [...words].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 扩展词汇列表
    expandVocabulary(words, targetCount) {
        const currentCount = words.length;
        if (currentCount >= targetCount) {
            return words.slice(0, targetCount);
        }

        // 从通用词汇中补充
        const additionalWords = this.selectRandomWords(
            this.generalVocabulary.items,
            targetCount - currentCount
        );

        return [...words, ...additionalWords];
    }

    // 获取主题相关词汇（确保返回足够的词汇）
    getThemeVocabulary(theme, options = {}) {
        const {
            coreCount = 4,
            itemsCount = 8,
            envCount = 4,
            randomize = true
        } = options;

        const vocabulary = this.getWordsByTheme(theme);

        const result = {
            core: randomize ?
                this.selectRandomWords(vocabulary.core, coreCount) :
                vocabulary.core.slice(0, coreCount),
            items: randomize ?
                this.selectRandomWords(vocabulary.items, itemsCount) :
                vocabulary.items.slice(0, itemsCount),
            environment: randomize ?
                this.selectRandomWords(vocabulary.environment, envCount) :
                vocabulary.environment.slice(0, envCount)
        };

        // 确保有足够的词汇
        result.core = this.expandVocabulary(result.core, coreCount);
        result.items = this.expandVocabulary(result.items, itemsCount);
        result.environment = this.expandVocabulary(result.environment, envCount);

        return result;
    }
}

// 创建全局实例
window.vocabularyManager = new VocabularyManager();