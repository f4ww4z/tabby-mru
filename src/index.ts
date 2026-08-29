import { NgModule } from '@angular/core'
import { ConfigProvider } from 'tabby-core'
import { MRUConfigProvider } from './config'
import { MRUService } from './mru.service'

@NgModule({
    providers: [
        { provide: ConfigProvider, useClass: MRUConfigProvider, multi: true },
        MRUService,
    ],
})
export default class MRUModule {
    constructor (private mru: MRUService) {
        void this.mru
    }
}
