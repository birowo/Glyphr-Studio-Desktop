/* global alert */
const {dialog} = require('electron').remote
const fs = require('fs')

window.addEventListener('beforeunload', function (event) {
  window.onbeforeunload = confirmClose(event)
})

function confirmClose (event) {
  let confirm

  if (document.getElementById('splashscreenlogo')) {
    return
  }

  confirm = dialog.showMessageBox({
    type: 'question',
    title: 'Confirm',
    buttons: ['Yes', 'No', 'Cancel'],
    message: 'Would you like to save before closing?'
  })

  if (confirm === 0) { // yes
    saveGlyphrProjectFile()
  } else if (confirm === 2) { // cancel
    event.returnValue = 'false'
  }
}

saveFile = function (fname, buffer, ftype) { // eslint-disable-line
  let fblob = new Blob([buffer], {
    'type': ftype || 'text/plain;charset=utf-8',
    'endings': 'native'
  })
  let link
  let event

  if (fname.includes('SVG') || ftype === 'font/opentype') {
    link = document.createElement('a')
    window.URL = window.URL || window.webkitURL
    link.href = window.URL.createObjectURL(fblob)
    link.download = fname

    event = document.createEvent('MouseEvents')
    event.initEvent('click', true, false)
    link.dispatchEvent(event)
  } else {
    if (window.saveFileOverwrite && window.saveFileOverwriteFile) {
      fs.writeFileSync(window.saveFileOverwriteFile, buffer)
      alert('Saved to ' + window.saveFileOverwriteFile)
    } else {
      dialog.showSaveDialog({
        properties: ['openFile'],
        title: 'Choose where to save project...',
        defaultPath: process.env.HOME + '/' + fname
      }, function (destination) {
        if (destination !== undefined) {
          fs.writeFileSync(destination, buffer)
          window.saveFileOverwriteFile = destination
        } else {
          event.returnValue = 'false'
        }
      })
    }
  }
}
