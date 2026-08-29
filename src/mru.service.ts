import { Injectable } from '@angular/core'
import { AppService, BaseTabComponent, ConfigService } from 'tabby-core'
import { MRUPopup } from './mru-popup.component'

@Injectable({ providedIn: 'root' })
export class MRUService {
    private stack: BaseTabComponent[] = []
    private cycleIndex = 0
    private cycling = false
    private ctrlHeld = false
    private originalTab: BaseTabComponent | null = null
    private popup: MRUPopup | null = null
    private mruMaxEntries = 10

    constructor (
        private app: AppService,
        private config: ConfigService,
    ) {
        this.loadConfig()

        this.app.activeTabChange$.subscribe(tab => {
            if (!tab || this.cycling) {
                return
            }
            this.pushToFront(tab)
        })

        this.app.tabClosed$.subscribe(tab => {
            this.stack = this.stack.filter(t => t !== tab)
        })

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Tab' && e.ctrlKey) {
                e.preventDefault()
                e.stopImmediatePropagation()
                this.handleCtrlTab()
            }
            if (e.key === 'Escape' && this.cycling) {
                e.preventDefault()
                this.cancelCycling()
            }
        }, true)

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.key === 'Control' && this.cycling) {
                this.commitSelection()
            }
        })
    }

    private loadConfig (): void {
        const mruConfig = (this.config.store as any)?.mru
        if (mruConfig?.maxEntries) {
            this.mruMaxEntries = mruConfig.maxEntries
        }
    }

    private pushToFront (tab: BaseTabComponent): void {
        this.stack = [tab, ...this.stack.filter(t => t !== tab)]
    }

    private getValidStack (): BaseTabComponent[] {
        let stack = this.stack.filter(t => this.app.tabs.includes(t))
        if (this.app.activeTab && !stack.includes(this.app.activeTab)) {
            stack = [this.app.activeTab, ...stack]
        }
        return stack
    }

    private handleCtrlTab (): void {
        const stack = this.getValidStack()
        if (stack.length < 2) {
            return
        }

        if (!this.cycling) {
            this.cycling = true
            this.ctrlHeld = true
            this.originalTab = this.app.activeTab
            this.cycleIndex = 0
            this.stack = stack
            this.showPopup()
        }

        this.cycleIndex = (this.cycleIndex + 1) % this.stack.length

        const target = this.stack[this.cycleIndex]
        if (target) {
            this.app.selectTab(target)
        }
        this.updatePopup()
    }

    private commitSelection (): void {
        if (!this.cycling) {
            return
        }

        const finalTab = this.stack[this.cycleIndex]
        if (finalTab) {
            this.pushToFront(finalTab)
        }

        this.hidePopup()
        this.cycling = false
        this.ctrlHeld = false
        this.originalTab = null
        this.cycleIndex = 0
    }

    private cancelCycling (): void {
        if (!this.cycling) {
            return
        }

        if (this.originalTab) {
            this.app.selectTab(this.originalTab)
        }

        this.hidePopup()
        this.cycling = false
        this.ctrlHeld = false
        this.originalTab = null
        this.cycleIndex = 0
    }

    private showPopup (): void {
        if (this.popup) {
            return
        }
        this.popup = new MRUPopup()
        this.popup.attach()
    }

    private updatePopup (): void {
        if (this.popup) {
            this.popup.update(
                this.stack.slice(0, this.mruMaxEntries),
                this.cycleIndex,
            )
        }
    }

    private hidePopup (): void {
        if (this.popup) {
            this.popup.destroy()
            this.popup = null
        }
    }
}
