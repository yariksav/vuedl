import Dialog from '../../../src/dialog'
import Vue from 'vue'
import { mount } from '../../utils'

const context = { foo: 'bar' }

describe('dialog asyncData and fetch', () => {
  beforeAll(() => {
    Dialog.prototype.context = context
  })

  test('Check asyncData', async () => {
    const asyncData = jest.fn((ctx) => {
      return new Promise((resolve) => {
        // check valid context in asyncData
        expect(ctx).toEqual({
          ...context,
          params: { bar: 'baz' }
        })
        setTimeout(() => resolve({ msg: 'foo' }), 1)
      })
    })

    const { dialog, element } = await mount({
      template: '<p>{{ msg }}</p>',
      asyncData
    }, { bar: 'baz' })

    expect(asyncData).toHaveBeenCalledTimes(1)
    expect(dialog.vmd.$data).toHaveProperty('msg', 'foo')
    expect(element.innerHTML).toBe('<p>foo</p>')
    dialog.close()
  })

  test('Check fetch data', async () => {
    let fetched = false
    const fetch = jest.fn((ctx) => {
      return new Promise(resolve => {
        // check valid context in fetch
        expect(ctx).toEqual({
          ...context,
          params: { bar: 'baz' }
        })
        setTimeout(() => {
          fetched = true
          resolve()
        }, 1)
      })
    })

    const { dialog } = await mount({
      render: () => {},
      fetch
    }, { bar: 'baz' })

    expect(fetched).toBe(true)
    expect(fetch).toHaveBeenCalledTimes(1)
    dialog.close()
  })

  test('Check asyncData await', async () => {
    const asyncData = () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ msg: 'foo' }), 1)
      })
    }

    const { dialog, element } = await mount({
      template: '<p>{{ msg }}</p>',
      async asyncData () {
        const data = await asyncData()
        return data
      }
    })

    expect(element.innerHTML).toBe('<p>foo</p>')
    dialog.close()
  })

  // test('Check asyncData callback', async () => {
  //   const { dialog, element } = await mount({
  //     template: '<p>{{ msg }}</p>',
  //     asyncData (_, callback) {
  //       setTimeout(() => {
  //         callback(null, { msg: 'foo' })
  //       }, 1)
  //     }
  //   })
  //   expect(element.innerHTML).toBe('<p>foo</p>')
  //   dialog.close()
  // })

  test('Check asyncData error', async () => {
    const dlg = new Dialog({
      render: () => {},
      asyncData () {
        throw new Error('Error in asyncData')
      }
    })
    expect(dlg.show()).rejects.toThrowError('Error in asyncData')
    expect(dlg.element).toBe(null)
    expect(dlg.vm).toBe(null)
  })

  test('Check many times usage', async () => {
    const fnWait = jest.fn()

    const asyncData = jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ msg: 'foo' }), 1)
      })
    })

    const fetch = jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 1)
      })
    })

    const dataFn = jest.fn(() => {
      return {
        foo: 'bar'
      }
    })

    const dlg = new Dialog({
      template: '<p>{{ msg }} {{ foo }}</p>',
      asyncData,
      fetch,
      data: dataFn
    })
    await dlg.show()
    expect(asyncData).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledTimes(1)
    dlg.wait().then(fnWait)
    expect(dlg.element.innerHTML).toBe('<p>foo bar</p>')
    dlg.close()
    await Vue.nextTick()
    expect(fnWait).toHaveBeenCalledTimes(1)

    await dlg.show()
    dlg.wait().then(fnWait)
    dlg.wait().then(fnWait)
    expect(asyncData).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(dlg.element.innerHTML).toBe('<p>foo bar</p>')
    dlg.close()
    await Vue.nextTick()
    expect(fnWait).toHaveBeenCalledTimes(3)

    await dlg.show()
    expect(asyncData).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenCalledTimes(3)
    dlg.wait().then(fnWait)
    expect(dlg.element.innerHTML).toBe('<p>foo bar</p>')
    dlg.close()
    await Vue.nextTick()
    expect(fnWait).toHaveBeenCalledTimes(4)
    expect(document.body.innerHTML).toBe('')
  })

  // test('Check asyncData error', async () => {
  //   const dlg = new Dialog({
  //     render: () => {},
  //     asyncData () {
  //       throw new Error('Error in asyncData')
  //     }
  //   })
  //   expect(dlg.show()).rejects.toThrowError('Error in asyncData')
  //   expect(dlg.element).toBe(null)
  //   expect(dlg.vm).toBe(null)
  // })
  const genCallback = (ret, timeout) => {
    return () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(ret), timeout)
      })
    }
  }

  test('Check when asyncData is object of Promises', async () => {
    var start = new Date().getTime()
    const { dialog } = await mount({
      template: '<p>{{ $data }}</p>',
      asyncData () {
        return {
          dataObject: genCallback({ test: 1 }, 10),
          dataString: genCallback('string', 30),
          dataNumber: genCallback(123, 30),
          simpleString: 'some string',
          simpleObject: { test: 123456 }
          // dataPromise: getCallback(new Promise(), 30)
        }
      }
    })
    var end = new Date().getTime()
    expect(end - start).toBeLessThan(50)
    expect(dialog.element.innerHTML).toMatchSnapshot()
    dialog.close()
  })

  test('Check when asyncData is promise of Promises', async () => {
    // var start = new Date().getTime()
    // {{ dataObject.test }}:{{ dataString }}:{{ dataNumber }}
    const { dialog } = await mount({
      template: '<p>{{ $data }}</p>',
      async asyncData () {
        return {
          dataObject: genCallback({ test: 1 }, 10),
          dataString: genCallback('string', 30),
          dataNumber: genCallback(123, 30),
          simpleString: 'some string',
          simpleObject: { test: 123456 }
          // dataPromise: getCallback(new Promise(), 30)
        }
      }
    })
    // var end = new Date().getTime()
    // expect(end - start).toBeLessThan(50)
    expect(dialog.element.innerHTML).toMatchSnapshot()
    dialog.close()
  })

  // test with errors
})
