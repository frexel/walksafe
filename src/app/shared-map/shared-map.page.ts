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
	selector: "app-shared-map",
	templateUrl: "./shared-map.page.html",
	styleUrls: ["./shared-map.page.scss"],
})
export class SharedMapPage {
	@ViewChild("map", { static: false }) mapElement: ElementRef;
	user = null;
	userid;
	map: any;
	markers = [];
	positions: Observable<any>;
	usersCollection: AngularFirestoreCollection<any>;
	userDoc;
	isTracking = false;
	watch: string;

	constructor(
		private afs: AngularFirestore,
		private authservice: AuthService,
		private router: Router
	) {
		this.usersCollection = this.afs.collection(`users`);
		/* this.user = this.authservice.getuserAuth().subscribe(user => {
			this.userid = user.uid;
		  }); */
		this.userDoc = this.usersCollection.doc("2");
	}

	ionViewWillEnter() {
		this.startTracking();
	}

	// inicializar el mapa
	loadMap() {
		let latLng = new google.maps.LatLng(-35.9036442, -57.6673267);

		let mapOptions = {
			center: latLng,
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
		};

		this.map = new google.maps.Map(
			this.mapElement.nativeElement,
			mapOptions
		);
	}

	// empezar a trackear
	startTracking() {
		this.loadMap();
		this.positions = this.userDoc
			.snapshotChanges()
			.pipe(map((doc) => (doc as any).payload.data().position));
		this.positions.subscribe((positions) => {
			this.updateMap(positions);
		});
	}

	// cerrar la suscripción
	stopTracking() {
		this.router.navigate(["app"]);
		//reroutear
	}

	updateMap(position) {
		this.map.setCenter(position);
		this.markers.map((marker) => marker.setMap(null));
		this.markers = [];

		let latLng = new google.maps.LatLng(position.lat, position.lng);

		let marker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: latLng,
		});
		//console.log(this.markers, marker);
		this.markers.push(marker);
	}
}
