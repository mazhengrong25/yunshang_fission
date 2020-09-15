import request from '@/api/request';

// 获取城市机场列表
function getAir (data) {
	return request({
		method: "GET",
    url: '/api/getAirList',
    data: data
	})
}

export default{
	getAir,
}

/** 
const domesticCity = [
    ["SHF", "石河子花园机场", "石河子花园机场", "SHZ ", "ShiHeZi", "SHF", "石河子"],
    ["PKX", "大兴国际机场", "大兴国际机场", "BJ", "BeiJing", "BJS", "北京"],
    ["GMQ", "果洛玛沁机场", "果洛玛沁机场", "MQ ", "MAQING", "GMQ", "果洛"],
    ["LNL", "陇南成县机场", "陇南成县机场", "LN ", "LongNanChengXian", "LNL", "陇南"],
    ["WMT", "遵义茅台机场", "茅台机场", "MT ", "maotai", "WMT", "遵义"],
    ["NZL", "扎兰屯机场", "扎兰屯机场", "NZL ", "ZhaLanTun", "ZLT", "扎兰屯"],
    ["SQD", "上饶三清山机场", "上饶三清山机场", "sr ", "Shangrao", "SQD", "上饶"],
    ["HUO", "霍林郭勒机场", "霍林郭勒", "HLGL ", "huolinguole", "HUO", "霍林郭勒"],
    ["CDE", "承德普宁机场", "承德", "CDPN ", "chengde", "CDE", "承德"],
    ["RIZ", "日照山字河机场", "日照山字河", "RZSZH ", "rizhao", "RIZ", "日照"],
    ["BAR", "琼海博鳌国际机场", "博鳌国际机场", "QH ", "Qionghai", "BAR", "琼海"],
    ["UCB", "乌兰察布集宁机场", "乌兰察布机场", "WLCB ", "wulanchabu", "UCB", "乌兰察布"],
    ["NLH", "宁蒗泸沽湖机场", "泸沽湖机场", "LGH ", "Luguhu", "NLH", "泸沽湖"],
    ["DAX", "达州河市机场", "河市机场", "HS ", "heshi", "DAX", "达州"],
    ["YKH", "营口兰旗机场", "营口机场", "YK ", "Yingkou", "YKH", "营口"],
    ["WDS", "十堰武当山机场", "武当山机场", "WDS ", "WuDangShan", "WDS", "武当山"],
    ["JMU", "佳木斯机场", "佳木斯机场", "JMS ", "Jiamusi", "JMU", "佳木斯"],
    ["LDS", "林都机场", "林都机场", "YC ", "Yichun", "LDS", "伊春"],
    ["HSN", "舟山机场", "舟山机场", "ZS ", "Zhoushan", "HSN", "舟山"],
    ["SYM", "思茅机场", "思茅机场", "SM ", "Simao", "SYM", "思茅"],
    ["THQ", "天水机场", "天水机场", "TS ", "Tianshui", "THQ", "天水"],
    ["HNY", "衡阳机场", "衡阳机场", "HY ", "HENGYANG", "HNY", "湖南"],
    ["DIG", "香格里拉机场", "香格里拉机场", "DQ ", "Diqing", "DIG", "迪庆"],
    ["TCZ", "腾冲机场", "腾冲机场", "TC ", "Tengchong", "TCZ", "腾冲"],
    ["YIC", "明月山机场", "明月山机场", "YC ", "YICHUN", "YIC", "宜春"],
    ["EJN", "额济纳旗机场", "额济纳机场", "EJN ", "EJINA", "EJN", "额济纳旗"],
    ["LPF", "六盘水机场", "六盘水机场", "LPS ", "LiuPanShui", "LPF", "六盘水"],
    ["ENH", "许家坪机场", "许家坪机场", "ES ", "Enshi", "ENH", "恩施"],
    ["CIH", "长治机场", "长治机场", "CZ ", "Changzhi", "CIH", "长治"],
    ["GOQ", "格尔木机场", "格尔木机场", "GEM ", "Golmud", "GOQ", "格尔木"],
    ["JJN", "泉州晋江国际机场", "泉州机场", "QZJJ ", "Quanzhou", "JJN", "泉州晋江"],
    ["JDZ", "景德镇机场", "景德镇机场", "JDZ ", "Jingdezhen", "JDZ", "景德镇"],
    ["JGS", "井冈山机场", "井冈山机场", "JGS ", "JINGGANGSHAN", "JGS", "江西吉安"],
    ["BPL", "博乐机场", "博乐机场", "BL ", "Bole", "BPL", "博乐"],
    ["SZV", "苏州福光机场", "苏州福光机场", "SZ ", "SUZHOU", "SZV", "江苏"],
    ["YUS", "玉树机场", "玉树机场", "YS ", "YuShu", "YUS", "玉树"],
    ["CGO", "新郑国际机场", "新郑国际机场", "ZZ ", "ZHENGZHOU", "CGO", "郑州"],
    ["DCY", "稻城亚丁机场", "稻城亚丁机场", "DC ", "DAOCHENG", "DCY", "稻城"],
    ["KJH", "黄平机场", "黄平机场", "KL ", "KAILI", "KJH", "黄平"],
    ["FUG", "阜阳机场", "阜阳机场", "FY ", "Fuyang", "FUG", "阜阳"],
    ["AKU", "阿克苏机场", "阿克苏机场", "AKS ", "Aksu", "AKU", "阿克苏"],
    ["WXN", "万州五桥机场", "万州机场", "WZ ", "WANZHOU", "CKG", "万州"],
    ["JIC", "金昌机场", "金昌机场", "JC ", "Jinchang", "JIC", "金昌"],
    ["BPX", "昌都邦达机场", "昌都邦达机场", "CD ", "Changdu", "BPX", "昌都"],
    ["RKZ", "日喀则机场", "日喀则机场", "RKZ ", "Rikaze", "RKZ", "日喀则"],
    ["XIL", "锡林浩特机场", "锡林浩特机场", "XLHT ", "Xilinhot", "XIL", "锡林浩特"],
    ["MIG", "南郊机场", "南郊机场", "MY ", "Mianyang", "MIG", "绵阳"],
    ["SWA", "揭阳潮汕机场", "揭阳潮汕机场", "JY ", "JIEYANG", "SWA", "揭阳"],
    ["NGQ", "阿里昆莎机场", "阿里昆莎机场", "ALKS ", "ALIKUNSHA", "NGQ", "阿里昆莎"],
    ["LZO", "泸州机场", "泸州机场", "LZ ", "Luzhou", "LZO", "泸州"],
    ["JNG", "曲阜机场", "曲阜机场", "JN ", "JINING", "JNG", "济宁"],
    ["IQM", "且末机场", "且末机场", "QM ", "Qiemo", "IQM", "且末"],
    ["OHE", "漠河机场", "漠河机场", "MH ", "MOHE", "OHE", "大兴安岭漠河"],
    ["IQN", "庆阳机场", "庆阳机场", "QY ", "Qingyang", "IQN", "庆阳"],
    ["YIW", "义乌机场", "义乌机场", "YW ", "YIWU", "YIW", "义乌"],
    ["HET", "呼和浩特白塔国际机场", "白塔机场", "HHHT ", "HoHeHaoTe", "HET", "呼和浩特"],
    ["ZHA", "湛江机场", "湛江机场", "ZJ ", "Zhanjiang", "ZHA", "湛江"],
    ["HMI", "哈密机场", "哈密机场", "HM ", "Hami", "HMI", "哈密"],
    ["AOG", "鞍山机场", "鞍山机场", "AS ", "Anshan", "AOG", "鞍山"],
    ["HZH", "黎平机场", "黎平机场", "LP ", "LIPING", "HZH", "黎平"],
    ["RHT", "阿拉善右旗机场", "阿拉善右旗机场", "ALSYQ ", "ALASHANYOUQI", "RHT", "阿拉善右旗"],
    ["KOW", "黄金机场", "黄金机场", "GZ ", "Ganzhou", "KOW", "赣州"],
    ["YIN", "伊宁机场", "伊宁机场", "YN ", "Yining", "YIN", "伊宁"],
    ["HTN", "和田机场", "和田机场", "HT ", "Hotan", "HTN", "和田"],
    ["GHN", "广汉机场", "广汉机场", "GH ", "Guanghan", "GHN", "广汉"],
    ["PZI", "保安营机场", "保安营机场", "PZH ", "Panzhihua", "PZI", "攀枝花"],
    ["LZH", "白莲机场", "白莲机场", "LZ ", "Liuzhou", "LZH", "柳州"],
    ["HZG", "西关机场", "西关机场", "HZ ", "Hanzhong", "HZG", "汉中"],
    ["GYS", "广元机场", "广元机场", "GY ", "Guangyuan", "GYS", "广元"],
    ["WUS", "武夷山机场", "武夷山机场", "WYS ", "Wuyishan", "WUS", "武夷山"],
    ["XFN", "襄阳刘集机场", "刘集机场", "XF ", "Xiangfan", "XFN", "襄樊"],
    ["LNJ", "临沧机场", "临沧机场", "LC ", "Lincang", "LNJ", "临沧"],
    ["HPG", "神农架机场", "神农架机场", "SNJLQ ", "Shennongjialinqu", "HPG", "神农架林区"],
    ["KHG", "喀什机场", "喀什机场", "KS ", "KASHEN", "KHG", "喀什"],
    ["JHG", "西双版纳机场", "西双版纳机场", "XSBN ", "XSBN", "JHG", "西双版纳"],
    ["LYG", "连云港机场", "连云港机场", "LYG ", "Liangyungang", "LYG", "连云港"],
    ["WHU", "芜湖机场", "芜湖机场", "WH ", "Wuhu", "WHU", "芜湖"],
    ["DAX", "达县机场", "达县机场", "DX ", "Dazhou", "DAX", "达县"],
    ["TCG", "塔城机场", "塔城机场", "TC ", "Tacheng", "TCG", "塔城"],
    ["DQA", "萨尔图机场", "萨尔图机场", "DQ ", "Daqing", "DQA", "大庆"],
    ["ACX", "兴义机场", "兴义机场", "XY ", "XINGYI", "ACX", "兴义"],
    ["YBP", "菜坝机场", "菜坝机场", "YB ", "Yibin", "YBP", "宜宾"],
    ["AXF", "阿拉善左旗", "阿拉善左旗", "ALSZQ ", "ALASHANZUOQI", "AXF", "阿拉善左旗"],
    ["JIQ", "黔江舟白机场", "黔江舟白机场", "QJ ", "Qianjiang", "JIQ", "黔江舟白"],
    ["JGD", "加格达奇机场", "加格达奇机场", "JGDQ ", "JiaGeDaQi", "JGD", "加格达奇"],
    ["PNJ", "蓬莱机场", "蓬莱机场", "PL ", "Penglai", "PNJ", "蓬莱"],
    ["YIH", "三峡机场", "三峡机场", "YC ", "Yichang", "YIH", "宜昌"],
    ["WUH", "天河机场", "天河机场", "WH ", "Wuhan", "WUH", "武汉"],
    ["HDG", "邯郸机场", "邯郸机场", "HD ", "Handan", "HDG", "邯郸"],
    ["TGO", "通辽机场", "通辽机场", "TL ", "Tongliao", "TGO", "通辽"],
    ["DSN", "鄂尔多斯伊金霍洛国际机场", "伊金霍洛机场", "EEDS ", "Eerduosi", "DSN", "鄂尔多斯"],
    ["XIY", "咸阳国际机场", "咸阳国际机场", "XA ", "XIAN", "XIY", "西安"],
    ["LCX", "冠豸山机场", "冠豸山机场", "LY ", "LONGYAN", "LCX", "龙岩连城"],
    ["WUZ", "长洲岛机场", "长洲岛机场", "WZ ", "Wuzhou", "WUZ", "梧州"],
    ["JGN", "嘉峪关机场", "嘉峪关机场", "JYG ", "Jiayuguan", "JGN", "嘉峪关"],
    ["CIF", "赤峰玉龙机场", "赤峰机场", "CF ", "Chifeng", "CIF", "赤峰"],
    ["HCJ", "河池机场", "河池机场", "HC ", "HECHI", "HCJ", "广西荷花市"],
    ["TEN", "铜仁凤凰机场", "铜仁机场", "TR ", "Tongren", "TEN", "铜仁"],
    ["CHW", "酒泉机场", "酒泉机场", "JQ ", "Jiuquan", "CHW", "酒泉"],
    ["LLF", "零陵机场", "零陵机场", "YZ ", "Yongzhou", "LLF", "永州"],
    ["KGT", "康定机场", "康定机场", "KD ", "Kangding", "KGT", "康定"],
    ["MDG", "海浪机场", "海浪机场", "MDJ ", "Mudanjiang", "MDG", "牡丹江"],
    ["DLU", "大理机场", "大理机场", "DL ", "DALI", "DLU", "大理"],
    ["TVS", "三女河机场", "三女河机场", "TS ", "TANGSHAN", "TVS", "河北唐山市"],
    ["URC", "地窝堡国际机场", "地窝堡国际机场", "WLMQ ", "WUlumuqi", "URC", "乌鲁木齐"],
    ["AVA", "黄果树机场", "黄果树机场", "AS ", "Anshun", "AVA", "安顺"],
    ["DDG", "浪头机场", "浪头机场", "DD ", "DANDONG", "DDG", "丹东"],
    ["DAT", "大同机场", "大同机场", "DT ", "Datong", "DAT", "大同"],
    ["HYN", "台州路桥机场", "台州机场", "TZ ", "Taizhou", "HYN", "台州"],
    ["LLV", "吕梁大武机场", "吕梁机场", "LL ", "LU:LIANG", "LLV", "山西"],
    ["JUH", "九华山机场", "九华山机场", "CZ ", "CHIZHOU", "JUH", "安徽"],
    ["YCU", "关公机场", "关公机场", "YC ", "Yuncheng", "YCU", "运城"],
    ["GYU", "六盘山机场", "六盘山机场", "GY ", "GUYUAN", "GYU", "固原"],
    ["HLH", "乌兰浩特机场", "乌兰浩特机场", "WLHT ", "WUlanhot", "HLH", "乌兰浩特"],
    ["NDG", "齐齐哈尔机场", "齐齐哈尔机场", "QQHE ", "QIQIHAER", "NDG", "齐齐哈尔"],
    ["XUZ", "观音机场", "观音机场", "XZ ", "Xuzhou", "XUZ", "徐州"],
    ["CZX", "奔牛机场", "奔牛机场", "CZ ", "Changzhou", "CZX", "常州"],
    ["ENY", "二十里铺机场", "二十里铺机场", "YA ", "Yanan", "ENY", "延安"],
    ["BFJ", "毕节飞雄机场", "毕节飞雄机场", "BJ ", "Bijie", "BFJ", "毕节"],
    ["LYI", "临沂机场", "临沂机场", "LY ", "Linyi", "LYI", "临沂"],
    ["DOY", "东营机场", "东营机场", "DY ", "Dongying", "DOY", "东营"],
    ["JNZ", "小岭子机场", "小岭子机场", "JZ ", "Jinzhou", "JNZ", "锦州"],
    ["HXD", "德令哈机场", "德令哈机场", "DLH ", "DELINGHA", "HXD", "青海德令哈"],
    ["TLQ", "吐鲁番机场", "吐鲁番机场", "TLF ", "TULUFAN", "TLQ", "吐鲁番市西北郊"],
    ["LUM", "芒市机场", "芒市机场", "MS ", "MANGSHI", "LUM", "云南芒市（德宏州）"],
    ["HIA", "涟水机场", "涟水机场", "HA ", "Huaian", "HIA", "淮安"],
    ["KRY", "克拉玛依机场", "克拉玛依机场", "KLMY ", "Kalamayi", "KRY", "克拉玛依"],
    ["PVG", "浦东国际机场", "浦东国际机场", "SHPD ", "Shanghaipudong", "SHA", "上海浦东"],
    ["LHW", "中川机场", "中川机场", "LZ ", "Lanzhou", "LHW", "兰州"],
    ["LJG", "三义机场", "三义机场", "LJ ", "Lijiang", "LJG", "丽江"],
    ["SYX", "凤凰机场", "凤凰机场", "SY ", "Sanya", "SYX", "三亚"],
    ["JXA", "鸡西机场", "鸡西机场", "JX ", "Jixi", "JXA", "鸡西"],
    ["KWL", "桂林两江国际机场", "两江机场", "GL ", "Guilin", "KWL", "桂林"],
    ["JUZ", "衢州机场", "衢州机场", "QZ ", "Quzhou", "JUZ", "衢州"],
    ["PKX", "大兴机场", "南苑机场", "BJDX ", "BEIJINGDAXIn", "BJS", "北京大兴"],
    ["HRB", "太平国际机场", "太平国际机场", "HEB ", "Haerbin", "HRB", "哈尔滨"],
    ["ZAT", "昭通机场", "昭通机场", "ZT ", "Zhaotong", "ZAT", "昭通"],
    ["TAO", "青岛流亭国际机场", "青岛流亭国际机场", "QD ", "Qingdao", "TAO", "青岛"],
    ["CHG", "朝阳机场", "朝阳机场", "CY ", "Chaoyang", "CHG", "朝阳"],
    ["YTY", "扬州泰州机场", "扬州泰州机场", "YZ ", "Yangzhou", "YTY", "扬州"],
    ["JIL", "二台子机场", "二台子机场", "JL ", "Jilin", "JIL", "吉林"],
    ["FOC", "福州长乐国际机场", "福州长乐国际机场", "FZ ", "Fuzhou", "FOC", "福州"],
    ["CGD", "桃花源机场", "桃花源机场", "CD ", "Changde", "CGD", "常德"],
    ["HSQ", "黄石候机楼", "黄石候机楼", "HS ", "Huangshi", "HSQ", "黄石"],
    ["HAK", "美兰机场", "美兰机场", "HK ", "Haikou", "HAK", "海口"],
    ["CGQ", "龙嘉机场", "龙嘉机场", "CC ", "Changchun", "CGQ", "长春"],
    ["AEB", "百色机场", "百色机场", "BS ", "BOSE", "AEB", "百色"],
    ["KWE", "龙洞堡国际机场", "龙洞堡国际机场", "GY ", "Guiyang", "KWE", "贵阳"],
    ["KHN", "昌北机场", "昌北机场", "NC ", "Nanchang", "KHN", "南昌"],
    ["INC", "银川河东国际机场", "河东机场", "YC ", "Yinchuan", "INC", "银川"],
    ["PEK", "首都国际机场", "首都国际机场", "BJSD ", "Beijing", "BJS", "北京"],
    ["ZHY", "中卫机场", "中卫机场", "ZW ", "Zhongwei", "ZHY", "中卫"],
    ["YIE", "阿尔山机场", "阿尔山机场", "AES ", "Aershan", "YIE", "内蒙古"],
    ["GXH", "夏河机场", "夏河机场", "XH ", "XIAHE", "GXH", "夏河"],
    ["FYJ", "抚远东极机场", "抚远东极机场", "FY ", "FUYUAN", "FYJ", "抚远"],
    ["SHE", "桃仙机场", "桃仙机场", "SY ", "Shenyang", "SHE", "沈阳"],
    ["NTG", "兴东机场", "兴东机场", "NT ", "Nantong", "NTG", "南通"],
    ["NBS", "长白山机场", "长白山机场", "CBS ", "CHANGBAISHAN", "NBS", "长白山"],
    ["DLC", "周水子国际机场", "周水子国际机场", "DL ", "Dalian", "DLC", "大连"],
    ["NNY", "南阳机场", "南阳机场", "NY ", "NanYang", "NNY", "南阳"],
    ["KMG", "长水国际机场", "长水国际机场", "KM ", "Kunming", "KMG", "昆明"],
    ["YZY", "张掖机场", "张掖机场", "ZY ", "ZHANGYE", "YZY", "甘肃"],
    ["RLK", "天吉泰机场", "天吉泰机场", "BYNE ", "Bayannaoer", "RLK", "巴彦淖尔"],
    ["JIU", "庐山机场", "庐山机场", "JJ ", "Jiujiang", "JIU", "九江"],
    ["JZH", "九寨黄龙机场", "九寨沟机场", "JZG ", "Jiuzhaigou", "JZH", "九寨沟"],
    ["ERL", "赛乌苏国际机场", "赛乌苏国际机场", "ELHT ", "NULL", "ERL", "二连浩特"],
    ["TSN", "滨海国际机场", "滨海国际机场", "TJ ", "Tianjin", "TSN", "天津"],
    ["MXZ", "梅县机场", "梅县机场", "MX ", "Meizhou", "MXZ", "广东"],
    ["WUA", "乌海机场", "乌海机场", "WH ", "Wuhai", "WUA", "乌海"],
    ["BAV", "包头二里半机场", "二里半机场", "BT ", "Baotou", "BAV", "包头"],
    ["NLT", "那拉提机场", "那拉提机场", "NLT ", "NEILATI", "NLT", "新源那拉提"],
    ["ZYI", "遵义新舟机场", "遵义新舟机场", "ZY ", "Zunyi", "ZYI", "遵义"],
    ["YNZ", "南洋机场", "南洋机场", "YC ", "YANCHENG", "YNZ", "盐城"],
    ["LLB", "荔波机场", "荔波机场", "QN ", "LiBo", "LLB", "黔南"],
    ["SZX", "宝安国际机场", "宝安国际机场", "SZ ", "Shenzhen", "SZX", "深圳"],
    ["CAN", "白云机场", "白云机场", "GZ ", "Guangzhou", "CAN", "广州"],
    ["HFE", "新桥国际机场", "新桥国际机场", "HF ", "Hefei", "HFE", "合肥"],
    ["XIC", "西昌机场", "西昌机场", "XC ", "Xichang", "XIC", "西昌"],
    ["HLD", "呼伦贝尔东山国际机场", "东山机场", "HLE ", "Hailaer", "HLD", "海拉尔"],
    ["KJI", "喀纳斯机场", "喀纳斯机场", "KNS ", "KANASI", "KJI", "喀纳斯"],
    ["KCA", "库车机场", "库车机场", "KC ", "KUCHE", "KCA", "库车"],
    ["HEK", "黑河机场", "黑河机场", "HH ", "Heihe", "HEK", "黑河"],
    ["YNJ", "朝阳川机场", "朝阳川机场", "YJ ", "Yanji", "YNJ", "延吉"],
    ["DYG", "荷花机场", "荷花机场", "ZJJ ", "Zhangjiajie", "DYG", "张家界"],
    ["NZH", "满洲里西郊国际机场", "满洲里西郊机场", "MZL ", "Manzhouli", "NZH", "满洲里"],
    ["XMN", "高崎机场", "高崎机场", "XM ", "Xiamen", "XMN", "厦门"],
    ["NGB", "栎社国际机场", "栎社国际机场", "NB ", "Ningbo", "NGB", "宁波"],
    ["LZY", "林芝机场", "林芝机场", "LZ ", "Linzhi", "LZY", "林芝"],
    ["WNH", "普者黑机场", "普者黑机场", "WS ", "WENSHAN", "WNH", "文山"],
    ["KRL", "库尔勒机场", "库尔勒机场", "KEL ", "Korla", "KRL", "库尔勒"],
    ["AQG", "天柱山机场", "天柱山机场", "AQ ", "Anqing", "AQG", "安庆"],
    ["HJJ", "芷江机场", "芷江机场", "ZJ ", "Huaihua", "HJJ", "怀化"],
    ["TXN", "屯溪机场", "屯溪机场", "HS ", "Huangshan", "TXN", "黄山"],
    ["SHA", "虹桥国际机场", "虹桥国际机场", "SHHQ ", "Shanghai", "SHA", "上海虹桥"],
    ["NAO", "南充机场", "南充机场", "NC ", "Nanchong", "NAO", "南充"],
    ["CTU", "双流国际机场", "双流国际机场", "CD ", "Chengdu", "CTU", "成都"],
    ["UYN", "榆阳机场", "榆阳机场", "YL ", "Yulin", "UYN", "榆林"],
    ["AKA", "五里铺机场", "五里铺机场", "AK ", "Ankang", "AKA", "安康"],
    ["TYN", "武宿机场", "武宿机场", "TY ", "Taiyuan", "TYN", "太原"],
    ["YNT", "莱山机场", "莱山机场", "YT ", "Yantai", "YNT", "烟台"],
    ["WEF", "潍坊机场", "潍坊机场", "WF ", "Weifang", "WEF", "潍坊"],
    ["WEH", "文登机场", "文登机场", "WH ", "Weihai", "WEH", "威海"],
    ["LXA", "贡嘎机场", "贡嘎机场", "LS ", "LaSa", "LXA", "拉萨"],
    ["CKG", "江北国际机场", "江北国际机场", "CQ ", "Chongqing", "CKG", "重庆"],
    ["WNZ", "永强机场", "永强机场", "WZ ", "Wenzhou", "WNZ", "温州"],
    ["HGH", "萧山国际机场", "萧山国际机场", "HZ ", "Hangzhou", "HGH", "杭州"],
    ["BSD", "云瑞机场", "云瑞机场", "BS ", "Baoshan", "BSD", "保山"],
    ["CSX", "黄花机场", "黄花机场", "CS ", "Changsha", "CSX", "长沙"],
    ["SHP", "秦皇岛机场", "秦皇岛机场", "QHD ", "Qinhuangdao", "SHP", "秦皇岛"],
    ["TNA", "遥墙机场", "遥墙机场", "JN ", "Jinan", "TNA", "济南"],
    ["NKG", "禄口机场", "禄口机场", "NJ ", "Nanjing", "NKG", "南京"],
    ["TNH", "通化三源浦机场", "通化三源浦机场", "TH ", "Tonghua", "TNH", "通化"],
    ["DNH", "敦煌机场", "敦煌机场", "DH ", "Dunhuang", "DNH", "敦煌"],
    ["XNN", "曹家堡机场", "曹家堡机场", "XN ", "Xining", "XNN", "西宁"],
    ["NNG", "吴圩机场", "吴圩机场", "NN ", "Nanning", "NNG", "南宁"],
    ["LYA", "洛阳机场", "洛阳机场", "LY ", "LuoYang", "LYA", "洛阳"],
    ["SJW", "正定国际机场", "正定国际机场", "SJZ ", "Shijiazhuang", "SJW", "石家庄"],
    ["WUX", "苏南硕放国际机场", "苏南硕放国际机场", "WX ", "Wuxi", "WUX", "无锡"],
    ["AAT", "阿勒泰机场", "阿勒泰机场", "ALT ", "Altay", "AAT", "阿勒泰"],
    ["BHY", "福城机场", "福城机场", "BH ", "Beihai", "BHY", "北海"],
    ["ZUH", "珠海机场", "珠海机场", "ZH ", "Zhuhai", "ZUH", "珠海"],
    ["ZQZ", "张家口机场", "张家口机场", "ZJK ", "ZHANGJIAKOU", "ZQZ", "河北张家口"],
    ["HUZ", "惠州机场", "惠州机场", "HZ ", "Huizhou", "HUZ", "惠州"],
    ["FUO", "佛山机场", "佛山机场", "FS ", "Fuoshan", "FUO", "佛山"]
]


module.exports = {
  domesticCity: domesticCity
}
*/