import DialogManager from '../../../src/manager'
import Vue from 'vue'
import { sleep } from '../../utils'

describe('manager', () => {
  let manager

  const overlay = {
    template: '<div v-if="visible" id="overlay"/>',
    data () {
      return {
        visible: false
      }
    }
  }

  test('Check overlay correct work', async () => {
    manager = new DialogManager({ context: { store: {} } })
    manager.overlay('default', overlay)
    let dialog = manager.show({
      template: '<p/>',
      asyncData: sleep(10)
    })
    await Vue.nextTick()
    expect(document.body.innerHTML).toMatchSnapshot()
    dialog = await dialog
    expect(dialog.element).toMatchSnapshot()
    dialog.close()
    await Vue.nextTick()
    expect(document.body.innerHTML).toMatchSnapshot()
    manager.overlay('default').destroy()
    expect(document.body.innerHTML).toBe('')
  })

  test('Check overlay with extended component', async () => {
    const dlg = Vue.extend({
      template: '<p/>',
      asyncData: sleep(5),
      overlay: 'extended'
    })

    const overlay = Vue.extend({
      template: '<div v-if="visible" id="overlay">extended</div>',
      data () {
        return {
          visible: false
        }
      }
    })
    manager = new DialogManager({})
    manager.overlay('extended', overlay)
    let dialog = manager.show(dlg)
    await Vue.nextTick()
    expect(document.body.innerHTML).toMatchSnapshot()
    dialog = await dialog
    expect(dialog.element).toMatchSnapshot()
    dialog.close()
    await Vue.nextTick()
    expect(document.body.innerHTML).toMatchSnapshot()
  })
})
