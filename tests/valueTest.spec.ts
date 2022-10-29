import { Message } from 'mushroom-di';
import { MushroomService, of } from 'mushroom-di';
import { MODULE } from 'mushroom-di';
import { numberPropName, symbolPropName } from './test-classes/basicClasses';

Message.toggleConsolePrintable(false);

export const role = {
    roles: ['Admin']
};

export type RoleType = typeof role;

export interface AppType {
    isLoading: boolean;

    [MODULE]: {
        theme: {
            mode: 'light' | 'dark';
        };
    };
}

export const values = {
    name: 'Mushroom',
    version: '1.0.0',

    users: {
        bigBear1: false,
        bigBear2: false,
        bigBear3: true
    }
};

export const modularValues = {
    [MODULE]: {
        user: {
            userId: 123,
            userName: '张三',

            [MODULE]: {
                role: {} as RoleType
            }
        },
        app: {} as AppType,
        '': {} as { '': number }
    }
};

export const { patchVal, takeVal, InjectVal } = of(MushroomService).buildValueDepsManager(modularValues);

test('重复构建值依赖管理器抛异常', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    try {
        of(MushroomService).buildValueDepsManager(modularValues);
    } catch (error) {}

    expect(messageHistory[0].code).toBe('29009');
});

test('InjectVal()装饰器的key必须是string类型！', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    try {
        InjectVal(1 as any);
    } catch (error) {}

    expect(messageHistory[0].code).toBe('29013');
});

test('注入值', async () => {
    const { MyAppStore } = await import('./test-classes/valueClasses');
    const myAppStore = of(MyAppStore);

    expect(MyAppStore.staticThemeMode).toBe(undefined);
    expect(MyAppStore.staticThemeModeWithDefault).toBe('light');
    expect(myAppStore.themeMode).toBe(undefined);
    expect(myAppStore.themeModeWithDefault).toBe('light');

    patchVal('app.theme.mode', 'dark');

    expect(MyAppStore.staticThemeMode).toBe('dark');
    expect(MyAppStore.staticThemeModeWithDefault).toBe('dark');
    expect(myAppStore.themeMode).toBe('dark');
    expect(myAppStore.themeModeWithDefault).toBe('dark');

    expect(myAppStore.roleStore.roles).toBe(undefined);
    patchVal('user.role.roles', ['Guest']);
    expect(myAppStore.roleStore.roles[0]).toBe('Guest');
});

test('为symbol、number类型的成员变量注入值', async () => {
    const { MyAppStore } = await import('./test-classes/valueClasses');
    const myAppStore = of(MyAppStore);
    patchVal('user.userName', '孙悟空');
    expect(myAppStore[numberPropName]).toBe('孙悟空');
    expect(myAppStore[symbolPropName]).toBe('孙悟空');
});

test('为注入值的成员变量赋值抛异常', async () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    const { MyAppStore } = await import('./test-classes/valueClasses');
    const myAppStore = of(MyAppStore);
    myAppStore.themeMode = undefined;

    expect(messageHistory[0].code).toBe('21002');
});

test('更新、获取值', () => {
    let userId = takeVal('user.userId');
    expect(userId).toBe(123);

    patchVal('user.userId', 456);
    userId = takeVal('user.userId');
    expect(userId).toBe(456);

    patchVal({
        'user.userId': 789,
        'user.userName': '李四'
    });

    const [userId2, userName2] = takeVal('user.userId', 'user.userName');

    expect(userId2).toBe(789);
    expect(userName2).toBe('李四');

    patchVal('user.userId', undefined);
    userId = takeVal('user.userId');

    expect(userId).toBe(undefined);

    patchVal('user.userId', null);
    userId = takeVal('user.userId');

    expect(userId).toBe(null);

    let emptyKeyValue = takeVal('.');
    expect(emptyKeyValue).toBe(undefined);

    patchVal('.', 1);
    emptyKeyValue = takeVal('.');
    expect(emptyKeyValue).toBe(1);

    const isLoading = takeVal('app.isLoading');
    expect(isLoading).toBe(undefined);

    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        takeVal(false as any);
    } catch (error) {}

    expect(messageHistory[0].code).toBe('29012');
});
