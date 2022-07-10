import { Component, OnInit } from "@angular/core";

import { AuthStore } from "./services/auth.store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // providers: [LoadingService, MessagesService], // Accesable to the AppComponent including all child components.
})
export class AppComponent implements OnInit {
  constructor(public authStore: AuthStore) {}

  ngOnInit() {}

  logout() {
    this.authStore.logout();
  }
}
