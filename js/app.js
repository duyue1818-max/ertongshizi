// 主应用类
class LiteracyApp {
    constructor() {
        this.currentVocabulary = null;
        this.currentTheme = '';
        this.currentTitle = '';
        this.isGenerating = false;

        // 初始化
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.loadSavedApiKey();
        this.loadHistory();
        this.checkInitialState();
    }

    // 绑定事件
    bindEvents() {
        // API密钥相关
        document.getElementById('saveApiKey').addEventListener('click', () => this.saveApiKey());
        document.getElementById('apiKey').addEventListener('input', (e) => this.onApiKeyInput(e));

        // 主题和标题输入
        document.getElementById('theme').addEventListener('input', (e) => this.onThemeInput(e));
        document.getElementById('title').addEventListener('input', (e) => this.onTitleInput(e));

        // 快速主题按钮
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectQuickTheme(btn.dataset.theme));
        });

        // 生成按钮
        document.getElementById('generateBtn').addEventListener('click', () => this.generateImage());

        // 词汇编辑
        document.getElementById('editWords').addEventListener('click', () => this.openEditModal());
        document.getElementById('saveWordsBtn').addEventListener('click', () => this.saveCustomWords());
        document.getElementById('resetWordsBtn').addEventListener('click', () => this.resetWords());

        // 弹窗关闭
        document.querySelector('.close').addEventListener('click', () => this.closeEditModal());
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });

        // 结果操作
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
        document.getElementById('regenerateBtn').addEventListener('click', () => this.regenerateImage());
        document.getElementById('saveHistoryBtn').addEventListener('click', () => this.saveToHistory());
    }

    // 加载保存的API密钥
    loadSavedApiKey() {
        const savedKey = localStorage.getItem('nanobanana_api_key');
        if (savedKey) {
            document.getElementById('apiKey').value = savedKey;
            this.updateApiKeyStatus(true, 'API密钥已加载');
        }
    }

    // 检查初始状态
    checkInitialState() {
        this.updateGenerateButton();
    }

    // 保存API密钥
    saveApiKey() {
        const apiKey = document.getElementById('apiKey').value.trim();

        if (!apiKey) {
            this.updateApiKeyStatus(false, '请输入API密钥');
            return;
        }

        const validation = apiService.validateApiKey(apiKey);

        if (validation.valid) {
            apiService.saveApiKey(apiKey);
            this.updateApiKeyStatus(true, validation.message);
            this.updateGenerateButton();
        } else {
            this.updateApiKeyStatus(false, validation.message);
        }
    }

    // API密钥输入处理
    onApiKeyInput(e) {
        // 清除状态提示
        document.getElementById('apiKeyStatus').textContent = '';
        this.updateGenerateButton();
    }

    // 更新API密钥状态显示
    updateApiKeyStatus(success, message) {
        const statusEl = document.getElementById('apiKeyStatus');
        statusEl.textContent = message;
        statusEl.className = `status ${success ? 'success' : 'error'}`;
    }

    // 主题输入处理
    onThemeInput(e) {
        const theme = e.target.value.trim();
        this.currentTheme = theme;

        if (theme) {
            this.updateVocabularyPreview(theme);
        } else {
            this.clearVocabularyPreview();
        }

        this.updateGenerateButton();
    }

    // 标题输入处理
    onTitleInput(e) {
        this.currentTitle = e.target.value.trim();
        this.updateGenerateButton();
    }

    // 选择快速主题
    selectQuickTheme(theme) {
        document.getElementById('theme').value = theme;
        this.currentTheme = theme;
        this.updateVocabularyPreview(theme);
        this.updateGenerateButton();
    }

    // 更新词汇预览
    updateVocabularyPreview(theme) {
        this.currentVocabulary = vocabularyManager.getThemeVocabulary(theme);

        // 更新各分类词汇显示
        this.displayVocabulary('coreWords', this.currentVocabulary.core);
        this.displayVocabulary('itemWords', this.currentVocabulary.items);
        this.displayVocabulary('envWords', this.currentVocabulary.environment);
    }

    // 显示词汇列表
    displayVocabulary(elementId, words) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';

        words.forEach(word => {
            const wordEl = document.createElement('span');
            wordEl.className = 'word-item';
            wordEl.innerHTML = `<span class="pinyin">${word.pinyin}</span>${word.chinese}`;
            container.appendChild(wordEl);
        });
    }

    // 清除词汇预览
    clearVocabularyPreview() {
        ['coreWords', 'itemWords', 'envWords'].forEach(id => {
            document.getElementById(id).innerHTML = '';
        });
    }

    // 更新生成按钮状态
    updateGenerateButton() {
        const btn = document.getElementById('generateBtn');
        const hasApiKey = apiService.apiKey.length > 0;
        const hasTheme = this.currentTheme.length > 0;
        const hasTitle = this.currentTitle.length > 0;

        btn.disabled = !(hasApiKey && hasTheme && hasTitle) || this.isGenerating;

        if (!hasApiKey) {
            btn.textContent = '请先设置API密钥';
        } else if (!hasTheme) {
            btn.textContent = '请输入主题';
        } else if (!hasTitle) {
            btn.textContent = '请输入标题';
        } else {
            btn.textContent = '生成识字小报';
        }
    }

    // 生成图片
    async generateImage() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.updateGenerateButton();

        try {
            // 显示进度区域
            document.getElementById('progressSection').style.display = 'block';
            document.getElementById('resultSection').style.display = 'none';

            // 生成提示词
            const prompt = promptGenerator.generateFullPrompt(
                this.currentTheme,
                this.currentTitle,
                this.currentVocabulary
            );

            // 获取生成设置
            const options = {
                aspectRatio: document.getElementById('aspectRatio').value,
                resolution: document.getElementById('resolution').value,
                outputFormat: 'png'
            };

            // 开始生成
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');

            const result = await apiService.generateImage(prompt, options, (status) => {
                progressText.textContent = status.message;

                // 更新进度条
                let progress = 0;
                switch (status.status) {
                    case 'creating':
                        progress = 10;
                        break;
                    case 'created':
                    case 'waiting':
                        progress = 30;
                        break;
                    case 'processing':
                        progress = 60;
                        break;
                    case 'completed':
                        progress = 100;
                        break;
                }
                progressFill.style.width = `${progress}%`;
                progressFill.textContent = `${progress}%`;
            });

            if (result.success) {
                this.showResult(result.imageUrl);
            }

        } catch (error) {
            console.error('生成失败:', error);
            alert(`生成失败: ${error.message}`);
        } finally {
            this.isGenerating = false;
            this.updateGenerateButton();
        }
    }

    // 显示生成结果
    showResult(imageUrl) {
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';

        const resultImage = document.getElementById('resultImage');
        resultImage.src = imageUrl;
        this.currentImageUrl = imageUrl;
    }

    // 下载图片
    downloadImage() {
        if (!this.currentImageUrl) return;

        const filename = `${this.currentTitle}_识字小报.png`;
        apiService.downloadImage(this.currentImageUrl, filename);
    }

    // 重新生成
    regenerateImage() {
        this.generateImage();
    }

    // 保存到历史记录
    saveToHistory() {
        if (!this.currentImageUrl) return;

        const history = this.getHistory();
        const newItem = {
            id: Date.now().toString(),
            theme: this.currentTheme,
            title: this.currentTitle,
            imageUrl: this.currentImageUrl,
            createdAt: new Date().toISOString()
        };

        // 添加到历史记录开头
        history.unshift(newItem);

        // 最多保留50条记录
        if (history.length > 50) {
            history.splice(50);
        }

        localStorage.setItem('literacyHistory', JSON.stringify(history));
        this.loadHistory();

        alert('已保存到历史记录');
    }

    // 获取历史记录
    getHistory() {
        const saved = localStorage.getItem('literacyHistory');
        return saved ? JSON.parse(saved) : [];
    }

    // 加载历史记录
    loadHistory() {
        const history = this.getHistory();
        const historyList = document.getElementById('historyList');

        if (history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">暂无历史记录</p>';
            return;
        }

        historyList.innerHTML = '';

        history.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'history-item';
            itemEl.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
                <div class="history-item-info">
                    <h4>${item.title}</h4>
                    <p>主题: ${item.theme}</p>
                </div>
            `;

            itemEl.addEventListener('click', () => {
                window.open(item.imageUrl, '_blank');
            });

            historyList.appendChild(itemEl);
        });
    }

    // 打开编辑词汇弹窗
    openEditModal() {
        if (!this.currentVocabulary) {
            alert('请先选择主题');
            return;
        }

        document.getElementById('editModal').style.display = 'flex';

        // 填充当前词汇
        document.getElementById('editCoreWords').value = this.formatWordsForEdit(this.currentVocabulary.core);
        document.getElementById('editItemWords').value = this.formatWordsForEdit(this.currentVocabulary.items);
        document.getElementById('editEnvWords').value = this.formatWordsForEdit(this.currentVocabulary.environment);
    }

    // 格式化词汇用于编辑
    formatWordsForEdit(words) {
        return words.map(word => `${word.pinyin} ${word.chinese}`).join('\n');
    }

    // 关闭编辑弹窗
    closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
    }

    // 保存自定义词汇
    saveCustomWords() {
        const coreText = document.getElementById('editCoreWords').value;
        const itemsText = document.getElementById('editItemWords').value;
        const envText = document.getElementById('editEnvWords').value;

        const coreWords = vocabularyManager.parseWordsFromString(coreText);
        const itemsWords = vocabularyManager.parseWordsFromString(itemsText);
        const envWords = vocabularyManager.parseWordsFromString(envText);

        const customVocabulary = {
            core: coreWords,
            items: itemsWords,
            environment: envWords
        };

        vocabularyManager.saveCustomTheme(this.currentTheme, customVocabulary);
        this.currentVocabulary = customVocabulary;
        this.updateVocabularyPreview(this.currentTheme);
        this.closeEditModal();

        alert('词汇已更新');
    }

    // 重置词汇
    resetWords() {
        document.getElementById('editCoreWords').value = '';
        document.getElementById('editItemWords').value = '';
        document.getElementById('editEnvWords').value = '';
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.literacyApp = new LiteracyApp();
});