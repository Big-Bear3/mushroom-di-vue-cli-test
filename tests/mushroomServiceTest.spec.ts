import { of, MushroomService, Message, by, registerDepsConfig } from 'mushroom-di';
import { ScopedClassesConfig } from './test-classes/classesConfig';
import { MonkeyChief, YellowMonkeyChief } from './test-classes/configedClasses';

Message.toggleConsolePrintable(false);

registerDepsConfig(ScopedClassesConfig);

test('只能通过依赖注入的方式创建MushroomService实例', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    of(MushroomService);
    expect(messageHistory.length).toBe(0);

    try {
        new MushroomService();
    } catch (error) {}

    expect(messageHistory[0]?.code).toBe('29003');
});

test('禁止销毁MushroomService实例', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        of(MushroomService).destroySingletonInstance(MushroomService);
    } catch (error) {}

    expect(messageHistory[0]?.code).toBe('29004');
});

test('配置局部范围内单例', () => {
    const huashanMonkeyChief1 = by(MonkeyChief, 'Huashan');
    const huashanMonkeyChief2 = by(MonkeyChief, 'Huashan');

    const taishanMonkeyChief1 = by(MonkeyChief, 'Taishan');

    expect(huashanMonkeyChief1 === huashanMonkeyChief2).toBe(true);
    expect(huashanMonkeyChief1 === taishanMonkeyChief1).toBe(false);

    const mushroomService = of(MushroomService);
    mushroomService.removeDependencyByKey(MonkeyChief, 'Taishan');

    const taishanMonkeyChief2 = by(MonkeyChief, 'Taishan');
    expect(taishanMonkeyChief1 === taishanMonkeyChief2).toBe(false);

    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        mushroomService.addDependencyWithKey(MonkeyChief, undefined, 'Taishan');
    } catch (error) {}
    expect(messageHistory[0]?.code).toBe('29005');
});

test('配置局部范围内单例 (弱引用)', () => {
    const info1 = { location: 'Huashan' };
    const info2 = { location: 'Huashan' };

    const huashan1YellowMonkeyChief1 = by(YellowMonkeyChief, info1);
    const huashan1YellowMonkeyChief2 = by(YellowMonkeyChief, info1);

    const huashan2YellowMonkeyChief = by(YellowMonkeyChief, info2);

    expect(huashan1YellowMonkeyChief1 === huashan1YellowMonkeyChief2).toBe(true);
    expect(huashan1YellowMonkeyChief1 === huashan2YellowMonkeyChief).toBe(false);

    const mushroomService = of(MushroomService);

    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        mushroomService.addDependencyWithWeakKey(YellowMonkeyChief, undefined, info1);
    } catch (error) {}
    expect(messageHistory[0]?.code).toBe('29006');
});

test('获取未放入的对象', () => {
    const mushroomService = of(MushroomService);

    const instance = mushroomService.getDependencyByKey(MonkeyChief, {});

    expect(instance).toBe(undefined);
});

test('移除对象', () => {
    const mushroomService = of(MushroomService);
    const monkeyChief = of(MonkeyChief);
    const weakKey = {};
    mushroomService.addDependencyWithWeakKey(MonkeyChief, monkeyChief, weakKey);
    let isExists = mushroomService.containsDependencyWithKey(MonkeyChief, weakKey);

    expect(isExists).toBe(true);

    const isReallyDelete1 = mushroomService.removeDependencyByKey(MonkeyChief, {});
    const isReallyDelete2 = mushroomService.removeDependencyByKey(MonkeyChief, weakKey);
    isExists = mushroomService.containsDependencyWithKey(MonkeyChief, weakKey);

    expect(isReallyDelete1).toBe(false);
    expect(isReallyDelete2).toBe(true);
    expect(isExists).toBe(false);
});

test('将非object类型用作weakKeyedDependenciesMap对象中WeakMap的键', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    const mushroomService = of(MushroomService);
    const monkeyChief = of(MonkeyChief);
    try {
        mushroomService.addDependencyWithWeakKey(MonkeyChief, monkeyChief, <any>'1');
    } catch (error) {}

    expect(messageHistory[0]?.code).toBe('29018');
});
