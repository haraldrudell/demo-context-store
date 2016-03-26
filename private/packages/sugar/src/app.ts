// TODO alpha has no watch, rerun npm start on code change
// TODO change in static file requires browser reload
// TODO beta imports from 'angular2/core'
// TODO beta does not require NgFor import
import {Component, Directive, ElementRef, Renderer, NgFor, Injectable, NgIf} from 'angular2/angular2'
import {RouteConfig} from 'angular2/router'
// TODO Http does not work server-side in angular2-universal-preview
import {Http, Response, Headers} from 'angular2/http';
//import {window} from 'angular2/src/core/facade/browser';

var postLoader = require('./postloader')

//import {WindowRef, WINDOW_PROVIDERS} from './window-service'

/*@Component({
    providers: [WINDOW_PROVIDERS],
})
class Windower {
  constructor(public win: WindowRef) {}
}*/

//function _window(): any {
//  return window
//}

class Post {
  public href: string
  public img: string
  public title: string
  public heading: string
  public author: string
  
  constructor(d: any) {
    this.href = d.url_seo
    this.img = d.images.xl.url
    this.heading = d.heading
    this.title = d.title
    this.author = d.author_name
  }
}

@Injectable()
export class PostService {
  protected static instance: PostService
  public static isBrowser: boolean = typeof XMLHttpRequest == 'function'
  protected static cache = new Map()
  public result: number
    
  constructor(public http: Http) {
    let isFirst = !PostService.instance 
    if (isFirst) {
      PostService.instance = this
      console.log('postService created')
    } else return PostService.instance
  }

  getPost(nid: number, cb: any) {
    var data: any
    if (!(data = PostService.cache.get(nid))) { // TODO race condition
      if (PostService.isBrowser) {
        this.http.get('http://sugar.haraldrudell.com/x?p=' + nid)
          .map((res: Response) => res.text())
          .subscribe(
            (text: string) => {
              postLoader.makeObject(text, (e: any, d: any) => {
                var post: Post = new Post(d)
                if (!e) this.putCache(nid, post)
                else this.logError(e)
                cb(e, post)
              })},
            (err: any) => {this.logError('http get: ' + err); cb(err)}
          )
          
      // Node.js fetch Post via http
      } else postLoader.loadObject(nid, (e: any, o: Post) => {
        if (!e) this.putCache(nid, o)
        else this.logError(e)
        cb(e, o)
      })
    } else {
      console.log('cache hit:', nid)
      cb(null, data)
    }
  }
  
  protected putCache(nid: number, post: Post) {
    console.log('cache put:', nid)
    PostService.cache.set(nid, post)
  }
  
  protected logError(err:any) {
    console.error('There was an error: ' + err);
  }
}

@Component({
  selector: 'stream-post',
  template:`
    <article *ng-if="post" class="post-content stream-view clearfix" >
      {{isRendering}}
      <div class=post-subhead><a (click) = "followExternalLink('http://www.popsugar.com/latest/Daisy-Ridley')" >{{post.heading}}</a></div>
      <div class=post-title>
        <a (click) = "followExternalLink(post.href)" >
          <span class=title-text>{{post.title}}</span>
        </a>
      </div>
      <a (click) = "followExternalLink(post.href)" >
        <div class=post-image>
          <img src={{post.img}} >
        </div>
      </a>
      <span class=byline>
        <span>
          <span class=by> by </span>
          <a itemprop="name" rel="author">Aemilia Madden</a>
        </span>
      </span>
    </article>
    `,
    inputs: ['nid'],
    providers: [PostService],
    directives: [NgIf],
})
/*
@RouteConfig([
    {path:'/crisis-center', name: 'CrisisCenter', component: CrisisListComponent},
  {path:'/heroes',        name: 'Heroes',       component: HeroListComponent},
  {path:'/hero/:id',      name: 'HeroDetail',   component: HeroDetailComponent}
])
*/
class StreamPost {
  protected _nid: number
  public post: Post
  
  constructor(private postService: PostService) {}
  
  set nid(nid: number) {
    this._nid = nid
    this.postService.getPost(nid, (err: any, post: Post) => {
      if (!err) {
        this.post = post
      }
    })
  }
  
  get nid() {return this._nid}
  
  get isRendering() {
    console.log('rendering', this.nid)
    return ''
  }
  
  followExternalLink(url: string) {
    var w: any
    if (w = postLoader.getWindow()) {
      w.location = url
    }
  }
}

@Directive({
  selector: '[x-large]'
})
class XLarge {
  constructor(element: ElementRef, renderer: Renderer) {
    // we must interact with the dom through Renderer for webworker/server to see the changes
    renderer.setElementStyle(element, 'fontSize', 'x-large');
  }
}

@Component({
  selector: 'app',
  // TODO beta does not need NgFor directive
  directives: [XLarge, StreamPost, NgFor, NgIf],
  // TODO beta is *ngFor, alpha is *ng-for
  template: `
    <div id=content>{{isRendering}}
      <div class="ikb-header">
        <div class="title">Everything So Far Rendered Server Side</div>
      </div>
      <stream-post *ng-for="#article of articles" [nid]="article"></stream-post>
    </div>
    <div class="fd-pager pager-container" data-position="front-page">
      <nav id="pager" class="pager clearfix" >
        <p *ng-if="didClick" id=end >The End.</p>
        <span *ng-if="!didClick"><a (click)="loadMore()" class="pager-next omniture-track" data-omniture-type="pager-next">Load More</a></span>
      </nav>
    </div>
  `,
})
export class App {
  public articles: number[] = [39370581, 39361373] // 39019128
  public didClick: boolean
  protected more: number[] = [39359743, 38824014]
  protected renderCount: number = 0
  
  get isRendering() {
    console.log('rendering: app:', ++this.renderCount)
    return ''
  }
  
  loadMore() {
    if (!this.didClick) {
      this.didClick = true;
      this.articles = this.articles.concat(this.more)
    }
  }
}
