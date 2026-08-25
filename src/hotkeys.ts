import { Injectable } from '@angular/core'
import { HotkeyDescription, HotkeyProvider } from 'tabby-core'

@Injectable()
export class MRUHotkeyProvider extends HotkeyProvider {
    async provide (): Promise<HotkeyDescription[]> {
        return [
            {
                id: 'mru-next',
                name: 'Switch to next tab in MRU order',
            },
            {
                id: 'mru-previous',
                name: 'Switch to previous tab in MRU order',
            },
        ]
    }
}
