// 预置词汇数据库
const VOCABULARY_DATABASE = {
    // 超市
    "超市": {
        core: [
            { chinese: "收银员", pinyin: "shōu yín yuán" },
            { chinese: "货架", pinyin: "huò jià" },
            { chinese: "购物车", pinyin: "gòu wù chē" },
            { chinese: "收银台", pinyin: "shōu yín tái" }
        ],
        items: [
            { chinese: "苹果", pinyin: "píng guǒ" },
            { chinese: "牛奶", pinyin: "niú nǎi" },
            { chinese: "面包", pinyin: "miàn bāo" },
            { chinese: "鸡蛋", pinyin: "jī dàn" },
            { chinese: "蔬菜", pinyin: "shū cài" },
            { chinese: "水果", pinyin: "shuǐ guǒ" },
            { chinese: "饼干", pinyin: "bǐng gān" },
            { chinese: "饮料", pinyin: "yǐn liào" }
        ],
        environment: [
            { chinese: "入口", pinyin: "rù kǒu" },
            { chinese: "出口", pinyin: "chū kǒu" },
            { chinese: "灯", pinyin: "dēng" },
            { chinese: "墙", pinyin: "qiáng" },
            { chinese: "门", pinyin: "mén" }
        ]
    },

    // 医院
    "医院": {
        core: [
            { chinese: "医生", pinyin: "yī shēng" },
            { chinese: "护士", pinyin: "hù shi" },
            { chinese: "病人", pinyin: "bìng rén" },
            { chinese: "病床", pinyin: "bìng chuáng" },
            { chinese: "挂号处", pinyin: "guà hào chù" }
        ],
        items: [
            { chinese: "听诊器", pinyin: "tīng zhěn qì" },
            { chinese: "体温计", pinyin: "tǐ wēn jì" },
            { chinese: "药", pinyin: "yào" },
            { chinese: "针筒", pinyin: "zhēn tǒng" },
            { chinese: "病历", pinyin: "bìng lì" },
            { chinese: "口罩", pinyin: "kǒu zhào" },
            { chinese: "棉签", pinyin: "mián qiān" },
            { chinese: "轮椅", pinyin: "lún yǐ" }
        ],
        environment: [
            { chinese: "急诊室", pinyin: "jí zhěn shì" },
            { chinese: "药房", pinyin: "yào fáng" },
            { chinese: "走廊", pinyin: "zǒu láng" },
            { chinese: "电梯", pinyin: "diàn tī" },
            { chinese: "窗户", pinyin: "chuāng hù" }
        ]
    },

    // 公园
    "公园": {
        core: [
            { chinese: "花坛", pinyin: "huā tán" },
            { chinese: "长椅", pinyin: "cháng yǐ" },
            { chinese: "小路", pinyin: "xiǎo lù" },
            { chinese: "大门", pinyin: "dà mén" }
        ],
        items: [
            { chinese: "花", pinyin: "huā" },
            { chinese: "树", pinyin: "shù" },
            { chinese: "草", pinyin: "cǎo" },
            { chinese: "鸟", pinyin: "niǎo" },
            { chinese: "蝴蝶", pinyin: "hú dié" },
            { chinese: "气球", pinyin: "qì qiú" },
            { chinese: "风筝", pinyin: "fēng zheng" },
            { chinese: "足球", pinyin: "zú qiú" }
        ],
        environment: [
            { chinese: "湖泊", pinyin: "hú pō" },
            { chinese: "桥", pinyin: "qiáo" },
            { chinese: "假山", pinyin: "jiǎ shān" },
            { chinese: "凉亭", pinyin: "liáng tíng" },
            { chinese: "草坪", pinyin: "cǎo píng" }
        ]
    },

    // 学校
    "学校": {
        core: [
            { chinese: "老师", pinyin: "lǎo shī" },
            { chinese: "学生", pinyin: "xué shēng" },
            { chinese: "黑板", pinyin: "hēi bǎn" },
            { chinese: "讲台", pinyin: "jiǎng tái" },
            { chinese: "课桌", pinyin: "kè zhuō" }
        ],
        items: [
            { chinese: "书本", pinyin: "shū běn" },
            { chinese: "铅笔", pinyin: "qiān bǐ" },
            { chinese: "橡皮", pinyin: "xiàng pí" },
            { chinese: "尺子", pinyin: "chǐ zi" },
            { chinese: "书包", pinyin: "shū bāo" },
            { chinese: "文具盒", pinyin: "wén jù hé" },
            { chinese: "作业本", pinyin: "zuò yè běn" },
            { chinese: "彩笔", pinyin: "cǎi bǐ" }
        ],
        environment: [
            { chinese: "教室", pinyin: "jiào shì" },
            { chinese: "操场", pinyin: "cāo chǎng" },
            { chinese: "图书馆", pinyin: "tú shū guǎn" },
            { chinese: "食堂", pinyin: "shí táng" },
            { chinese: "校门", pinyin: "xiào mén" }
        ]
    },

    // 动物园
    "动物园": {
        core: [
            { chinese: "笼子", pinyin: "lóng zi" },
            { chinese: "饲养员", pinyin: "sì yǎng yuán" },
            { chinese: "导游图", pinyin: "dǎo yóu tú" },
            { chinese: "观光车", pinyin: "guān guāng chē" }
        ],
        items: [
            { chinese: "熊猫", pinyin: "xióng māo" },
            { chinese: "狮子", pinyin: "shī zi" },
            { chinese: "老虎", pinyin: "lǎo hǔ" },
            { chinese: "猴子", pinyin: "hóu zi" },
            { chinese: "大象", pinyin: "dà xiàng" },
            { chinese: "长颈鹿", pinyin: "cháng jǐng lù" },
            { chinese: "斑马", pinyin: "bān mǎ" },
            { chinese: "孔雀", pinyin: "kǒng què" }
        ],
        environment: [
            { chinese: "水池", pinyin: "shuǐ chí" },
            { chinese: "假山", pinyin: "jiǎ shān" },
            { chinese: "草地", pinyin: "cǎo dì" },
            { chinese: "围栏", pinyin: "wéi lán" },
            { chinese: "指示牌", pinyin: "zhǐ shì pái" }
        ]
    },

    // 家庭
    "家庭": {
        core: [
            { chinese: "爸爸", pinyin: "bà ba" },
            { chinese: "妈妈", pinyin: "mā ma" },
            { chinese: "孩子", pinyin: "hái zi" },
            { chinese: "沙发", pinyin: "shā fā" }
        ],
        items: [
            { chinese: "电视", pinyin: "diàn shì" },
            { chinese: "冰箱", pinyin: "bīng xiāng" },
            { chinese: "桌子", pinyin: "zhuō zi" },
            { chinese: "椅子", pinyin: "yǐ zi" },
            { chinese: "床", pinyin: "chuáng" },
            { chinese: "台灯", pinyin: "tái dēng" },
            { chinese: "电话", pinyin: "diàn huà" },
            { chinese: "钟表", pinyin: "zhōng biǎo" }
        ],
        environment: [
            { chinese: "客厅", pinyin: "kè tīng" },
            { chinese: "卧室", pinyin: "wò shì" },
            { chinese: "厨房", pinyin: "chú fáng" },
            { chinese: "卫生间", pinyin: "wèi shēng jiān" },
            { chinese: "阳台", pinyin: "yáng tái" }
        ]
    },

    // 交通
    "交通": {
        core: [
            { chinese: "红绿灯", pinyin: "hóng lǜ dēng" },
            { chinese: "斑马线", pinyin: "bān mǎ xiàn" },
            { chinese: "交警", pinyin: "jiāo jǐng" },
            { chinese: "路标", pinyin: "lù biāo" }
        ],
        items: [
            { chinese: "汽车", pinyin: "qì chē" },
            { chinese: "公交车", pinyin: "gōng jiāo chē" },
            { chinese: "自行车", pinyin: "zì xíng chē" },
            { chinese: "出租车", pinyin: "chū zū chē" },
            { chinese: "地铁", pinyin: "dì tiě" },
            { chinese: "火车", pinyin: "huǒ chē" },
            { chinese: "飞机", pinyin: "fēi jī" },
            { chinese: "船", pinyin: "chuán" }
        ],
        environment: [
            { chinese: "马路", pinyin: "mǎ lù" },
            { chinese: "桥", pinyin: "qiáo" },
            { chinese: "隧道", pinyin: "suì dào" },
            { chinese: "车站", pinyin: "chē zhàn" },
            { chinese: "机场", pinyin: "jī chǎng" }
        ]
    }
};

// 通用词汇库（当没有匹配主题时使用）
const GENERAL_VOCABULARY = {
    core: [
        { chinese: "朋友", pinyin: "péng you" },
        { chinese: "家人", pinyin: "jiā rén" },
        { chinese: "老师", pinyin: "lǎo shī" },
        { chinese: "学生", pinyin: "xué shēng" }
    ],
    items: [
        { chinese: "书", pinyin: "shū" },
        { chinese: "笔", pinyin: "bǐ" },
        { chinese: "球", pinyin: "qiú" },
        { chinese: "花", pinyin: "huā" },
        { chinese: "树", pinyin: "shù" },
        { chinese: "房子", pinyin: "fáng zi" },
        { chinese: "车", pinyin: "chē" },
        { chinese: "门", pinyin: "mén" }
    ],
    environment: [
        { chinese: "天空", pinyin: "tiān kōng" },
        { chinese: "云", pinyin: "yún" },
        { chinese: "太阳", pinyin: "tài yáng" },
        { chinese: "月亮", pinyin: "yuè liang" },
        { chinese: "星星", pinyin: "xīng xing" }
    ]
};