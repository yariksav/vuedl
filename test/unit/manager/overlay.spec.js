// import Dialog from '../../../src/dialog'
import DialogManager from '../../../src/manager'
// import Confirm from '../../../src/components/Confirm'
// import { wrap } from '../../utils'
// import Returnable from '../../../src/mixins/returnable'
import Vue from 'vue'
import { sleep } from '../../utils'

describe('manager', () => {
  let manager

  // const asyncData = jest.fn((ctx) => {
  //   return sleep(10)
  // })

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
  })
})
