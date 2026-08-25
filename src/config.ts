import { Injectable } from '@angular/core'
import { ConfigProvider } from 'tabby-core'

/**
 * Registers default (empty) keybindings so Settings > Hotkeys has
 * entries to bind and the config schema validates cleanly.
 */
@Injectable()
export class MRUConfigProvider extends ConfigProvider {
    defaults = {
        hotkeys: {
            'mru-next': [],
            'mru-previous': [],
        },
    }
}
