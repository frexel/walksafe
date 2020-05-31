import { Component, ViewChild, ElementRef } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
	AngularFirestoreCollection,
	AngularFirestore,
} from "@angular/fire/firestore";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
const { Geolocation } = Plugins;

declare var google;
@Component({
	selector: "app-tab1",
	templateUrl: "tab1.page.html",
	styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
	constructor(private router: Router) {}

	// empezar a trackear
	startTracking() {
		this.router.navigate(["map"]);
	}
}
