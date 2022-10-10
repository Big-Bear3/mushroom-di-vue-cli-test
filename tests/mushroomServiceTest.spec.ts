import { of, MushroomService, Message } from 'mushroom-di';

test('只能通过依赖注入的方式创建MushroomService实例', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    of(MushroomService);
    expect(messageHistory.length).toBe(0);

    try {
        const a = new MushroomService();
        console.log(a);
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
