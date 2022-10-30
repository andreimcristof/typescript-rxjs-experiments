import {
  combineLatest,
  concat,
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
  return of(true).pipe(
    concatMap(() => measureProgressEverySec$(unitDurationMs))
  );
};

const sessionPomodoros = 3;
const unitDurationMs = 4000;

const repeatWork$ = runUnit$(unitDurationMs);
const repeatPause$ = runUnit$(unitDurationMs);

const resetProgress$ = of(true).pipe(
  tap(() => console.log('progress resetted'))
);

const pomodoroSession$ = concat(repeatWork$, repeatPause$, resetProgress$);
// .pipe(
//   repeat(sessionPomodoros)
// );

pomodoroSession$.subscribe({
  complete: () => console.log('pomodoro session done'),
});
