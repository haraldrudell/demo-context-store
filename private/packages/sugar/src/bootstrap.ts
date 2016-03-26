// import {bootstrap} from 'angular2/angular2';
// angular2-universal-preview: editor says no such modeule, but it works.
import {bootstrap} from 'angular2-universal-preview'
// angular2/http
// 'angular2-universal-preview': EXCEPTION: No provider for ConnectionBackend! (StreamPost -> Http -> ConnectionBackend) in [null]
import {HTTP_PROVIDERS} from 'angular2/http'
import {App} from './app';

bootstrap(App, [
  HTTP_PROVIDERS,
  ])
