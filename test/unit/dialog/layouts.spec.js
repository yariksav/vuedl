import Dialog from '../../../src/dialog'
// import Vue from 'vue'
// import DialogView from '../../../src/components/view'
// import { mount } from '../../utils'

describe('dialog layouts', () => {
  beforeAll(() => {
    // Vue.component('dialog-view', DialogView)
    // Dialog.prototype.context = context
  })

  // test('Check default layouts when not sended', async () => {
  //   const dlg = new Dialog({
  //     template: '<p>foo</p>'
  //   })
  //   // expect(dlg._wrapper).toHaveProperty('component')
  //   // await dlg.show()
  //   // expect(dlg.element).toMatchSnapshot()
  //   // // expect(asyncData).toHaveBeenCalledTimes(1)
  //   // // expect(dialog.vmd.$data).toHaveProperty('msg', 'foo')
  //   // expect(dlg.innerHTML).toBe('<p>foo</p>')
  //   // dialog.close()
  // })

  test('check error without component', () => {
    expect(() => {
      new Dialog() // eslint-disable-line no-new
    }).toThrow()
  })

  test('Check layout', async () => {
    const layout = {
      template: '<div><slot/></div>'
    }

    const dialog = new Dialog({
      template: '<p>foo</p>'
    }, {
      layout: {component: layout}
    })
    await dialog.show()
    expect(dialog.element).toMatchSnapshot()
    expect(dialog.element.textContent).toBe('foo')
    dialog.close()
  })

  test('Check layout object', async () => {
    const dialog = new Dialog({
      template: '<p>foo</p>',
      layout: {
        template: '<div><slot/></div>'
      }
    })
    await dialog.show()
    expect(dialog.element).toMatchSnapshot()
    expect(dialog.element.textContent).toBe('foo')
    dialog.close()
  })

  /* test('Check layout slots', async () => {
    const layout = {
      template:
        `<div>
          <slot name="header"/>
          <p>above content</p>
          <slot/>
          <p>below content</p>
          <slot name="footer"/>
        </div>`
    }

    const dialog = new Dialog({
      template:
      `<div>
          <template slot="header">header</template>
          <div slot="footer">footer content</div>
          content
        </div>`
    }, {
      layout
    })
    await dialog.show()

    expect(dialog.element).toMatchSnapshot()
    dialog.close()
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  }) */
})
