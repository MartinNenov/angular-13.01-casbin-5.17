import { Injectable } from "@angular/core";
import { from, NEVER, Observable, of, Subscription } from "rxjs";
import { concatMap, map, switchMap, tap } from "rxjs/operators";
import { ACL } from "../interfaces";
import JwtEnforcer from "../lib/JwtEnforcer";
import { getModel } from "../model/index";

@Injectable()
export class EnforcerService {
  private _acls: Observable<ACL[] | null> | null = null;

  private enforcer: JwtEnforcer | null = null;
  private sub: Subscription | null = null;

  private cache: { [key: string]: Observable<boolean> } = {};
  private false = of(false);

  constructor() {
    this.false.subscribe((d) => console.log("test"));
  }

  load(acls: Observable<ACL[]>) {
    this.unload();

    this.sub = acls
      .pipe(
        concatMap((acls) => {
          console.log(acls);
          if (!acls) {
            return NEVER;
          }

          const enforcer = new JwtEnforcer(acls);
          return from(enforcer.setup(getModel()));
        })
      )
      .subscribe((enforcer) => {
        console.log("acls changed");
        this._acls = acls;
        this.enforcer = enforcer;
      });
  }

  unload() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.enforcer = null;
    this.cache = {};
  }

  enforce(obj: string, act: string) {
    if (!this._acls || !this.enforcer) {
      return this.false;
    }
    const key = `${obj}+${act}`;
    const obs = this.cache[key];

    if (!obs) {
      this.cache[key] = this._acls.pipe(
        concatMap(() => {
          if (!this.enforcer) {
            return of(false);
          }
          return from(this.enforcer.enforce(obj, act));
        }),
        tap((res) => {console.log(res)})
      );
    }
    return obs;
  }
}
