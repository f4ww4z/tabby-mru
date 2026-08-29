import { BaseTabComponent } from 'tabby-core'

const STYLES = `
    .mru-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.35);
        pointer-events: none;
    }

    .mru-popup {
        background: #1e1e1e;
        border: 1px solid #333;
        border-radius: 8px;
        min-width: 400px;
        max-width: 600px;
        max-height: 70vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }

    .mru-header {
        padding: 12px 16px;
        color: #888;
        font-size: 13px;
        border-bottom: 1px solid #333;
        user-select: none;
    }

    .mru-item {
        padding: 10px 16px;
        color: #ddd;
        font-size: 14px;
        cursor: default;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
    }

    .mru-selected {
        background: #37373d;
        color: #fff;
    }

    .mru-item:last-child {
        border-radius: 0 0 7px 7px;
    }
`

export class MRUPopup {
    private host: HTMLDivElement
    private list: HTMLDivElement
    private styleEl: HTMLStyleElement

    constructor () {
        this.styleEl = document.createElement('style')
        this.styleEl.textContent = STYLES
        document.head.appendChild(this.styleEl)

        const overlay = document.createElement('div')
        overlay.className = 'mru-overlay'

        const popup = document.createElement('div')
        popup.className = 'mru-popup'

        const header = document.createElement('div')
        header.className = 'mru-header'
        header.textContent = 'Recent tabs'

        this.list = document.createElement('div')
        this.list.className = 'mru-list'

        popup.appendChild(header)
        popup.appendChild(this.list)
        overlay.appendChild(popup)

        this.host = overlay
    }

    attach (): void {
        document.body.appendChild(this.host)
    }

    update (tabs: BaseTabComponent[], selectedIndex: number): void {
        this.list.innerHTML = ''
        for (let i = 0; i < tabs.length; i++) {
            const item = document.createElement('div')
            item.className = 'mru-item' + (i === selectedIndex ? ' mru-selected' : '')
            let title = tabs[i].title ?? 'Untitled'
            if (title.length > 120) {
                title = title.substring(0, 117) + '...'
            }
            item.textContent = title
            this.list.appendChild(item)
        }
    }

    destroy (): void {
        if (this.host.parentNode) {
            this.host.parentNode.removeChild(this.host)
        }
        if (this.styleEl.parentNode) {
            this.styleEl.parentNode.removeChild(this.styleEl)
        }
    }
}
