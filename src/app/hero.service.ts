import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' }),
  };

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    // this.messageService.add('HeroService: fetched hero!');
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((heroes) => this.log('fetched heroes!!')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    // this.messageService.add(`HeroServie: fetched hero id=${id}`);
    // return of(HEROES.find((hero) => hero.id === id));
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  // サーバ上でHeroデータを更新
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  private log(message: string) {
    this.messageService.add(`MessageService: ${message}`);
  }
  private heroesUrl = 'api/heroes'; //WebAPIのURL

  /**
   * 失敗したHttp操作を処理します。
   * アプリを持続させます。
   * @param operation - 失敗した操作の名前
   * @param result - observableな結果として返す任意の値
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error);

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed : ${error.message}`);

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }
}
