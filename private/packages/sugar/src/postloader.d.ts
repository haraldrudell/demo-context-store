/*declare module 'postloader' {
  export function loadPost(nid:number): any
}
*/
declare function loadPost(nid:number, cb: any): any
export = loadPost
