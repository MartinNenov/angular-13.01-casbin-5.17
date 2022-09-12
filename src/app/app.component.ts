import { Component, Inject, OnInit } from "@angular/core";
import { of } from "rxjs";
import { EnforcerService } from "./services/enforcer.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "CodeSandbox";

  constructor(@Inject(EnforcerService) public enforcer: EnforcerService) {}

  ngOnInit() {
    this.enforcer.load(of([{ obj: "test", act: "test", eft: "allow" }]));
    setTimeout(() => {
      this.enforcer.load(of([{ obj: "test", act: "test", eft: "deny" }]));
    }, 10000);
  }
}
