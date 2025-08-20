world.addCollisionFilter(`player`, `player`)

const SPECIAL_PLAYER = {
        BOX3OFFICER: ['吉吉喵', '搬砖喵', '美术喵'],//官方
        WRITER: '草灵灵2020',//作者
}//特殊玩家

const spawnPointadd = 5;

//由于AP的一些问题，已经在下面将'P'断言为voxelName
class playerEntity extends GameEntity {
        isspecial:boolean;
        Voxels: voxelName | voxelId;
        Rotation: voxelRotation;
        player_setting: {
                player_cameraMode: {
                        Setting: GameCameraMode,
                        CH: string,
                },
                player_LIZI: {
                        Things: {
                                Rate: number,
                                RateSpread: number,
                                Limit: number,
                                LimitTime: number,
                                LimitTimeSpread: number,
                                Size: number[],
                                SizeSpread: number,
                                Color: GameRGBColor[],
                                Velocity: GameVector3,
                                VelocitySpread: GameVector3,
                                Damping: number,
                                Acceleration: GameVector3,
                                Noise: number,
                                NoiseFrequency: number,
                        },
                },
                player_fly: {
                        Setting: boolean,
                        CH: string,
                }
        }
        constructor() {
                super()

                this.isspecial = false;
                this.Voxels = `grass`;
                this.Rotation = 1;
                this.player_setting = {
                        player_cameraMode: {
                                Setting: GameCameraMode.FOLLOW,
                                CH: `第三人称跟踪视角`,
                        },
                        player_LIZI: {
                                Things: {
                                        Rate: 0,
                                        RateSpread: 0,
                                        Limit: 0,
                                        LimitTime: 0,
                                        LimitTimeSpread: 0,
                                        Size: [0, 0],
                                        SizeSpread: 0,
                                        Color: [new GameRGBColor(0, 0, 0), new GameRGBColor(0, 0, 0)],
                                        Velocity: new GameVector3(0, 0, 0),
                                        VelocitySpread: new GameVector3(0, 0, 0),
                                        Damping: 0,
                                        Acceleration: new GameVector3(0, 0, 0),
                                        Noise: 0,
                                        NoiseFrequency: 0,
                                },
                        },
                        player_fly: {
                                Setting: false,
                                CH: `关`,
                        }
                }
        }
}

world.onPlayerJoin(({ entity: PE }) => {
        const entity = <playerEntity & { player: GamePlayer; readonly isPlayer: true; }>PE
        world.say(`热烈欢迎玩家${entity.player.name}进入地图！`);
        const spawnPoint = world.querySelector('#蓝色重生点（出生点）-1');
        if (typeof spawnPoint === null) console.log(`未能通过选择器“#蓝色重生点”找到实体！`); else if (spawnPoint instanceof GameEntity) entity.player.spawnPoint = spawnPoint.position;
        entity.position.copy(entity.player.spawnPoint);
        entity.position.y += spawnPointadd;
        entity.player.enable3DCursor = true;//开启方块光标
        entity.isspecial = false;
        entity.Voxels = `grass`
        entity.Rotation = 1
        entity.player_setting = {
                player_cameraMode: {
                        Setting: GameCameraMode.FOLLOW,
                        CH: `第三人称跟踪视角`,
                },
                player_LIZI: {
                        Things: {
                                Rate: 0,
                                RateSpread: 0,
                                Limit: 0,
                                LimitTime: 0,
                                LimitTimeSpread: 0,
                                Size: [0, 0],
                                SizeSpread: 0,
                                Color: [new GameRGBColor(0, 0, 0), new GameRGBColor(0, 0, 0)],
                                Velocity: new GameVector3(0, 0, 0),
                                VelocitySpread: new GameVector3(0, 0, 0),
                                Damping: 0,
                                Acceleration: new GameVector3(0, 0, 0),
                                Noise: 0,
                                NoiseFrequency: 0,
                        },
                },
                player_fly: {
                        Setting: false,
                        CH: `关`,
                }
        }
        if (SPECIAL_PLAYER.WRITER === entity.player.name) {//是作者
                world.say(`作者来了，有问题请及时反馈！`);
                entity.isspecial = true;
        };
        if (!SPECIAL_PLAYER.BOX3OFFICER.includes(entity.player.name)) return;//是官方
        world.say(`稀有的官方 ${entity.player.name} 出现！`);
        entity.isspecial = true;
});

world.onChat(({ entity, message }) => {
        if (entity.player && message === '重生') {
                const spawnPoint = world.querySelector('#蓝色重生点（出生点）-1');
                if (typeof spawnPoint === null) console.log(`未能通过选择器“#蓝色重生点”找到实体！`); else if (spawnPoint instanceof GameEntity) entity.player.spawnPoint = spawnPoint.position;
                entity.position.copy(entity.player.spawnPoint);
                entity.position.y += spawnPointadd;
                entity.player.directMessage('你已重生完毕！');
        };
});

world.onPress(({ raycast, button, entity: PE }) => {
        const entity = <playerEntity & { player: GamePlayer; readonly isPlayer: true; }>PE
        if (button === GameButtonType.ACTION0) {//如果玩家按下鼠标左键
                const pos = raycast.voxelIndex;
                voxels.setVoxel(pos.x, pos.y, pos.z, `air`);//破坏焦点方块
        };
        if (button === GameButtonType.ACTION1) {//如果玩家按下鼠标右键
                const pos = raycast.voxelIndex.add(raycast.normal);
                voxels.setVoxel(pos.x, pos.y, pos.z, entity.Voxels, entity.Rotation);//建造方块
        };
});

world.onPlayerLeave(({ entity }) => {
        world.say(`玩家${entity.player.name}离开了，欢迎下次回来！`);
});

const VOXELS_LIST = {
        NAME: ['纯色方块■', '自然方块■', '建筑方块■', '灯类方块■', '动态方块■', '叠色方块■', '字符串方块■'],//方块列表
        CH: {
                COLOUR_VOXELS: ['红', '橙', '黄', '绿', '蓝', '紫', '粉'],//纯色方块
                WORLD_VOXELS: ['草地', '泥土', '石头', '水', '绿叶', '木头', '雪地', '冰', '蜘蛛网', '竹子', '岩浆'],//自然方块
                BUILD_VOXELS: ['木板', '冰砖', '石砖', '窗', '玻璃', '木盒', '不锈钢', '冰墙', '蓝色玻璃', '红色玻璃', '绿色玻璃', '黑色玻璃', '快递箱', '电视', '书架', '礼物（红）', '礼物（蓝）', '风道', '按钮', '工具箱', '弹跳垫'],//建筑方块
                LIGHT_VOXELS: ['灯笼01', '灯笼02', 'led地板01', 'led地板02', '南瓜灯', '星星灯', '雪花灯', '蓝色星形灯带', '绿色星形灯带', '红色星形灯带', '黄色星形灯带', '彩虹灯', '古灯', '其他灯01', '其他灯02', '其他灯03', '其他灯04', '红', '橙', '黄', '绿', '蓝', '紫', '粉', '白'],//灯类方块
                CANDO_VOXELS: ['电梯', '风扇', '被风吹的草'],//动态方块
                COLORS_VOXELS: ['深浅粉', '黑白', '深浅蓝', '深浅绿', '深浅黄', '深浅紫', '深浅红', '粉红蛋糕', '马卡龙', '饼干'],//叠色方块
                ABC_VOXELS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '＋', '－', '×', '÷', '=', '！', '？', '&', '✲', '@', '＼', ']', '[', '^', '’', '$', '>', '<', '{', '}', '%', '.', '#', '"', ';', '/', '~'],//字符串方块
        },
}

const COLOR = {
        T: {
                TEXT: new GameRGBAColor(1, 0, 0, 1),
                BG: new GameRGBAColor(0, 0, 1, 0.5),
        },
        C: {
                TEXT: new GameRGBAColor(0, 1, 0, 1),
                BG: new GameRGBAColor(0, 0, 1, 0.5),
        },
}

const CHOOSE = world.querySelector('#控制台-1');
if (typeof CHOOSE === null) console.log(`未能通过选择器“#控制台-1”找到实体！`); else if (CHOOSE instanceof GameEntity) {
        CHOOSE.enableInteract = true;
        CHOOSE.interactRadius = 256;
        CHOOSE.interactHint = '控制台-菜单'
        CHOOSE.interactColor = new GameRGBColor(0, 225, 0);

        CHOOSE.onInteract(async ({ entity: PE }) => {
                const entity = <playerEntity & { player: GamePlayer; readonly isPlayer: true; }>PE
                const result = await entity.player.dialog({//菜单
                        type: GameDialogType.SELECT,
                        title: "控制台-菜单",
                        titleTextColor: COLOR.T.TEXT,
                        titleBackgroundColor: COLOR.T.BG,
                        content: `请选择服务。（此文字显示将改为玩家信息展示，敬请期待~）`,
                        options: ['■方块切换', `更改方块旋转码（当前方块旋转码：${entity.Rotation}）`, '玩家控制', '将来会有更多服务，敬请期待~'], //'玩家控制',
                        contentTextColor: COLOR.C.TEXT,
                        contentBackgroundColor: COLOR.C.BG,
                        lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                        lookTarget: entity,
                });

                if (!result || result === null) { return; }

                switch (result.index) {//菜单
                        case 0: //方块
                                othervoxel(entity)
                                break;
                        case 1:
                                Rotationset(entity)
                                break;
                        case 2:
                                EntityPlayerSetting(entity)
                                break;
                        default:

                }

        })
}


async function EntityPlayerSetting(EntityPlayerSetting_MyShelf_Entity: playerEntity & { player: GamePlayer; readonly isPlayer: true; }) {
        const result2 = await EntityPlayerSetting_MyShelf_Entity.player.dialog({
                type: GameDialogType.SELECT,
                title: "玩家控制",
                titleTextColor: COLOR.T.TEXT,
                titleBackgroundColor: COLOR.T.BG,
                content: `${EntityPlayerSetting_MyShelf_Entity.player.name} --------------------玩家控制`,
                options: [`飞行开关（当前状态：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_fly.CH}，点此切换）`, `切换视角（当前状态： ${EntityPlayerSetting_MyShelf_Entity.player_setting.player_cameraMode.CH}）`, `粒子特效`],   // 将提供玩家选择的选项放入数组里。
                contentTextColor: COLOR.C.TEXT,
                contentBackgroundColor: COLOR.C.BG,
                lookEye: EntityPlayerSetting_MyShelf_Entity.position.add(EntityPlayerSetting_MyShelf_Entity.player.facingDirection.scale(5)),
                lookTarget: EntityPlayerSetting_MyShelf_Entity,
        });

        if (!result2 || result2 === null) { return; }

        switch (result2.index) {
                case 0:
                        if (EntityPlayerSetting_MyShelf_Entity.player_setting.player_fly.Setting) {
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_fly.Setting = false;
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_fly.CH = `关`
                        } else {
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_fly.Setting = true;
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_fly.CH = `开`
                        }
                        EntityPlayerSetting_MyShelf_Entity.player.canFly = EntityPlayerSetting_MyShelf_Entity.player_setting.player_fly.Setting;
                        break;
                case 1:
                        if (EntityPlayerSetting_MyShelf_Entity.player_setting.player_cameraMode.Setting === GameCameraMode.FOLLOW) {
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_cameraMode.Setting = GameCameraMode.FPS;
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_cameraMode.CH = `第一人称`
                        } else {
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_cameraMode.Setting = GameCameraMode.FOLLOW;
                                EntityPlayerSetting_MyShelf_Entity.player_setting.player_cameraMode.CH = `第三人称跟踪视角`
                        }
                        EntityPlayerSetting_MyShelf_Entity.player.cameraMode = EntityPlayerSetting_MyShelf_Entity.player_setting.player_cameraMode.Setting;
                        break;
                case 2:
                        const LIZI_choose = await EntityPlayerSetting_MyShelf_Entity.player.dialog({
                                type: GameDialogType.SELECT,
                                title: `粒子特效`,
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `请选择设置项。`,
                                options: [
                                        `每秒粒子量 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Rate}`,
                                        `数量随机性 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.RateSpread}`,
                                        `数量上限 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Limit}`,
                                        `存活秒数 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.LimitTime}`,
                                        `随机性 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.LimitTimeSpread}`,
                                        `大小变化 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Size}`,
                                        `大小随机性 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.SizeSpread}`,
                                        `颜色变化 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Color}`,
                                        `初始速度 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Velocity}`,
                                        `速度随机性 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.VelocitySpread}`,
                                        `阻尼系数 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Damping}`,
                                        `加速度 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Acceleration}`,
                                        `粒子摆动最大幅度 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.Noise}`,
                                        `摆动频率 当前：${EntityPlayerSetting_MyShelf_Entity.player_setting.player_LIZI.Things.NoiseFrequency}`
                                ],
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: EntityPlayerSetting_MyShelf_Entity.position.add(EntityPlayerSetting_MyShelf_Entity.player.facingDirection.scale(5)),
                                lookTarget: EntityPlayerSetting_MyShelf_Entity,
                        })

                        if (!LIZI_choose || LIZI_choose === null) { return; }

                        LIZI_Setting(EntityPlayerSetting_MyShelf_Entity, LIZI_choose)

                        break;
                default:
        }
}

async function LIZI_Setting(LIZI_Setting_Entity:playerEntity & { player: GamePlayer; readonly isPlayer: true; }, Options:GameDialogSelectResponse) {
        switch (Options.index) {
                case 0:
                        break;
                default:
        }
}

async function Rotationset(Rotationset_MyShelf_Entity:playerEntity & { player: GamePlayer; readonly isPlayer: true; }) {
        const ROT = await Rotationset_MyShelf_Entity.player.dialog({
                type: GameDialogType.INPUT,
                title: `方块旋转码（当前方块旋转码：${Rotationset_MyShelf_Entity.Rotation}）`,
                titleTextColor: COLOR.T.TEXT,
                titleBackgroundColor: COLOR.T.BG,
                content: `请输入方块旋转码（当前方块旋转码：${Rotationset_MyShelf_Entity.Rotation}）`,
                confirmText: '确认更改',
                placeholder: '方块旋转码是1~4的数字',
                contentTextColor: COLOR.C.TEXT,
                contentBackgroundColor: COLOR.C.BG,
                lookEye: Rotationset_MyShelf_Entity.position.add(Rotationset_MyShelf_Entity.player.facingDirection.scale(5)),
                lookTarget: Rotationset_MyShelf_Entity,
        });

        if (!ROT || ROT === null) { return }

        if (!(ROT === `1` || ROT === `2` || ROT === `3` || ROT === `4`)) {
                Rotationset_MyShelf_Entity.player.directMessage(`方块旋转码是1~4的数字！！！`)
                return;
        } else {
                Rotationset_MyShelf_Entity.Rotation = <voxelRotation><number><unknown>ROT
                Rotationset_MyShelf_Entity.player.directMessage(`设置成功！当前方块旋转码： ${Rotationset_MyShelf_Entity.Rotation} `)
        }
}

async function othervoxel(entity:playerEntity & { player: GamePlayer; readonly isPlayer: true; }) {
        const result0 = await entity.player.dialog({//方块
                type: GameDialogType.SELECT,
                title: "■方块切换",
                titleTextColor: COLOR.T.TEXT,
                titleBackgroundColor: COLOR.T.BG,
                content: `■请选择方块类型`,
                options: VOXELS_LIST.NAME,
                contentTextColor: COLOR.C.TEXT,
                contentBackgroundColor: COLOR.C.BG,
                lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                lookTarget: entity,
        });

        if (!result0 || result0 === null) { return; }

        switch (result0.index) {//方块
                case 0: //纯色方块
                        const result1 = await entity.player.dialog({//
                                type: GameDialogType.SELECT,
                                title: "【选择方块■】纯色方块■",
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `■请选择具体方块`,
                                options: VOXELS_LIST.CH.COLOUR_VOXELS,
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                                lookTarget: entity,
                        });

                        if (!result1 || result1 === null) { return; }

                        switch (result1.index) {//纯色方块
                                case 0:
                                        entity.Voxels = 'red'
                                        break;
                                case 1:
                                        entity.Voxels = 'orange'
                                        break;
                                case 2:
                                        entity.Voxels = 'medium_yellow'
                                        break;
                                case 3:
                                        entity.Voxels = 'medium_green'
                                        break;
                                case 4:
                                        entity.Voxels = 'blue'
                                        break;
                                case 5:
                                        entity.Voxels = 'medium_purple'
                                        break;
                                case 6:
                                        entity.Voxels = 'pink'
                                        break;
                                default:
                        }
                        break;
                case 1:
                        const result2 = await entity.player.dialog({
                                type: GameDialogType.SELECT,
                                title: "【选择方块■】自然方块■",
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `■请选择具体方块`,
                                options: VOXELS_LIST.CH.WORLD_VOXELS,
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                                lookTarget: entity,
                        });

                        if (!result2 || result2 === null) { return; }

                        switch (result2.index) {
                                case 0:
                                        entity.Voxels = 'grass'
                                        break;
                                case 1:
                                        entity.Voxels = 'dirt'
                                        break;
                                case 2:
                                        entity.Voxels = 'stone'
                                        break;
                                case 3:
                                        entity.Voxels = 'water'
                                        break;
                                case 4:
                                        entity.Voxels = 'green_leaf'
                                        break;
                                case 5:
                                        entity.Voxels = 'wood'
                                        break;
                                case 6:
                                        entity.Voxels = 'snowland'
                                        break;
                                case 7:
                                        entity.Voxels = 'ice'
                                        break;
                                case 8:
                                        entity.Voxels = 'spiderweb'
                                        break;
                                case 9:
                                        entity.Voxels = 'bamboo'
                                        break;
                                case 10:
                                        entity.Voxels = 'lava02'
                                        break;
                                default:

                        }
                        break;
                case 2:
                        const result3 = await entity.player.dialog({
                                type: GameDialogType.SELECT,
                                title: "【选择方块■】建筑方块■",
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `请选择具体方块■`,
                                options: VOXELS_LIST.CH.BUILD_VOXELS,
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                                lookTarget: entity,
                        });

                        if (!result3 || result3 === null) { return; }

                        switch (result3.index) {
                                case 0:
                                        entity.Voxels = 'plank_02'
                                        break;
                                case 1:
                                        entity.Voxels = 'ice_brick'
                                        break;
                                case 2:
                                        entity.Voxels = 'grey_stone_brick'
                                        break;
                                case 3:
                                        entity.Voxels = 'window'
                                        break;
                                case 4:
                                        entity.Voxels = 'glass'
                                        break;
                                case 5:
                                        entity.Voxels = 'wooden_box'
                                        break;
                                case 6:
                                        entity.Voxels = 'stainless_steel'
                                        break;
                                case 7:
                                        entity.Voxels = 'ice_wall'
                                        break;
                                case 8:
                                        entity.Voxels = 'blue_glass'
                                        break;
                                case 9:
                                        entity.Voxels = 'red_glass'
                                        break;
                                case 10:
                                        entity.Voxels = 'green_glass'
                                        break;
                                case 11:
                                        entity.Voxels = 'black_glass'
                                        break;
                                case 12:
                                        entity.Voxels = 'express_box'
                                        break;
                                case 13:
                                        entity.Voxels = 'television'
                                        break;
                                case 14:
                                        entity.Voxels = 'bookshelf'
                                        break;
                                case 15:
                                        entity.Voxels = 'red_gift'
                                        break;
                                case 16:
                                        entity.Voxels = 'blue_gift'
                                        break;
                                case 17:
                                        entity.Voxels = 'air_duct'
                                        break;
                                case 18:
                                        entity.Voxels = 'button'
                                        break;
                                case 19:
                                        entity.Voxels = 'toolbox'
                                        break;
                                case 20:
                                        entity.Voxels = 'bounce_pad'
                                        break;
                                default:

                        }
                        break;
                case 3:
                        const result4 = await entity.player.dialog({
                                type: GameDialogType.SELECT,
                                title: "【选择方块■】灯类方块■",
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `请选择具体方块■`,
                                options: VOXELS_LIST.CH.LIGHT_VOXELS,
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                                lookTarget: entity,
                        });

                        if (!result4 || result4 === null) { return; }

                        switch (result4.index) {
                                case 0:
                                        entity.Voxels = 'lantern_01'
                                        break;
                                case 1:
                                        entity.Voxels = 'lantern_02'
                                        break;
                                case 2:
                                        entity.Voxels = 'ledfloor01'
                                        break;
                                case 3:
                                        entity.Voxels = 'ledfloor02'
                                        break;
                                case 4:
                                        entity.Voxels = 'pumpkin_lantern'
                                        break;
                                case 5:
                                        entity.Voxels = 'star_lamp'
                                        break;
                                case 6:
                                        entity.Voxels = 'snowflake_lamp'
                                        break;
                                case 7:
                                        entity.Voxels = 'blue_decorative_light'
                                        break;
                                case 8:
                                        entity.Voxels = 'green_decorative_light'
                                        break;
                                case 9:
                                        entity.Voxels = 'red_decorative_light'
                                        break;
                                case 10:
                                        entity.Voxels = 'yellow_decorative_light'
                                        break;
                                case 11:
                                        entity.Voxels = 'rainbow_cube'
                                        break;
                                case 12:
                                        entity.Voxels = 'palace_lamp'
                                        break;
                                case 13:
                                        entity.Voxels = 'lab_lamp_01'
                                        break;
                                case 14:
                                        entity.Voxels = 'lab_lamp_02'
                                        break;
                                case 15:
                                        entity.Voxels = 'lab_lamp_03'
                                        break;
                                case 16:
                                        entity.Voxels = 'lab_material_05'
                                        break;
                                case 17:
                                        entity.Voxels = 'red_light'
                                        break;
                                case 18:
                                        entity.Voxels = 'orange_light'
                                        break;
                                case 19:
                                        entity.Voxels = 'yellow_light'
                                        break;
                                case 20:
                                        entity.Voxels = 'green_light'
                                        break;
                                case 21:
                                        entity.Voxels = 'blue_light'
                                        break;
                                case 22:
                                        entity.Voxels = 'purple'
                                        break;
                                case 23:
                                        entity.Voxels = 'pink_light'
                                        break;
                                case 24:
                                        entity.Voxels = 'white_light'
                                        break;
                                default:

                        }
                        break;
                case 4:
                        const result5 = await entity.player.dialog({
                                type: GameDialogType.SELECT,
                                title: "【选择方块■】动态方块",
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `请选择具体方块■`,
                                options: VOXELS_LIST.CH.CANDO_VOXELS,
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                                lookTarget: entity,
                        });

                        if (!result5 || result5 === null) { return; }

                        switch (result5.index) {
                                case 0:
                                        entity.Voxels = 'conveyor'
                                        break;
                                case 1:
                                        entity.Voxels = 'fan'
                                        break;
                                case 2:
                                        entity.Voxels = 'windygrass'
                                        break;
                                default:

                        }

                        break;
                case 5:
                        const result6 = await entity.player.dialog({
                                type: GameDialogType.SELECT,
                                title: "【选择方块■】叠色方块■",
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `请选择具体方块■`,
                                options: VOXELS_LIST.CH.COLORS_VOXELS,
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: entity.position.add(entity.player.facingDirection.scale(5)),
                                lookTarget: entity,
                        });

                        if (!result6 || result6 === null) { return; }

                        switch (result6.index) {
                                case 0:
                                        entity.Voxels = 'carpet_03'
                                        break;
                                case 1:
                                        entity.Voxels = 'carpet_08'
                                        break;
                                case 2:
                                        entity.Voxels = 'carpet_09'
                                        break;
                                case 3:
                                        entity.Voxels = 'carpet_10'
                                        break;
                                case 4:
                                        entity.Voxels = 'carpet_11'
                                        break;
                                case 5:
                                        entity.Voxels = 'carpet_12'
                                        break;
                                case 6:
                                        entity.Voxels = 'carpet_13'
                                        break;
                                case 7:
                                        entity.Voxels = 'pink_cake'
                                        break;
                                case 8:
                                        entity.Voxels = 'macaroon'
                                        break;
                                case 9:
                                        entity.Voxels = 'biscuit'
                                        break;
                                default:

                        }

                        break;
                case 6:
                        const result7 = await entity.player.dialog({
                                type: GameDialogType.SELECT,
                                title: "【选择方块■】字符串方块■",
                                titleTextColor: COLOR.T.TEXT,
                                titleBackgroundColor: COLOR.T.BG,
                                content: `请选择具体方块■`,
                                options: VOXELS_LIST.CH.ABC_VOXELS,
                                contentTextColor: COLOR.C.TEXT,
                                contentBackgroundColor: COLOR.C.BG,
                                lookEye: entity.position.add(entity.position.add(entity.player.facingDirection.scale(5))),
                                lookTarget: entity,
                        });

                        if (!result7 || result7 === null) { return; }

                        switch (result7.index) {
                                case 0:
                                        entity.Voxels = 'A'
                                        break;
                                case 1:
                                        entity.Voxels = 'B'
                                        break;
                                case 2:
                                        entity.Voxels = 'C'
                                        break;
                                case 3:
                                        entity.Voxels = 'D'
                                        break;
                                case 4:
                                        entity.Voxels = 'E'
                                        break;
                                case 5:
                                        entity.Voxels = 'F'
                                        break;
                                case 6:
                                        entity.Voxels = 'G'
                                        break;
                                case 7:
                                        entity.Voxels = 'H'
                                        break;
                                case 8:
                                        entity.Voxels = 'I'
                                        break;
                                case 9:
                                        entity.Voxels = 'J'
                                        break;
                                case 10:
                                        entity.Voxels = 'K'
                                        break;
                                case 11:
                                        entity.Voxels = 'L'
                                        break;
                                case 12:
                                        entity.Voxels = 'M'
                                        break;
                                case 13:
                                        entity.Voxels = 'N'
                                        break;
                                case 14:
                                        entity.Voxels = 'O'
                                        break;
                                case 15:
                                        entity.Voxels = <voxelName>'P'
                                        break;
                                case 16:
                                        entity.Voxels = 'Q'
                                        break;
                                case 17:
                                        entity.Voxels = 'R'
                                        break;
                                case 18:
                                        entity.Voxels = 'S'
                                        break;
                                case 19:
                                        entity.Voxels = 'T'
                                        break;
                                case 20:
                                        entity.Voxels = 'U'
                                        break;
                                case 21:
                                        entity.Voxels = 'V'
                                        break;
                                case 22:
                                        entity.Voxels = 'W'
                                        break;
                                case 23:
                                        entity.Voxels = 'X'
                                        break;
                                case 24:
                                        entity.Voxels = 'Y'
                                        break;
                                case 25:
                                        entity.Voxels = 'Z'
                                        break;
                                case 26:
                                        entity.Voxels = 'zero'
                                        break;
                                case 27:
                                        entity.Voxels = 'one'
                                        break;
                                case 28:
                                        entity.Voxels = 'two'
                                        break;
                                case 29:
                                        entity.Voxels = 'three'
                                        break;
                                case 30:
                                        entity.Voxels = 'four'
                                        break;
                                case 31:
                                        entity.Voxels = 'five'
                                        break;
                                case 32:
                                        entity.Voxels = 'six'
                                        break;
                                case 33:
                                        entity.Voxels = 'seven'
                                        break;
                                case 34:
                                        entity.Voxels = 'eight'
                                        break;
                                case 35:
                                        entity.Voxels = 'nine'
                                        break;
                                case 36:
                                        entity.Voxels = 'add'
                                        break;
                                case 37:
                                        entity.Voxels = 'subtract'
                                        break;
                                case 38:
                                        entity.Voxels = 'multiply'
                                        break;
                                case 39:
                                        entity.Voxels = 'divide'
                                        break;
                                case 40:
                                        entity.Voxels = 'exclamation_mark'
                                        break;
                                case 41:
                                        entity.Voxels = 'question_mark'
                                        break;
                                case 42:
                                        entity.Voxels = 'ampersand'
                                        break;
                                case 43:
                                        entity.Voxels = 'asterisk'
                                        break;
                                case 44:
                                        entity.Voxels = 'at'
                                        break;
                                case 45:
                                        entity.Voxels = 'backslash'
                                        break;
                                case 46:
                                        entity.Voxels = 'bracket_close'
                                        break;
                                case 47:
                                        entity.Voxels = 'bracket_open'
                                        break;
                                case 48:
                                        entity.Voxels = 'caret'
                                        break;
                                case 49:
                                        entity.Voxels = 'colon'
                                        break;
                                case 50:
                                        entity.Voxels = 'comma'
                                        break;
                                case 51:
                                        entity.Voxels = 'dollar'
                                        break;
                                case 52:
                                        entity.Voxels = 'greater_than'
                                        break;
                                case 53:
                                        entity.Voxels = 'less_than'
                                        break;
                                case 54:
                                        entity.Voxels = 'paren_open'
                                        break;
                                case 55:
                                        entity.Voxels = 'paren_close'
                                        break;
                                case 56:
                                        entity.Voxels = 'percent'
                                        break;
                                case 57:
                                        entity.Voxels = 'period'
                                        break;
                                case 58:
                                        entity.Voxels = 'pound'
                                        break;
                                case 59:
                                        entity.Voxels = 'quotation_mark'
                                        break;
                                case 60:
                                        entity.Voxels = 'semicolon'
                                        break;
                                case 61:
                                        entity.Voxels = 'slash'
                                        break;
                                case 62:
                                        entity.Voxels = 'tilde'
                                        break;
                                default:

                        }

                        break;
                default:

        }

}