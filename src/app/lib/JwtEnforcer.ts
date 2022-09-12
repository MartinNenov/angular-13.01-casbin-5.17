import { Model, newEnforcer } from "casbin";
import { from, Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { ACL } from "../interfaces";
import { crudMatch } from "../model/matchers";
import JwtAdapter from "./JwtAdapter";

export default class JwtEnforcer {
  casbin: any | null;
  acls: ACL[];
  sub: string;

  constructor(acls: ACL[], roleName = "$defaultRole") {
    this.casbin = null;

    if (!acls) {
      throw new Error("CTOR: JWT ACLS are required!");
    }

    this.acls = acls;
    this.sub = roleName;
  }

  setup(model: Model) {
    return from(newEnforcer(model, new JwtAdapter(this.acls))).pipe(
      concatMap((casbin) => {
        this.casbin = casbin;
        return from(this.casbin.addFunction("crudMatch", crudMatch)).pipe(
          map(() => this)
        );
      })
    );
  }

  enforce(obj: string, act: string, sub = this.sub): Observable<boolean> {
    if (!this.casbin) {
      throw new Error("Run setup() before enforcing!");
    }

    return from(this.casbin.enforce(sub, obj, act)) as Observable<boolean>;
  }
}
