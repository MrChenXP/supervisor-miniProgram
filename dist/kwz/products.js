// "comments": "去Strong里拿_commonMenus，的FUN_ID"

export default {
    "workspace": [{
        "proId": "0cacf838bfb6493994b7625a07cc246a",
        "children": [
            {
                "funId": "44c22ba9992c479183353d1406c91f16",
                "proId": "3758a16aa4e14b3d87bb1f9c7e2fc509",
                "link": "/pages/zggz/zggz",
                "icon": "/static/images/icons/wj.png",
                "comments": "整改工作"
            }, {
                "funId": "295dc445db8e4558a4ca9d24975000d3",
                "proId": "ebc60e699bc642a1871f1e017b979483",
                "link": "/pages/xcdd/xcdd",
                "icon": "/static/images/icons/video.png",
                "comments": "督导记录"
            }, {
                "funId": "d015a61dc3f44a60aff9d7c4cf918778",
                "proId": "b892eba5fae9493189ac81a510bbbd73",
                "link": "/pages/gzjh/gzjh",
                "icon": "/static/images/icons/jsb.png",
                "comments": "工作计划"
            }, {
                "funId": "5f0c4c3eb30b4e8b9bb7d8ebe3dd66b4",
                "proId": "cd5235ad9e2d463a9af919de06dcfb06",
                "link": "/pages/tkjl/tkjl",
                "icon": "/static/images/icons/edit.png",
                "comments": "听课记录"
            }
        ]
    },
    // 坪山的工作计划在“新督导”下面
    {
        "proId": "a92d4b68d3ad457b81e8ef641b5b48f0",
        "children": [{
            "funId": "d015a61dc3f44a60aff9d7c4cf918778",
            "proId": "3cb4d4fd5ba64194ac74657221b95b52",
            "link": "/pages/gzjh/gzjh",
            "icon": "/static/images/icons/rx.png",
            "comments": "新工作计划"
        }]
    },
    {
        "proId": "9be835829982442a9bdd43e9fc33e7d5",
        "children": [{
            "funId": "f7ea5194aa134350af213e8aa55d8b71",
            "proId": "3280df52804e4509ab02f315b9215f09",
            "link": "/pages/xxglddb/xxglddb",
            "icon": "/static/images/icons/rx.png",
            "comments": "学校管理督导版"
        }]
    },
    { // 高新网没有‘学校管理督导版’所以用‘学校管理’的id  且'学校管理'挂在'挂牌督导'下
        "proId": "0cacf838bfb6493994b7625a07cc246a",
        "children": [{
            "funId": "387bb0a5bad34fb6b0f2bc6ed8f37c31",
            "proId": "11662d8f782f4fd28b353c68fe819c3b",

            "link": "/pages/xxglddb/xxglddb",
            "icon": "/static/images/icons/rx.png",
            "comments": "学校管理督导版"
        }]
    },
    {
        "proId": "13aae6758c564d53a6ea3d4458ff46fe",
        "children": [{
            "funId": "17c3ddfceefa4486a7f023f02f0708d0",
            "proId": "28e42de931a64c5a988ffd454b8f3a43",
            "link": "/pages/dxgl/dxgl",
            "icon": "/static/images/icons/group.png",
            "comments": "督学管理"
        }]
    },
    {
        "proId": "fcf4e6d8bd9641988f6252e7143642e7",
        "children": [{
            "funId": "666bcfa029514002a1649fb3c34d1d31",
            "proId": "4d0aa00009364de280bf33e38c14464d",
            "link": "/pages/dxsl/dxsl",
            "icon": "/static/images/icons/bbs.png",
            "comments": "督学沙龙"
        }]
    },
    { // 高新网“督学沙龙”挂在"互动交流"下
        "proId": "63aee6ba61ec4c2483351ef0d9fd8e24",
        "children": [{
            "funId": "666bcfa029514002a1649fb3c34d1d31",
            "proId": "39395dd2a00c40c59bb771d968de873d",
            "link": "/pages/dxsl/dxsl",
            "icon": "/static/images/icons/bbs.png",
            "comments": "督学沙龙"
        }]
    }
    ]
}