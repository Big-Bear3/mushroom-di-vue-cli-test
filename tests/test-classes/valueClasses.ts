import { InjectVal } from '../valueTest.spec';
import { Injectable } from 'mushroom-di';

class AppStore {
    @InjectVal('app.isLoading')
    isLoading: boolean;

    @InjectVal('app.theme.mode')
    static staticThemeMode: 'light' | 'dark';

    @InjectVal('app.theme.mode', 'light')
    static staticThemeModeWithDefault: 'light' | 'dark';

    @InjectVal('app.theme.mode')
    themeMode: 'light' | 'dark';

    @InjectVal('app.theme.mode', 'light')
    themeModeWithDefault: 'light' | 'dark';
}

@Injectable()
class RoleStore {
    @InjectVal('user.role.roles')
    roles: string[];
}

@Injectable()
export class MyAppStore extends AppStore {
    @InjectVal('user.userId')
    userId: number;

    @InjectVal('user.userName')
    userName: string;

    constructor(public roleStore: RoleStore) {
        super();
    }
}
