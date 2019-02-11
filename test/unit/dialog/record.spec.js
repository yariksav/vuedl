
import Dialog from '../../../src/dialog'

test('Check is not isNewRecord', async () => {
  const dlg = new Dialog({
    template: '<p>{{ isNewRecord }}</p>',
    primaryKey: 'id'
  })
  await dlg.show({ id: 123 })
  expect(dlg.element.innerHTML).toMatchSnapshot()
  dlg.close()
})

test('Check is isNewRecord', async () => {
  const dlg = new Dialog({
    template: '<p>{{ isNewRecord }}</p>',
    primaryKey: 'id'
  })
  await dlg.show()
  expect(dlg.element.innerHTML).toMatchSnapshot()
  dlg.close()
})

test('Check is isNewRecord undefined', async () => {
  const dlg = new Dialog({
    template: '<p></p>'
  })
  await dlg.show()
  expect(dlg.vm.isNewRecord).toBeUndefined()
  dlg.close()
})

test('Check parameters', async () => {
  const dlg = new Dialog({
    template: '<p></p>',
    primaryKey: 'id'
  })
  const params = { id: 1, name: 'foo' }
  await dlg.show(params)
  expect(dlg.vmd.$parameters).toMatchObject(params)
  dlg.close()
})
