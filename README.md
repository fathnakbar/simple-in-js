# simple-in-js
Simple css in js for developing component based js app

this simple script use object that has toString() method and proxy to server ability to extends classname dynamically

## Usage/Examples

To used it import `useCSS` or `css` function inside index.js script. The output of `useCSS` template function is an proxy that reflect `toString()` method that returns a generated class name. The `css` method return a class name as string. This separation intended to avoid type conflict in typescript. You can also write nested style.

```javascript
  const style = css`
  display: flex;

  a {
    color: red;
  }

`
```


Put it on className attribute:

```javascript
  function App(){
    return (
      <div className={style}>
        <a>
          {//This link's color is red}
        </a>
      </div>
    )
  }

```

NOTE: Alway remember to call `css` or `useCSS` function outside the component so it won't redundantly insert multiple style.
For further improvement, I will add cache to avoid this

### with
In case you want to use tailwind, bootstrap, or just add class dynamically you can use property accessor for ex:

```javascript
  const style = useCSS``;
  style.otherClass // or style['otherClass']

  // output: `${generatedClassname} otherClass`
```

or use the generated style `with` method:

```javascript
  const style = useCSS``;
  style.with('container', 'box-border hidden');

  // output: `${generatedClassname} container box-border hidden`
```

or simply use @with rules:

```javascript
  const style = css`
  display: flex
  @with flex flex-row items-start
`
  // you can use css or useCSS function for @with rules

  // output: `${generatedClassname} flex flex-row items-start`
```
at rules only cannot be use inside nested style.

### composite style

Because the output of `useCSS` is an object that returns a proxy object: `{with: () => string, name: string}`. You can compose a style. There's not much of difference
in `css` and `useCSS`. It is written so typescript works as we expected. for example:
```javascript
  const flexContainer = useCSS`
    display: flex;
  `

  const alignCenter = css`
    align-items: center;
    @with ${flexContainer.name} justify-center
  `

  // or to dynamically compose style

  const center = css`
    align-items: center;
  `

  const start = css`
    align-items: start;
  `

  const end = css`
    align-items: end;
  `

  function App(){
    const state = useState('end');
    const [style, setStyle] = useState('');

    switch(state){
      case 'start':
        setStyle(flexContainer.with(start))
      break;
      case 'center':
        setStyle(flexContainer.with(center))
      break;
      case 'end':
        setStyle(flexContainer.with(end))
      break;
    }

    return (
      <div className={style}></div>
    )
  }

```

NOTE: the `@with` value won't included for now
## Roadmap

- [ ] Caching
- [ ] Builder ‒Generate css file.
- [ ] @tailwind, @bootstrap rules support
- [ ] Include all value for composite style

