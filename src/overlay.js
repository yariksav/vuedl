/*
 * vuedl
 *
 * (c) Savaryn Yaroslav <yariksav@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Vue from 'vue'

export default class Overlay {
  constructor (component) {
    this._component = component
    this._vm = null
  }

  show () {
    if (!this._vm) {
      const Ctor = Vue.extend(this._component)
      this._vm = new Ctor() // {propsData: { visible: true }}
      this._vm.$mount()
      document.body.appendChild(this._vm.$el)
    }
    this._vm.visible = true
  }

  hide () {
    this._vm.visible = false
  }
}
