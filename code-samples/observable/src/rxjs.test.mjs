/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// rxjs 6.0.0 has no default export
import * as rxjs from 'rxjs'

import util from 'util'

test('Display rxjs exports', () => {
  console.log(`rxjs exports: ${util.inspect(rxjs, {colors: true})}`)
  expect(rxjs).toBeTruthy()
})

/*
{ Observable: { [Function: Observable] create: [36m[Function][39m },
      ConnectableObservable: [36m[Function: ConnectableObservable][39m,
      GroupedObservable: [36m[Function: GroupedObservable][39m,
      observable: [32m'@@observable'[39m,
      Subject: { [Function: Subject] create: [36m[Function][39m },
      BehaviorSubject: [36m[Function: BehaviorSubject][39m,
      ReplaySubject: [36m[Function: ReplaySubject][39m,
      AsyncSubject: [36m[Function: AsyncSubject][39m,
      asapScheduler:
       AsapScheduler {
         SchedulerAction: [36m[Function: AsapAction][39m,
         now: [36m[Function][39m,
         actions: [],
         active: [33mfalse[39m,
         scheduled: [90mundefined[39m },
      asyncScheduler:
       AsyncScheduler {
         SchedulerAction: [36m[Function: AsyncAction][39m,
         now: [36m[Function][39m,
         actions: [],
         active: [33mfalse[39m,
         scheduled: [90mundefined[39m },
      queueScheduler:
       QueueScheduler {
         SchedulerAction: [36m[Function: QueueAction][39m,
         now: [36m[Function][39m,
         actions: [],
         active: [33mfalse[39m,
         scheduled: [90mundefined[39m },
      animationFrameScheduler:
       AnimationFrameScheduler {
         SchedulerAction: [36m[Function: AnimationFrameAction][39m,
         now: [36m[Function][39m,
         actions: [],
         active: [33mfalse[39m,
         scheduled: [90mundefined[39m },
      VirtualTimeScheduler: { [Function: VirtualTimeScheduler] frameTimeFactor: [34m10[39m },
      VirtualAction: { [Function: VirtualAction] sortActions: [36m[Function][39m },
      Scheduler: { [Function: Scheduler] now: [36m[Function: now][39m },
      Subscription:
       { [Function: Subscription]
         EMPTY:
          Subscription {
            closed: [33mtrue[39m,
            _parent: [1mnull[22m,
            _parents: [1mnull[22m,
            _subscriptions: [1mnull[22m } },
      Subscriber: { [Function: Subscriber] create: [36m[Function][39m },
      Notification:
       { [Function: Notification]
         createNext: [36m[Function][39m,
         createError: [36m[Function][39m,
         createComplete: [36m[Function][39m,
         completeNotification: Notification { kind: [32m'C'[39m, value: [90mundefined[39m, error: [90mundefined[39m, hasValue: [33mfalse[39m },
         undefinedValueNotification: Notification { kind: [32m'N'[39m, value: [90mundefined[39m, error: [90mundefined[39m, hasValue: [33mtrue[39m } },
      pipe: [36m[Function: pipe][39m,
      noop: [36m[Function: noop][39m,
      identity: [36m[Function: identity][39m,
      ArgumentOutOfRangeError: [36m[Function: ArgumentOutOfRangeError][39m,
      EmptyError: [36m[Function: EmptyError][39m,
      ObjectUnsubscribedError: [36m[Function: ObjectUnsubscribedError][39m,
      UnsubscriptionError: [36m[Function: UnsubscriptionError][39m,
      TimeoutError: [36m[Function: TimeoutError][39m,
      bindCallback: [36m[Function: bindCallback][39m,
      bindNodeCallback: [36m[Function: bindNodeCallback][39m,
      combineLatest: [36m[Function: combineLatest][39m,
      concat: [36m[Function: concat][39m,
      defer: [36m[Function: defer][39m,
      empty: [36m[Function: empty][39m,
      forkJoin: [36m[Function: forkJoin][39m,
      from: [36m[Function: from][39m,
      fromEvent: [36m[Function: fromEvent][39m,
      fromEventPattern: [36m[Function: fromEventPattern][39m,
      generate: [36m[Function: generate][39m,
      iif: [36m[Function: iif][39m,
      interval: [36m[Function: interval][39m,
      merge: [36m[Function: merge][39m,
      never: [36m[Function: never][39m,
      of: [36m[Function: of][39m,
      onErrorResumeNext: [36m[Function: onErrorResumeNext][39m,
      pairs: [36m[Function: pairs][39m,
      race: [36m[Function: race][39m,
      range: [36m[Function: range][39m,
      throwError: [36m[Function: throwError][39m,
      timer: [36m[Function: timer][39m,
      using: [36m[Function: using][39m,
      zip: [36m[Function: zip][39m,
      EMPTY: Observable { _isScalar: [33mfalse[39m, _subscribe: [36m[Function][39m },
      NEVER: Observable { _isScalar: [33mfalse[39m, _subscribe: [36m[Function: noop][39m },
      config:
       { Promise: [90mundefined[39m,
         useDeprecatedSynchronousErrorHandling: [36m[Getter/Setter][39m } }
*/