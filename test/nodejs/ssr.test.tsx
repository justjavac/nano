/**
 * @jest-environment node
 */

import Nano, { Img, Helmet } from '../../lib/index.js'
import { initSSR, renderSSR } from '../../lib/ssr.js'

const spy = jest.spyOn(global.console, 'error')

describe('server side rendering', () => {
  test('should render without errors', async () => {
    initSSR()

    const App = () => {
      return (
        <div>
          <Helmet>
            <title>some title</title>
            <meta name="description" content="Nano-JSX application" />
          </Helmet>
          <Img src="some-url" placeholder="placeholder-url" />
        </div>
      )
    }

    const app = Nano.renderSSR(<App />)
    const { body, head } = Helmet.SSR(app)

    const html = `
       <!DOCTYPE html>
       <html lang="en">
         <head>
           ${head.join('\n')}
         </head>
         <body>
           ${body}
         </body>
       </html>
       `

    expect(html).toBe(`
       <!DOCTYPE html>
       <html lang="en">
         <head>
           <title>some title</title><meta content="Nano-JSX application" name="description" />
         </head>
         <body>
           <div><img src="placeholder-url" /></div>
         </body>
       </html>
       `)
    expect(spy).not.toHaveBeenCalled()
  })

  test("should escape attribute's string value", () => {
    const content = Nano.h('div', { id: '"hoge' }, 'hoge')
    const html = renderSSR(content)
    expect(html).toBe('<div id="&quot;hoge">hoge</div>')
  })

  test('should escape dangerous string', () => {
    const h1 = Nano.h('h1', {}, 'title')
    const p = Nano.h('p', {}, 'yanni<k')
    const div = Nano.h('div', {}, h1, p)
    const html = renderSSR(div)
    expect(html).toBe('<div><h1>title</h1><p>yanni&lt;k</p></div>')
  })
})

describe('escape dangerous html', () => {
  test('should keep dangerous string', () => {
    const h1 = Nano.h('h1', {}, 'title')
    const p = Nano.h('p', { dangerouslySetInnerHTML: { __html: 'des<ription' } })
    const div = Nano.h('div', {}, h1, p)
    const html = renderSSR(div)
    expect(html).toBe('<div><h1>title</h1><p>des<ription</p></div>')
  })

  test('should escape text node', () => {
    const content = Nano.h('div', {}, '<span>span</span>')
    const html = renderSSR(content)
    expect(html).toBe('<div>&lt;span&gt;span&lt;/span&gt;</div>')
  })

  test('should render dangerouslySetInnerHtml without escaping', () => {
    const code = `<div>should not escape</div>`
    const App = () => {
      return (
        <div>
          <div>hoge</div>
          <Img src="some-url" placeholder="placeholder-url" />
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </div>
      )
    }

    const app = Nano.renderSSR(<App />)
    const { body } = Helmet.SSR(app)

    expect(body).toBe(`<div><div>hoge</div><img src="placeholder-url" /><div><div>should not escape</div></div></div>`)
    expect(spy).not.toHaveBeenCalled()
  })
})
