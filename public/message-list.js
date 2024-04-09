document.addEventListener('newmessage', e => {
  const list = document.querySelector('#messagelist')

  const { id, role, content, ts } = e.detail.message

  const elementId = `${id}-${role}`

  const messageElement = document.getElementById(elementId)

  if (messageElement) {
    const listitem = document.createElement('li')
    listitem.setAttribute('id', elementId)
    listitem.innerHTML = `Author: ${role}<br /> Message: ${content}`
    messageElement.replaceWith(listitem)
  }

  else {
    const listitem = document.createElement('li')
    listitem.setAttribute('id', elementId)
    listitem.innerHTML = `Author: ${role}<br /> Message: ${content}`
    list.append(listitem)
  }
})
