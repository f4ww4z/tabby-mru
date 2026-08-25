import { Injectable } from '@angular/core'
import { AppService, BaseTabComponent, HotkeysService } from 'tabby-core'

/**
 * Tracks tab activation order and lets you cycle through tabs
 * in Most-Recently-Used order, like Ctrl+Tab in a browser or
 * Alt+Tab in an OS window switcher.
 */
@Injectable({ providedIn: 'root' })
export class MRUService {
    private stack: BaseTabComponent[] = []
    private cycleIndex = 0
    private cycling = false
    private cycleTimeout: any = null

    constructor (
        private app: AppService,
        private hotkeys: HotkeysService,
    ) {
        this.app.activeTabChange$.subscribe(tab => {
            if (!tab) {
                return
            }
            if (this.cycling) {
                return
            }
            this.pushToFront(tab)
        })

        this.app.tabClosed$.subscribe(tab => {
            this.stack = this.stack.filter(t => t !== tab)
        })

        this.hotkeys.hotkey$.subscribe(id => {
            if (id === 'mru-next') {
                this.cycle(1)
            } else if (id === 'mru-previous') {
                this.cycle(-1)
            }
        })
    }

    private pushToFront (tab: BaseTabComponent): void {
        this.stack = [tab, ...this.stack.filter(t => t !== tab)]
    }

    private cycle (direction: 1 | -1): void {
        this.stack = this.stack.filter(t => this.app.tabs.includes(t))
        if (this.app.activeTab && !this.stack.includes(this.app.activeTab)) {
            this.stack.unshift(this.app.activeTab)
        }
        if (this.stack.length < 2) {
            return
        }

        if (!this.cycling) {
            this.cycling = true
            this.cycleIndex = 0
        }

        this.cycleIndex = (this.cycleIndex + direction + this.stack.length) % this.stack.length
        const target = this.stack[this.cycleIndex]
        if (target) {
            this.app.selectTab(target)
        }

        if (this.cycleTimeout) {
            clearTimeout(this.cycleTimeout)
        }
        this.cycleTimeout = setTimeout(() => {
            this.cycling = false
            const finalTab = this.stack[this.cycleIndex]
            if (finalTab) {
                this.pushToFront(finalTab)
            }
            this.cycleIndex = 0
        }, 600)
    }
}
