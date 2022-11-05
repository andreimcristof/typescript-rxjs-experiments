import {
  combineLatest,
  concat,
  EMPTY,
  forkJoin,
  from,
  interval,
  merge,
  of,
  pipe,
  range,
  timer,
} from 'rxjs';
import {
  concatMap,
  delay,
  repeat,
  scan,
  take,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { measureProgressEverySec$ } from './progress';

/* 
  TASK:
  - from a source of count, start multiple observables: 
  - multiple timer observables: 1 pomodoro, 1 pause - 2 observables. 1 finishes, 2 starts. 
    achieved with: concat(obs1, obs2) https://www.learnrxjs.io/learn-rxjs/operators/combination/concat
*/

const runUnit$ = (unitDurationMs: number) => {
  // const source = range(1, count);

  // This works, but its bloated with unnecessary code. E.g. What is of(1), who is 1? etc
  // return of(1).pipe(
  //   concatMap((current) =>
  //     of(current).pipe(
  //       () => measureProgressEverySec$(unitDurationMs)
  //     )
  //   )
  // );

  // this is better. less bloat
  return of(0).pipe(concatMap(() => measureProgressEverySec$(unitDurationMs)));
};

const unitDurationMs = 2000;

const repeatWork$ = runUnit$(unitDurationMs);
const repeatPause$ = runUnit$(unitDurationMs);

const resetProgress$ = of(0).pipe(tap(() => console.log('progress resetted')));

const singlePomodoroSession$ = concat(
  repeatWork$,
  repeatPause$,
  resetProgress$
);

const sessionPomodoros = 3;

const session$ = range(1, sessionPomodoros).pipe(
  concatMap((current: number) =>
    of(current).pipe(
      tap((current: number) => {
        console.log(`${current} of ${sessionPomodoros}`);
      }),
      concatMap(() => singlePomodoroSession$)
    )
  )
);

session$.subscribe({
  complete: () => console.log('pomodoro session done'),
});
