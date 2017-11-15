import Vue from 'vue'
import $ from 'jquery'
import TypeaheadDoc from '@docs/pages/components/Typeahead.md'
import utils from '../utils'

describe('Typeahead', () => {
  let xhr, requests, server
  let vm
  let $el

  beforeEach(() => {
    const Constructor = Vue.extend(TypeaheadDoc)
    vm = new Constructor().$mount()
    $el = $(vm.$el).appendTo('body')
  })

  afterEach(() => {
    vm.$destroy()
    $el.remove()
  })

  before(() => {
    xhr = sinon.useFakeXMLHttpRequest()
    requests = []
    xhr.onCreate = (req) => {
      requests.push(req)
    }
    server = sinon.fakeServer.create()
  })

  after(() => {
    xhr.restore()
    server.restore()
  })

  it('should be able to open typeahead when input change', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(3)
    const selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
  })

  it('should be able to open typeahead on input focus', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'focus')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(3)
    const selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
  })

  it('should be able to close typeahead on input blur', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    utils.triggerEvent(input, 'blur')
    await vm.$nextTick()
    expect(dropdown.className).not.contain('open')
  })

  it('should not close typeahead on input click', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    utils.triggerEvent(input, 'click')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
  })

  it('should be able to close typeahead when input changed to empty', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    input.value = ''
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.not.contain('open')
  })

  it('should be able to slice item length', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'a'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(10)
    const selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
  })

  it('should not open dropdown if nothing match', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'asdasdasdasd'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.not.contain('open')
  })

  it('should be able to select item', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(3)
    const selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
    utils.triggerEvent(selected, 'click')
    await vm.$nextTick()
    expect(dropdown.className).to.not.contain('open')
    expect(input.value).to.equal('Alabama')
    expect(_vm.model.name).to.equal('Alabama')
  })

  it('should be able to use force select', async () => {
    const _vm = vm.$refs['typeahead-force-select']
    _vm.forceSelect = true
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(_vm.model).not.exist
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(3)
    const selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
    utils.triggerEvent(selected, 'click')
    await vm.$nextTick()
    expect(dropdown.className).to.not.contain('open')
    expect(input.value).to.equal('Alabama')
    expect(_vm.model.name).to.equal('Alabama')
  })

  it('should not be able to select item using keyboard while dropdown not open', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    utils.triggerKey(input, utils.keyCodes.enter, 'down')
    await vm.$nextTick()
    expect(dropdown.className).to.not.contain('open')
    expect(input.value).to.equal('')
  })

  it('should be able to select item using keyboard', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(3)
    const selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
    utils.triggerKey(input, 13)
    await vm.$nextTick()
    expect(dropdown.className).to.not.contain('open')
    expect(input.value).to.equal('Alabama')
    expect(_vm.model.name).to.equal('Alabama')
  })

  it('should be able use keyboard nav to go next', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(3)
    let selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
    utils.triggerKey(input, 40)
    await vm.$nextTick()
    selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alaska')
    utils.triggerKey(input, 40)
    await vm.$nextTick()
    utils.triggerKey(input, 40)
    await vm.$nextTick()
    selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Palau')
  })

  it('should be able use keyboard nav to go prev', async () => {
    const _vm = vm.$refs['typeahead-example']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(3)
    let selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
    utils.triggerKey(input, 40)
    await vm.$nextTick()
    utils.triggerKey(input, 40)
    await vm.$nextTick()
    utils.triggerKey(input, 40)
    await vm.$nextTick()
    selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Palau')
    utils.triggerKey(input, 38)
    await vm.$nextTick()
    selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alaska')
    utils.triggerKey(input, 38)
    await vm.$nextTick()
    utils.triggerKey(input, 38)
    await vm.$nextTick()
    selected = dropdown.querySelector('li.active a')
    expect(selected.textContent).to.equal('Alabama')
  })

  it('should be able to match start', async () => {
    const _vm = vm.$refs['typeahead-match-start']
    _vm.matchStart = true
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    input.value = 'ala'
    utils.triggerEvent(input, 'input')
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(2)
  })

  it('should be able to use async typeahead', async () => {
    const _vm = vm.$refs['typeahead-async-query']
    await vm.$nextTick()
    const input = _vm.$el.querySelector('input')
    const dropdown = _vm.$el.querySelector('.dropdown')
    expect(dropdown.className).to.not.contain('open')
    // matches don't work in here
    const savedMatches = Element.prototype.matches
    Element.prototype.matches = () => true
    input.value = 'wxsm'
    utils.triggerEvent(input, 'input')
    await utils.sleep(600)
    server.requests[0].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({items: [{login: 'wxsms'}]})
    )
    await vm.$nextTick()
    expect(dropdown.className).to.contain('open')
    expect(dropdown.querySelectorAll('li').length).to.equal(1)
    const selected = dropdown.querySelector('li.active a span')
    expect(selected.textContent).to.equal('wxsms')
    Element.prototype.matches = savedMatches
  })
})
