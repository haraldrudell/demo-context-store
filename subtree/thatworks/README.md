# rollup-plugin-thatworks

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)

Chmod + Directory Resolver + Shebang Rollup plugins by Harald Rudell

<blockquote><pre>
import { chmod, directoryResolver, shebang } from 'rollup-plugin-thatworks'
…
 plugins: [
  directoryResolver({paths: 'src'}), // can import from 'dir' instead of '../dir'
  shebang(), // these two creates Node.js executables
  chmod(),
</pre></blockquote>

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
