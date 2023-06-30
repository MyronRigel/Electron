// @ts-ignore
const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron', {
   ipcRenderer: ipcRenderer,
})

let button: HTMLElement | null

window.addEventListener('DOMContentLoaded', () => {
   document.addEventListener('mouseup', (event) => {

      const selectedText = window.getSelection()?.toString()

      if (selectedText && !button) {
         button = document.createElement('button')
         button.style.position = 'absolute'
         button.style.top = event.pageY + 'px'
         button.style.left = event.pageX + 'px'
         button.innerText = 'Save highlight'
         document.body.appendChild(button)

         button.addEventListener('click', (event) => {
            event.preventDefault()
            ipcRenderer.send('selected-text-from-view', {
               selectedText: selectedText,
               url: window.location.href,
               header: document.getElementsByTagName('h1')[0].innerText
            })
            button?.remove()
            button = null
         })
      }
   })
})