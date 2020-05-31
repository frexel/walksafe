import { Component } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { map } from "rxjs/operators";
import {
	AngularFirestore,
	AngularFirestoreCollection,
} from "@angular/fire/firestore";

const { Geolocation } = Plugins;

declare var google;
@Component({
	selector: "app-tab1",
	templateUrl: "tab1.page.html",
	styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
	usersCollection: AngularFirestoreCollection<any>;
	userDoc;
	notifications;
	constructor(
		private router: Router,
		private afs: AngularFirestore,
		private alertController: AlertController
	) {
		this.usersCollection = this.afs.collection(`users`);
		this.userDoc = this.usersCollection.doc("2");
		this.notifications = this.userDoc
			.snapshotChanges()
			.pipe(map((doc) => (doc as any).payload.data().notifications));
		this.notifications.subscribe((notification) => {
			if (notification == "sharing") {
				this.customAlert(
					"Nombre Apellido",
					"Está compartiendo su ubicación",
					"Aceptar",
					"Cancelar"
				);
			} else if (notification == "stopped") {
				this.customAlert(
					"Nombre Apellido",
					"Ha dejado de compartir su ubicación",
					"Aceptar",
					"Cancelar"
				);
			} else if (notification == "panic") {
				this.customAlert(
					"Nombre ",
					"Está en problemas",
					"Aceptar",
					"Cancelar"
				);
			}
		});
	}

	ionViewWillEnter() {
		this.presentAlertPrompt();
	}

	// empezar a trackear
	startTracking() {
		this.router.navigate(["map"]);
	}

	//(click)="presentAlertPrompt()

	//alerta
	async presentAlert() {
		const alert = await this.alertController.create({
			message: "Queres borrar este contacto?",
			buttons: ["Cancelar", "Aceptar"],
		});

		await alert.present();
	}

	async customAlert(
		title?: string,
		message?: string,
		acceptButtonText?: string,
		cancelButtonText?: string
	) {
		const alert = await this.alertController.create({
			cssClass: "my-custom-class",
			header: title,
			message: message,
			buttons: [
				{
					text: cancelButtonText,
					role: "cancel",
					cssClass: "secondary",
					handler: () => {
						console.log("Confirm Cancel");
					},
				},
				{
					text: acceptButtonText,
					handler: () => {
						this.router.navigate(["map"]);
					},
				},
			],
		});

		await alert.present();
	}

	async presentAlertPrompt() {
		const alert = await this.alertController.create({
			cssClass: "my-custom-class",
			header: "Nombre Apellido",
			message: "Está compartiendo su ubicación",
			buttons: [
				{
					text: "Cancelar",
					role: "cancel",
					cssClass: "secondary",
					handler: () => {
						console.log("Confirm Cancel");
					},
				},
				{
					text: "Aceptar",
					handler: () => {
						//acá hay que hacer algo con la info pero no se que
						this.router.navigate(["map"]);
					},
				},
			],
		});

		await alert.present();
	}
}
