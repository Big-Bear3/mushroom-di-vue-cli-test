import type { Class } from 'mushroom-di';

import { DependencyConfig, of, DependencyConfigEntity, STOP_DEEP_CONFIG } from 'mushroom-di';
import {
    Banana,
    BrownMonkey,
    ColorPig,
    Corn,
    CounterfeitMonkey,
    Food,
    GoldMonkey,
    Monkey,
    MonkeyChief,
    MonkeyKing,
    Monkeys,
    Peach,
    Pig,
    RedMonkey,
    RedPig,
    YellowMonkey
} from './configedClasses';

let usingFood: any = Food;
let usingMonkey: any = Monkey;

export function useFood(food: typeof Food | typeof Banana | typeof Peach): void {
    usingFood = food;
}

export function useMonkey(monkey: typeof Monkey | typeof RedMonkey | typeof YellowMonkey | typeof GoldMonkey): void {
    usingMonkey = monkey;
}

export class ClassesConfig {
    @DependencyConfig(Food)
    static configFood(
        configEntity: DependencyConfigEntity<typeof Food | typeof Banana | typeof Peach, any[]>,
        outerClass: Class
    ): void {
        if (outerClass === BrownMonkey) {
            configEntity.usingClass = Corn;
            configEntity.args = <any[]>[100, 'Beijing'];
        } else configEntity.usingClass = usingFood;
    }

    @DependencyConfig(Monkey)
    static configMonkey(
        configEntity: DependencyConfigEntity<typeof Monkey | typeof RedMonkey | typeof YellowMonkey | typeof GoldMonkey>
    ): void {
        configEntity.usingClass = usingMonkey;
    }

    static monkeyKingCreateCount = 0;
    static monkeyKingFetchCount = 0;
    static monkeysCreateCount = 0;
    static monkeysFetchCount = 0;

    @DependencyConfig(MonkeyKing)
    static configMonkeyKing(configEntity: DependencyConfigEntity<typeof MonkeyKing>): void {
        configEntity.afterInstanceCreate = (instance: MonkeyKing) => {
            if (!instance) throw new Error();
            ClassesConfig.monkeyKingCreateCount++;
        };
        configEntity.afterInstanceFetch = (instance: MonkeyKing, isNew: boolean) => {
            if (!instance || isNew === undefined) throw new Error();
            ClassesConfig.monkeyKingFetchCount++;
        };
    }

    @DependencyConfig(Monkeys)
    static configMonkeys(configEntity: DependencyConfigEntity<typeof Monkeys>): void {
        configEntity.afterInstanceCreate = (instance: MonkeyKing) => {
            if (!instance) throw new Error();
            ClassesConfig.monkeysCreateCount++;
        };
        configEntity.afterInstanceFetch = (instance: MonkeyKing, isNew: boolean) => {
            if (!instance || isNew === undefined) throw new Error();
            ClassesConfig.monkeysFetchCount++;
        };
    }

    static afterInstanceFetchLaunched = false;

    @DependencyConfig(CounterfeitMonkey)
    static configCounterfeitMonkey(configEntity: DependencyConfigEntity<typeof CounterfeitMonkey, [any]>) {
        configEntity.afterInstanceFetch = () => {
            ClassesConfig.afterInstanceFetchLaunched = true;
        };
        return configEntity.args[0] ? configEntity.args[0] : of(Monkeys);
    }

    @DependencyConfig(Pig)
    static configPig(configEntity: DependencyConfigEntity<typeof Pig, [boolean] | [number]>) {
        configEntity.usingClass = ColorPig;
        if (configEntity.args[0]) {
            configEntity.args = [1];
            return STOP_DEEP_CONFIG;
        }
        configEntity.args = [1];
    }

    @DependencyConfig(ColorPig)
    static configColorPig(configEntity: DependencyConfigEntity<typeof ColorPig>) {
        configEntity.usingClass = RedPig;
        configEntity.args = [2];
    }
}

export class ScopedClassesConfig {
    private static monkeyChiefs = new Map<string, MonkeyChief>();

    @DependencyConfig(MonkeyChief)
    static configMonkeyChief(configEntity: DependencyConfigEntity<typeof MonkeyChief>): void | MonkeyChief {
        const location = configEntity.args[0];

        if (ScopedClassesConfig.monkeyChiefs.has(location)) {
            return ScopedClassesConfig.monkeyChiefs.get(location);
        } else {
            configEntity.afterInstanceCreate = (instance): void => {
                ScopedClassesConfig.monkeyChiefs.set(location, instance);
            };
        }
    }
}
