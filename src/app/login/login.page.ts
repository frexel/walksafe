import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFirestoreCollection } from "@angular/fire/firestore/public_api";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  user;
  usersCollection: AngularFirestoreCollection;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {}

  login() {
    this.router.navigate(["/app"]);
    /* this.afauth.signInAnonymously().then((res) => {
      this.usersCollection = this.afs.collection(`users`);
      this.user = res.user;
      let userRef = this.usersCollection.doc(this.user.uid);
      userRef.set({
        position: {
          lat: "",
          lng: "",
        },
        timestamp: 0,
        notification: "",
        state:'',
      });
    }); */
  }
}