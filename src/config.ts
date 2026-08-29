import { Injectable } from '@angular/core'
import { ConfigProvider } from 'tabby-core'

@Injectable()
export class MRUConfigProvider extends ConfigProvider {
    defaults = {
        mru: {
            maxEntries: 10,
        },
    }
}
