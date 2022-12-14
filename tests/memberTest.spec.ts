import { Message, of } from 'mushroom-di';
import { Bears, Honey, numberPropName, Snake, symbolPropName } from './test-classes/basicClasses';
import {
    Animal,
    Grassland,
    Earth,
    Mars,
    DeerMeat,
    RabitMeat,
    Meat,
    FemaleLion,
    SolarSystem,
    MaleLion
} from './test-classes/extendsClasses';

Message.toggleConsolePrintable(false);

test('静态成员变量注入', () => {
    expect(Animal.planet1 && Animal.planet1 instanceof Earth).toBe(true);
    expect(Animal.planet2 && Animal.planet2 instanceof Mars).toBe(true);
    expect(Animal.planet3 && Animal.planet3 instanceof Earth).toBe(true);
    expect(Animal.planet4 && Animal.planet4 instanceof Mars).toBe(true);
    expect(Animal.planet1 === Animal.planet1).toBe(true);
    expect(Animal.planet2 === Animal.planet2).toBe(true);
});

test('成员变量注入', () => {
    const grassland1 = of(Grassland);
    const grassland2 = of(Grassland);

    expect(!!grassland1.maleLion).toBe(true);
    expect(!!grassland1.femaleLion).toBe(true);

    expect(grassland1.maleLion.food && grassland1.maleLion.food instanceof DeerMeat).toBe(true);
    expect(grassland1.femaleLion.food && grassland1.femaleLion.food instanceof RabitMeat).toBe(true);

    expect(grassland1.maleLion.food === grassland2.maleLion.food).toBe(true);
    expect(grassland1.femaleLion.food === grassland2.femaleLion.food).toBe(false);
});

test('symbol、number类型成员变量注入', () => {
    const bears = of(Bears);
    expect(bears[numberPropName] instanceof Honey).toBe(true);
    expect(bears[symbolPropName] instanceof Honey).toBe(true);
});

test('父类成员变量注入', () => {
    const grassland = of(Grassland);

    expect(grassland.maleLion.foodType && grassland.maleLion.foodType instanceof Meat).toBe(true);
    expect(grassland.femaleLion.foodType && grassland.femaleLion.foodType instanceof Meat).toBe(true);
});

test('静态成员变量延迟注入', () => {
    Mars.initedFlag = false;

    expect(SolarSystem.planet && SolarSystem.planet instanceof Mars).toBe(true);
    expect(Mars.initedFlag).toBe(true);
});

test('成员变量延迟注入', () => {
    FemaleLion.initedFlag = false;

    const grassland = of(Grassland);
    expect(grassland.femaleLion && grassland.femaleLion instanceof FemaleLion).toBe(true);
    expect(FemaleLion.initedFlag).toBe(true);
});

test('错误注入处理', () => {
    const grassland = of(Grassland);
    expect(grassland.anyMember).toBe(undefined);
    expect(Grassland.anyStaticMember).toBe(undefined);
});

test('指定null注入', () => {
    const grassland = of(Grassland);
    expect(grassland.nullMember1 instanceof MaleLion).toBe(true);
    expect(grassland.nullMember2 instanceof MaleLion).toBe(true);
    expect(Grassland.nullStaticMember1 instanceof MaleLion).toBe(true);
    expect(Grassland.nullStaticMember2 instanceof MaleLion).toBe(true);
});

test('延迟注入成员变量赋值', () => {
    const grassland = of(Grassland);
    grassland.maleLionValue = null;
    Grassland.maleLionStaticValue = null;

    expect(grassland.maleLionValue).toBe(null);
    expect(Grassland.maleLionStaticValue).toBe(null);
});

test('找不到依赖注入undefined', () => {
    const snake = of(Snake);

    expect(Snake.num1).toBe(undefined);
    expect(Snake.num2).toBe(undefined);
    expect(snake.num3).toBe(undefined);
    expect(snake.num4).toBe(undefined);
    expect(snake.num5).toBe(undefined);
    expect(snake.num6).toBe(undefined);
    expect(snake.num7).toBe(undefined);
    expect(Snake.animal1).toBe(undefined);
    expect(Snake.animal2).toBe(undefined);
    expect(snake.animal3).toBe(undefined);
    expect(snake.animal4).toBe(undefined);
    expect(snake.animal3).toBe(undefined);
});
