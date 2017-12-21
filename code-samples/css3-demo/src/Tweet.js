/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component, Fragment} from 'react'
import styles from './Tweet.css'

export default class Tweet extends Component {
  static label = 'Tweet'
  render() {
    return <Fragment>
      <blockquote className={styles.tweet + " twitter-tweet"} data-lang="en" cite="https://twitter.com/HaRuD/status/937797765089730560">
        <p lang="en" dir="ltr">
          .<br />
          <br />
          &emsp;
          <a href="https://twitter.com/hashtag/ECMAScript?src=hash&amp;ref_src=twsrc%5Etfw">ECMAScript</a>
          {'\x20'}2049<br />
          <br />
          &emsp;Every line can use whatever walks or crawls by{'\x20'}
          <a href="https://twitter.com/hashtag/tc39?src=hash&amp;ref_src=twsrc%5Etfw">TC39</a>
          {'\x20'}at one time or another<br />
          <br />
          &emsp;&emsp;Allow add of new{'\x20'}
          <a href="https://twitter.com/hashtag/Babel?src=hash&amp;ref_src=twsrc%5Etfw">babelJS</a>
          {'\x20'}Experimental Plugins<br />
          <br />
          &emsp;&emsp;&emsp;Fast Babel via dependency or pre-transpiled launcher<br />
          <br />
          <a href="/nodejs" className="twitter-atreply pretty-link js-nav" dir="ltr" data-mentioned-user-id="91985735"><strong>NodeJS</strong></a>{'\x20'}
          <a href="https://twitter.com/hashtag/javascript?src=hash&amp;ref_src=twsrc%5Etfw">JavaScript</a>{'\x20'}
          <a href="https://twitter.com/hashtag/reactjs?src=hash&amp;ref_src=twsrc%5Etfw">reactJS</a>{'\x20'}
          <a href="https://twitter.com/hashtag/Facebook?src=hash&amp;ref_src=twsrc%5Etfw">Facebook</a>{'\x20'}
          <a href="https://twitter.com/hashtag/Google?src=hash&amp;ref_src=twsrc%5Etfw">Google</a>{'\x20'}
          <a href="https://twitter.com/hashtag/rollup?src=hash&amp;ref_src=twsrc%5Etfw">rollupJS</a>{'\x20'}
          <a href="https://twitter.com/hashtag/webpack?src=hash&amp;ref_src=twsrc%5Etfw">webpack</a>
          <img width={505} height={252} src='https://pbs.twimg.com/media/DQO5CaDWkAAT2nE.jpg' alt='ECMAScript' />
        </p>
        &mdash; Harald Rudell (@HaRuD)
        <a href="https://twitter.com/HaRuD/status/934183488575737859?ref_src=twsrc%5Etfw">November 24, 2017</a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>

    {/* Test Area */}
    <p style={{color: 'red', margin: 10, padding: 10, border: '1px solid gray', borderRadius: 4}}>This paragraph is red due to in-line styling</p>
    <div style={{color: 'red', margin: 10, padding: 10, border: '1px solid gray', borderRadius: 4}}>
      <style dangerouslySetInnerHTML={{__html: `
        .h {
        color: red;
        `}} />
      <p className='h'>This paragraph is red due to a style element</p>
    </div>
    <p className={styles.redText} style={{margin: 10, padding: 10, border: '1px solid gray', borderRadius: 4}}>This paragraph is red due to a global class</p>

      {/* Second tweet */}
      <blockquote className="twitter-tweet" data-lang="en">
        <p lang="en" dir="ltr">
          .<br />
          <br /> CSS Modules
          <br />  Allows style sheets to have class names unique to that file
          <br />  A feature in the style sheet file loader
          <br /> <a href="https://twitter.com/reactjs?ref_src=twsrc%5Etfw">@ReactJS</a> demands it
          <br />Most <a href="https://twitter.com/hashtag/webpack?src=hash&amp;ref_src=twsrc%5Etfw">#webpack</a> has it in css-loader
          <br />
          <br />use:
          <br />:local(.App)
          <br />
          <br />ERASE THE PAST
          <a href="https://t.co/PoQvhOxFRG">https://t.co/PoQvhOxFRG</a>
          <a href="https://twitter.com/hashtag/css3?src=hash&amp;ref_src=twsrc%5Etfw">#css3</a> <a href="https://twitter.com/nodejs?ref_src=twsrc%5Etfw">@NodeJS</a> <a href="https://twitter.com/JavaScript?ref_src=twsrc%5Etfw">@JavaScript</a> <a href="https://twitter.com/hashtag/CreateReactApp?src=hash&amp;ref_src=twsrc%5Etfw">#CreateReactApp</a> <a href="https://t.co/DiAMtgaUmo">pic.twitter.com/DiAMtgaUmo</a>
          </p>&mdash; Harald Rudell (@HaRuD) <a href="https://twitter.com/HaRuD/status/937797765089730560?ref_src=twsrc%5Etfw">December 4, 2017</a>
      </blockquote>
<script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
    </Fragment>
  }
}
