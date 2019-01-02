import Vue from 'vue'
import DialogManager from '../../../src/manager'
import NotificationLayout from '../../../src/components/NotificationLayout'
import { sleep } from '../../utils'

describe('manager', () => {
  let manager

  beforeAll(() => {
    manager = new DialogManager({ context: { store: {} } })
    expect(manager).toBeInstanceOf(DialogManager)
    manager.layout('notification', NotificationLayout)
    manager.component('notification', {
      template: '<div>{{ text }}</div>',
      layout: 'notification',
      props: ['text']
    }, {
      waitForResult: true
    })
  })

  test('Test success notification', async () => {
    const dlg = await manager.notification({
      type: 'success',
      text: 'Test notification',
      timeout: 100,
      waitForResult: false
    })
    await sleep(50)
    expect(dlg.vm.$el).toMatchSnapshot()
    await sleep(100)
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  test('Test error notification with top-left position', async () => {
    const dlg = await manager.notification({
      type: 'error',
      text: 'Test notification',
      timeout: 100,
      position: 'top-left',
      waitForResult: false
    })
    await sleep(50)
    expect(dlg.vm.$el).toMatchSnapshot()
    await sleep(500)
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  test('Test warning notification with bottom-right position', async () => {
    const dlg = await manager.notification({
      type: 'warning',
      text: 'Test notification',
      timeout: 100,
      position: 'bottom-right',
      waitForResult: false
    })
    await sleep(50)
    expect(dlg.vm.$el).toMatchSnapshot()
    await sleep(1000)
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })
})
