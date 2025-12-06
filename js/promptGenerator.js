// 提示词生成类
class PromptGenerator {
    constructor() {
        // 基础提示词模板
        this.baseTemplate = `请生成一张儿童识字小报《{{主题/场景}}》，竖版 A4，学习小报版式，适合 5–9 岁孩子 认字与看图识物。

# 一、小报标题区（顶部）

**顶部居中大标题**：《{{标题}}》
* **风格**：十字小报 / 儿童学习报感
* **文本要求**：大字、醒目、卡通手写体、彩色描边
* **装饰**：周围添加与 {{主题/场景}} 相关的贴纸风装饰，颜色鲜艳

# 二、小报主体（中间主画面）

画面中心是一幅 **卡通插画风的「{{主题/场景}}」场景**：
* **整体气氛**：明亮、温暖、积极
* **构图**：物体边界清晰，方便对应文字，不要过于拥挤。

**场景分区与核心内容**
1.  **核心区域 A（主要对象）**：表现 {{主题/场景}} 的核心活动。
2.  **核心区域 B（配套设施）**：展示相关的工具或物品。
3.  **核心区域 C（环境背景）**：体现环境特征（如墙面、指示牌等）。

**主题人物**
* **角色**：1 位可爱卡通人物（职业/身份：与 {{主题/场景}} 匹配）。
* **动作**：正在进行与场景相关的自然互动。

# 三、必画物体与识字清单（Generated Content）

**请务必在画面中清晰绘制以下物体，并为其预留贴标签的位置：**

**1. 核心角色与设施：**
{{核心角色与设施}}

**2. 常见物品/工具：**
{{常见物品/工具}}

**3. 环境与装饰：**
{{环境与装饰}}

*(注意：画面中的物体数量不限于此，但以上列表必须作为重点描绘对象)*

# 四、识字标注规则

对上述清单中的物体，贴上中文识字标签：
* **格式**：两行制（第一行拼音带声调，第二行简体汉字）。
* **样式**：彩色小贴纸风格，白底黑字或深色字，清晰可读。
* **排版**：标签靠近对应的物体，不遮挡主体。

# 五、画风参数
* **风格**：儿童绘本风 + 识字小报风
* **色彩**：高饱和、明快、温暖 (High Saturation, Warm Tone)
* **质量**：8k resolution, high detail, vector illustration style, clean lines.`;
    }

    // 生成完整的提示词
    generatePrompt(theme, title, vocabulary) {
        let prompt = this.baseTemplate;

        // 替换基本变量
        prompt = prompt.replace(/\{\{主题\/场景\}\}/g, theme);
        prompt = prompt.replace(/\{\{标题\}\}/g, title);

        // 替换词汇列表
        prompt = prompt.replace(/\{\{核心角色与设施\}\}/g, this.formatVocabulary(vocabulary.core));
        prompt = prompt.replace(/\{\{常见物品\/工具\}\}/g, this.formatVocabulary(vocabulary.items));
        prompt = prompt.replace(/\{\{环境与装饰\}\}/g, this.formatVocabulary(vocabulary.environment));

        return prompt;
    }

    // 格式化词汇列表为字符串
    formatVocabulary(words) {
        if (!words || words.length === 0) {
            return '暂无';
        }

        return words.map(word => {
            // 确保拼音和中文都存在
            if (word.pinyin && word.chinese) {
                return `${word.pinyin} ${word.chinese}`;
            } else if (word.chinese) {
                return word.chinese;
            } else {
                return '';
            }
        }).filter(word => word).join('、');
    }

    // 添加额外的场景描述
    addSceneDescription(prompt, theme) {
        const sceneDescriptions = {
            '超市': '超市内部明亮整洁，货架排列整齐，商品丰富多样',
            '医院': '医院环境干净整洁，白色为主色调，医疗设备齐全',
            '公园': '公园绿树成荫，鲜花盛开，环境优美宜人',
            '学校': '教室明亮整洁，学习氛围浓厚，充满朝气',
            '动物园': '动物园环境自然，各种动物在合适的环境中生活',
            '家庭': '家庭环境温馨舒适，充满生活气息'
        };

        const description = sceneDescriptions[theme] || '';

        if (description) {
            prompt += `\n\n**场景描述**：${description}`;
        }

        return prompt;
    }

    // 添加人物描述
    addCharacterDescription(prompt, theme) {
        const characters = {
            '超市': '穿着围裙的收银员阿姨或正在购物的小朋友',
            '医院': '穿着白大褂的医生或护士，以及戴口罩的病人',
            '公园': '穿着休闲装的游客或小朋友在玩耍',
            '学校': '穿着校服的学生或戴眼镜的老师',
            '动物园': '穿着工作服的饲养员或兴奋参观的小朋友',
            '家庭': '爸爸妈妈和孩子在温馨互动'
        };

        const character = characters[theme] || '可爱的卡通人物';

        prompt = prompt.replace(
            /(\*\*角色\*\*：).*/,
            `$1${character}`
        );

        return prompt;
    }

    // 生成最终的完整提示词
    generateFullPrompt(theme, title, vocabulary) {
        let prompt = this.generatePrompt(theme, title, vocabulary);

        // 添加场景描述
        prompt = this.addSceneDescription(prompt, theme);

        // 添加人物描述
        prompt = this.addCharacterDescription(prompt, theme);

        return prompt;
    }

    // 验证提示词
    validatePrompt(prompt) {
        const errors = [];

        // 检查必要的内容
        if (!prompt.includes('《')) {
            errors.push('缺少标题');
        }

        if (!prompt.includes('识字标签')) {
            errors.push('缺少识字标注规则');
        }

        if (!prompt.includes('核心角色与设施') &&
            !prompt.includes('常见物品/工具') &&
            !prompt.includes('环境与装饰')) {
            errors.push('缺少词汇列表');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // 获取提示词的统计信息
    getPromptStats(prompt) {
        const stats = {
            length: prompt.length,
            wordCount: prompt.length,
            vocabularyCount: {
                core: 0,
                items: 0,
                environment: 0
            }
        };

        // 统计词汇数量
        const coreMatch = prompt.match(/核心角色与设施：([\s\S]*?)(?=2\.|$)/);
        if (coreMatch) {
            stats.vocabularyCount.core = coreMatch[1].split(/[、,，\n]/).filter(w => w.trim()).length;
        }

        const itemsMatch = prompt.match(/常见物品\/工具：([\s\S]*?)(?=3\.|$)/);
        if (itemsMatch) {
            stats.vocabularyCount.items = itemsMatch[1].split(/[、,，\n]/).filter(w => w.trim()).length;
        }

        const envMatch = prompt.match(/环境与装饰：([\s\S]*?)(?=\*|\n\n#|$)/);
        if (envMatch) {
            stats.vocabularyCount.environment = envMatch[1].split(/[、,，\n]/).filter(w => w.trim()).length;
        }

        return stats;
    }
}

// 创建全局实例
window.promptGenerator = new PromptGenerator();