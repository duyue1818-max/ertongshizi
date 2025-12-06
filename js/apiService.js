// API服务类 - 封装Nano Banana Pro API调用
class ApiService {
    constructor() {
        this.baseURL = 'https://api.kie.ai/api/v1/jobs';
        this.apiKey = this.getApiKey();
        this.taskPollingInterval = 3000; // 3秒轮询一次
        this.maxPollingTime = 300000; // 最大轮询时间5分钟
    }

    // 从LocalStorage获取API密钥
    getApiKey() {
        return localStorage.getItem('nanobanana_api_key') || '';
    }

    // 保存API密钥
    saveApiKey(apiKey) {
        localStorage.setItem('nanobanana_api_key', apiKey);
        this.apiKey = apiKey;
    }

    // 验证API密钥格式
    validateApiKey(apiKey) {
        // 基本格式验证
        if (!apiKey || apiKey.length < 10) {
            return {
                valid: false,
                message: 'API密钥格式不正确'
            };
        }

        return {
            valid: true,
            message: 'API密钥已保存'
        };
    }

    // 创建生成任务
    async createTask(prompt, options = {}) {
        const {
            aspectRatio = '3:4',
            resolution = '2K',
            outputFormat = 'png'
        } = options;

        const requestData = {
            model: 'nano-banana-pro',
            input: {
                prompt: prompt,
                image_input: [],
                aspect_ratio: aspectRatio,
                resolution: resolution,
                output_format: outputFormat
            }
        };

        try {
            const response = await fetch(`${this.baseURL}/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (response.ok && data.code === 200) {
                return {
                    success: true,
                    taskId: data.data.taskId
                };
            } else {
                throw new Error(data.msg || `HTTP错误: ${response.status}`);
            }
        } catch (error) {
            console.error('创建任务失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 查询任务状态
    async queryTaskStatus(taskId) {
        try {
            const response = await fetch(`${this.baseURL}/recordInfo?taskId=${taskId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const data = await response.json();

            if (response.ok && data.code === 200) {
                const taskData = data.data;

                // 解析结果JSON
                let resultUrls = [];
                if (taskData.resultJson) {
                    try {
                        const result = JSON.parse(taskData.resultJson);
                        resultUrls = result.resultUrls || [];
                    } catch (e) {
                        console.error('解析结果失败:', e);
                    }
                }

                return {
                    success: true,
                    state: taskData.state,
                    resultUrls: resultUrls,
                    failCode: taskData.failCode,
                    failMsg: taskData.failMsg,
                    costTime: taskData.costTime
                };
            } else {
                throw new Error(data.msg || `HTTP错误: ${response.status}`);
            }
        } catch (error) {
            console.error('查询任务状态失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 轮询任务直到完成
    async pollTaskUntilComplete(taskId, onProgress) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const poll = async () => {
                // 检查是否超时
                if (Date.now() - startTime > this.maxPollingTime) {
                    reject(new Error('任务超时'));
                    return;
                }

                const result = await this.queryTaskStatus(taskId);

                if (!result.success) {
                    reject(new Error(result.error));
                    return;
                }

                // 更新进度
                if (onProgress) {
                    onProgress(result);
                }

                // 检查任务状态
                switch (result.state) {
                    case 'success':
                        resolve({
                            success: true,
                            resultUrls: result.resultUrls,
                            costTime: result.costTime
                        });
                        break;

                    case 'fail':
                        reject(new Error(result.failMsg || '任务失败'));
                        break;

                    case 'waiting':
                    case 'processing':
                        // 继续轮询
                        setTimeout(poll, this.taskPollingInterval);
                        break;

                    default:
                        reject(new Error(`未知任务状态: ${result.state}`));
                }
            };

            // 开始轮询
            poll();
        });
    }

    // 生成图片（完整的流程）
    async generateImage(prompt, options = {}, onProgress) {
        // 检查API密钥
        if (!this.apiKey) {
            throw new Error('请先设置API密钥');
        }

        // 更新进度：开始创建任务
        if (onProgress) {
            onProgress({ status: 'creating', message: '正在创建生成任务...' });
        }

        // 1. 创建任务
        const taskResult = await this.createTask(prompt, options);

        if (!taskResult.success) {
            throw new Error(taskResult.error || '创建任务失败');
        }

        // 更新进度：任务创建成功
        if (onProgress) {
            onProgress({
                status: 'created',
                taskId: taskResult.taskId,
                message: '任务创建成功，等待处理...'
            });
        }

        // 2. 轮询直到完成
        try {
            const result = await this.pollTaskUntilComplete(
                taskResult.taskId,
                (status) => {
                    if (onProgress) {
                        let progressMessage = '正在生成图片...';

                        switch (status.state) {
                            case 'waiting':
                                progressMessage = '等待队列处理...';
                                break;
                            case 'processing':
                                progressMessage = '正在生成图片，请稍候...';
                                break;
                        }

                        onProgress({
                            status: status.state,
                            taskId: taskResult.taskId,
                            message: progressMessage
                        });
                    }
                }
            );

            if (onProgress) {
                onProgress({
                    status: 'completed',
                    taskId: taskResult.taskId,
                    message: '生成完成！',
                    resultUrls: result.resultUrls,
                    costTime: result.costTime
                });
            }

            return {
                success: true,
                imageUrl: result.resultUrls[0],
                costTime: result.costTime,
                taskId: taskResult.taskId
            };
        } catch (error) {
            if (onProgress) {
                onProgress({
                    status: 'error',
                    taskId: taskResult.taskId,
                    message: `生成失败: ${error.message}`
                });
            }
            throw error;
        }
    }

    // 下载图片
    downloadImage(imageUrl, filename) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename || '识字小报.png';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 获取API使用统计（如果API支持）
    async getApiStats() {
        // 这里可以实现获取API使用统计的功能
        // 根据实际的API文档实现
        return {
            totalUsage: 0,
            remainingQuota: 0
        };
    }
}

// 创建全局实例
window.apiService = new ApiService();