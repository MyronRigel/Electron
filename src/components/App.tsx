import React, { useState } from 'react'
import '../index.css'


const {ipcRenderer} = window.electron

declare global {
   interface Window {
      electron: any
   }
}

const App: React.FC = () => {
   const [records, setRecords] = useState<Array<Record<string, string>>>([])
   const handleLinkClick = (event: React.MouseEvent<HTMLUListElement> & { target: Element }) => {
      event.preventDefault()
      ipcRenderer.send('open-link', event.target.innerHTML)
   }

   const sendIPCMessage = async () => {
      try {
         const response = await ipcRenderer.invoke('info-from-view')

         setRecords(response)
      } catch (error) {
         console.error(error)
      }
   }

   return (
      <div className="container">
         <h1>Your highlights</h1>
         <button onClick={sendIPCMessage} type="button">Refresh Records</button>
         {!!records.length && <hr/>}
         {records.map(record => (
            <div className="card">
               <div className="space-between">
                  <div>{record.header}</div>
                  <div><a href={record.url} className="link">{record.url}</a></div>

               </div>
               <div className="card-content">
                  <p>{record.selectedText}</p>
               </div>
            </div>
         ))}
         <hr/>
         <ul onClick={handleLinkClick}>
            <li>https://ru.wikipedia.org/wiki/Electron</li>
            <li>https://uk.legacy.reactjs.org/</li>
            <li>https://nodejs.org/en/docs/</li>
            <li>https://stackoverflow.com/questions/48148021/how-to-import-ipcrenderer-in-react
            </li>
         </ul>
      </div>
   )
}

export default App