import { NgModule } from '@angular/core'
import { ConfigProvider, HotkeyProvider } from 'tabby-core'
import { MRUHotkeyProvider } from './hotkeys'
import { MRUConfigProvider } from './config'
import { MRUService } from './mru.service'

@NgModule({
    providers: [
        { provide: HotkeyProvider, useClass: MRUHotkeyProvider, multi: true },
        { provide: ConfigProvider, useClass: MRUConfigProvider, multi: true },
        MRUService,
    ],
})
export default class MRUModule {
    constructor (private mru: MRUService) {
        void this.mru
    }
}
