import { Nano } from './nano.js'
import { Component } from './component.js'

const Button = (props: any) => {
  console.log('Button props', props)
  return (
    <button
      class="button is-primary"
      onClick={() => {
        const toaster = document.getElementById('toaster')
        if (toaster) {
          const event = new CustomEvent('toast', {
            detail: {
              text: 'I am a new toast!',
            },
          })
          toaster.dispatchEvent(event)
        }
      }}
      ref={(node: any) => {
        // Logs the button
        // console.log(node)
      }}
      type="button"
    >
      <span>Button text</span>
    </button>
  )
}

const MuchMoreText = () => {
  return <p class="testClass">again and again!</p>
}

const MoreText = () => {
  return (
    <Nano.Fragment>
      <p class="testClass">from fragment 1!!</p>
      <p class="testClass">from fragment 2!!</p>
      <p class="testClass">from fragment 3!!</p>
      <p class="testClass">from fragment 4!!</p>
    </Nano.Fragment>
  )
}

const ChildrenTest = (props: any) => {
  const { children } = props
  console.log('ChildrenTest', props)
  return <p>{children}</p>
}

class SomeText extends Component {
  render() {
    return (
      <div>
        <p>Some Text</p>
      </div>
    )
  }
}

const Bla0 = (props: any) => {
  return props.children
}
const Bla1 = (props: any) => {
  return <span>{props.children}</span>
}

const Bla2 = (props: any) => {
  return (
    <p>
      <span>{props.children}</span>
    </p>
  )
}

class Hello extends Component {
  render() {
    console.log('Hello props', this.props)
    return (
      <div id="wrapper">
        <ChildrenTest id="1">This is a child (1)</ChildrenTest>
        <ChildrenTest id="2">
          <span>This is a child (2)</span>
        </ChildrenTest>
        <ChildrenTest id="3">
          <Bla0>This is a child (3)</Bla0>
        </ChildrenTest>
        <ChildrenTest id="4">
          <Bla1>This is a child (4)</Bla1>
        </ChildrenTest>
        <ChildrenTest id="5">
          <Bla2>This is a child (5)</Bla2>
        </ChildrenTest>
        <Button id="hello" />
        <MoreText />
        <MuchMoreText />
        <SomeText />
      </div>
    )
  }
}

// @ts-ignore
Nano.render(<Hello name="hello" />, document.getElementById('root'))

class List extends Component {
  data: any = []
  async didMount() {
    console.log('didMount')
    // const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    // const data = await res.json()
    this.data = [{ title: 'asdf' }, { title: 'asfwio' }]

    this.update()
  }

  render() {
    if (this.data.length === 0) return <div>...loading</div>

    const list = <ol id="ordered-list"></ol>
    this.data.forEach((d: any) => {
      list.appendChild(<li>{d.title}</li>)
    })
    return list
  }
}

class ListWrapper {
  render() {
    return (
      <div class="some-test-class">
        <List />
      </div>
    )
  }
}

Nano.render(<ListWrapper />, document.getElementById('list'))

class Input extends Component {
  text = ''

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement
    this.text = target.value

    const p = this.element.getElementsByTagName('p')[0]
    p.innerHTML = this.text
  }

  onSubmit(e: Event) {
    e.preventDefault()
    if (this.text.length === 0) return

    const list = document.getElementById('ordered-list')
    if (list) {
      list.appendChild(<li>{this.text}</li>)
      this.text = ''
      this.update()
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={(e: Event) => this.onSubmit(e)}>
          <input type="text" placeholder="placeholder" value={this.text} onInput={(e: Event) => this.handleChange(e)} />
          <input type="submit" value="Submit" />
        </form>
        <p>{this.text}</p>
      </div>
    )
  }
}

const TestInputs = () => {
  return <Input />
}

Nano.render(<TestInputs />, document.getElementById('input'))

class Toaster extends Component {
  id = -1
  event = new Event('toast')

  didMount() {
    document.getElementById('toaster')?.addEventListener('toast', (e: any) => {
      this.id++
      const el = this.addToast(this.id, e.detail.text) as HTMLElement
      setTimeout(() => {
        el.className = 'toast transparent'
      }, 3000)
      setTimeout(() => {
        el.remove()
      }, 4000)
    })
  }

  addToast(id: number, text: string) {
    const el = <p class="toast visible" key={id}>{`${text} - ${id}`}</p>
    this.element.appendChild(el)
    return el
  }

  render() {
    return <div></div>
  }
}

Nano.render(<Toaster />, document.getElementById('toaster'))
