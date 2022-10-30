import { interval, Observable } from 'rxjs';
import { scan, takeWhile, tap } from 'rxjs/operators';

const reportProgress$ = () =>
  tap((progress: number) => {
    console.log('measuring', progress);
  });

export const measureProgressEverySec$ = (
  totalDuration: number
): Observable<number> =>
  interval(1000).pipe(
    scan((_accProgress, c) => {
      const progressPercentagePerSecond = (c / (totalDuration / 1000)) * 100;
      return Math.floor(progressPercentagePerSecond);
    }),
    takeWhile((progress: number) => progress <= 100),
    reportProgress$()
  );
